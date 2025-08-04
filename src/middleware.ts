import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  locales: ['en', 'id', 'zh'],
 
  defaultLocale: 'id'
});
 
export const config = {
  matcher: ['/', '/(id|en|zh)/:path*']
};