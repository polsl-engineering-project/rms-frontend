import { components } from '@repo/api-client';

export type OrderLine = components['schemas']['OrderLine'];
export type Address = components['schemas']['Address'];
export type CustomerInfo = components['schemas']['CustomerInfo'];

export type DeliveryOrderPlacedEvent = Omit<
  components['schemas']['DeliveryOrderPlacedEvent'],
  'scheduledFor'
> & {
  scheduledFor?: string | null;
};
export type PickUpOrderPlacedEvent = Omit<
  components['schemas']['PickUpOrderPlacedEvent'],
  'scheduledFor'
> & {
  scheduledFor?: string | null;
};
export type OrderApprovedEvent = components['schemas']['OrderApprovedEvent'];
export type OrderCancelledEvent = components['schemas']['OrderCancelledEvent'];
export type OrderCompletedEvent = components['schemas']['OrderCompletedEvent'];
export type OrderDeliveryStartedEvent = components['schemas']['OrderDeliveryStartedEvent'];
export type OrderLinesChangedEvent = components['schemas']['OrderLinesChangedEvent'];
export type OrderMarkedAsReadyEvent = components['schemas']['OrderMarkedAsReadyEvent'];

export type OrderEventType = NonNullable<DeliveryOrderPlacedEvent['type']> | 'INITIAL_DATA';

export const OrderEventType = {
  INITIAL_DATA: 'INITIAL_DATA',
  DELIVERY_ORDER_PLACED: 'DELIVERY_ORDER_PLACED',
  PICK_UP_ORDER_PLACED: 'PICK_UP_ORDER_PLACED',
  APPROVED: 'APPROVED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  DELIVERY_STARTED: 'DELIVERY_STARTED',
  LINES_CHANGED: 'LINES_CHANGED',
  MARKED_AS_READY: 'MARKED_AS_READY',
} as const;

export interface OrderDetailsResponse {
  id: string;
  status: string;
  customerInfo: CustomerInfo;
  address?: Address | null;
  deliveryMode: 'ASAP' | 'SCHEDULED';
  scheduledFor?: string | null;
  placedAt?: string;
  orderLines: OrderLine[];
  estimatedPreparationTimeMinutes?: number | null;
}

export type OrderWebsocketMessage =
  | { type: typeof OrderEventType.INITIAL_DATA; data: OrderDetailsResponse[] }
  | { type: typeof OrderEventType.DELIVERY_ORDER_PLACED; data: DeliveryOrderPlacedEvent }
  | { type: typeof OrderEventType.PICK_UP_ORDER_PLACED; data: PickUpOrderPlacedEvent }
  | { type: typeof OrderEventType.APPROVED; data: OrderApprovedEvent }
  | { type: typeof OrderEventType.CANCELLED; data: OrderCancelledEvent }
  | { type: typeof OrderEventType.COMPLETED; data: OrderCompletedEvent }
  | { type: typeof OrderEventType.DELIVERY_STARTED; data: OrderDeliveryStartedEvent }
  | { type: typeof OrderEventType.LINES_CHANGED; data: OrderLinesChangedEvent }
  | { type: typeof OrderEventType.MARKED_AS_READY; data: OrderMarkedAsReadyEvent };
