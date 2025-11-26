import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useAuthStore } from '../stores/auth';
import {
  OrderEventType,
  OrderWebsocketMessage,
  OrderDetailsResponse,
  DeliveryOrderPlacedEvent,
} from '../types/orders-ws';

// TODO: Replace with actual WebSocket URL from environment or config
const WS_URL = 'ws://rms-backend-1045457934254.europe-central2.run.app/ws/orders';

export function useLiveOrders() {
  const [orders, setOrders] = useState<OrderDetailsResponse[]>([]);
  const token = useAuthStore((state) => state.token);
  // Note: Browser WebSocket API does not support custom headers (like Authorization).
  // We pass the token via query parameter as the standard workaround.
  const socketUrl = token ? `${WS_URL}?token=${token}` : null;

  const { lastMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const message: OrderWebsocketMessage = JSON.parse(lastMessage.data);

        switch (message.type) {
          case OrderEventType.INITIAL_DATA:
            setOrders(message.data);
            break;

          case OrderEventType.DELIVERY_ORDER_PLACED:
          case OrderEventType.PICK_UP_ORDER_PLACED: {
            const newOrderData = message.data;
            const newOrder: OrderDetailsResponse = {
              id: newOrderData.orderId || '',
              status: 'PLACED',
              customerInfo: newOrderData.customerInfo || {
                firstName: '',
                lastName: '',
                phoneNumber: '',
              },
              address:
                message.type === OrderEventType.DELIVERY_ORDER_PLACED
                  ? (newOrderData as DeliveryOrderPlacedEvent).deliveryAddress
                  : null,
              deliveryMode:
                message.type === OrderEventType.DELIVERY_ORDER_PLACED ? 'ASAP' : 'SCHEDULED',
              // @ts-ignore: OpenAPI generated type for scheduledFor is Record<string, never> but backend sends string
              scheduledFor: newOrderData.scheduledFor as string | null,
              orderLines: newOrderData.lines || [],
              estimatedPreparationTimeMinutes: null,
            };
            setOrders((prev) => [...prev, newOrder]);
            break;
          }

          case OrderEventType.APPROVED_BY_FRONT_DESK: {
            const data = message.data;
            setOrders((prev) =>
              prev.map((order) =>
                order.id === data.orderId ? { ...order, status: 'APPROVED_BY_FRONT_DESK' } : order
              )
            );
            break;
          }

          case OrderEventType.APPROVED_BY_KITCHEN: {
            const data = message.data;
            setOrders((prev) =>
              prev.map((order) =>
                order.id === data.orderId
                  ? {
                      ...order,
                      status: 'APPROVED_BY_KITCHEN',
                      estimatedPreparationTimeMinutes: data.estimatedPreparationMinutes,
                    }
                  : order
              )
            );
            break;
          }

          case OrderEventType.CANCELLED: {
            const data = message.data;
            setOrders((prev) => prev.filter((order) => order.id !== data.orderId));
            break;
          }

          case OrderEventType.COMPLETED: {
            const data = message.data;
            setOrders((prev) => prev.filter((order) => order.id !== data.orderId));
            break;
          }

          case OrderEventType.DELIVERY_STARTED: {
            const data = message.data;
            setOrders((prev) =>
              prev.map((order) =>
                order.id === data.orderId ? { ...order, status: 'DELIVERY_STARTED' } : order
              )
            );
            break;
          }

          case OrderEventType.LINES_CHANGED: {
            const data = message.data;
            setOrders((prev) =>
              prev.map((order) => {
                if (order.id !== data.orderId) return order;
                return {
                  ...order,
                  estimatedPreparationTimeMinutes:
                    data.updatedEstimatedPreparationMinutes ??
                    order.estimatedPreparationTimeMinutes,
                };
              })
            );
            break;
          }

          case OrderEventType.MARKED_AS_READY: {
            const data = message.data;
            setOrders((prev) =>
              prev.map((order) =>
                order.id === data.orderId
                  ? { ...order, status: data.readyStatus || 'UNKNOWN' }
                  : order
              )
            );
            break;
          }
        }
      } catch (e) {
        console.error('Failed to parse WebSocket message', e);
      }
    }
  }, [lastMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return {
    orders,
    connectionStatus,
    readyState,
  };
}
