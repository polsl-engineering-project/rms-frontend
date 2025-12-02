import { useState, useEffect } from 'react';
import type { components } from '@repo/api-client';
import { Dialog, DialogContent, Button, Badge, Minus, Plus } from '@repo/ui';
import { useCartStore } from '../stores/cart';
import { SPICE_LEVEL_LABELS, SPICE_LEVEL_COLORS, DIETARY_BADGES } from '../constants/menu';

type MenuItemResponse = components['schemas']['MenuItemResponse'];

interface ItemDetailDialogProps {
  item: MenuItemResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ItemDetailDialog({ item, open, onOpenChange }: ItemDetailDialogProps) {
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const [quantity, setQuantity] = useState(1);
  const cartQuantity = useCartStore((state) =>
    item?.id && item?.version !== undefined
      ? (state.items.find((i) => i.itemId === item.id && i.version === item.version)?.quantity ?? 0)
      : 0
  );

  useEffect(() => {
    if (item && open) {
      setQuantity(Math.max(1, cartQuantity));
    }
  }, [item, open, cartQuantity]);

  if (!item) return null;

  const handleAddOrUpdate = () => {
    if (!item.id || item.version === undefined) return;

    if (cartQuantity > 0) {
      updateQuantity(item.id, item.version, quantity);
    } else {
      addItem(
        {
          itemId: item.id,
          name: item.name || '',
          price: item.price || 0,
          version: item.version,
        },
        quantity
      );
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="h-64 bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 -mx-6 -mt-6 mb-4" />

        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
            <p className="text-3xl font-bold text-amber-800">${item.price?.toFixed(2)}</p>
          </div>

          <p className="text-gray-700">{item.description}</p>

          <div className="flex flex-wrap gap-2">
            {item.spiceLevel && item.spiceLevel !== 'NONE' && (
              <Badge className={`cursor-default ${SPICE_LEVEL_COLORS[item.spiceLevel]}`}>
                {SPICE_LEVEL_LABELS[item.spiceLevel]}
              </Badge>
            )}
            {DIETARY_BADGES.map(
              (badge) =>
                item[badge.key] && (
                  <Badge key={badge.key} className={`cursor-default ${badge.color}`}>
                    {badge.icon} {badge.label}
                  </Badge>
                )
            )}
          </div>

          {(item.calories || item.allergens) && (
            <div className="border-t pt-4 space-y-2">
              {item.calories && (
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Calories:</span> {item.calories}
                </p>
              )}
              {item.allergens && (
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Allergens:</span> {item.allergens}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <span className="font-semibold">Quantity</span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-bold w-12 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {cartQuantity > 0 && (
            <p className="text-sm text-gray-600">Currently {cartQuantity} in cart</p>
          )}

          <Button
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            size="lg"
            onClick={handleAddOrUpdate}
          >
            {cartQuantity > 0 ? 'Update Quantity' : 'Add to Order'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
