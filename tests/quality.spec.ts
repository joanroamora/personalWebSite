import { expect, test } from '@playwright/test';
import { siteConfig } from '../site.config.mjs';

declare global {
  interface Window {
    qualityCompleteFullscreenEntry(): void;
    qualityLayoutShiftValue(): number;
  }
}

const base = siteConfig.base;

test('cerrar el juego espera una solicitud de pantalla completa pendiente', { tag: '@mobile' }, async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    let fullscreen: Element | null = null;
    let completeEntry: (() => void) | undefined;
    Object.defineProperty(document, 'fullscreenElement', { get: () => fullscreen });
    Element.prototype.requestFullscreen = () => new Promise<void>(resolve => {
      completeEntry = () => {
        fullscreen = document.documentElement;
        resolve();
        document.dispatchEvent(new Event('fullscreenchange'));
      };
    });
    document.exitFullscreen = async () => {
      fullscreen = null;
      document.dispatchEvent(new Event('fullscreenchange'));
    };
    Object.assign(window, { qualityCompleteFullscreenEntry: () => completeEntry?.() });
  });
  await page.goto(`${base}juegos/cadete-roa/`);
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.locator('[data-game-start]').click();
  await page.locator('[data-game-close]').click();
  await page.evaluate(() => window.qualityCompleteFullscreenEntry());
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect.poll(() => page.evaluate(() => document.fullscreenElement === null)).toBe(true);
  await expect(page.locator('[data-game-open]')).toBeFocused();
});

test('texto al 200 % conserva navegación y lectura sin desbordamiento', { tag: '@desktop' }, async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['', 'sobre-mi/', 'proyectos/', 'juegos/', 'blog/', 'blog/dejar-una-idea-por-escrito/', 'trayectoria/', 'contacto/']) {
    await page.goto(`${base}${path}`);
    await page.addStyleTag({ content: ':root { font-size: 200%; }' });
    const layout = await page.evaluate(() => ({
      fits: document.documentElement.scrollWidth <= window.innerWidth,
      overflow: Array.from(document.querySelectorAll('body *')).filter(element => {
        const bounds = element.getBoundingClientRect();
        return bounds.right > window.innerWidth + 1 && bounds.width > 0;
      }).slice(0, 12).map(element => ({ tag: element.tagName, class: element.className })),
    }));
    expect(layout.fits, `${path || 'Inicio'}: ${JSON.stringify(layout.overflow)}`).toBe(true);
    const menu = page.locator('summary[aria-controls="mobile-navigation"]');
    await menu.click();
    await expect(page.locator('#mobile-navigation')).toBeVisible();
    await page.keyboard.press('Escape');
  }
  await page.screenshot({ path: testInfo.outputPath('texto-ampliado.png'), fullPage: true, animations: 'disabled' });
});

test('el contenido se mantiene estable al cargar sin recursos de terceros', async ({ page }, testInfo) => {
  const foreignRequests: string[] = [];
  page.on('request', request => {
    const url = new URL(request.url());
    if (url.protocol.startsWith('http') && url.origin !== 'http://127.0.0.1:4321') foreignRequests.push(url.href);
  });
  await page.addInitScript(() => {
    let shift = 0;
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        const layout = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
        if (!layout.hadRecentInput) shift += layout.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
    Object.assign(window, { qualityLayoutShiftValue: () => shift });
  });
  const measurements = [];
  for (const path of ['', 'proyectos/', 'juegos/', 'blog/', 'blog/lo-pequeno-tambien-tiene-gravedad/']) {
    await page.goto(`${base}${path}`);
    await page.locator('img').evaluateAll(images => Promise.all(images
      .filter((image): image is HTMLImageElement => image instanceof HTMLImageElement && image.complete)
      .map(image => image.decode().catch(() => {}))));
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const shift = await page.evaluate(() => window.qualityLayoutShiftValue());
    expect(shift, path || 'Inicio').toBeLessThanOrEqual(0.1);
    measurements.push({ path: path || '/', layoutShift: shift });
  }
  expect(foreignRequests).toEqual([]);
  await testInfo.attach('estabilidad-de-carga', { body: JSON.stringify(measurements, null, 2), contentType: 'application/json' });
});
