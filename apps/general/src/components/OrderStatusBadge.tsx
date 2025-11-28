import { Badge, Package, Clock, CheckCircle, Truck, XCircle, ChefHat } from '@repo/ui';
import { ORDER_STATUS_CONFIG } from '../constants/order';

interface OrderStatusBadgeProps {
  status: string;
}

const STATUS_ICONS = {
  PENDING_APPROVAL: Clock,
  APPROVED_BY_FRONT_DESK: CheckCircle,
  APPROVED: ChefHat,
  CONFIRMED: ChefHat,
  READY_FOR_PICKUP: Package,
  READY_FOR_DRIVER: Package,
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
