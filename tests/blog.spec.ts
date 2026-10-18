import { expect, test } from '@playwright/test';
import { siteConfig } from '../site.config.mjs';

const base = siteConfig.base;
const latest = 'lo-pequeno-tambien-tiene-gravedad';
const codePost = 'dejar-una-idea-por-escrito';

test('Inicio y el índice comparten la última entrada; un borrador no tiene ruta', async ({ page }, testInfo) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto(base);
  await expect(page.locator('.latest-placeholder h3')).toHaveText('Lo pequeño también tiene gravedad');
  await page.getByRole('link', { name: 'Leer la entrada' }).click();
  await expect(page).toHaveURL(new RegExp(`${base}blog/${latest}/$`));
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${siteConfig.site}${base}blog/${latest}/`);
  await page.getByRole('link', { name: 'Volver al blog', exact: true }).click();
  await expect(page.locator('.featured-post h2')).toHaveText('Lo pequeño también tiene gravedad');
  await expect(page.locator('.post-list h3')).toHaveText(['Un juego empieza antes de la primera partida', 'Dejar una idea por escrito']);
  await expect(page.getByRole('complementary', { name: 'Aviso de contenido de muestra' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Borrador/ })).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath('blog.png'), fullPage: true, animations: 'disabled' });
  const response = await page.goto(`${base}blog/borrador-de-muestra/`);
  expect(response?.status()).toBe(404);
  expect(requests.filter(url => /cadete-roa|\/game\.|\/renderer\./.test(url))).toEqual([]);
});

test.describe('lectura sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('índice, apartados, entrada anterior y regreso funcionan con enlaces reales', async ({ page }, testInfo) => {
    await page.goto(`${base}blog/`);
    await page.getByRole('link', { name: 'Lo pequeño también tiene gravedad', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lo pequeño también tiene gravedad');
    const toc = page.getByRole('navigation', { name: 'En esta entrada', exact: true });
    const chapter = toc.getByRole('link', { name: 'Probar sin cerrar la puerta', exact: true });
    await chapter.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#probar-sin-cerrar-la-puerta$/);
    await expect(page.getByRole('heading', { name: 'Probar sin cerrar la puerta', exact: true })).toBeInViewport();
    await page.getByRole('navigation', { name: 'Más entradas' }).getByRole('link', { name: /Una nota anterior/ }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Un juego empieza antes de la primera partida');
    await expect(page.locator('.article-body table')).toBeVisible();
    await page.getByRole('navigation', { name: 'Más entradas' }).getByRole('link', { name: /Una nota anterior/ }).click();
    await expect(page.locator('.article-body pre code')).toContainText('const preguntas');
    await page.screenshot({ path: testInfo.outputPath('lectura.png'), fullPage: true, animations: 'disabled' });
    await page.getByRole('link', { name: 'Todas las entradas', exact: true }).click();
    await expect(page).toHaveURL(`http://127.0.0.1:4321${base}blog/`);
  });
});

test('lectura con movimiento reducido y navegación activa', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${base}blog/${latest}/`);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.post-header time')).toHaveAttribute('datetime', '2026-10-16');
  const navigation = page.locator('#desktop-navigation');
  if (await navigation.isVisible()) await expect(navigation.locator('[aria-current="page"]')).toHaveText('Blog');
  else {
    await page.locator('summary[aria-controls="mobile-navigation"]').click();
    await expect(page.locator('#mobile-navigation [aria-current="page"]')).toHaveText('Blog');
    await page.keyboard.press('Escape');
  }
  await expect(page.locator('.post-pagination a').first()).toHaveCSS('transition-duration', '0s');
  await page.screenshot({ path: testInfo.outputPath('entrada.png'), fullPage: true, animations: 'disabled' });
});

test('blog, tablas y código caben en móvil, tablet y horizontal', { tag: '@desktop' }, async ({ page }) => {
  for (const viewport of [{ width: 320, height: 640 }, { width: 768, height: 1024 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    for (const path of ['blog/', `blog/${codePost}/`, 'blog/antes-de-la-primera-partida/']) {
      await page.goto(`${base}${path}`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${path} a ${viewport.width}px`).toBe(true);
    }
  }
});
