import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { ORDER_STATUSES } from '../../constants/order';
import type { components } from '@repo/api-client';

type OrderCustomerViewResponse = components['schemas']['OrderCustomerViewResponse'];

interface OrderTimelineProps {
  status: OrderCustomerViewResponse['status'];
}

export function OrderTimeline({ status }: OrderTimelineProps) {
  const stages = [
    { status: ORDER_STATUSES.PLACED, label: 'Order Placed' },
    { status: ORDER_STATUSES.ACCEPTED, label: 'Order Accepted' },
    { status: ORDER_STATUSES.READY, label: 'Order Ready' },
    status === ORDER_STATUSES.IN_DELIVERY
      ? { status: ORDER_STATUSES.IN_DELIVERY, label: 'Out for Delivery' }
      : null,
    { status: ORDER_STATUSES.COMPLETED, label: 'Order Completed' },
  ].filter(Boolean);

  const statusOrder = [
    ORDER_STATUSES.PLACED,
    ORDER_STATUSES.ACCEPTED,
    ORDER_STATUSES.READY,
    ORDER_STATUSES.IN_DELIVERY,
    ORDER_STATUSES.COMPLETED,
  ];

  const currentIndex = statusOrder.indexOf(status as (typeof statusOrder)[number]);

  return (
    <Card className="border-amber-100 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Order Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stages.map((stage) => {
            if (!stage) return null;

            const stageIndex = statusOrder.indexOf(stage.status as (typeof statusOrder)[number]);
            const isActive = stageIndex <= currentIndex;
            const isCurrent = stage.status === status;

            return (
              <div key={stage.status} className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    isActive
                      ? 'bg-amber-600 border-amber-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {isActive && '✓'}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      isCurrent
                        ? 'text-amber-700'
                        : isActive
                        ? 'text-gray-900'
                        : 'text-gray-400'
                    }`}
                  >
                    {stage.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
