import { WaiterLayout } from '../components/waiter/WaiterLayout';
import { BillList } from '../components/waiter/BillList';

export function WaiterDashboardPage() {
  return (
    <WaiterLayout>
      <BillList />
    </WaiterLayout>
  );
}
