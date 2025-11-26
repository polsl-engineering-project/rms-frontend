import { Card, CardContent, Badge, Clock, Users } from '@repo/ui';
import { formatDistanceToNow } from 'date-fns';

interface BillCardProps {
  id: string;
  tableNumber: number;
  totalAmount: number;
  status: 'OPEN' | 'CLOSED';
  openedAt: string;
  itemCount: number;
  onClick: () => void;
}

export function BillCard({
  tableNumber,
  totalAmount,
  status,
  openedAt,
  itemCount,
  onClick,
}: BillCardProps) {
  return (
    <Card
      className="cursor-pointer hover:border-primary/50 transition-colors active:scale-95 transform duration-100"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
            {tableNumber}
          </div>
          <Badge variant={status === 'OPEN' ? 'default' : 'secondary'}>{status}</Badge>
        </div>

        <div className="space-y-1">
          <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
          <div className="text-sm text-slate-500 flex items-center gap-1">
            <Users className="h-3 w-3" /> {itemCount} items
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(openedAt), { addSuffix: true })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
