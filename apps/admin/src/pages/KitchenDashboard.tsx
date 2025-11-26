import { KitchenOrdersBoard } from '../components/kitchen/KitchenOrdersBoard';
import { KitchenBillsBoard } from '../components/kitchen/KitchenBillsBoard';

export function KitchenDashboard() {
  return (
    <div className="flex flex-col lg:flex-row h-full w-full overflow-hidden bg-white">
      <div className="flex-1 lg:w-1/2 p-4 overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-200">
        <KitchenBillsBoard />
      </div>
      <div className="flex-1 lg:w-1/2 p-4 overflow-hidden bg-slate-50/50">
        <KitchenOrdersBoard />
      </div>
    </div>
  );
}
