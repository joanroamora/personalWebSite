import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { siteConfig } from '../site.config.mjs';
const url=`${siteConfig.base}juegos/torque-trail/`;

test('Torque Trail: aceleración, freno, meta, siguiente recorrido, récord y reinicio @desktop',async({page},testInfo)=>{
  test.setTimeout(90000);await page.clock.install();
  await page.addInitScript(()=>{window.requestAnimationFrame=callback=>window.setTimeout(()=>callback(performance.now()),100);window.cancelAnimationFrame=window.clearTimeout.bind(window);});
  await page.goto(url);await page.locator('[data-arcade-start]').click();
  await page.keyboard.down('ArrowUp');await page.clock.runFor(6000);await page.keyboard.up('ArrowUp');
  const fast=Number(await page.locator('[data-ride-speed]').textContent());expect(fast).toBeGreaterThan(25);
  await page.screenshot({path:testInfo.outputPath('torque-trail-riding.png')});
  await page.keyboard.down('ArrowDown');await page.clock.runFor(2000);await page.keyboard.up('ArrowDown');
  expect(Number(await page.locator('[data-ride-speed]').textContent())).toBeLessThan(fast);
  await page.keyboard.down('ArrowUp');await page.clock.runFor(35000);await page.keyboard.up('ArrowUp');
  await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','over');await expect(page.locator('.arcade-title')).toHaveText('Trail complete');
  await expect(page.locator('[data-screen-message]')).toContainText('clean landings');
  const best=Number(await page.locator('[data-arcade-best]').textContent());expect(best).toBeGreaterThan(0);
  expect(await page.evaluate(()=>Number(localStorage.getItem('torque-trail:best:v1')))).toBe(best);
  await page.locator('[data-arcade-next]').click();await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','running');
  await page.keyboard.press('KeyP');await page.locator('[data-arcade-restart]').click();
  await expect(page.locator('[data-ride-score]')).toHaveText('00000');await expect(page.locator('[data-ride-lives]')).toHaveText('3');
  await page.reload();await expect(page.locator('[data-arcade-best]')).toHaveText(String(best));
});

test('Torque Trail: caídas, recuperación real en el punto de control y fin de intentos @desktop',async({page},testInfo)=>{
  test.setTimeout(90000);await page.clock.install();
  await page.addInitScript(()=>{window.requestAnimationFrame=callback=>window.setTimeout(()=>callback(performance.now()),100);window.cancelAnimationFrame=window.clearTimeout.bind(window);});
  await page.goto(url);await page.locator('[data-arcade-start]').click();
  await page.keyboard.down('ArrowUp');await page.keyboard.down('ArrowLeft');await page.clock.runFor(19000);
  await expect(page.locator('[data-ride-lives]')).toHaveText('2');await expect(page.locator('[data-action="context"]')).toBeEnabled();
  await page.screenshot({path:testInfo.outputPath('torque-trail-recovery.png')});
  const before=await page.locator('[data-ride-distance]').textContent();
  await page.keyboard.press('KeyE');await page.clock.runFor(300);
  await expect(page.locator('[data-action="context"]')).toBeDisabled();expect(await page.locator('[data-ride-distance]').textContent()).not.toBe(before);
  await page.clock.runFor(9000);await expect(page.locator('[data-ride-lives]')).toHaveText('1');
  await page.keyboard.press('KeyE');await page.clock.runFor(9000);await page.keyboard.up('ArrowUp');await page.keyboard.up('ArrowLeft');
  await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','over');await expect(page.locator('.arcade-title')).toHaveText('Dust settles');
  await page.locator('[data-arcade-start]').click();await expect(page.locator('[data-ride-lives]')).toHaveText('3');
});

test('Torque Trail: gas e inclinación simultáneos, controles cómodos y cambios de tamaño @mobile',async({page,context},testInfo)=>{
  await page.addInitScript(()=>{Object.defineProperty(Element.prototype,'requestFullscreen',{value:undefined,configurable:true});});
  await page.goto(url);await page.locator('[data-arcade-start]').tap();
  const cdp=await context.newCDPSession(page);
  const gas=(await page.locator('[data-hold="up"]').boundingBox())!,lean=(await page.locator('[data-hold="right"]').boundingBox())!;
  expect(gas.width).toBeGreaterThanOrEqual(44);expect(gas.height).toBeGreaterThanOrEqual(44);expect(lean.width).toBeGreaterThanOrEqual(44);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:1,x:gas.x+gas.width/2,y:gas.y+gas.height/2},{id:2,x:lean.x+lean.width/2,y:lean.y+lean.height/2}]});
  await expect(page.locator('[data-hold="up"]')).toHaveClass(/is-held/);await expect(page.locator('[data-hold="right"]')).toHaveClass(/is-held/);
  await expect.poll(async()=>Number(await page.locator('[data-ride-speed]').textContent())).toBeGreaterThan(3);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  const score=Number(await page.locator('[data-ride-score]').textContent());
  for(const size of [{width:320,height:568},{width:844,height:390}]){
    await page.setViewportSize(size);await expect(page.locator('.arcade-stage')).toHaveAttribute('data-phase','running');
    await expect(page.locator('[data-hold="up"]')).toBeInViewport();await expect(page.locator('[data-arcade-pause]')).toBeInViewport();
    const field=(await page.locator('.arcade-playfield').boundingBox())!,controls=(await page.locator('.arcade-controls').boundingBox())!;
    expect(field.y+field.height<=controls.y+1||field.x+field.width<=controls.x+1).toBe(true);
    expect(Number(await page.locator('[data-ride-score]').textContent())).toBeGreaterThanOrEqual(score);
  }
  await page.screenshot({path:testInfo.outputPath('torque-trail-landscape.png')});
  await page.locator('[data-arcade-pause]').tap();
  const audit=await new AxeBuilder({page}).include('[data-arcade]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(audit.violations).toEqual([]);
  await page.locator('[data-arcade-close]').tap();await expect(page.locator('html')).not.toHaveClass(/arcade-open/);
  await cdp.detach();
});
