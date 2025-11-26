import { useNavigate } from 'react-router-dom';
import { useBills } from '../../hooks/useBills';
import { BillCard } from './BillCard';
import { Loader2 } from '@repo/ui';
import type { components } from '@repo/api-client';

type BillSummary = components['schemas']['BillSummaryResponse'];

export function BillList() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useBills({ statuses: ['OPEN'] });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">Failed to load bills. Please try again.</div>
    );
  }

  const bills = data?.content || [];

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 p-4">
      {/* New Bill Card */}
      <div
        onClick={() => navigate('/waiter/create')}
        className="bg-white rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-6 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all min-h-[160px]"
      >
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </div>
        <span className="font-medium text-slate-900">New Bill</span>
      </div>

      {bills.map((bill: BillSummary) => (
        <BillCard
          key={bill.id}
          id={bill.id!}
          tableNumber={bill.tableNumber!}
          totalAmount={bill.totalAmount || 0}
          status={bill.status as 'OPEN' | 'CLOSED'}
          openedAt={bill.openedAt!}
          itemCount={bill.itemCount || 0}
          onClick={() => navigate(`/waiter/bill/${bill.id}`)}
        />
      ))}
    </div>
  );
}
