export interface IFooterLink {
  label: string;
  path: string;
}

export interface IFooterColumn {
  title: string;
  links: IFooterLink[];
}

export const FOOTER_NAVIGATION: IFooterColumn[] = [
  {
    title: 'БРЕНД',
    links: [
      { label: 'О нас', path: '/about' },
      { label: 'История', path: '/about/history' },
      { label: 'Карьера', path: '/careers' },
    ],
  },
  {
    title: 'МАГАЗИН',
    links: [
      { label: 'Новинки', path: '/new-arrivals' },
      { label: 'Мужские', path: '/mens' },
      { label: 'Женские', path: '/womens' },
      { label: 'Распродажа', path: '/sale' },
    ],
  },
  {
    title: 'ПОДДЕРЖКА',
    links: [
      { label: 'Доставка', path: '/support/delivery' },
      { label: 'Возвраты', path: '/support/returns' },
      { label: 'Таблица размеров', path: '/support/size-guide' },
      { label: 'FAQ', path: '/support/faq' },
      { label: 'Контакты', path: '/contacts' },
    ],
  },
  {
    title: 'ИНФО',
    links: [
      { label: 'Конфиденциальность', path: '/legal/privacy-policy' },
      { label: 'Условия', path: '/legal/terms-of-service' },
      { label: 'Cookies', path: '/legal/cookies' },
    ],
  },
];
