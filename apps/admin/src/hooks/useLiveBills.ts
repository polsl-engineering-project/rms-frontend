import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useAuthStore } from '../stores/auth';
import { BillEventType, BillWebsocketMessage, BillInitialDataEvent } from '../types/bills-ws';

// TODO: Replace with actual WebSocket URL from environment or config
const WS_URL = 'ws://rms-backend-1045457934254.europe-central2.run.app/ws/bills';

export function useLiveBills() {
  const [bills, setBills] = useState<BillInitialDataEvent[]>([]);
  const token = useAuthStore((state) => state.token);
  const socketUrl = token ? `${WS_URL}?token=${token}` : null;

  const { lastMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const message: BillWebsocketMessage = JSON.parse(lastMessage.data);

        switch (message.type) {
          case BillEventType.INITIAL_DATA:
            setBills(message.data);
            break;

          case BillEventType.OPENED: {
            const data = message.data;
            const newBill: BillInitialDataEvent = {
              id: data.billId,
              tableNumber: data.tableNumber?.value,
              status: 'OPEN',
              userId: '', // Not provided in event
              totalAmount: 0, // Initial amount
              billLines: [], // Initial lines
              openedAt: data.openedAt,
              updatedAt: data.occurredAt,
            };
            // If initialLines are provided, we might need to map them, but BillLine vs BillLineResponse might differ
            setBills((prev) => [...prev, newBill]);
            break;
          }

          case BillEventType.LINES_ADDED: {
            const data = message.data;
            setBills((prev) =>
              prev.map((bill) => {
                if (bill.id !== data.billId) return bill;
                // We'd ideally merge lines here, but for now let's just update the timestamp
                // In a real app, we'd need to fetch the full bill or carefully merge the delta
                // For the kitchen view, we mostly care about the existence of the bill and maybe the item count
                return {
                  ...bill,
                  updatedAt: data.updatedAt,
                };
              })
            );
            break;
          }

          case BillEventType.LINES_REMOVED: {
            const data = message.data;
            setBills((prev) =>
              prev.map((bill) => {
                if (bill.id !== data.billId) return bill;
                return {
                  ...bill,
                  updatedAt: data.updatedAt,
                };
              })
            );
            break;
          }

          case BillEventType.CLOSED: {
            const data = message.data;
            setBills((prev) =>
              prev.map((bill) =>
                bill.id === data.billId
                  ? { ...bill, status: 'CLOSED', closedAt: data.closedAt }
                  : bill
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
    bills,
    connectionStatus,
    readyState,
  };
}
