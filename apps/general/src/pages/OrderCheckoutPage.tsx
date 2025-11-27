import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, ShoppingCart, ArrowLeft } from '@repo/ui';
import { useCartStore } from '../stores/cart';
import { OrderSummary } from '../components/OrderSummary';
import { OrderTypeSelector } from '../components/OrderTypeSelector';
import { OrderCheckoutForm, OrderCheckoutFormHandle } from '../components/forms/OrderCheckoutForm';
import { ORDER_TYPES, DELIVERY_MODES } from '../constants/order';
import type { OrderType, DeliveryMode } from '../constants/order';

export function OrderCheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const formRef = useRef<OrderCheckoutFormHandle>(null);

  const [orderType, setOrderType] = useState<OrderType>(ORDER_TYPES.PICKUP);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>(DELIVERY_MODES.ASAP);
  const [scheduledTime, setScheduledTime] = useState('');

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full border-amber-100">
          <CardContent className="p-8 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-amber-600" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add items from the menu to place an order</p>
            <Button onClick={() => navigate('/menu')} className="bg-amber-600 hover:bg-amber-700">
              Browse Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4">
      <div className="max-w-5xl mx-auto py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/menu')}
          className="mb-6 text-amber-700 hover:text-amber-800 hover:bg-amber-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Button>

        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <OrderTypeSelector
              orderType={orderType}
              deliveryMode={deliveryMode}
              scheduledTime={scheduledTime}
              onOrderTypeChange={setOrderType}
              onDeliveryModeChange={setDeliveryMode}
              onScheduledTimeChange={setScheduledTime}
            />

            <OrderCheckoutForm
              ref={formRef}
              orderType={orderType}
              deliveryMode={deliveryMode}
              scheduledTime={scheduledTime}
            />
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              <OrderSummary />

              <Button
                onClick={() => formRef.current?.submit()}
                disabled={formRef.current?.isPending}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-6 text-lg font-semibold"
              >
                {formRef.current?.isPending ? 'Placing Order...' : 'Place Order'}
              </Button>

              {formRef.current?.isError && (
                <p className="text-sm text-red-600 text-center">{formRef.current?.errorMessage}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
