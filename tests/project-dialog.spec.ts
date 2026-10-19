import { expect, test } from '@playwright/test';
import { siteConfig } from '../site.config.mjs';

const catalogue = `${siteConfig.base}proyectos/`;

test('el detalle abre delante del catálogo, contiene el foco y regresa a la tarjeta', async ({ page }, testInfo) => {
  await page.goto(catalogue);
  const opener = page.getByRole('link', { name: 'AETHER · Inteligencia documental', exact: true });
  await opener.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'AETHER · Inteligencia documental', exact: true });
  await expect(dialog).toBeVisible();
  await expect(page).toHaveURL(`http://127.0.0.1:4321${catalogue}`);
  const close = dialog.getByRole('button', { name: 'Cerrar detalle' });
  await expect(close).toBeFocused();
  await expect(page.locator('html')).toHaveCSS('overflow-y', 'hidden');
  await expect(dialog.getByRole('link', { name: 'Explorar el código en GitHub' })).toHaveAttribute('href', 'https://github.com/joanroamora/rag-document-intelligence');
  const python = dialog.locator('img[src$="python.svg"]');
  await python.scrollIntoViewIfNeeded();
  expect(await python.evaluate(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)).toBe(true);
  await close.focus();
  await page.keyboard.press('Shift+Tab');
  expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
  await dialog.evaluate(element => { element.scrollTop = 0; });
  await page.screenshot({ path: testInfo.outputPath('detalle-proyecto.png'), animations: 'disabled' });
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
  await expect(page.locator('html')).not.toHaveCSS('overflow-y', 'hidden');

  await opener.click();
  await expect(dialog).toBeVisible();
  await page.mouse.click(3, 3);
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test('búsqueda y filtros permiten localizar proyectos académicos y recuperar el catálogo', async ({ page }, testInfo) => {
  await page.goto(catalogue);
  await page.getByRole('button', { name: 'Datos', exact: true }).click();
  const search = page.getByRole('searchbox', { name: 'Buscar proyectos' });
  await search.fill('UNAD');
  await expect(page.locator('[data-project-item]:visible')).toHaveCount(1);
  await page.getByRole('link', { name: 'Horizonte 2050 · Energía por habitante', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('complementary', { name: 'Contexto académico' })).toContainText('Proyecto aplicado de grado');
  await expect(dialog).toContainText('UNAD');
  await dialog.getByRole('button', { name: 'Cerrar detalle' }).click();
  await expect(dialog).toBeHidden();

  await search.fill('indiana');
  await page.getByRole('link', { name: 'FairLens · Una mirada al sesgo', exact: true }).click();
  await expect(dialog).toContainText('Machine Learning Fundamentals');
  await expect(dialog).toContainText('Indiana Wesleyan University');
  await dialog.getByRole('button', { name: 'Cerrar detalle' }).click();
  await expect(dialog).toBeHidden();
  await search.fill('zzzzzz-sin-resultados');
  await expect(page.getByRole('heading', { name: 'No hay proyectos en esta búsqueda.' })).toBeVisible();
  await page.getByRole('button', { name: 'Ver todos los proyectos' }).click();
  await expect(page.locator('[data-project-item]:visible')).toHaveCount(27);
  await search.fill('Boris');
  await expect(page.locator('[data-project-item]:visible')).toContainText('Repositorio privado');
  await search.clear();
  await page.screenshot({ path: testInfo.outputPath('catalogo-proyectos.png'), fullPage: true, animations: 'disabled' });
});

test('movimiento reducido y ventanas pequeñas conservan el acceso al detalle y al cierre', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const viewport of [{ width: 320, height: 640 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    await page.goto(catalogue);
    await page.getByRole('link', { name: 'AETHER · Inteligencia documental', exact: true }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveCSS('animation-name', 'none');
    expect(await dialog.evaluate(element => getComputedStyle(element, '::backdrop').animationName)).toBe('none');
    expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    const repository = dialog.getByRole('link', { name: 'Explorar el código en GitHub' });
    await repository.scrollIntoViewIfNeeded();
    await expect(repository).toBeInViewport();
    const close = dialog.getByRole('button', { name: 'Cerrar detalle' });
    await expect(close).toBeInViewport();
    await close.click();
    await expect(dialog).toBeHidden();
  }
});
