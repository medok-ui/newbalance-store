export interface IMenuItem {
  title: string;
  routerLink: string;
}

export const MENU_ITEMS: IMenuItem[] = [
  {
    title: 'Мой профиль',
    routerLink: 'user-profile',
  },
  {
    title: 'Настройки профиля',
    routerLink: 'setting',
  },
  {
    title: 'История заказов',
    routerLink: 'history',
  },
];
