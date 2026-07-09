import { IProduct } from "../../features/products/interfaces/product.interface";

export interface ICartDisplayItem {
  cartItemId: number; 
  product: IProduct;
}
