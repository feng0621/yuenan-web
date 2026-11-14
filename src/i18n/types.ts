export const locales = ['vi', 'en'] as const;
export type Locale = (typeof locales)[number];

export interface LinkItem {
  label: string;
  href: string;
}

export interface Section {
  heading: string;
  paragraphs?: string[];
  listTitle?: string;
  list?: string[];
  images?: string[];
  caption?: string;
}

export interface Article {
  slug: string;
  title: string;
  displayTitle?: string;
  summary: string;
  image: string;
  category: string;
  lead: string;
  meta: string;
  sections: Section[];
}

export interface CharityItem extends Article {
  tag: string;
  homeTitle: string;
  homeText: string;
}

export interface NewsItem extends Article {
  day: string;
  month: string;
}

export interface BenefitItem extends Article {
  icon: string;
  homeText: string;
  no: string;
}

export interface Ui {
  skip: string;
  defaultTitle: string;
  defaultDescription: string;
  homeAria: string;
  navLabel: string;
  mobileNavLabel: string;
  langLabel: string;
  menuOpen: string;
  menuClose: string;
  officeHours: string;
  emailLabel: string;
  footerNavLabel: string;
  backToTop: string;
  prevSlide: string;
  nextSlide: string;
  scrollDown: string;
  more: string;
  readMore: string;
  learnMore: string;
  allUpdates: string;
  allMembers: string;
  valuesAria: string;
  prevStage: string;
  nextStage: string;
  timelinePending: string;
  back: string;
  prevItem: string;
  nextItem: string;
  prevItemAria: string;
  nextItemAria: string;
  pagerLabel: string;
  filterLabel: string;
  paginationLabel: string;
  nextPage: string;
  pageLabel: string;
  memberBenefit: string;
}

export interface HomePage {
  heroTitle: string;
  heroSubtitle: string;
  heroSubtitleLang: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutHeading: string;
  aboutBody: string[];
  valuesTitle: string;
  chamberTitle: string;
  chamberLines: string[];
  charityTitle: string;
  charitySubtitle: string;
  newsEyebrow: string;
  newsTitle: string;
  teamEyebrow: string;
  teamTitle: string;
  benefitsEyebrow: string;
  benefitsTitle: string;
}

export interface AboutPage {
  title: string;
  subtitle: string;
  eyebrow: string;
  titleLines: string[];
  leadLines: string[];
  pillars: { title: string; text: string }[];
  rankingAlt: string;
  valuesEyebrow: string;
  valuesTitleLines: string[];
  missionEyebrow: string;
  missionTitleLines: string[];
  missionText: string;
  missionCta: string;
  missionAlt: string;
}

export interface TeamPage {
  title: string;
  subtitle: string;
  eyebrow: string;
  titleLines: string[];
  ideaEyebrow: string;
  ideaTitleLines: string[];
  ideaText: string;
}

export interface ListPage {
  title: string;
  subtitle: string;
  all: string;
  options: string[];
}

export interface SiteContent {
  ui: Ui;
  nav: LinkItem[];
  footerColumns: { title: string; links: LinkItem[] }[];
  company: { name: string; intro: string; hours: string; email: string; copyright: string };
  coreValues: { title: string; text: string }[];
  timeline: { period: string; circle: [string, string]; name: string; subtitle: string; body: string[] }[];
  charity: CharityItem[];
  news: NewsItem[];
  benefits: BenefitItem[];
  team: { name: string; role: string; photo: string }[];
  aboutFacts: { big: string; title: string; text: string }[];
  pages: { home: HomePage; about: AboutPage; team: TeamPage; charity: ListPage; news: ListPage; benefits: ListPage };
}
