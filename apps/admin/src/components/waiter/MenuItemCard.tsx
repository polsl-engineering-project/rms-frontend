import { Card, CardContent, Button, Plus, Minus } from '@repo/ui';
import type { MenuItem, CartItem } from '../../types';

interface MenuItemCardProps {
  item: MenuItem;
  cartItem?: CartItem;
  onAdd: (item: MenuItem) => void;
  onRemove: (itemId: string) => void;
}

export function MenuItemCard({ item, cartItem, onAdd, onRemove }: MenuItemCardProps) {
  return (
    <Card
      className={`overflow-hidden cursor-pointer transition-all ${
        cartItem ? 'ring-2 ring-inset ring-primary' : ''
      }`}
      onClick={() => !cartItem && onAdd(item)}
    >
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-1">{item.name}</h3>
        {item.description && (
          <p className="text-sm text-slate-500 mb-2 line-clamp-2">{item.description}</p>
        )}
        <div className="flex justify-between items-center mt-3">
          <span className="text-lg font-bold">${item.price?.toFixed(2)}</span>
          {cartItem && (
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item.id!);
                }}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-medium w-8 text-center">{cartItem.quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd(item);
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
