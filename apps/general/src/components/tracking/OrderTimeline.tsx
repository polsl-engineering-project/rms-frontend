import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Clock,
  Truck,
  CheckCircle,
  ChefHat,
  Package,
} from '@repo/ui';
import { ORDER_STATUSES } from '../../constants/order';
import type { components } from '@repo/api-client';

type OrderCustomerViewResponse = components['schemas']['OrderCustomerViewResponse'];

interface OrderTimelineProps {
  order: OrderCustomerViewResponse;
}

export function OrderTimeline({ order }: OrderTimelineProps) {
  const { status, orderType } = order;
  const getProgressLevel = (s: string | undefined) => {
    switch (s) {
      case ORDER_STATUSES.PENDING_APPROVAL:
        return 0;
      case ORDER_STATUSES.APPROVED:
      case ORDER_STATUSES.CONFIRMED:
      case 'APPROVED_BY_FRONT_DESK': // Fallback
      case 'APPROVED_BY_KITCHEN': // Fallback
        return 1;
      case ORDER_STATUSES.READY_FOR_PICKUP:
      case ORDER_STATUSES.READY_FOR_DRIVER:
        return 2;
      case ORDER_STATUSES.IN_DELIVERY:
        return 3;
      case ORDER_STATUSES.COMPLETED:
        return 4;
      default:
        return -1;
    }
  };

  const currentLevel = getProgressLevel(status);

  const showDeliveryStep = orderType === 'DELIVERY';

  const stages = [
    { id: 'placed', label: 'Order Placed', level: 0, Icon: Clock },
    { id: 'preparing', label: 'Preparing', level: 1, Icon: ChefHat },
    {
      id: 'ready',
      label: orderType === 'DELIVERY' ? 'Ready for Driver' : 'Ready for Pickup',
      level: 2,
      Icon: Package,
    },
  ];

  if (showDeliveryStep) {
    stages.push({ id: 'delivery', label: 'Out for Delivery', level: 3, Icon: Truck });
  }

  stages.push({
    id: 'completed',
    label: 'Completed',
    level: showDeliveryStep ? 4 : 3,
    Icon: CheckCircle,
  });

  const getStageDescription = (stageId: string) => {
    switch (stageId) {
      case 'placed':
        return 'Waiting for confirmation...';
      case 'preparing':
        return 'Order approved & kitchen is preparing it...';
      case 'ready':
        return orderType === 'DELIVERY'
          ? 'Waiting for driver assignment...'
          : 'Ready for pickup at the counter!';
      case 'delivery':
        return 'Driver is on the way to you...';
      case 'completed':
        return 'Enjoy your meal!';
      default:
        return '';
    }
  };

  return (
    <Card className="border-amber-100 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Order Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-0">
          {stages.map((stage, index) => {
            const isCompleted = currentLevel > stage.level;
            const isCurrent = currentLevel === stage.level;
            const isActive = isCompleted || isCurrent;
            const isLast = index === stages.length - 1;
            const description = getStageDescription(stage.id);
            const shouldPulse = isCurrent && stage.id !== 'completed' && stage.id !== 'ready';

            return (
              <div key={stage.id} className="relative flex gap-4 pb-8 last:pb-0">
                {/* Connecting Line */}
                {!isLast && (
                  <div
                    className={`absolute left-4 top-8 bottom-0 w-0.5 -ml-px ${
                      isCompleted ? 'bg-amber-600' : 'bg-gray-200'
                    }`}
                  />
                )}

                {/* Icon Circle */}
                <div
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                    isActive
                      ? 'bg-amber-600 border-amber-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  <stage.Icon className="w-4 h-4" />
                </div>

                {/* Text */}
                <div className="flex-1 pt-1">
                  <p
                    className={`font-medium transition-colors duration-300 ${
                      isCurrent
                        ? 'text-amber-700 font-bold'
                        : isActive
                          ? 'text-gray-900'
                          : 'text-gray-400'
                    }`}
                  >
                    {stage.label}
                  </p>
                  {isCurrent && description && (
                    <p
                      className={`text-sm text-amber-600 mt-1 ${
                        shouldPulse ? 'animate-pulse' : ''
                      }`}
                    >
                      {description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
