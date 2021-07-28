import { Document } from '@contentful/rich-text-types';

export type IFigureImage = {
  title: string | null;
  description: string | null;
  imageUrl: string;
  width: string | number;
  height: string | number;
};

export type IAuthor = {
  name: string;
  avatar?: IFigureImage;
  shortBio: string;
  email: string;
  // Eg. Marketing Researcher
  position: string | null;
  twitter: string | null;
  facebook: string | null;
  github: string | null;
};

export interface IPost {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  body: Document;
  author?: IAuthor;
  publishedDate: string;
  featureImage?: IFigureImage;
  fullHeader?: boolean;
  tags: Array<string>;
  slug: string;
}

export interface IFAQItem {
  id: number;
  question: string;
  answer: Document;
  tag: string;
}

export interface IFetchEntriesReturn {
  entries: Array<any>;
  total: number;
}

export interface IFAQList {
  [key: string]: IFAQItem[];
}

export interface IFetchBlogEntriesReturn extends IFetchEntriesReturn {
  entries: Array<IPost>;
}

export interface IFetchFAQItemsReturn extends IFetchEntriesReturn {
  entries: Array<IFAQItem>;
}

export interface IPage {
  title: string;
  slug: string;
  body: Document;
}

export interface IFetchPagesReturn extends IFetchEntriesReturn {
  entries: Array<IPage>;
}
