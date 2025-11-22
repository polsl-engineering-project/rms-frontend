import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { ORDER_STATUSES } from '../../constants/order';
import type { components } from '@repo/api-client';

type OrderCustomerViewResponse = components['schemas']['OrderCustomerViewResponse'];

interface OrderCancellationReasonProps {
  status: OrderCustomerViewResponse['status'];
  reason: string | undefined;
}

export function OrderCancellationReason({ status, reason }: OrderCancellationReasonProps) {
  if (status !== ORDER_STATUSES.CANCELLED || !reason) return null;

  return (
    <Card className="border-red-200 bg-red-50/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-red-900">Cancellation Reason</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-800">{reason}</p>
      </CardContent>
    </Card>
  );
}
