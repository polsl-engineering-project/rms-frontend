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
  TableCell,
  User,
  Truck,
  Loader2,
  MapPin,
  Clock,
} from '@repo/ui';
import {
  OrderSummaryResponse,
  orderStatusConfig,
  deliveryModeConfig,
} from '../tables/OrdersTable.config';
import { format } from 'date-fns';
import { StatusBadge } from '../common/StatusBadge';
import { useQuery } from '@tanstack/react-query';
import { fetchClient } from '../../api/client';

interface OrderDetailsDialogProps {
  order: OrderSummaryResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {
  const { data: detailedOrder, isLoading } = useQuery({
    queryKey: ['order', order?.id],
    queryFn: async () => {
      if (!order?.id) return null;
      const { data, error } = await fetchClient.GET('/api/v1/orders/{id}', {
        params: { path: { id: order.id } },
      });
      if (error) throw error;
      return data;
    },
    enabled: !!order?.id && open,
  });

  if (!order) return null;

  const displayOrder = detailedOrder || order;

  // Helper to format address
  const formatAddress = (addr: NonNullable<typeof detailedOrder>['address']) => {
    if (!addr) return '-';
    const parts = [
      addr.street,
      addr.houseNumber,
      addr.apartmentNumber ? `Apt ${addr.apartmentNumber}` : null,
      addr.city,
      addr.postalCode,
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Order Details
            <StatusBadge
              status={displayOrder.status || 'PENDING_APPROVAL'}
              config={orderStatusConfig}
            />
          </DialogTitle>
          <DialogDescription>
            ID: <span className="font-mono">{displayOrder.id}</span>
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
                  <User className="h-4 w-4" /> Customer
                </div>
                <div className="mt-1 font-semibold truncate">
                  {detailedOrder?.customerInfo
                    ? `${detailedOrder.customerInfo.firstName} ${detailedOrder.customerInfo.lastName}`
                    : order.customerFirstName || 'Guest'}
                </div>
                {detailedOrder?.customerInfo?.phoneNumber && (
                  <div className="text-xs text-muted-foreground">
                    {detailedOrder.customerInfo.phoneNumber}
                  </div>
                )}
              </div>

              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4" /> Delivery
                </div>
                <div className="mt-1">
                  <StatusBadge
                    status={displayOrder.deliveryMode || 'ASAP'}
                    config={deliveryModeConfig}
                  />
                </div>
                {displayOrder.deliveryMode === 'SCHEDULED' && detailedOrder?.scheduledFor && (
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {detailedOrder.scheduledFor as unknown as string}
                  </div>
                )}
              </div>

              <div className="rounded-lg border p-3 col-span-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" /> Address
                </div>
                <div
                  className="mt-1 text-sm font-medium truncate"
                  title={detailedOrder?.address ? formatAddress(detailedOrder.address!) : ''}
                >
                  {detailedOrder?.address ? formatAddress(detailedOrder.address!) : '-'}
                </div>
              </div>
            </div>
            {detailedOrder?.orderLines && detailedOrder.orderLines.length > 0 ? (
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
                    {detailedOrder.orderLines.map((line, index) => (
                      <TableRow key={index}>
                        <TableCell>{line.menuItemName}</TableCell>
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
            ) : (
              <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
                <p>No items found.</p>
              </div>
            )}

            {/* Timestamps */}
            <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2">
              <div>
                <span className="font-medium">Placed:</span>{' '}
                {displayOrder.placedAt ? format(new Date(displayOrder.placedAt), 'PPpp') : '-'}
              </div>
              <div className="text-right">
                <span className="font-medium">Approved:</span>{' '}
                {detailedOrder?.approvedAt
                  ? format(new Date(detailedOrder.approvedAt), 'PPpp')
                  : '-'}
              </div>
              <div>
                <span className="font-medium">Delivery Started:</span>{' '}
                {detailedOrder?.deliveryStartedAt
                  ? format(new Date(detailedOrder.deliveryStartedAt), 'PPpp')
                  : '-'}
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
