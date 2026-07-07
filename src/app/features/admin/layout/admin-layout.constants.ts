export interface IAdminNavItem {
  label: string;
  icon: string;
  path: string;
}

export interface IAdminNavGroup {
  groupLabel: string;
  items: IAdminNavItem[];
}

export const ADMIN_NAV: IAdminNavGroup[] = [
  {
    groupLabel: 'Основное',
    items: [
      { label: 'Дашборд', icon: '/assets/svgs/grid.svg', path: '/admin/dashboard' },
      { label: 'Товары', icon: '/assets/svgs/box.svg', path: '/admin/products' },
      { label: 'Заказы', icon: '/assets/svgs/orders.svg', path: '/admin/orders' },
      { label: 'Пользователи', icon: '/assets/svgs/user-white.svg', path: '/admin/users' },
    ],
  },
];
