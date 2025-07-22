import type { Block, Document, Inline } from '@contentful/rich-text-types';
import { type ContentfulClientApi, createClient, type EntryCollection, type Tag } from 'contentful';
import { format, parseISO } from 'date-fns';
import { METADATA } from '@/constants';
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

export async function fetchBlogEntries(quantity = 100, page = 1): Promise<IFetchBlogEntriesReturn> {
  const _entries = await client.getEntries({
    content_type: 'post', // only fetch blog post entry
    order: '-fields.date',
    limit: quantity,
    skip: (page - 1) * quantity,
  });

  const results = await generateEntries(_entries, 'post');
  return {
    entries: results.entries as Array<IPost>,
    total: results.total,
  };
}

export async function fetchBlogEntriesByTag(
  tag: string,
  quantity = 100
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
    if (entry.sys.contentType.sys.id === 'post') {
      return convertPost(entry, taglist);
    }
    if (entry.sys.contentType.sys.id === 'page') {
      return convertPage(entry);
    }
  }

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

export async function fetchPages(quantity = 100): Promise<IFetchPagesReturn> {
  const _entries = await client.getEntries({
    content_type: 'page',
    limit: quantity,
  });

  const results = await generateEntries(_entries, 'page');
  return {
    entries: results.entries as Array<IPage>,
    total: results.total,
  };
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
