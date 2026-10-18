import assert from 'node:assert/strict';
import { test } from 'node:test';
import { localizeHTML, translate } from '../src/i18n/render.ts';
import { locales, translatedLocales, languageHref, routeContext } from '../src/i18n/locales.ts';
import { ui } from '../src/i18n/ui.ts';
import { profileTranslations } from '../src/i18n/profile.ts';
import { projectTranslations, summaries, projectTitles } from '../src/i18n/projects.ts';
import { editorialTranslations } from '../src/i18n/editorial.ts';
import { projects } from '../src/data/projects.ts';

test('los seis idiomas tienen orden estable, nombres propios y escritura árabe RTL', () => {
  assert.deepEqual(locales.map(locale => locale.code),['en','es','zh','hi','ar','fr']);
  assert.equal(locales.find(locale => locale.code === 'ar').direction,'rtl');
  for (const catalog of [ui,profileTranslations,projectTranslations,editorialTranslations]) for (const row of Object.values(catalog)) {
    assert.equal(row.length,5); row.forEach(text => assert.ok(typeof text === 'string' && text.trim()));
  }
  for (const project of projects) { assert.ok(summaries[project.id]); assert.ok(projectTitles[project.id]); }
});

test('las URLs conservan base, detalle, query y ancla sin duplicar idiomas', () => {
  const base = '/personalWebSite/';
  for (const locale of locales) {
    const url = languageHref('proyectos/pdf-roar/?from=home#pdf-roar-detail-title',locale.code,base);
    assert.deepEqual(routeContext(url,base),{locale:locale.code,path:'proyectos/pdf-roar/?from=home#pdf-roar-detail-title'});
  }
  assert.equal(languageHref('', 'fr', '/'),'/fr/');
  assert.deepEqual(routeContext('/fr/sobre-mi/','/'),{locale:'fr',path:'sobre-mi/'});
});

test('se traduce HTML y plantillas inertes sin tocar recursos, código ni originales', () => {
  const source = '<!doctype html><html lang="es"><head><title>Sobre mí · Joan Ricardo Roa Mora</title><meta name="description" content="Proyectos"></head><body><h1>Sobre mí</h1><a href="/personalWebSite/proyectos/pdf-roar/">Descubrir proyecto</a><img alt="Proyectos" src="/personalWebSite/images/test.svg"><script>const title = "Proyectos";</script><template><p>Hecho con</p></template><div data-no-translate lang="es">Descripción original en español</div><pre>Proyectos</pre></body></html>';
  const html = localizeHTML(source,'ar','/personalWebSite/');
  assert.match(html,/lang="ar" dir="rtl"/);
  assert.match(html,/href="\/personalWebSite\/ar\/proyectos\/pdf-roar\/"/);
  assert.match(html,/src="\/personalWebSite\/images\/test.svg"/);
  assert.match(html,/<template><p>التقنيات المستخدمة<\/p><\/template>/);
  assert.match(html,/<script>const title = "Proyectos";<\/script>/);
  assert.match(html,/<div data-no-translate="" lang="es">Descripción original en español<\/div>/);
  assert.match(html,/<pre>Proyectos<\/pre>/);
  assert.equal(localizeHTML(source,'es','/personalWebSite/'),source);
  for (const locale of translatedLocales) assert.notEqual(translate('Ingeniero DevOps con experiencia en confiabilidad de plataformas.',locale.code),'Ingeniero DevOps con experiencia en confiabilidad de plataformas.');
  const description=localizeHTML('<html><head><meta name="description" content="Ingeniero DevOps con experiencia en confiabilidad de plataformas. Código, juegos y textos de Joan Ricardo Roa Mora."></head><body></body></html>','en','/personalWebSite/');
  assert.match(description,/DevOps engineer with experience in platform reliability\. Code, games and writing by Joan Ricardo Roa Mora\./);
});

test('las fechas y los contadores conservan el valor y cambian de idioma', () => {
  const source='<html lang="es"><head></head><body><time datetime="2026-10-16">16 de octubre de 2026</time><p data-project-count>12 proyectos / Un archivo en movimiento</p></body></html>';
  const html=localizeHTML(source,'en','/personalWebSite/');
  assert.match(html,/October 16, 2026/);
  assert.match(html,/12 projects \/ An evolving archive/);
  assert.match(html,/data-count-plural="projects"/);
});
