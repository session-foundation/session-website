import type { Block, Document, Inline } from '@contentful/rich-text-types';
import { type ContentfulClientApi, createClient, type EntryCollection, type Tag } from 'contentful';
import { format, parseISO } from 'date-fns';
import { METADATA } from '@/constants';
import blogCache from '@/services/cache';
import { fetchContent } from '@/services/embed';
import type {
  IAuthor,
  IFAQItem,
  IFetchBlogEntriesReturn,
  IFetchEntriesReturn,
  IFetchFAQItemsReturn,
  IFetchPagesReturn,
  IFigureImage,
  IPage,
  IPost,
  ITagList,
} from '@/types/cms';

// Contentful API pagination limit
const CONTENTFUL_PAGE_SIZE = 100;

// Sentinel value to mark 404s in cache
const NOT_FOUND_MARKER = Symbol('NOT_FOUND');

const client: ContentfulClientApi = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  environment: process.env.CONTENTFUL_ENVIRONMENT_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  host: 'cdn.contentful.com',
});

export async function fetchTagList(): Promise<ITagList> {
  const _tags = await client.getTags();
  const tags: ITagList = {};
  _tags.items.forEach((tag) => {
    tags[tag.sys.id] = tag.name;
  });
  return tags;
}

export async function fetchBlogEntries(
  quantity = CONTENTFUL_PAGE_SIZE,
  page = 1
): Promise<IFetchBlogEntriesReturn> {
  const cacheKey = `blog_entries_${quantity}_${page}`;
  const cached = blogCache.get<IFetchBlogEntriesReturn>(cacheKey);

  if (cached) {
    return cached;
  }

  const _entries = await client.getEntries({
    content_type: 'post', // only fetch blog post entry
    order: '-fields.date',
    limit: quantity,
    skip: (page - 1) * quantity,
  });

  const results = await generateEntries(_entries, 'post');
  const data = {
    entries: results.entries as Array<IPost>,
    total: results.total,
  };

  blogCache.set(cacheKey, data);
  return data;
}

/**
 * Efficiently fetches all blog entries with optimized pagination
 *
 * This function replaces inefficient while loops that made unnecessary API calls.
 *
 * Optimizations:
 * - Calculates total pages from first API call
 * - Uses for loop with known bounds instead of while loop
 * - Caches the complete result to avoid repeated full fetches
 * - Leverages per-page caching for individual requests
 *
 * Cache Key: 'all_blog_entries'
 * TTL: 1 hour (default cache TTL)
 *
 * @returns Promise<IPost[]> Array of all blog posts
 */
export async function fetchAllBlogEntries(): Promise<IPost[]> {
  const cacheKey = 'all_blog_entries';
  const cached = blogCache.get<IPost[]>(cacheKey);

  if (cached) {
    return cached;
  }

  const posts: IPost[] = [];

  // First fetch to get total count
  const firstBatch = await fetchBlogEntries(CONTENTFUL_PAGE_SIZE, 1);
  posts.push(...firstBatch.entries);

  // Calculate remaining pages
  const totalPages = Math.ceil(firstBatch.total / CONTENTFUL_PAGE_SIZE);

  // Fetch remaining pages if needed
  for (let page = 2; page <= totalPages; page++) {
    const { entries } = await fetchBlogEntries(CONTENTFUL_PAGE_SIZE, page);
    posts.push(...entries);
  }

  blogCache.set(cacheKey, posts);
  return posts;
}

/**
 * Check if a slug likely exists without making API calls
 * Uses cached data to quickly validate if a slug might be valid
 *
 * @param slug - The slug to check
 * @returns boolean - true if slug might exist, false if definitely doesn't exist in cache
 */
export async function slugMightExist(slug: string): Promise<boolean> {
  // Check if it's already in the entry cache
  const cacheKey = `entry_by_slug_${slug}`;
  if (blogCache.has(cacheKey)) {
    return true;
  }

  // Check if we have all blog entries cached
  const allPostsKey = 'all_blog_entries';
  const cachedPosts = blogCache.get<IPost[]>(allPostsKey);

  if (cachedPosts) {
    const found = cachedPosts.some((post) => post.slug === slug);
    if (found) {
      return true;
    }
  }

  // Check if we have pages cached
  const allPagesKey = 'all_pages';
  const cachedPages = blogCache.get<IPage[]>(allPagesKey);

  if (cachedPages) {
    const found = cachedPages.some((page) => page.slug === slug);
    if (found) {
      return true;
    }
  }

  // If we have cache and slug not found, likely doesn't exist
  // But return true to allow API call as fallback (cache might be incomplete)
  return true;
}

export async function fetchBlogEntriesByTag(
  tag: string,
  quantity = CONTENTFUL_PAGE_SIZE
): Promise<IFetchBlogEntriesReturn> {
  const taglist = await fetchTagList();
  const id = Object.entries(taglist).filter(([_, value]) => {
    return tag === value;
  })[0][0];

  const _entries = await client.getEntries({
    content_type: 'post', // only fetch blog post entry
    order: '-fields.date',
    'metadata.tags.sys.id[in]': id,
    limit: quantity,
  });

  if (_entries.items.length > 0) {
    const results = await generateEntries(_entries, 'post');
    return {
      entries: results.entries as Array<IPost>,
      total: results.total,
    };
  }

  return Promise.reject(new Error(`Failed to fetch entries for ${tag}`));
}

export async function fetchEntryPreview(slug: string): Promise<IPage | IPost> {
  const _client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN!,
    host: 'preview.contentful.com',
  });

  const _pages = await _client.getEntries({
    content_type: 'page',
    'fields.slug': slug,
    'fields.preview': true,
  });
  const _posts = await _client.getEntries({
    content_type: 'post',
    'fields.slug': slug,
    'fields.preview': true,
  });

  const _entries = [..._pages.items, ..._posts.items];
  const taglist = await fetchTagList();

  if (_entries.length > 0) {
    const entry = _entries[0];
    if (entry.sys.contentType.sys.id === 'post') {
      return convertPost(entry, taglist);
    }
    if (entry.sys.contentType.sys.id === 'page') {
      return convertPage(entry);
    }
  }

  return Promise.reject(new Error(`Failed to fetch preview for ${slug}`));
}

export async function fetchEntryBySlug(slug: string): Promise<IPage | IPost> {
  const cacheKey = `entry_by_slug_${slug}`;

  // Check if we have this in cache (either valid entry or 404 marker)
  if (blogCache.has(cacheKey)) {
    const cached = blogCache.get<IPage | IPost | typeof NOT_FOUND_MARKER>(cacheKey);

    // If it's the NOT_FOUND marker, we previously checked and it doesn't exist
    if (cached === NOT_FOUND_MARKER) {
      return Promise.reject(new Error(`Failed to fetch entry for ${slug}`));
    }

    // Otherwise it's a valid cached entry
    if (cached) {
      return cached;
    }
  }

  // Not in cache, proceed with API call
  const _pages = await client.getEntries({
    content_type: 'page',
    'fields.slug': slug,
  });
  const _posts = await client.getEntries({
    content_type: 'post',
    'fields.slug': slug,
  });

  const _entries = [..._pages.items, ..._posts.items];
  const taglist = await fetchTagList();

  if (_entries.length > 0) {
    const entry = _entries[0];
    let result: IPage | IPost;
    if (entry.sys.contentType.sys.id === 'post') {
      result = convertPost(entry, taglist);
    } else if (entry.sys.contentType.sys.id === 'page') {
      result = convertPage(entry);
    } else {
      return Promise.reject(new Error(`Failed to fetch entry for ${slug}`));
    }

    // Cache successful lookups for 1 hour
    blogCache.set(cacheKey, result);
    return result;
  }

  // Cache negative results for 10 minutes to prevent repeated lookups of non-existent pages
  // This is shorter than successful lookups since content might be added
  blogCache.set(cacheKey, NOT_FOUND_MARKER as any, 600000); // 10 minutes
  return Promise.reject(new Error(`Failed to fetch entry for ${slug}`));
}

function convertPost(rawData: any, taglist: ITagList): IPost {
  const rawPost = rawData.fields;
  const rawFeatureImage = rawPost?.featureImage ? rawPost?.featureImage.fields : null;
  const rawAuthor = rawPost.author ? rawPost.author.fields : null;

  return {
    id: rawData.sys.id ?? null,
    body: rawPost.body ?? null,
    subtitle: rawPost.subtitle ?? null,
    description: rawPost.description ?? null,
    publishedDateISO: rawPost.date,
    publishedDate: format(parseISO(rawPost.date), 'MMMM dd, yyyy'),
    slug: rawPost.slug,
    tags: convertTags(rawData.metadata.tags, taglist),
    title: rawPost.title,
    featureImage: convertImage(rawFeatureImage),
    fullHeader: rawPost.fullHeader ?? null,
    author: convertAuthor(rawAuthor),
  };
}

function convertImage(rawImage: any): IFigureImage {
  return {
    imageUrl: rawImage.file.url.replace('//', 'https://'), // may need to put null check as well here
    description: rawImage.description ?? null,
    title: rawImage.title ?? null,
    width: rawImage.file.details.image.width,
    height: rawImage.file.details.image.height,
  };
}

function convertAuthor(rawAuthor: any): IAuthor {
  return {
    name: rawAuthor?.name ?? null,
    avatar: convertImage(rawAuthor.avatar.fields),
    shortBio: rawAuthor?.shortBio ?? null,
    position: rawAuthor?.position ?? null,
    email: rawAuthor?.email ?? null,
    twitter: rawAuthor?.twitter ?? null,
    facebook: rawAuthor.facebook ?? null,
    github: rawAuthor.github ?? null,
  };
}

function convertTags(rawTags: any, taglist: ITagList): string[] {
  return rawTags.map((tag: Tag) => {
    return taglist[tag.sys.id];
  });
}

async function generateEntries(
  entries: EntryCollection<unknown>,
  entryType: 'post' | 'faq' | 'page'
): Promise<IFetchEntriesReturn> {
  let _entries: any = [];
  if (entries?.items && entries.items.length > 0) {
    switch (entryType) {
      case 'post': {
        const taglist = await fetchTagList();
        _entries = entries.items.map((entry) => convertPost(entry, taglist));
        break;
      }
      case 'faq':
        _entries = entries.items.map((entry) => convertFAQ(entry));
        break;
      case 'page':
        _entries = entries.items.map((entry) => convertPage(entry));
        break;
      default:
        break;
    }
    return { entries: _entries, total: entries.total };
  }

  return { entries: _entries, total: 0 };
}

export function generateRoute(slug: string): string {
  return slug.indexOf('/blog/') > 0 ? slug.split('/blog/')[0] : `/blog/${slug}`;
}

async function loadMetaData(node: Block | Inline) {
  // is embedded link not embedded media
  if (!node.data.target.fields.file) {
    if (node.data.target.sys.contentType.sys.id === 'post') {
      node.data.target.fields.url = `${METADATA.HOST_URL}/blog/${node.data.target.fields.slug}`;
    }
    node.data.target.fields.meta = await fetchContent(node.data.target.fields.url);
  }
  return node;
}

export async function generateLinkMeta(doc: Document): Promise<Document> {
  const promises = doc.content.map(async (node: Block | Inline) => {
    if (node.nodeType === 'embedded-entry-block') {
      node = await loadMetaData(node);
    } else {
      // check for inline embedding
      const innerPromises = node.content.map(async (innerNode) => {
        if (
          innerNode.nodeType === 'embedded-entry-inline' &&
          innerNode.data.target.sys.contentType.sys.id !== 'markup'
        ) {
          innerNode = await loadMetaData(innerNode);
        }
      });
      await Promise.all(innerPromises);
    }
  });
  await Promise.all(promises);
  return doc;
}

export async function fetchFAQItems(): Promise<IFetchFAQItemsReturn> {
  const _entries = await client.getEntries({
    content_type: 'faq_item', // only fetch faq items
    order: 'fields.id',
  });

  const results = await generateEntries(_entries, 'faq');
  return { entries: results.entries as Array<IFAQItem>, total: results.total };
}

function convertFAQ(rawData: any): IFAQItem {
  const rawFAQ = rawData.fields;
  const { question, answer, id, tag, slug } = rawFAQ;

  return {
    id: id ?? null,
    question: question ?? null,
    answer: answer ?? null,
    tag: tag ?? null,
    slug: slug ?? null,
  };
}

export async function fetchPages(quantity = CONTENTFUL_PAGE_SIZE): Promise<IFetchPagesReturn> {
  const cacheKey = `pages_${quantity}`;
  const cached = blogCache.get<IFetchPagesReturn>(cacheKey);

  if (cached) {
    return cached;
  }

  const _entries = await client.getEntries({
    content_type: 'page',
    limit: quantity,
  });

  const results = await generateEntries(_entries, 'page');
  const data = {
    entries: results.entries as Array<IPage>,
    total: results.total,
  };

  // Cache all pages for slug validation
  if (quantity >= results.total) {
    blogCache.set('all_pages', data.entries);
  }

  blogCache.set(cacheKey, data);
  return data;
}

function convertPage(rawData: any): IPage {
  const rawPage = rawData.fields;

  return {
    title: rawPage.title,
    slug: rawPage.slug,
    headline: rawPage.headline ?? null,
    body: rawPage.body,
  };
}
