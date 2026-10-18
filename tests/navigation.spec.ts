import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { parsePublicProfile } from '../src/utils/profile';
import { navigation } from '../src/data/navigation';
import { siteConfig } from '../site.config.mjs';

const base = siteConfig.base;
const publicProfile = parsePublicProfile(readFileSync(new URL('../docs/PERFIL_PUBLICO.md', import.meta.url), 'utf8'));
const summarySelector = 'summary[aria-controls="mobile-navigation"]';

async function openNavigation(page: Page) {
  const summary = page.locator(summarySelector);
  if (await summary.isVisible() && !await page.locator('[data-navigation-disclosure]').evaluate((menu: HTMLDetailsElement) => menu.open)) {
    await summary.click();
  }
  return page.locator('nav[aria-label="Navegación principal"]:visible');
}

test('las siete rutas son navegables y señalan la sección activa', async ({ page }, testInfo) => {
  const failedResources: string[] = [];
  page.on('response', response => { if (response.status() >= 400) failedResources.push(response.url()); });
  await page.goto(base);
  await page.screenshot({ path: testInfo.outputPath('inicio.png'), fullPage: true, animations: 'disabled' });
  for (const section of navigation) {
    const nav = await openNavigation(page);
    await expect(nav.getByRole('link')).toHaveText(navigation.map(item => item.label));
    await nav.getByRole('link', { name: section.label, exact: true }).click();
    await expect(page).toHaveURL(`http://127.0.0.1:4321${base}${section.path}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(section.path ? section.label : /Ideas en\s*órbita\./);
    const currentNav = await openNavigation(page);
    await expect(currentNav.locator('[aria-current="page"]')).toHaveCount(1);
    await expect(currentNav.locator('[aria-current="page"]')).toHaveText(section.label);
    if (await page.locator(summarySelector).isVisible()) await page.locator(summarySelector).click();
    if (section.path === 'blog/') await page.screenshot({ path: testInfo.outputPath('seccion-blog.png'), fullPage: true, animations: 'disabled' });
    if (section.id === 'projects') await page.screenshot({ path: testInfo.outputPath('proyectos.png'), fullPage: true, animations: 'disabled' });
    if (section.id === 'games') await page.screenshot({ path: testInfo.outputPath('juegos.png'), fullPage: true, animations: 'disabled' });
    if (['about', 'journey', 'contact'].includes(section.id)) {
      await expect(page.getByRole('complementary', { name: 'Aviso de contenido de muestra' })).toHaveCount(0);
      await page.screenshot({ path: testInfo.outputPath(`${section.id}.png`), fullPage: true, animations: 'disabled' });
    }
  }
  expect(failedResources).toEqual([]);
});

test('el enlace de salto permite entrar al contenido con teclado', async ({ page }) => {
  await page.goto(base);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Saltar al contenido' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('respeta el movimiento reducido y mantiene la navegación normal', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base);
  expect(await page.locator('html').evaluate(element => parseFloat(getComputedStyle(element).getPropertyValue('--motion-fast')))).toBe(0);
  const nav = await openNavigation(page);
  expect(await nav.getByRole('link').first().evaluate(element => getComputedStyle(element).transitionDuration)).toBe('0s');
  await nav.getByRole('link', { name: 'Juegos', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Juegos', level: 1 })).toBeVisible();
});

test.describe('sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('los enlaces y el menú nativo siguen funcionando', async ({ page }) => {
    await page.goto(base);
    const nav = await openNavigation(page);
    await nav.getByRole('link', { name: 'Proyectos', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Proyectos', level: 1 })).toBeVisible();
    const nextNav = await openNavigation(page);
    await nextNav.getByRole('link', { name: 'Inicio', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Ideas en\s*órbita\./);
  });

  test('los contactos públicos conservan sus destinos sin JavaScript', async ({ page }) => {
    await page.goto(`${base}contacto/`);
    for (const channel of publicProfile.contact.channels) {
      await expect(page.getByRole('link', { name: channel.label, exact: true })).toHaveAttribute('href', channel.href);
    }
  });
});

test('menú móvil: teclado, cierre, pantalla táctil e historial', { tag: '@mobile' }, async ({ page }, testInfo) => {
  await page.goto(base);
  const menu = page.locator('[data-navigation-disclosure]');
  const summary = page.locator(summarySelector);
  await summary.focus();
  await page.keyboard.press('Space');
  await expect(menu).toHaveJSProperty('open', true);
  await page.keyboard.press('Tab');
  await expect(page.locator('#mobile-navigation a').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveJSProperty('open', false);
  await expect(summary).toBeFocused();
  await expect(summary).toHaveCSS('outline-style', 'solid');

  await summary.tap();
  await page.screenshot({ path: testInfo.outputPath('menu-movil.png'), fullPage: true, animations: 'disabled' });
  const links = page.locator('#mobile-navigation a');
  for (const link of await links.all()) expect((await link.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  await page.locator('.brand').focus();
  await expect(menu).toHaveJSProperty('open', false);

  await summary.tap();
  await page.locator('.site-footer p').click();
  await expect(menu).toHaveJSProperty('open', false);
  await summary.tap();
  await page.locator('#mobile-navigation').getByRole('link', { name: 'Blog', exact: true }).tap();
  await expect(page.getByRole('heading', { name: 'Blog', level: 1 })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(`http://127.0.0.1:4321${base}`);
  await expect(page.locator('[data-navigation-disclosure]')).toHaveJSProperty('open', false);
});

test('pantallas pequeñas, intermedias, horizontales y escritorio sin desbordamiento', { tag: '@desktop' }, async ({ page }, testInfo) => {
  const screens = [
    { width: 320, height: 640 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 844, height: 390 },
    { width: 1024, height: 768 },
    { width: 1120, height: 800 },
    { width: 1440, height: 900 },
  ];
  for (const viewport of screens) {
    await page.setViewportSize(viewport);
    await page.goto(base);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.locator('#desktop-navigation')).toBeVisible({ visible: viewport.width >= 1120 });
    await expect(page.locator(summarySelector)).toBeVisible({ visible: viewport.width < 1120 });
    await page.screenshot({ path: testInfo.outputPath(`inicio-${viewport.width}x${viewport.height}.png`), fullPage: true, animations: 'disabled' });
    for (const section of navigation.filter(item => ['about', 'projects', 'games', 'blog', 'journey', 'contact'].includes(item.id))) {
      await page.goto(`${base}${section.path}`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${section.label} a ${viewport.width}px`).toBe(true);
    }
  }
});
