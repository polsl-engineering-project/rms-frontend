import type { CartItem } from './menu';

export interface BillItem {
  menuItemId?: string;
  name?: string;
  quantity?: number;
  version?: number;
}

export interface MenuSelectionProps {
  onConfirm: (cart: CartItem[]) => void;
  isSubmitting: boolean;
  confirmLabel?: string;
  initialItems?: CartItem[];
}
