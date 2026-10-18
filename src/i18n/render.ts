import { parse, serialize, type DefaultTreeAdapterTypes } from 'parse5';
import { ui } from './ui.ts';
import { profileTranslations } from './profile.ts';
import { projectTranslations } from './projects.ts';
import { editorialTranslations } from './editorial.ts';
import { languageHref, localeInfo, normalizeText, routeContext, translatedText, type Locale } from './locales.ts';

type Node = DefaultTreeAdapterTypes.Node;
type Element = DefaultTreeAdapterTypes.Element;
const catalog = { ...ui, ...profileTranslations, ...projectTranslations, ...editorialTranslations };
export const translate = (source: string, locale: Locale) => translatedText(source, locale, catalog);
const attr = (node: Element, name: string) => node.attrs.find(item => item.name === name)?.value;
const setAttr = (node: Element, name: string, value: string) => {
  const existing = node.attrs.find(item => item.name === name);
  if (existing) existing.value = value; else node.attrs.push({name,value});
};

/** Localización de HTML en compilación. No se envían catálogos ni motores de traducción al navegador. */
export function localizeHTML(html: string, locale: Locale, base: string): string {
  if (locale === 'es') return html;
  const targetLocale = locale;
  const tree = parse(html);
  const info = localeInfo(locale);
  const text = (source: string): string => {
    const normalized = normalizeText(source);
    if (!normalized) return source;
    let translated = translate(normalized, locale);
    if (translated === normalized) {
      // Interpolaciones conocidas: no se traducen URLs, IDs, nombres propios o código.
      translated = normalized.split(' · ').map(part => translate(part, locale)).join(' · ');
      const titleBreak = normalized.lastIndexOf(' · ');
      if (titleBreak > 0 && translate(normalized.slice(0,titleBreak),locale) !== normalized.slice(0,titleBreak)) translated = `${translate(normalized.slice(0,titleBreak),locale)}${normalized.slice(titleBreak)}`;
      if (normalized.startsWith('Tecnologías de ')) translated = `${translate('Hecho con',locale)}: ${normalized.slice(15)}`;
      if (/^Órbita \d{2} \/ /.test(normalized)) translated = normalized.replace(/^Órbita/, {en:'Orbit',zh:'轨道',hi:'कक्षा',ar:'مدار',fr:'Orbite'}[targetLocale]).replace(/\/ (.+)$/, (_,state:string) => `/ ${translate(state,locale)}`);
      translated = translated.replace('Código, juegos y textos.', translate('Código, juegos y textos.',locale));
      const homeDescription = normalized.match(/^(.+\.) Código, juegos y textos de (.+)\.$/);
      if (homeDescription) {
        const [,summary,name] = homeDescription;
        const ending = { en:`Code, games and writing by ${name}.`, zh:`${name} 的代码、游戏与文字。`, hi:`${name} के कोड, खेल और लेख।`, ar:`برمجة وألعاب وكتابات ${name}.`, fr:`Du code, des jeux et des textes de ${name}.` }[targetLocale];
        translated = `${translate(summary,locale)} ${ending}`;
      }
      if (/^\d+ min de lectura aprox\.$/.test(normalized)) translated = normalized.replace('min de lectura aprox.',{en:'min read approx.',zh:'分钟左右阅读时间',hi:'मिनट पढ़ने का अनुमान',ar:'دقائق قراءة تقريبًا',fr:'min de lecture env.'}[targetLocale]);
    }
    return source.replace(source.trim(),translated);
  };
  function walk(node: Node, noTranslate = false): void {
    if (node.nodeName === '#text') {
      if (!noTranslate) (node as DefaultTreeAdapterTypes.TextNode).value = text((node as DefaultTreeAdapterTypes.TextNode).value);
      return;
    }
    if (!('tagName' in node)) { for (const child of 'childNodes' in node ? node.childNodes : []) walk(child,noTranslate); return; }
    const element = node as Element;
    if (element.tagName === 'html') { setAttr(element,'lang',info.tag); setAttr(element,'dir',info.direction); }
    const skip = noTranslate || attr(element,'data-no-translate') !== undefined || attr(element,'translate') === 'no' || ['script','style','code','pre'].includes(element.tagName);
    for (const attribute of element.attrs) {
      if (attribute.name === 'href' && attribute.value.startsWith(base) && !skip && element.tagName === 'a') {
        const {path} = routeContext(attribute.value,base);
        if (!/^(?:_astro|images|icons)\//.test(path) && !path.endsWith('.md')) attribute.value = languageHref(path,locale,base);
      }
      if (!skip && ['aria-label','placeholder','alt','title','data-search'].includes(attribute.name)) attribute.value = text(attribute.value);
      if (element.tagName === 'meta' && ['description','og:title','og:description','article:tag'].includes(attr(element,'name') ?? attr(element,'property') ?? '') && attribute.name === 'content') attribute.value = text(attribute.value);
    }
    if (element.tagName === 'time' && attr(element,'datetime')) {
      const date = new Date(`${attr(element,'datetime')!.slice(0,10)}T12:00:00Z`);
      if (!Number.isNaN(date.valueOf())) {
        const child = element.childNodes.find(node => node.nodeName === '#text') as DefaultTreeAdapterTypes.TextNode | undefined;
        if (child) child.value = new Intl.DateTimeFormat(info.tag,{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(date);
        return;
      }
    }
    // El contador se actualiza sin importar un catálogo completo en JavaScript.
    if (attr(element,'data-project-count') !== undefined) {
      const labels = {
        en:['project','projects',' / An evolving archive',' of '], zh:['个项目','个项目',' / 不断发展的档案',' / '],
        hi:['परियोजना','परियोजनाएँ',' / बदलता हुआ संग्रह',' / '], ar:['مشروع','مشاريع',' / أرشيف يتطور',' من '], fr:['projet','projets',' / Des archives vivantes',' sur '],
      }[targetLocale];
      ['singular','plural','suffix','of'].forEach((key,index) => setAttr(element,`data-count-${key}`,labels[index]));
      const child = element.childNodes.find(node => node.nodeName === '#text') as DefaultTreeAdapterTypes.TextNode | undefined;
      if (child) child.value = `${child.value.match(/^\d+/)?.[0] ?? '0'} ${labels[1]}${labels[2]}`;
      return;
    }
    for (const child of element.childNodes) walk(child,skip);
    if ('content' in element) walk((element as DefaultTreeAdapterTypes.Template).content,skip);
    if (!skip && attr(element,'data-project-item') !== undefined) {
      const getText = (node: Node):string => node.nodeName === '#text' ? (node as DefaultTreeAdapterTypes.TextNode).value : 'childNodes' in node ? node.childNodes.map(getText).join(' ') : '';
      setAttr(element,'data-search',`${attr(element,'data-search') ?? ''} ${getText(element)}`);
    }
  }
  walk(tree);
  return serialize(tree);
}
