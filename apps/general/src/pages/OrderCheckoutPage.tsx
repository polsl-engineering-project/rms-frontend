import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsList,
  TabsTrigger,
  Label,
  RadioGroup,
  RadioGroupItem,
  Input,
  ShoppingCart,
  ArrowLeft,
  Calendar,
} from '@repo/ui';
import { useCartStore } from '../stores/cart';
import { OrderSummary } from '../components/OrderSummary';
import {
  CustomerInfoForm,
  CustomerInfoFormValues,
  CustomerInfoFormHandle,
} from '../components/forms/CustomerInfoForm';
import { AddressForm, AddressFormValues, AddressFormHandle } from '../components/forms/AddressForm';
import { ORDER_TYPES, DELIVERY_MODES } from '../constants/order';
import { fetchClient } from '../api/client';
import type { OrderType, DeliveryMode } from '../constants/order';

export function OrderCheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const getCartForOrder = useCartStore((state) => state.getCartForOrder);
  const clearCart = useCartStore((state) => state.clearCart);

  const [orderType, setOrderType] = useState<OrderType>(ORDER_TYPES.PICKUP);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>(DELIVERY_MODES.ASAP);
  const [scheduledTime, setScheduledTime] = useState('');

  const customerFormRef = useRef<CustomerInfoFormHandle>(null);
  const addressFormRef = useRef<AddressFormHandle>(null);

  const placeOrderMutation = useMutation({
    mutationFn: async ({
      customerInfo,
      address,
    }: {
      customerInfo: CustomerInfoFormValues;
      address?: AddressFormValues;
    }) => {
      const orderLines = getCartForOrder();

      if (orderType === ORDER_TYPES.PICKUP) {
        const response = await fetchClient.POST('/api/v1/orders/place-pick-up-order', {
          body: {
            customerInfo: {
              firstName: customerInfo.firstName,
              lastName: customerInfo.lastName,
              phoneNumber: customerInfo.phoneNumber,
            },
            deliveryMode,
            orderLines,
          },
        });

        if (response.error) {
          throw new Error(response.error.message || 'Failed to place order');
        }

        return response.data;
      } else {
        if (!address) {
          throw new Error('Address is required for delivery orders');
        }

        const response = await fetchClient.POST('/api/v1/orders/place-delivery-order', {
          body: {
            customerInfo: {
              firstName: customerInfo.firstName,
              lastName: customerInfo.lastName,
              phoneNumber: customerInfo.phoneNumber,
            },
            deliveryMode,
            orderLines,
            address: {
              street: address.street,
              houseNumber: address.houseNumber,
              apartmentNumber: address.apartmentNumber,
              city: address.city,
              postalCode: address.postalCode,
              apartment: address.apartment,
            },
          },
        });

        if (response.error) {
          throw new Error(response.error.message || 'Failed to place order');
        }

        return response.data;
      }
    },
    onSuccess: (data) => {
      if (data?.id) {
        clearCart();
        navigate(`/order/${data.id}`);
      }
    },
  });

  const [customerInfo, setCustomerInfo] = useState<CustomerInfoFormValues | null>(null);
  const [address, setAddress] = useState<AddressFormValues | null>(null);

  const handlePlaceOrder = async () => {
    // Trigger form validation and submission
    if (customerFormRef.current) {
      await customerFormRef.current.submitForm();
    }

    if (orderType === ORDER_TYPES.DELIVERY && addressFormRef.current) {
      await addressFormRef.current.submitForm();
    }

    // Check if we have the required data
    if (!customerInfo) return;
    if (orderType === ORDER_TYPES.DELIVERY && !address) return;

    placeOrderMutation.mutate({ customerInfo, address: address || undefined });
  };

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
            {/* Order Type Selection */}
            <Card className="border-amber-100 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Order Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={orderType} onValueChange={(value) => setOrderType(value as OrderType)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value={ORDER_TYPES.PICKUP}>Pick-up</TabsTrigger>
                    <TabsTrigger value={ORDER_TYPES.DELIVERY}>Delivery</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            {/* Delivery Mode Selection */}
            <Card className="border-amber-100 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>When do you want your order?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={deliveryMode}
                  onValueChange={(value) => setDeliveryMode(value as DeliveryMode)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={DELIVERY_MODES.ASAP} id="asap" />
                    <Label htmlFor="asap" className="cursor-pointer">
                      As soon as possible
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={DELIVERY_MODES.SCHEDULED} id="scheduled" />
                    <Label htmlFor="scheduled" className="cursor-pointer">
                      Schedule for later
                    </Label>
                  </div>
                </RadioGroup>

                {deliveryMode === DELIVERY_MODES.SCHEDULED && (
                  <div className="mt-4">
                    <Label htmlFor="scheduledTime">Scheduled Time</Label>
                    <div className="relative">
                      <Input
                        id="scheduledTime"
                        type="datetime-local"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="pl-10"
                      />
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="border-amber-100 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomerInfoForm
                  ref={customerFormRef}
                  onSubmit={(values) => setCustomerInfo(values)}
                  initialValues={customerInfo || undefined}
                />
              </CardContent>
            </Card>

            {/* Delivery Address (only for delivery orders) */}
            {orderType === ORDER_TYPES.DELIVERY && (
              <Card className="border-amber-100 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Delivery Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <AddressForm
                    ref={addressFormRef}
                    onSubmit={(values) => setAddress(values)}
                    initialValues={address || undefined}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              <OrderSummary />

              <Button
                onClick={handlePlaceOrder}
                disabled={placeOrderMutation.isPending}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-6 text-lg font-semibold"
              >
                {placeOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
              </Button>

              {placeOrderMutation.isError && (
                <p className="text-sm text-red-600 text-center">
                  {placeOrderMutation.error?.message || 'Failed to place order'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
