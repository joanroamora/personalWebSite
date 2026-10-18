import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { parsePublicProfile } from '../src/utils/profile';
import { siteConfig } from '../site.config.mjs';

const profile = parsePublicProfile(readFileSync(new URL('../docs/PERFIL_PUBLICO.md', import.meta.url), 'utf8'));
const base = siteConfig.base;

test('la identidad y el proyecto destacado son reales; el blog conserva su etiqueta de muestra', async ({ page }) => {
  await page.goto(base);
  await expect(page.locator('.brand')).toContainText(profile.name);
  await expect(page.locator('.hero .lead')).toHaveText(profile.introduction[0]);
  await expect(page.locator('.featured-placeholder h3')).toContainText(profile.featuredProjects[0].name);
  await expect(page.locator('.featured-placeholder a')).toHaveAttribute('href', `${base}proyectos/pdf-roar/`);
  await expect(page.locator('.latest-placeholder')).toContainText('Texto de muestra');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await expect(page).toHaveTitle(new RegExp(profile.name));
  await expect(page.locator('.hero')).not.toContainText('Este podría ser');
});

test('biografía, trayectoria y formación proceden de la fuente sin atribuir contenido ficticio', async ({ page }, testInfo) => {
  await page.goto(`${base}sobre-mi/`);
  await expect(page.getByText(profile.summary, { exact: true })).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', profile.summary);
  for (const paragraph of profile.biography) await expect(page.getByText(paragraph, { exact: true })).toBeVisible();
  await expect(page.locator('.profile-toolkit dt')).toHaveText(profile.technologies.map(group => group.area));
  await expect(page.locator('.photo-placeholder')).toContainText('Fotografía pendiente');
  await expect(page.locator('.photo-placeholder img')).toHaveCount(0);
  await expect(page.getByRole('complementary', { name: 'Aviso de contenido de muestra' })).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath('sobre-mi-real.png'), fullPage: true, animations: 'disabled' });
  await page.goto(`${base}trayectoria/`);
  await expect(page.locator('.journey-list h3')).toHaveText([...profile.experience].reverse().map(entry => entry.title));
  await expect(page.locator('.profile-education h3')).toHaveText(profile.education.map(entry => entry.title));
  await expect(page.locator('.profile-certifications h3')).toHaveText(profile.certifications.map(entry => entry.title));
  await expect(page.locator('main')).not.toContainText('Capítulo de muestra');
  await page.screenshot({ path: testInfo.outputPath('trayectoria-real.png'), fullPage: true, animations: 'disabled' });
});

test('Contacto ofrece solo los tres canales públicos aprobados', async ({ page }, testInfo) => {
  await page.goto(`${base}contacto/`);
  await expect(page.locator('.contact-list a')).toHaveCount(profile.contact.channels.length);
  for (const channel of profile.contact.channels) {
    await expect(page.getByRole('link', { name: channel.label, exact: true })).toHaveAttribute('href', channel.href);
  }
  await expect(page.locator('.contact-location')).toContainText(profile.contact.location);
  await expect(page.locator('form,.test-destination')).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath('contacto-real.png'), fullPage: true, animations: 'disabled' });
});
