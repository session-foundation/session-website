import isLive from '@/utils/environment';

const CMS = {
  BLOG_RESULTS_PER_PAGE: 13,
  BLOG_RESULTS_PER_PAGE_TAGGED: 12,
  // Next.js will try and re-build the page when a request comes in
  // every 1 hour for production and every 30 seconds for staging
  CONTENT_REVALIDATE_RATE: isLive() ? 3600 : 30,
  // For older blog posts (>30 days), revalidate once per day
  CONTENT_REVALIDATE_RATE_OLD: isLive() ? 86400 : 30,
  // Age threshold (in days) to consider a post "old"
  OLD_POST_AGE_DAYS: 30,
  // So we dont get rate limited by the GitHub API
  GITHUB_API_RATE: 600,
};

/**
 * Calculate the appropriate revalidation time for a blog post based on its age.
 * 
 * Strategy:
 * - Posts newer than 30 days: revalidate every 1 hour (more frequent updates expected)
 * - Posts older than 30 days: revalidate once per day (content is stable)
 * 
 * This reduces API calls for older content that rarely changes.
 * 
 * @param publishedDateISO - ISO date string of when the post was published
 * @returns Revalidation time in seconds
 */
export function getRevalidationTime(publishedDateISO?: string): number {
  if (!publishedDateISO) {
    return CMS.CONTENT_REVALIDATE_RATE;
  }

  const publishedDate = new Date(publishedDateISO);
  const now = new Date();
  const ageInDays = (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24);

  if (ageInDays > CMS.OLD_POST_AGE_DAYS) {
    return CMS.CONTENT_REVALIDATE_RATE_OLD;
  }

  return CMS.CONTENT_REVALIDATE_RATE;
}

export default CMS;
