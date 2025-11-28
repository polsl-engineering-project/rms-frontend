import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  Loader2,
  User,
  CalendarIcon,
  DollarSign,
  Hash,
  TableCell,
} from '@repo/ui';
import { BillSummaryResponse, billStatusConfig } from '../tables/BillsTable.config';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { fetchClient } from '../../api/client';
import { StatusBadge } from '../common/StatusBadge';

interface BillDetailsDialogProps {
  bill: BillSummaryResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BillDetailsDialog({ bill, open, onOpenChange }: BillDetailsDialogProps) {
  const { data: detailedBill, isLoading } = useQuery({
    queryKey: ['bill', bill?.id],
    queryFn: async () => {
      if (!bill?.id) return null;
      const { data, error } = await fetchClient.GET('/api/v1/bills/{id}', {
        params: { path: { id: bill.id } },
      });
      if (error) throw error;
      return data;
    },
    enabled: !!bill?.id && open,
  });

  if (!bill) return null;

  const displayBill = detailedBill || bill;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Bill Details
            <StatusBadge status={displayBill.status || 'OPEN'} config={billStatusConfig} />
          </DialogTitle>
          <DialogDescription>
            ID: <span className="font-mono">{displayBill.id}</span>
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Key Information Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Hash className="h-4 w-4" /> Table
                </div>
                <div className="mt-1 text-lg font-semibold">{displayBill.tableNumber}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" /> User
                </div>
                <div className="mt-1 text-lg font-semibold truncate" title={displayBill.userId}>
                  <UserNameDisplay userId={displayBill.userId} />
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" /> Total
                </div>
                <div className="mt-1 text-lg font-semibold">
                  ${(displayBill.totalAmount || 0).toFixed(2)}
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" /> Opened
                </div>
                <div className="mt-1 text-sm font-medium">
                  {displayBill.openedAt ? format(new Date(displayBill.openedAt), 'PP p') : '-'}
                </div>
              </div>
            </div>

            {/* Bill Lines Table */}
            {detailedBill?.billLines && detailedBill.billLines.length > 0 && (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailedBill.billLines.map((line, index) => (
                      <TableRow key={index}>
                        <TableCell>{line.name}</TableCell>
                        <TableCell className="text-right">{line.quantity || 0}</TableCell>
                        <TableCell className="text-right">
                          ${(line.unitPrice || 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${((line.quantity || 0) * (line.unitPrice || 0)).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Timestamps */}
            <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2">
              <div>
                <span className="font-medium">Closed:</span>{' '}
                {displayBill.closedAt ? format(new Date(displayBill.closedAt), 'PPpp') : '-'}
              </div>
              <div className="text-right">
                <span className="font-medium">Updated:</span>{' '}
                {displayBill.updatedAt ? format(new Date(displayBill.updatedAt), 'PPpp') : '-'}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UserNameDisplay({ userId }: { userId?: string }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await fetchClient.GET('/api/v1/users/{id}', {
        params: { path: { id: userId } },
      });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  if (isLoading) return <span className="text-muted-foreground text-sm">Loading...</span>;
  if (!user) return <span>{userId || '-'}</span>;

  return <span>{`${user.firstName} ${user.lastName}`}</span>;
}
