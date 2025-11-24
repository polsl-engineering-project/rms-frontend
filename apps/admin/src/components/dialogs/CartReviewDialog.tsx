import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Plus,
  Minus,
  Trash2,
} from '@repo/ui';
import type { CartItem } from '../../types';

interface CartReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onAddQuantity: (itemId: string) => void;
  onRemoveQuantity: (itemId: string) => void;
  totalAmount: number;
}

export function CartReviewDialog({
  isOpen,
  onClose,
  cart,
  onAddQuantity,
  onRemoveQuantity,
  totalAmount,
}: CartReviewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Review Cart</DialogTitle>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-center text-slate-500 py-8">Your cart is empty</p>
          ) : (
            <ul className="divide-y">
              {cart.map((item) => (
                <li key={item.id} className="py-3 flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-slate-500">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onRemoveQuantity(item.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-medium w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onAddQuantity(item.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => {
                        // Remove all quantity
                        for (let i = 0; i < item.quantity; i++) {
                          onRemoveQuantity(item.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <DialogFooter>
          <div className="flex justify-between items-center w-full">
            <div>
              <p className="text-sm text-slate-500">Total</p>
              <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
            </div>
            <Button onClick={onClose}>Done</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
