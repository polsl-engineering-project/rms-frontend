import { useLiveOrders } from '../../hooks/useLiveOrders';
import { KitchenOrderCard } from './KitchenOrderCard';
import { Loader2, AlertCircle } from 'lucide-react';
import { ReadyState } from 'react-use-websocket';

export function KitchenOrdersBoard() {
  const { orders, readyState } = useLiveOrders();

  const kitchenOrders = orders.filter((order) =>
    ['APPROVED_BY_FRONT_DESK', 'APPROVED_BY_KITCHEN', 'CONFIRMED', 'APPROVED'].includes(
      order.status
    )
  );

  if (readyState === ReadyState.CONNECTING) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
        <p>Connecting to live orders...</p>
      </div>
    );
  }

  if (readyState === ReadyState.CLOSED) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p>Connection lost. Reconnecting...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl font-semibold text-slate-800">Online Orders</h2>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Live</span>
        </div>
      </div>

      {kitchenOrders.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl min-h-[200px]">
          No active orders
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 overflow-y-auto p-4">
          {kitchenOrders.map((order) => (
            <div key={order.id} className="h-full">
              <KitchenOrderCard order={order} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
