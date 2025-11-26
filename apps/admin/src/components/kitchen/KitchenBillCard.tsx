import { Card, CardContent, Badge, Clock, ShoppingBag } from '@repo/ui';
import { formatDistanceToNow } from 'date-fns';
import { BillInitialDataEvent } from '../../types/bills-ws';

interface KitchenBillCardProps {
  bill: BillInitialDataEvent;
}

export function KitchenBillCard({ bill }: KitchenBillCardProps) {
  return (
    <Card className="w-full h-full flex flex-col hover:border-primary/50 transition-colors">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
            {bill.tableNumber}
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={bill.status === 'OPEN' ? 'default' : 'secondary'}>{bill.status}</Badge>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {bill.openedAt && formatDistanceToNow(new Date(bill.openedAt), { addSuffix: true })}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-3 text-sm mt-2">
          <div className="flex items-start gap-2 text-slate-600">
            <ShoppingBag className="w-4 h-4 mt-0.5 shrink-0" />
            <div className="flex flex-col w-full">
              {bill.billLines && bill.billLines.length > 0 ? (
                bill.billLines.map((line, index) => (
                  <div key={index} className="flex justify-between w-full">
                    <span>
                      {line.quantity}x {line.name || 'Unknown Item'}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-slate-400 italic">No items yet</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
