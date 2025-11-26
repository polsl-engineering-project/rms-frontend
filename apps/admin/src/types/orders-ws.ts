import { components } from '@repo/api-client';

export type OrderLine = components['schemas']['OrderLine'] & {
  id?: string;
  name?: string;
};
export type Address = components['schemas']['Address'];
export type CustomerInfo = components['schemas']['CustomerInfo'];

export type DeliveryOrderPlacedEvent = components['schemas']['DeliveryOrderPlacedEvent'];
export type PickUpOrderPlacedEvent = components['schemas']['PickUpOrderPlacedEvent'];
export type OrderApprovedByFrontDeskEvent = components['schemas']['OrderApprovedByFrontDeskEvent'];
export type OrderApprovedByKitchenEvent = components['schemas']['OrderApprovedByKitchenEvent'];
export type OrderCancelledEvent = components['schemas']['OrderCancelledEvent'];
export type OrderCompletedEvent = components['schemas']['OrderCompletedEvent'];
export type OrderDeliveryStartedEvent = components['schemas']['OrderDeliveryStartedEvent'];
export type OrderLinesChangedEvent = components['schemas']['OrderLinesChangedEvent'];
export type OrderMarkedAsReadyEvent = components['schemas']['OrderMarkedAsReadyEvent'];

// Extract OrderEventType from one of the events (they all share the same enum for 'type')
export type OrderEventType = NonNullable<DeliveryOrderPlacedEvent['type']> | 'INITIAL_DATA';

// Define the enum manually for usage in code (values must match the schema)
export const OrderEventType = {
  INITIAL_DATA: 'INITIAL_DATA',
  DELIVERY_ORDER_PLACED: 'DELIVERY_ORDER_PLACED',
  PICK_UP_ORDER_PLACED: 'PICK_UP_ORDER_PLACED',
  APPROVED_BY_FRONT_DESK: 'APPROVED_BY_FRONT_DESK',
  APPROVED_BY_KITCHEN: 'APPROVED_BY_KITCHEN',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  DELIVERY_STARTED: 'DELIVERY_STARTED',
  LINES_CHANGED: 'LINES_CHANGED',
  MARKED_AS_READY: 'MARKED_AS_READY',
} as const;

// OrderDetailsResponse is not an event, but a DTO. We can construct it from OrderCustomerViewResponse or similar,
// but looking at the manual definition, it seems to be a mix.
// Let's look for a suitable type in the schema. 'OrderCustomerViewResponse' is close but missing address/lines.
// 'DeliveryOrderPlacedEvent' has most fields.
// The manual type had: id, status, customerInfo, address, deliveryMode, scheduledFor, orderLines, estimatedPreparationTimeMinutes.
// Let's see if there is a full Order response type. 'OrderPlacedResponse' is just ID.
// 'BillSummaryWithLinesResponse' is for bills.
// It seems we might need to compose it or find the right one.
// Wait, the INITIAL_DATA payload in the manual type was OrderDetailsResponse[].
// If the backend sends OrderDetailsResponse, we should check if that type exists in the schema.
// I don't see 'OrderDetailsResponse' in the schema list I read.
// However, 'DeliveryOrderPlacedEvent' has 'lines', 'deliveryAddress', 'customerInfo'.
// Let's check 'OrderCustomerViewResponse' again.
// It has id, status, estimatedPreparationMinutes, cancellationReason.
// Maybe the INITIAL_DATA returns a list of events? No, usually it returns the current state.
// Let's assume for now we need to define OrderDetailsResponse manually or based on a combination,
// OR maybe I missed it.
// Let's check if 'Order' schema exists. I didn't see it in the first 800 lines or the rest.
// I saw 'OrderPlacedResponse', 'OrderLine', 'OrderLineRemoval'.
// Let's stick to a manual definition for OrderDetailsResponse for now, reusing the generated parts,
// unless I find a better match.
// Actually, let's look at the manual definition again.
// It has 'deliveryMode'.
// 'PlaceDeliveryOrderRequest' has 'deliveryMode'.
// Let's define OrderDetailsResponse using the components.

export interface OrderDetailsResponse {
  id: string;
  status: string;
  customerInfo: CustomerInfo;
  address?: Address | null;
  deliveryMode: 'ASAP' | 'SCHEDULED';
  scheduledFor?: string | null;
  orderLines: OrderLine[];
  estimatedPreparationTimeMinutes?: number | null;
}

export type OrderWebsocketMessage =
  | { type: typeof OrderEventType.INITIAL_DATA; data: OrderDetailsResponse[] }
  | { type: typeof OrderEventType.DELIVERY_ORDER_PLACED; data: DeliveryOrderPlacedEvent }
  | { type: typeof OrderEventType.PICK_UP_ORDER_PLACED; data: PickUpOrderPlacedEvent }
  | { type: typeof OrderEventType.APPROVED_BY_FRONT_DESK; data: OrderApprovedByFrontDeskEvent }
  | { type: typeof OrderEventType.APPROVED_BY_KITCHEN; data: OrderApprovedByKitchenEvent }
  | { type: typeof OrderEventType.CANCELLED; data: OrderCancelledEvent }
  | { type: typeof OrderEventType.COMPLETED; data: OrderCompletedEvent }
  | { type: typeof OrderEventType.DELIVERY_STARTED; data: OrderDeliveryStartedEvent }
  | { type: typeof OrderEventType.LINES_CHANGED; data: OrderLinesChangedEvent }
  | { type: typeof OrderEventType.MARKED_AS_READY; data: OrderMarkedAsReadyEvent };
