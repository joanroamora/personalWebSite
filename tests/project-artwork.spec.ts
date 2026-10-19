import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { projects } from '../src/data/projects';
import { siteConfig } from '../site.config.mjs';

const base = siteConfig.base;
const root = '[data-featured-projects]';
const slide = `${root} [data-featured-host] [data-featured-slide]`;
const current = (page: import('@playwright/test').Page) => page.locator(slide).getAttribute('data-featured-slide');

test('todas las tarjetas y sus detalles comparten una ilustración real y responsive', async ({ page }) => {
  await page.goto(`${base}proyectos/`);
  const figures = page.locator('.projects-grid [data-project-artwork]');
  await expect(figures).toHaveCount(projects.length);
  expect(new Set(await figures.locator('img').evaluateAll(images => images.map(image => image.getAttribute('src')))).size).toBe(27);
  for (const figure of await figures.all()) {
    const image = figure.locator('img');
    await expect(image).toHaveAttribute('loading', 'lazy');
    await expect(image).toHaveAttribute('srcset', /360w.*600w.*900w.*1200w/);
    await expect(image).toHaveAttribute('alt', /Plano conceptual/);
  }
  const card = page.locator('#pdf-roar');
  await card.scrollIntoViewIfNeeded();
  const cardImage = card.locator('[data-project-artwork] img');
  await expect.poll(() => cardImage.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  const src = await cardImage.getAttribute('src');
  await card.getByRole('link').click();
  const dialog = page.getByRole('dialog');
  const detailImage = dialog.locator('[data-project-artwork] img');
  await expect(detailImage).toHaveAttribute('src', src!);
  await expect(dialog).toContainText('Ilustración conceptual · Generada con IA');
  await dialog.getByRole('button', { name: 'Cerrar detalle' }).click();
  await page.goto(`${base}proyectos/pdf-roar/`);
  await expect(page.locator('main [data-project-artwork="pdf-roar"]')).toBeVisible();
});

test('el destacado rota cada tres segundos sin repetir hasta recorrer los 27 proyectos', async ({ page }) => {
  await page.clock.install();
  const fetched: string[] = [];
  page.on('request', request => { if (/\.(?:webp|jpg)(?:\?|$)/.test(request.url())) fetched.push(request.url()); });
  await page.goto(base);
  await page.locator(root).scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect(page.locator(root)).toHaveAttribute('data-rotation-state', 'playing');
  await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 100);
  await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
  expect(await current(page)).toBe('pdf-roar');
  // Inert templates must not download the other 26 project pictures at startup.
  expect(new Set(fetched.filter(url => projects.some(project => url.includes(`${project.id}.`)))).size).toBeLessThanOrEqual(2);
  const seen = new Set([await current(page)]);
  await page.clock.runFor(2990);
  expect(await current(page)).toBe('pdf-roar');
  for (let index = 0; index < 26; index++) {
    await page.clock.runFor(index === 0 ? 50 : 3000);
    const id = await current(page);
    expect(seen.has(id)).toBe(false);
    seen.add(id);
    await expect(page.locator(`${slide} a`)).toHaveAttribute('href', `${base}proyectos/${id}/`);
    await expect(page.locator(`${slide} [data-project-artwork]`)).toHaveAttribute('data-project-artwork', id!);
  }
  expect(seen.size).toBe(27);
  await expect(page.locator('[data-featured-announcement]')).toBeEmpty();
});

test('la rotación respeta foco, pausa, visibilidad, movimiento reducido y navegación manual', async ({ page }) => {
  await page.clock.install();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base);
  await page.locator(root).scrollIntoViewIfNeeded();
  await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 100);
  await expect(page.locator(root)).toHaveAttribute('data-rotation-state', 'paused');
  await page.clock.runFor(9000);
  expect(await current(page)).toBe('pdf-roar');
  await page.getByRole('button', { name: 'Siguiente proyecto' }).click();
  expect(await current(page)).not.toBe('pdf-roar');
  await expect(page.locator('[data-featured-announcement]')).not.toBeEmpty();
  const toggle = page.locator('[data-featured-toggle]');
  await toggle.click();
  await expect(toggle).toHaveAttribute('data-paused', 'false');
  const before = await current(page);
  await page.locator(`${slide} a`).focus();
  await page.clock.runFor(6000);
  expect(await current(page)).toBe(before);
  await page.evaluate(() => (document.activeElement as HTMLElement).blur());
  await page.mouse.move(0, 0);
  await expect(page.locator(root)).toHaveAttribute('data-rotation-state', 'playing');
  await page.clock.runFor(3010);
  expect(await current(page)).not.toBe(before);
  await toggle.click();
  await expect(toggle).toHaveAttribute('data-paused', 'true');
  const paused = await current(page);
  await page.clock.runFor(6000);
  expect(await current(page)).toBe(paused);
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable:true, value:true }); document.dispatchEvent(new Event('visibilitychange')); });
  await toggle.click();
  await page.evaluate(() => (document.activeElement as HTMLElement).blur());
  await page.clock.runFor(6000);
  expect(await current(page)).toBe(paused);
  await expect(page.locator(root)).toHaveAttribute('data-rotation-state', 'suspended');
});

test('móvil, RTL y teclado mantienen imágenes y enlaces coherentes sin desbordamiento', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const locale of ['en', 'ar']) {
    for (const viewport of [{ width:320, height:740 }, { width:844, height:390 }, { width:1440, height:900 }]) {
      await page.setViewportSize(viewport);
      await page.goto(`${base}${locale}/`);
      await page.locator(root).scrollIntoViewIfNeeded();
      const next = page.locator('[data-featured-next]');
      await next.focus();
      await page.keyboard.press('Enter');
      const id = await current(page);
      await expect(page.locator(`${slide} a`)).toHaveAttribute('href', `${base}${locale}/proyectos/${id}/`);
      await expect(page.locator(`${slide} img`).first()).toHaveAttribute('alt', locale === 'en' ? /Conceptual sepia/ : /رسم هندسي/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const size = await next.boundingBox();
      expect(size!.width).toBeGreaterThanOrEqual(44);
      expect(size!.height).toBeGreaterThanOrEqual(44);
      if (locale === 'en' && viewport.height > 700) {
        await page.locator(root).screenshot({ path:testInfo.outputPath(`featured-${viewport.width}.png`), animations:'disabled' });
      }
    }
  }
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path:testInfo.outputPath('portfolio-featured.png'), fullPage:true });
});

test('sin JavaScript se conservan imagen y enlace del proyecto inicial', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled:false });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:4321${base}`);
  await expect(page.locator(`${slide} [data-project-artwork="pdf-roar"]`)).toBeVisible();
  await expect(page.locator(`${slide} a`)).toHaveAttribute('href', `${base}proyectos/pdf-roar/`);
  await expect(page.locator('[data-featured-controls]')).toBeHidden();
  await context.close();
});
