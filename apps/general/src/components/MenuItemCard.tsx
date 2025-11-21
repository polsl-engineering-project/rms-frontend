import type { components } from '@repo/api-client';
import { Badge, Button, Card, CardContent, Plus, Minus, Trash2 } from '@repo/ui';
import { SPICE_LEVEL_LABELS, SPICE_LEVEL_COLORS, DIETARY_BADGES } from '../constants/menu';
import { useCartStore } from '../stores/cart';

type MenuItemResponse = components['schemas']['MenuItemResponse'];

interface MenuItemCardProps {
  item: MenuItemResponse;
  onClick: () => void;
}

export function MenuItemCard({ item, onClick }: MenuItemCardProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const quantity = useCartStore((state) =>
    item.id && item.version !== undefined
      ? (state.items.find((i) => i.itemId === item.id && i.version === item.version)?.quantity ?? 0)
      : 0
  );

  return (
    <Card
      className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-amber-100 bg-white/90 backdrop-blur-sm"
      onClick={onClick}
    >
      <div className="h-48 bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400" />

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
          <span className="font-bold text-lg text-primary whitespace-nowrap ml-2">
            ${item.price?.toFixed(2)}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {item.spiceLevel && item.spiceLevel !== 'NONE' && (
            <Badge className={`cursor-default text-xs ${SPICE_LEVEL_COLORS[item.spiceLevel]}`}>
              {SPICE_LEVEL_LABELS[item.spiceLevel]}
            </Badge>
          )}
          {DIETARY_BADGES.map(
            (badge) =>
              item[badge.key] && (
                <Badge key={badge.key} className={`cursor-default text-xs ${badge.color}`}>
                  {badge.icon} {badge.label}
                </Badge>
              )
          )}
        </div>

        <div className="flex items-center gap-2">
          {quantity > 0 ? (
            <>
              <div className="flex items-center gap-1 flex-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.id && item.version !== undefined) {
                      updateQuantity(item.id, item.version, quantity - 1);
                    }
                  }}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm font-semibold w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.id && item.version !== undefined) {
                      updateQuantity(item.id, item.version, quantity + 1);
                    }
                  }}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.id && item.version !== undefined) {
                    removeItem(item.id, item.version);
                  }
                }}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
              <Badge className="cursor-default px-2 py-1 bg-amber-600 text-white hover:bg-amber-600 hover:text-white">
                in cart
              </Badge>
            </>
          ) : (
            <Button
              className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              size="sm"
            >
              Add to Order
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
