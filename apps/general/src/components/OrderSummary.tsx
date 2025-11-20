import { Card, CardContent, Badge } from '@repo/ui';
import { useCartStore } from '../stores/cart';
import { ShoppingCart } from '@repo/ui';
import { EmptyState } from './EmptyState';

export function OrderSummary() {
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

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
            <div key={item.itemId} className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
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
          <Badge className="mt-2 bg-amber-100 text-amber-900 border-amber-200">
            {items.reduce((total, item) => total + item.quantity, 0)} items
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
