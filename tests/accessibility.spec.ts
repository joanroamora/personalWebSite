import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page, type TestInfo } from '@playwright/test';
import { siteConfig } from '../site.config.mjs';

const base = siteConfig.base;
const pages = [
  ['', 'Inicio'],
  ['sobre-mi/', 'Sobre mí'],
  ['proyectos/', 'Proyectos'],
  ['proyectos/operationalizing-fairness/', 'Proyecto académico'],
  ['juegos/', 'Juegos'],
  ['juegos/cadete-roa/', 'Ficha de Cadete Roa'],
  ['juegos/orbita-de-bolsillo/', 'Juego de muestra'],
  ['blog/', 'Blog'],
  ['blog/lo-pequeno-tambien-tiene-gravedad/', 'Lectura'],
  ['trayectoria/', 'Trayectoria'],
  ['contacto/', 'Contacto'],
  ['404.html', '404'],
];

async function audit(page: Page, testInfo: TestInfo, name: string) {
  const results = await new AxeBuilder({ page }).analyze();
  await testInfo.attach(`${name}-accesibilidad`, {
    body: JSON.stringify({ violations: results.violations, incomplete: results.incomplete }, null, 2),
    contentType: 'application/json',
  });
  expect(results.violations.map(({ id, impact, nodes }) => ({ id, impact, targets: nodes.map(node => node.target) }))).toEqual([]);
}

for (const [path, name] of pages) {
  test(`accesibilidad automática: ${name}`, async ({ page }, testInfo) => {
    await page.goto(`${base}${path}`);
    if (path === 'juegos/cadete-roa/') {
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.locator('[data-game-close]').click();
      await expect(page.getByRole('dialog')).not.toBeVisible();
    }
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('main')).toHaveCount(1);
    await audit(page, testInfo, name);
    await testInfo.attach('estructura-de-lectura', {
      body: await page.getByRole('main').ariaSnapshot(),
      contentType: 'text/plain',
    });
  });
}

test('accesibilidad del detalle abierto y el menú móvil', async ({ page }, testInfo) => {
  await page.goto(`${base}proyectos/`);
  await page.locator('[data-project-open]').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await audit(page, testInfo, 'detalle-abierto');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  const menu = page.locator('summary[aria-controls="mobile-navigation"]');
  if (await menu.isVisible()) {
    await menu.click();
    await audit(page, testInfo, 'menu-abierto');
  }
});

test('accesibilidad de la presentación y pausa de Cadete Roa', async ({ page }, testInfo) => {
  await page.goto(`${base}juegos/cadete-roa/`);
  await expect(page.getByRole('dialog')).toBeVisible();
  await audit(page, testInfo, 'presentacion-juego');
  await page.locator('[data-game-start]').click();
  await page.locator('[data-game-pause]').click();
  await expect(page.locator('.cadet-stage')).toHaveAttribute('data-state', 'paused');
  await audit(page, testInfo, 'pausa-juego');
});
