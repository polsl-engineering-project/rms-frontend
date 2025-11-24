export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface MenuItem {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
}

export interface Category {
  id?: string;
  name?: string;
}
