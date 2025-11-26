import { useLiveBills } from '../../hooks/useLiveBills';
import { KitchenBillCard } from './KitchenBillCard';
import { Loader2, AlertCircle } from 'lucide-react';
import { ReadyState } from 'react-use-websocket';

export function KitchenBillsBoard() {
  const { bills, readyState } = useLiveBills();

  const openBills = bills.filter((bill) => bill.status === 'OPEN');

  if (readyState === ReadyState.CONNECTING) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
        <p>Connecting to live bills...</p>
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
        <h2 className="text-xl font-semibold text-slate-800">Restaurant Bills</h2>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Live</span>
        </div>
      </div>

      {openBills.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl min-h-[200px]">
          No active bills
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 overflow-y-auto p-4">
          {openBills.map((bill) => (
            <div key={bill.id} className="h-full">
              <KitchenBillCard bill={bill} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
