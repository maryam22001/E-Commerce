export interface IProduct {
  _id?: string;
  id?: string;
  name: string;
  discription: string;
  description?: string;
  price: number;
  category: 'electronics' | 'clothing' | 'books' | 'home' | 'beauty' | 'sports' | 'toys';
  image: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IProductsResponse {
  success: boolean;
  results: number;
  count: number;
  limit: number;
  page: number;
  data: IProduct[];
}

export interface IProductResponse {
  success: boolean;
  data: IProduct;
}
