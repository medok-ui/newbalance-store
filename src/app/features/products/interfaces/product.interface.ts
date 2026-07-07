export interface IProductDescription {
  intro: string;
  features: string;
  technologies: string;
  about: string;
}

export interface IProductSpecs {
  upper: string;
  sole: string;
  midsole: string;
  weight: string;
  closure: string;
  height: string;
  country: string;
  color: string;
  size_range: string;
  warranty: string;
}

export interface ICategory {
  name: string;
  slug: string;
}

export interface IProduct {
  id: number;
  name: string;
  brand: string;
  category_id: number;
  categories?: ICategory;
  gender: string;
  badge: 'new' | 'sale' | null;
  price: number;
  old_price: number | null;
  discount: number | null;
  description: IProductDescription;
  specs: IProductSpecs;
  sizes: number[];
  images: string[];
  rating: number;
  reviews_count: number;
  in_stock: boolean;
  created_at: string;
}
