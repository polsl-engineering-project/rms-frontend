import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchClient } from '../../api/client';
import {
  DataTable,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@repo/ui';
import { FilterToolbar } from './FilterToolbar';
import {
  columns,
  ORDER_STATUS,
  OrderStatus,
  DELIVERY_MODE,
  DeliveryMode,
  OrderSummaryResponse,
} from './OrdersTable.config';
import { OrderDetailsDialog } from '../dialogs/OrderDetailsDialog';
import { DateTimePicker } from '@repo/ui';

export function OrdersTable() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode | 'ALL'>('ALL');
  const [placedFrom, setPlacedFrom] = useState<Date>();
  const [placedTo, setPlacedTo] = useState<Date>();
  const [customerName, setCustomerName] = useState('');

  const [selectedOrder, setSelectedOrder] = useState<OrderSummaryResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['orders', page, pageSize, status, deliveryMode, placedFrom, placedTo, customerName],
    queryFn: async () => {
      const { data, error } = await fetchClient.GET('/api/v1/orders', {
        params: {
          query: {
            page,
            size: pageSize,
            statuses: status === 'ALL' ? undefined : [status],
            deliveryMode: deliveryMode === 'ALL' ? undefined : deliveryMode,
            placedFrom: placedFrom ? placedFrom.toISOString() : undefined,
            placedTo: placedTo ? placedTo.toISOString() : undefined,
            customerFirstName: customerName || undefined,
          },
        },
      });

      if (error) throw error;
      return data;
    },
  });

  const handleClearFilters = () => {
    setStatus('ALL');
    setDeliveryMode('ALL');
    setPlacedFrom(undefined);
    setPlacedTo(undefined);
    setCustomerName('');
    setPage(0);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Orders History</CardTitle>
          <CardDescription>View and manage all order transactions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterToolbar onClear={handleClearFilters} onRefresh={() => refetch()}>
            <Select value={status} onValueChange={(val) => setStatus(val as OrderStatus | 'ALL')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                {Object.entries(ORDER_STATUS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={deliveryMode}
              onValueChange={(val) => setDeliveryMode(val as DeliveryMode | 'ALL')}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Delivery Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Modes</SelectItem>
                {Object.entries(DELIVERY_MODE).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DateTimePicker
              value={placedFrom}
              onChange={setPlacedFrom}
              placeholder="Placed From"
              className="flex-1 min-w-[150px]"
            />
            <DateTimePicker
              value={placedTo}
              onChange={setPlacedTo}
              placeholder="Placed To"
              className="flex-1 min-w-[150px]"
            />

            <Input
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="flex-1 min-w-[150px]"
            />
          </FilterToolbar>

          <DataTable
            columns={columns}
            data={data?.content || []}
            loading={isLoading}
            pagination={{
              page,
              pageSize,
              total: data?.totalElements || 0,
            }}
            onPaginationChange={({ page, pageSize }) => {
              setPage(page);
              setPageSize(pageSize);
            }}
            onRowClick={(row) => {
              setSelectedOrder(row);
              setDetailsOpen(true);
            }}
          />
        </CardContent>
      </Card>

      <OrderDetailsDialog order={selectedOrder} open={detailsOpen} onOpenChange={setDetailsOpen} />
    </div>
  );
}
