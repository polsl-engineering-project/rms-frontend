import { Card, CardContent, Badge, Button, ShoppingCart, Trash2, Plus, Minus } from '@repo/ui';
import { useCartStore } from '../stores/cart';
import { EmptyState } from './EmptyState';

export function OrderSummary() {
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  if (items.length === 0) {
    return (
      <Card className="border-amber-100 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            description="Add items from the menu to place an order"
          />
        </CardContent>
      </Card>
    );
  }

  const totalPrice = getTotalPrice();

  return (
    <Card className="border-amber-100 bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Order Summary</h2>

        <div className="space-y-3 mb-4">
          {items.map((item) => (
            <div
              key={`${item.itemId}-${item.version}`}
              className="flex justify-between items-start gap-4 p-3 rounded-lg border border-gray-100 hover:border-amber-200 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.itemId, item.version, item.quantity - 1)}
                    className="h-7 w-7 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.itemId, item.version, item.quantity + 1)}
                    className="h-7 w-7 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.itemId, item.version)}
                    className="h-7 w-7 p-0 ml-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-amber-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
          <Badge className="mt-2 bg-amber-100 text-amber-900 border-amber-200 hover:bg-amber-100 hover:text-amber-900 cursor-default">
            {items.reduce((total, item) => total + item.quantity, 0)} items
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
