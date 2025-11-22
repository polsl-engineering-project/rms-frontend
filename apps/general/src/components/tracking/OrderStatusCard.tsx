import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { OrderStatusBadge } from '../OrderStatusBadge';
import { ORDER_STATUSES } from '../../constants/order';
import type { components } from '@repo/api-client';

type OrderCustomerViewResponse = components['schemas']['OrderCustomerViewResponse'];

interface OrderStatusCardProps {
  status: OrderCustomerViewResponse['status'];
}

export function OrderStatusCard({ status }: OrderStatusCardProps) {
  const isCompleted =
    status === ORDER_STATUSES.COMPLETED || status === ORDER_STATUSES.CANCELLED;

  return (
    <Card className="border-amber-100 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Order Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium">Current Status</span>
          <OrderStatusBadge status={status!} />
        </div>

        {!isCompleted && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-pulse flex items-center gap-2 text-amber-700">
              <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div
                className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"
                style={{ animationDelay: '0.4s' }}
              ></div>
              <span className="ml-2 text-sm">Updating live...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
