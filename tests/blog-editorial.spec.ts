import {expect,test} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {siteConfig} from '../site.config.mjs';
import {translate} from '../src/i18n/render';
const base=siteConfig.base;
const articles=[['anatomia-de-una-tragamonedas-de-bolsillo','Anatomía de una tragamonedas de bolsillo'],['el-espejo-programado','El espejo programado']] as const;

for(const [slug,title] of articles){
 test(`${title}: ilustración, referencias, metadatos y accesibilidad`,async({page},testInfo)=>{
  await page.goto(`${base}blog/${slug}/`);await expect(page.locator('h1')).toHaveText(title);
  const image=page.locator('.post-hero img');await expect(image).toBeVisible();expect(await image.getAttribute('alt')).toBeTruthy();
  await expect.poll(()=>image.evaluate(img=>(img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  expect(await image.evaluate(img=>(img as HTMLImageElement).currentSrc)).toMatch(/\.webp$/);await expect(page.locator('.post-hero figcaption')).toContainText('Generada con IA');
  const metadata=page.locator('meta[property="og:image"]');const url=(await metadata.getAttribute('content'))!;expect(url).toMatch(/^https:\/\/joanroamora.github.io\/personalWebSite\/_astro\/.+\.jpg$/);
  const response=await page.request.get(new URL(url).pathname);expect(response.status()).toBe(200);expect((await response.body()).length).toBeLessThan(400*1024);
  expect(await page.locator('.article-body a[href^="https://"]').count()).toBeGreaterThanOrEqual(5);await expect(page.locator('.article-body')).toHaveAttribute('lang','es');await expect(page.locator('.post-takeaway')).toBeVisible();
  await expect(page.locator('.demo-notice,.sample-label')).toHaveCount(0);await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex, nofollow');
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  await page.screenshot({path:testInfo.outputPath(`${slug}-top.png`),animations:'disabled'});
  await page.locator('.article-body h2').nth(2).scrollIntoViewIfNeeded();await page.screenshot({path:testInfo.outputPath(`${slug}-reading.png`),animations:'disabled'});
 });
}

test('lectura editorial adaptable, texto ampliado y movimiento reducido @desktop',async({page},testInfo)=>{
 test.setTimeout(60000);await page.emulateMedia({reducedMotion:'reduce'});
 for(const size of [{width:320,height:568},{width:768,height:1024},{width:844,height:390},{width:1440,height:900}]){
  await page.setViewportSize(size);
  for(const path of ['blog/',...articles.map(([slug])=>`blog/${slug}/`)]){
   await page.goto(`${base}${path}`);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${path} ${size.width}`).toBe(true);
   for(const image of await page.locator('.featured-art img,.archive-art img,.post-hero img').all()){const box=(await image.boundingBox())!;expect(box.width).toBeLessThanOrEqual(size.width);expect(box.height).toBeGreaterThan(0);}
  }
 }
 await page.setViewportSize({width:390,height:844});await page.addStyleTag({content:':root{font-size:200%}'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('.post-contents summary').click();await expect(page.locator('.post-contents details')).not.toHaveAttribute('open');await page.locator('.post-contents summary').click();await expect(page.locator('.post-contents details')).toHaveAttribute('open');
 await page.screenshot({path:testInfo.outputPath('editorial-text-200.png'),animations:'disabled'});
});

test('fichas localizadas y lectura original explícita en inglés y árabe',async({page})=>{
 for(const locale of ['en','ar'] as const){
  await page.goto(`${base}${locale}/blog/`);await expect(page.locator('.featured-post h2')).toHaveText(translate(articles[0][1],locale));
  const link=page.locator('.featured-post h2 a');await expect(link).toHaveAttribute('href',`${base}${locale}/blog/${articles[0][0]}/`);await link.click();
  await expect(page.locator('.post-header .eyebrow')).toContainText(translate('Bajo el cristal',locale));await expect(page.locator('.original-language-note')).toBeVisible();await expect(page.locator('.article-body')).toHaveCSS('direction','ltr');await expect(page.locator('.post-hero figure')).toHaveAttribute('lang','es');
  await expect(page.locator('.post-pagination a')).toHaveCount(1);await expect(page.locator('.post-pagination a')).toHaveAttribute('href',`${base}${locale}/blog/el-espejo-programado/`);
 }
});
