export interface Product {
  _id: string;
  name: string;
  discription: string;
  image: string;
  category: 'electronics' | 'clothing' | 'books' | 'home' | 'beauty' | 'sports' | 'toys';
  price: number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  'price[gte]'?: number;
  'price[lte]'?: number;
}
