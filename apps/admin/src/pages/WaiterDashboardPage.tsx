import { WaiterLayout } from '../components/waiter/WaiterLayout';
import { BillList } from '../components/waiter/BillList';
import { LiveOrdersBoard } from '../components/waiter/live-orders/LiveOrdersBoard';

export function WaiterDashboardPage() {
  return (
    <WaiterLayout>
      <div className="flex flex-col lg:flex-row h-full overflow-hidden">
        <div className="flex-1 lg:w-1/2 p-4 overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 px-1">In-House Orders</h2>
          <BillList />
        </div>
        <div className="flex-1 lg:w-1/2 p-4 overflow-hidden bg-slate-50/50">
          <LiveOrdersBoard />
        </div>
      </div>
    </WaiterLayout>
  );
}
