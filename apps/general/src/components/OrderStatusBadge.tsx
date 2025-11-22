import { Badge, Package, Clock, CheckCircle, Truck, XCircle } from '@repo/ui';
import { ORDER_STATUS_CONFIG } from '../constants/order';

interface OrderStatusBadgeProps {
  status: string;
}

const STATUS_ICONS = {
  PLACED: Package,
  ACCEPTED: Clock,
  READY: CheckCircle,
  IN_DELIVERY: Truck,
  COMPLETED: CheckCircle,
  CANCELLED: XCircle,
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status] || ORDER_STATUS_CONFIG.PLACED;
  const Icon = STATUS_ICONS[status as keyof typeof STATUS_ICONS] || Package;

  return (
    <Badge
      className={`cursor-default ${config.bgColor} ${config.color} gap-2 px-4 py-2 text-sm font-medium`}
    >
      <Icon className="w-4 h-4" />
      {config.label}
    </Badge>
  );
}
