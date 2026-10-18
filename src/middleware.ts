import { defineMiddleware } from 'astro:middleware';
import { routeContext } from './i18n/locales';
import { localizeHTML } from './i18n/render';

export const onRequest = defineMiddleware(async (context,next) => {
  const response = await next();
  const { locale } = routeContext(context.url.pathname,import.meta.env.BASE_URL);
  if (locale === 'es' || !response.headers.get('content-type')?.includes('text/html')) return response;
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.set('Content-Language',locale === 'zh' ? 'zh-Hans' : locale);
  return new Response(localizeHTML(await response.text(),locale,import.meta.env.BASE_URL),{status:response.status,headers});
});
