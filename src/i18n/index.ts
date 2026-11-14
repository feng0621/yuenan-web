import { en } from './en';
import type { Article, Locale, SiteContent } from './types';
import { locales } from './types';
import { vi } from './vi';

export type { Article, BenefitItem, CharityItem, Locale, NewsItem, Section, SiteContent } from './types';
export { locales };

const copies: Record<Locale, SiteContent> = { en, vi };

const htmlLang: Record<Locale, string> = { en: 'en', vi: 'vi' };
export const localeNames: Record<Locale, string> = { en: 'English', vi: 'Tiếng Việt' };

function sameOrder(label: string, lists: { slug?: string; photo?: string }[][]) {
  const base = lists[0].map((item) => item.slug ?? item.photo).join('|');
  lists.slice(1).forEach((list) => {
    const got = list.map((item) => item.slug ?? item.photo).join('|');
    if (got !== base) throw new Error(`${label} items must use the same order in every locale`);
  });
}

sameOrder('Charity', [vi.charity, en.charity]);
sameOrder('News', [vi.news, en.news]);
sameOrder('Benefits', [vi.benefits, en.benefits]);
sameOrder('Team', [vi.team, en.team]);

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function getSite(locale: Locale) {
  return copies[locale];
}

export function languageTag(locale: Locale) {
  return htmlLang[locale];
}

export function localizeHref(locale: Locale, href: string) {
  const path = href.startsWith('/') ? href : `/${href}`;
  const normalized = path === '/' ? '/' : path.endsWith('/') ? path : `${path}/`;
  if (locale === 'vi') return normalized;
  return normalized === '/' ? `/${locale}/` : `/${locale}${normalized}`;
}

export function switchLocalePath(pathname: string, target: Locale) {
  let path = pathname.split('?')[0].split('#')[0];
  if (!path.startsWith('/')) path = `/${path}`;
  path = path.replace(/^\/(en|vi)(?=\/|$)/, '');
  if (!path) path = '/';
  if (path !== '/' && !path.endsWith('/')) path += '/';
  return localizeHref(target, path);
}

export function foreignPaths() {
  return [{ params: { lang: 'en' }, props: { locale: 'en' as const } }];
}

type CollectionKey = 'charity' | 'news' | 'benefits';

export function collectionPaths(locale: Locale, key: CollectionKey) {
  const items = getSite(locale)[key];
  return items.map((item, i) => ({
    params: { slug: item.slug },
    props: {
      locale,
      item: item as Article,
      prev: items[(i - 1 + items.length) % items.length] as Article,
      next: items[(i + 1) % items.length] as Article,
    },
  }));
}

export function prefixedCollectionPaths(key: CollectionKey) {
  return (['en'] as const).flatMap((locale) =>
    collectionPaths(locale, key).map(({ params, props }) => ({
      params: { lang: locale, slug: params.slug },
      props,
    })),
  );
}
