 
 export interface IFilterSection {
  id: string;
  label: string;
  type: 'chips' | 'sizes' | 'price' | 'select' | 'rating' | 'badge';
  options?: IFilterOption[];
  selectOptions?: string[];
}

export interface IFilterOption {
  label: string;
  value: string;
  badge?: 'new' | 'sale' | null;
  active?: boolean;
}
 
export const FILTER_SECTIONS: IFilterSection[] = [
    {
      id: 'sort',
      label: 'Сортировка',
      type: 'select',
      selectOptions: [
        'Сначала новые',
        'Сначала дешёвые',
        'Сначала дорогие',
        'По рейтингу',
        'По скидке',
      ],
    },
    {
      id: 'gender',
      label: 'Пол',
      type: 'chips',
      options: [
        { label: 'Все', value: 'all', active: true },
        { label: 'Мужской', value: 'Мужской' },
        { label: 'Женский', value: 'Женский' },
        { label: 'Унисекс', value: 'Унисекс' },
      ],
    },
    {
      id: 'sizes',
      label: 'Размер (RU)',
      type: 'sizes',
      options: [
        { label: '36', value: '36' },
        { label: '37', value: '37' },
        { label: '38', value: '38' },
        { label: '39', value: '39' },
        { label: '40', value: '40' },
        { label: '41', value: '41' },
        { label: '42', value: '42' },
        { label: '43', value: '43' },
        { label: '44', value: '44' },
        { label: '45', value: '45' },
      ],
    },
    {
      id: 'price',
      label: 'Цена, ₽',
      type: 'price',
    },
    {
      id: 'badge',
      label: 'Метка',
      type: 'badge',
      options: [
        { label: 'Все', value: 'all', active: true },
        { label: 'Новинки', value: 'new', badge: 'new' },
        { label: 'Распродажа', value: 'sale', badge: 'sale' },
      ],
    },
    {
      id: 'rating',
      label: 'Рейтинг',
      type: 'rating',
      options: [
        { label: '5 звёзд', value: '5' },
        { label: '4 и выше', value: '4' },
        { label: '3 и выше', value: '3' },
      ],
    },
];