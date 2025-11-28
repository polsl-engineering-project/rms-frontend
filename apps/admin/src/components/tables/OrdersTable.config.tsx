import { Column, COLUMN_CELL_TYPE } from '@repo/ui';
import type { components } from '@repo/api-client';
import { StatusBadge, StatusConfig } from '../common/StatusBadge';
import { Clock, CheckCircle, Truck, Package, XCircle, ChefHat, Bell } from 'lucide-react';

export type OrderSummaryResponse = components['schemas']['OrderSummaryResponse'];

export const ORDER_STATUS = {
  PENDING_APPROVAL: 'Pending Approval',
  APPROVED_BY_FRONT_DESK: 'Approved by Front Desk',
  APPROVED: 'Approved',
  READY_FOR_PICKUP: 'Ready for Pickup',
  READY_FOR_DRIVER: 'Ready for Driver',
  IN_DELIVERY: 'In Delivery',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS;

export const orderStatusConfig: Record<string, StatusConfig> = {
  PENDING_APPROVAL: {
    label: 'Pending',
    variant: 'outline',
    icon: Clock,
    className: 'border-yellow-500 text-yellow-600',
  },
  APPROVED_BY_FRONT_DESK: {
    label: 'Front Desk Approved',
    variant: 'secondary',
    icon: Bell,
    className: 'bg-blue-100 text-blue-800',
  },
  APPROVED: { label: 'Approved', variant: 'default', icon: ChefHat, className: 'bg-blue-500' },
  READY_FOR_PICKUP: {
    label: 'Ready for Pickup',
    variant: 'secondary',
    icon: Package,
    className: 'bg-green-100 text-green-800',
  },
  READY_FOR_DRIVER: {
    label: 'Ready for Driver',
    variant: 'secondary',
    icon: Package,
    className: 'bg-green-100 text-green-800',
  },
  IN_DELIVERY: {
    label: 'In Delivery',
    variant: 'default',
    icon: Truck,
    className: 'bg-purple-500',
  },
  COMPLETED: {
    label: 'Completed',
    variant: 'default',
    icon: CheckCircle,
    className: 'bg-green-600',
  },
  CANCELLED: { label: 'Cancelled', variant: 'destructive', icon: XCircle },
};

export const DELIVERY_MODE = {
  ASAP: 'ASAP',
  SCHEDULED: 'Scheduled',
} as const;

export type DeliveryMode = keyof typeof DELIVERY_MODE;

export const deliveryModeConfig: Record<string, StatusConfig> = {
  ASAP: { label: 'ASAP', variant: 'default', icon: Clock, className: 'bg-orange-500' },
  SCHEDULED: { label: 'Scheduled', variant: 'outline', icon: Clock },
};

export const columns: Column<OrderSummaryResponse>[] = [
  {
    id: 'status',
    label: 'Status',
    type: COLUMN_CELL_TYPE.COMPONENT,
    render: (status) => <StatusBadge status={status as string} config={orderStatusConfig} />,
  },
  {
    id: 'deliveryMode',
    label: 'Delivery Mode',
    type: COLUMN_CELL_TYPE.COMPONENT,
    render: (mode) => <StatusBadge status={mode as string} config={deliveryModeConfig} />,
  },
  {
    id: 'customerFirstName',
    label: 'Customer',
    type: COLUMN_CELL_TYPE.TEXT,
    noDataFallback: '-',
  },
  {
    id: 'placedAt',
    label: 'Placed At',
    type: COLUMN_CELL_TYPE.DATE,
    dateFormat: 'PPpp',
  },
  {
    id: 'updatedAt',
    label: 'Updated At',
    type: COLUMN_CELL_TYPE.DATE,
    dateFormat: 'PPpp',
  },
];
