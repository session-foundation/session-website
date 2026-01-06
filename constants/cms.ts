import isLive from '@/utils/environment';

const CMS = {
  BLOG_RESULTS_PER_PAGE: 13,
  BLOG_RESULTS_PER_PAGE_TAGGED: 12,
  // Next.js will try and re-build the page when a request comes in
  // every 1 hour for production and every 30 seconds for staging
  CONTENT_REVALIDATE_RATE: isLive() ? 3600 : 30,
  // So we dont get rate limited by the GitHub API
  GITHUB_API_RATE: 600,
};

export default CMS;
