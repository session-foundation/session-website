export default function isLive(): boolean {
  // only show 'live' content in production
  return process.env.NEXT_PUBLIC_SITE_ENV === 'production';
}
