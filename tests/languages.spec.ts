import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { siteConfig } from '../site.config.mjs';
import { locales, translatedLocales, languageHref } from '../src/i18n/locales';
import { translate } from '../src/i18n/render';
import { projects } from '../src/data/projects';
import { readFileSync } from 'node:fs';
import { parsePublicProfile } from '../src/utils/profile';
const publicProfile=parsePublicProfile(readFileSync('docs/PERFIL_PUBLICO.md','utf8'));

const base=siteConfig.base;
const switcher='[data-language-switcher]';
const trigger=`${switcher} > summary`;

test('burbuja: seis idiomas en orden, mismo detalle, Escape, foco y preferencia',async ({page},testInfo) => {
  await page.goto(`${base}proyectos/pdf-roar/?from=archive#pdf-roar-detail-title`);
  await page.locator(trigger).click();
  await expect(page.locator(`${switcher} a`)).toHaveText(locales.map(locale => `${locale.label}${locale.code === 'es' ? '✓' : '↗'}`));
  await page.keyboard.press('ArrowDown');
  await expect(page.locator(`${switcher} a`).first()).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.locator(`${switcher} a`).last()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator(switcher)).not.toHaveAttribute('open');
  await expect(page.locator(trigger)).toBeFocused();
  await page.locator(trigger).click();
  await page.locator(`${switcher} [data-language="en"]`).click();
  await expect(page).toHaveURL(`${base}en/proyectos/pdf-roar/?from=archive#pdf-roar-detail-title`);
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  await expect(page.locator('h1')).toHaveText(translate(projects.find(project=>project.id==='pdf-roar')!.title,'en'));
  await expect(page.locator('.original-content')).toContainText('Full original description');
  await expect(page.locator('.original-content [lang="es"]')).toHaveCount(1);
  expect(await page.evaluate(()=>localStorage.getItem('orbital-language'))).toBe('en');
  await page.goto(base);
  await expect(page).toHaveURL(`${base}en/`);
  await page.locator(trigger).click();
  await page.screenshot({path:testInfo.outputPath('language-menu.png'),fullPage:false,animations:'disabled'});
  const result=await new AxeBuilder({page}).analyze();
  expect(result.violations).toEqual([]);
  await page.locator(`${switcher} [data-language="es"]`).click();
  await expect(page).toHaveURL(base);
  await page.reload();
  await expect(page).toHaveURL(base);
});

for (const locale of translatedLocales) test(`versión ${locale.code}: contenido real, enlaces localizados, metadatos y lectura`,async ({page},testInfo) => {
  await page.goto(languageHref('sobre-mi/',locale.code,base));
  await expect(page.locator('html')).toHaveAttribute('lang',locale.tag);
  await expect(page.locator('html')).toHaveAttribute('dir',locale.direction);
  await expect(page.getByRole('heading',{level:1})).toHaveText(translate('Sobre mí',locale.code));
  await expect(page.getByText(translate(publicProfile.summary,locale.code),{exact:true})).toBeVisible();
  await expect(page.getByText(translate(publicProfile.biography[0],locale.code),{exact:true})).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',translate(publicProfile.summary,locale.code));
  await expect(page.locator('[data-personal-photo="portrait"] img')).toHaveAttribute('alt',translate('Retrato de Joan Roa con gafas, traje oscuro y corbata azul.',locale.code));
  await expect(page.locator('link[rel="alternate"]')).toHaveCount(7);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',new URL(languageHref('sobre-mi/',locale.code,base),siteConfig.site).href);
  await expect(page.locator('.brand')).toHaveAttribute('href',languageHref('',locale.code,base));
  const active=page.locator('#desktop-navigation a[aria-current="page"],#mobile-navigation a[aria-current="page"]');
  await expect(active).toHaveCount(2);
  await expect(active.first()).toHaveText(translate('Sobre mí',locale.code));
  for (const width of [320,768,1440]) {
    await page.setViewportSize({width,height:900});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  }
  const audit=await new AxeBuilder({page}).analyze();
  expect(audit.violations).toEqual([]);
  if (locale.code==='ar') await page.screenshot({path:testInfo.outputPath('about-arabic.png'),fullPage:true,animations:'disabled'});
  if (locale.code==='ar') {
    await page.goto(`${base}ar/juegos/cadete-roa/`);
    await expect(page.locator('#cadete-window')).toBeVisible();
    await expect(page.locator('#cadete-window')).toHaveCSS('direction','ltr');
    await expect(page.locator('.cadet-stage')).toHaveAttribute('lang','en');
    await page.locator('[data-game-close]').click();
    await expect(page.locator('#cadete-window')).not.toBeVisible();
    await expect(page.locator('.cadet-page>.back-link')).toHaveAttribute('href',`${base}ar/juegos/`);
  }
});

test('búsqueda, diálogo traducido y originales conservan el idioma al navegar',async ({page}) => {
  await page.goto(`${base}fr/proyectos/`);
  const search=page.locator('[data-project-search]');
  await search.fill('atelier');
  await expect(page.locator('[data-project-item]:visible')).toHaveCount(1);
  await expect(page.locator('[data-project-count]')).toHaveText('1 projet sur 27');
  await page.locator('[data-project-item]:visible a[data-project-open]').click();
  const dialog=page.locator('#project-dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('h2').first()).toHaveText('pdfRoar · L’atelier du PDF');
  await expect(dialog.locator('.detail-prose').first()).toContainText('Des outils pour fusionner');
  await dialog.locator('.original-content>summary').click();
  await expect(dialog.locator('.original-content [lang="es"]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await page.goto(`${base}zh/blog/lo-pequeno-tambien-tiene-gravedad/`);
  await expect(page.locator('.original-language-note')).toHaveText('原始示例文章 · 西班牙语');
  await expect(page.locator('.article-body')).toHaveAttribute('lang','es');
  await expect(page.locator('.back-to-blog')).toHaveAttribute('href',`${base}zh/blog/`);
});

test('menús no se superponen y el selector respeta el texto al 200 % @mobile',async ({page},testInfo) => {
  await page.goto(base);
  await page.locator('.mobile-menu>summary').click();
  await expect(page.locator('.mobile-menu')).toHaveAttribute('open');
  await page.locator(trigger).click();
  await expect(page.locator('.mobile-menu')).not.toHaveAttribute('open');
  await expect(page.locator(switcher)).toHaveAttribute('open');
  await page.locator('main').click({position:{x:1,y:1}});
  await expect(page.locator(switcher)).not.toHaveAttribute('open');
  await page.addStyleTag({content:'html { font-size:200% !important; }'});
  await page.locator(trigger).click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  await page.locator(`${switcher} [data-language="fr"]`).scrollIntoViewIfNeeded();
  await expect(page.locator(`${switcher} [data-language="fr"]`)).toBeInViewport();
  await page.screenshot({path:testInfo.outputPath('language-menu-text-200.png'),fullPage:false,animations:'disabled'});
});

test.describe('sin JavaScript',()=>{
  test.use({javaScriptEnabled:false});
  test('la burbuja nativa permite cambiar idioma y conservar la sección',async ({page})=>{
    await page.goto(`${base}contacto/`);
    await page.locator(trigger).click();
    await page.locator(`${switcher} [data-language="hi"]`).click();
    await expect(page).toHaveURL(`${base}hi/contacto/`);
    await expect(page.locator('html')).toHaveAttribute('lang','hi');
    await expect(page.getByRole('heading',{level:1})).toHaveText('संपर्क');
    await expect(page.locator('.contact-list a')).toHaveCount(publicProfile.contact.channels.length);
  });
});
