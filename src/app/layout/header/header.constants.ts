export interface INavLink {
  label: string;
  path: string;
}

export interface INavIcon {
  id: 'search' | 'cart' | 'favorites' | 'profile';
  icon: string;
  path: string;
  label: string;
}

export const NAV_LINKS: INavLink[] = [
  { label: 'Мужское', path: '/catalog/mens' },
  { label: 'Женское', path: '/catalog/womens' },
  { label: 'Новинки', path: '/new-arrivals' },
  { label: 'Распродажа', path: '/sale' },
];

export const NAV_ICONS: INavIcon[] = [
  {
    id: 'cart',
    icon: '/assets/svgs/basket.svg',
    path: '/cart',
    label: 'Корзина',
  },
  {
    id: 'favorites',
    icon: '/assets/svgs/like.svg',
    path: '/favorites',
    label: 'Избранное',
  },
  {
    id: 'profile',
    icon: '/assets/svgs/user-login.svg',
    path: '/profile',
    label: 'Личный кабинет',
  },
];
