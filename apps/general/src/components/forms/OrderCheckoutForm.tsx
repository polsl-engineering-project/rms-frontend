import { useFormik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { forwardRef, useImperativeHandle } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { useCartStore } from '../../stores/cart';
import { fetchClient } from '../../api/client';
import { createOrderCheckoutSchema } from './OrderCheckoutForm.validation';
import { CustomerInfoFormFields } from './CustomerInfoFormFields';
import { AddressFormFields } from './AddressFormFields';
import { ORDER_TYPES } from '../../constants/order';
import type { OrderType, DeliveryMode } from '../../constants/order';
import type { CheckoutFormValues } from './CustomerInfoFormFields';

interface OrderCheckoutFormProps {
  orderType: OrderType;
  deliveryMode: DeliveryMode;
  scheduledTime?: string;
}

export interface OrderCheckoutFormHandle {
  submit: () => void;
  isPending: boolean;
  isError: boolean;
  errorMessage?: string;
}

export const OrderCheckoutForm = forwardRef<OrderCheckoutFormHandle, OrderCheckoutFormProps>(
  ({ orderType, deliveryMode, scheduledTime }, ref) => {
    const navigate = useNavigate();
    const getCartForOrder = useCartStore((state) => state.getCartForOrder);
    const clearCart = useCartStore((state) => state.clearCart);

    const placeOrderMutation = useMutation({
      mutationFn: async (values: CheckoutFormValues) => {
        const orderLines = getCartForOrder();

        const customerInfo = {
          firstName: values.firstName,
          lastName: values.lastName,
          phoneNumber: values.phoneNumber,
        };

        const commonBody = {
          customerInfo,
          deliveryMode,
          orderLines,
          scheduledFor: deliveryMode === 'SCHEDULED' ? scheduledTime : undefined,
        };

        if (orderType === ORDER_TYPES.PICKUP) {
          const response = await fetchClient.POST('/api/v1/orders/place-pick-up-order', {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            body: commonBody as any,
          });

          if (response.error) {
            throw new Error(response.error.message || 'Failed to place order');
          }

          return response.data;
        } else {
          const address = {
            street: values.street,
            houseNumber: values.houseNumber,
            apartmentNumber: values.apartmentNumber,
            city: values.city,
            postalCode: values.postalCode,
            apartment: values.apartment,
          };

          const response = await fetchClient.POST('/api/v1/orders/place-delivery-order', {
            body: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ...(commonBody as any),
              address,
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

    const formik = useFormik<CheckoutFormValues>({
      initialValues: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        street: '',
        houseNumber: '',
        apartmentNumber: '',
        city: '',
        postalCode: '',
        apartment: false,
      },
      validationSchema: createOrderCheckoutSchema(orderType),
      onSubmit: (values) => {
        placeOrderMutation.mutate(values);
      },
    });

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
      submit: () => formik.handleSubmit(),
      isPending: placeOrderMutation.isPending,
      isError: placeOrderMutation.isError,
      errorMessage: placeOrderMutation.error?.message || 'Failed to place order',
    }));

    return (
      <>
        {/* Customer Information */}
        <Card className="border-amber-100 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerInfoFormFields formik={formik} />
          </CardContent>
        </Card>

        {/* Delivery Address (only for delivery orders) */}
        {orderType === ORDER_TYPES.DELIVERY && (
          <Card className="border-amber-100 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
            </CardHeader>
            <CardContent>
              <AddressFormFields formik={formik} />
            </CardContent>
          </Card>
        )}
      </>
    );
  }
);

OrderCheckoutForm.displayName = 'OrderCheckoutForm';
