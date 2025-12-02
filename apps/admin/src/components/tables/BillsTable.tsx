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
  DateTimePicker,
  CardDescription,
} from '@repo/ui';
import { FilterToolbar } from './FilterToolbar';
import { UserIdSelect } from '../filters/UserIdSelect';
import { MenuItemSelect } from '../filters/MenuItemSelect';
import { columns, BILL_STATUS, BillStatus, BillSummaryResponse } from './BillsTable.config';
import { BillDetailsDialog } from '../dialogs/BillDetailsDialog';

export function BillsTable() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState<BillStatus | 'ALL'>('ALL');
  const [openedFrom, setOpenedFrom] = useState<Date>();
  const [openedTo, setOpenedTo] = useState<Date>();
  const [closedFrom, setClosedFrom] = useState<Date>();
  const [closedTo, setClosedTo] = useState<Date>();
  const [userId, setUserId] = useState('');
  const [menuItemId, setMenuItemId] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [tableNumber, setTableNumber] = useState('');

  const [selectedBill, setSelectedBill] = useState<BillSummaryResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'bills',
      page,
      pageSize,
      status,
      openedFrom,
      openedTo,
      closedFrom,
      closedTo,
      userId,
      menuItemId,
      minAmount,
      maxAmount,
      tableNumber,
    ],
    queryFn: async () => {
      const { data, error } = await fetchClient.GET('/api/v1/bills', {
        params: {
          query: {
            page,
            size: pageSize,
            statuses: status === 'ALL' ? undefined : [status],
            openedFrom: openedFrom ? openedFrom.toISOString() : undefined,
            openedTo: openedTo ? openedTo.toISOString() : undefined,
            closedAtFrom: closedFrom ? closedFrom.toISOString() : undefined,
            closedAtTo: closedTo ? closedTo.toISOString() : undefined,
            userId: userId || undefined,
            menuItemId: menuItemId || undefined,
            minTotalAmount: minAmount ? Number(minAmount) : undefined,
            maxTotalAmount: maxAmount ? Number(maxAmount) : undefined,
            tableNumbers: tableNumber ? [Number(tableNumber)] : undefined,
          },
        },
      });

      if (error) throw error;
      return data;
    },
  });

  const handleClearFilters = () => {
    setStatus('ALL');
    setOpenedFrom(undefined);
    setOpenedTo(undefined);
    setClosedFrom(undefined);
    setClosedTo(undefined);
    setUserId('');
    setMenuItemId('');
    setMinAmount('');
    setMaxAmount('');
    setTableNumber('');
    setPage(0);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Bills History</CardTitle>
          <CardDescription>View and manage all bill transactions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterToolbar onClear={handleClearFilters} onRefresh={() => refetch()}>
            <Select value={status} onValueChange={(val) => setStatus(val as BillStatus | 'ALL')}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                {Object.entries(BILL_STATUS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DateTimePicker
              value={openedFrom}
              onChange={setOpenedFrom}
              placeholder="Opened From"
              className="flex-1 min-w-[150px]"
            />
            <DateTimePicker
              value={openedTo}
              onChange={setOpenedTo}
              placeholder="Opened To"
              className="flex-1 min-w-[150px]"
            />
            <DateTimePicker
              value={closedFrom}
              onChange={setClosedFrom}
              placeholder="Closed From"
              className="flex-1 min-w-[150px]"
            />
            <DateTimePicker
              value={closedTo}
              onChange={setClosedTo}
              placeholder="Closed To"
              className="flex-1 min-w-[150px]"
            />

            <UserIdSelect value={userId} onChange={(val) => setUserId(val || '')} />
            <MenuItemSelect value={menuItemId} onChange={(val) => setMenuItemId(val || '')} />

            <Input
              placeholder="Min Amount"
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="w-[120px]"
            />
            <Input
              placeholder="Max Amount"
              type="number"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="w-[120px]"
            />
            <Input
              placeholder="Table No."
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-[100px]"
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
              setSelectedBill(row);
              setDetailsOpen(true);
            }}
          />
        </CardContent>
      </Card>

      <BillDetailsDialog bill={selectedBill} open={detailsOpen} onOpenChange={setDetailsOpen} />
    </div>
  );
}
