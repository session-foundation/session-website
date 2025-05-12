import { Block, Inline } from '@contentful/rich-text-types';
import METADATA from '../constants/metadata';

// utils for checking if hyperlinks are for the current site
// are there any links to id's i.e. #mac, #linux, #windows
// TODO links on site should be updated to follow NextJS convention on contentful?

const protocols = ['https://', 'http://', 'ftp://', 'file://', 'mailto:'];

export function isLocal(url: string) {
  let result = true;
  if (url[0] === '#' || url.indexOf('localhost:') > 0) {
    return result;
  }
  protocols.forEach((protocol) => {
    if (url.indexOf(protocol) >= 0) {
      result = false;
    }
  });
  return result;
}

export function hasLocalID(node: Block | Inline) {
  let id = '';
  node.content.forEach((child) => {
    if (child.nodeType === 'hyperlink' && isLocal(child.data.uri)) {
      id = child.data.uri.split('#')[1];
    }
  });
  return id;
}

const host = new URL(METADATA.HOST_URL).host;

export function parseUrl(urlStr: string) {
  try {
    // new URL will throw if the url is invalid eg: no protocol
    return new URL(urlStr);
  } catch {
    if (urlStr.startsWith(host) || urlStr.startsWith(`www.${host}`)) {
      // We can fix the url if it's the same as the host url
      try {
        return new URL(`https://${urlStr}`);
      } catch {
        return urlStr;
      }
    } else {
      return urlStr;
    }
  }
}
