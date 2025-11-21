export const ORDER_TYPES = {
  PICKUP: 'PICKUP',
  DELIVERY: 'DELIVERY',
} as const;

export type OrderType = ValueOf<typeof ORDER_TYPES>;

export const DELIVERY_MODES = {
  ASAP: 'ASAP',
  SCHEDULED: 'SCHEDULED',
} as const;

export type DeliveryMode = ValueOf<typeof DELIVERY_MODES>;

export const ORDER_STATUSES = {
  PLACED: 'PLACED',
  ACCEPTED: 'ACCEPTED',
  READY: 'READY',
  IN_DELIVERY: 'IN_DELIVERY',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = ValueOf<typeof ORDER_STATUSES>;

export const ORDER_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  PLACED: {
    label: 'Order Placed',
    color: 'text-amber-700 hover:text-amber-700',
    bgColor: 'bg-amber-100 hover:bg-amber-100',
  },
  ACCEPTED: {
    label: 'Accepted',
    color: 'text-green-700 hover:text-green-700',
    bgColor: 'bg-green-100 hover:bg-green-100',
  },
  READY: {
    label: 'Ready',
    color: 'text-blue-700 hover:text-blue-700',
    bgColor: 'bg-blue-100 hover:bg-blue-100',
  },
  IN_DELIVERY: {
    label: 'Out for Delivery',
    color: 'text-purple-700 hover:text-purple-700',
    bgColor: 'bg-purple-100 hover:bg-purple-100',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'text-gray-700 hover:text-gray-700',
    bgColor: 'bg-gray-100 hover:bg-gray-100',
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'text-red-700 hover:text-red-700',
    bgColor: 'bg-red-100 hover:bg-red-100',
  },
};
