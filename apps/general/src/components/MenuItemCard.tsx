import type { components } from '@repo/api-client';
import { Badge, Button, Card, CardContent } from '@repo/ui';
import { SPICE_LEVEL_LABELS, SPICE_LEVEL_COLORS, DIETARY_BADGES } from '../constants/menu';
import { useCartStore } from '../stores/cart';

type MenuItemResponse = components['schemas']['MenuItemResponse'];

interface MenuItemCardProps {
  item: MenuItemResponse;
  onClick: () => void;
}

export function MenuItemCard({ item, onClick }: MenuItemCardProps) {
  const getItemQuantity = useCartStore((state) => state.getItemQuantity);
  const quantity = item.id ? getItemQuantity(item.id) : 0;

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
            <Badge variant="secondary" className={`text-xs ${SPICE_LEVEL_COLORS[item.spiceLevel]}`}>
              {SPICE_LEVEL_LABELS[item.spiceLevel]}
            </Badge>
          )}
          {DIETARY_BADGES.map(
            (badge) =>
              item[badge.key] && (
                <Badge key={badge.key} variant="secondary" className={`text-xs ${badge.color}`}>
                  {badge.icon} {badge.label}
                </Badge>
              )
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            size="sm"
          >
            Add to Order
          </Button>
          {quantity > 0 && (
            <Badge variant="default" className="px-2 py-1 bg-amber-600">
              {quantity} in cart
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
