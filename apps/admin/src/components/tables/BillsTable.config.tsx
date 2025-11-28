import { Column, COLUMN_CELL_TYPE } from '@repo/ui';
import type { components } from '@repo/api-client';
import { StatusBadge, StatusConfig } from '../common/StatusBadge';
import { Circle, CheckCircle } from 'lucide-react';

export type BillSummaryResponse = components['schemas']['BillSummaryResponse'];

export const BILL_STATUS = {
  OPEN: 'Open',
  CLOSED: 'Closed',
} as const;

export type BillStatus = keyof typeof BILL_STATUS;

export const billStatusConfig: Record<string, StatusConfig> = {
  OPEN: {
    label: 'Open',
    variant: 'default',
    icon: Circle,
    className: 'bg-green-500 hover:bg-green-600',
  },
  CLOSED: { label: 'Closed', variant: 'secondary', icon: CheckCircle },
};

export const columns: Column<BillSummaryResponse>[] = [
  {
    id: 'tableNumber',
    label: 'Table',
    type: COLUMN_CELL_TYPE.NUMBER,
    className: 'font-medium',
  },
  {
    id: 'status',
    label: 'Status',
    type: COLUMN_CELL_TYPE.COMPONENT,
    render: (status) => <StatusBadge status={status as string} config={billStatusConfig} />,
  },
  {
    id: 'userId',
    label: 'User',
    type: COLUMN_CELL_TYPE.TEXT,
    noDataFallback: '-',
  },
  {
    id: 'totalAmount',
    label: 'Total',
    type: COLUMN_CELL_TYPE.NUMBER,
    transform: (val) => val || 0,
    precision: 2,
  },
  {
    id: 'itemCount',
    label: 'Items',
    type: COLUMN_CELL_TYPE.NUMBER,
  },
  {
    id: 'openedAt',
    label: 'Opened At',
    type: COLUMN_CELL_TYPE.DATE,
    dateFormat: 'PPpp',
  },
  {
    id: 'closedAt',
    label: 'Closed At',
    type: COLUMN_CELL_TYPE.DATE,
    dateFormat: 'PPpp',
  },
  {
    id: 'updatedAt',
    label: 'Updated At',
    type: COLUMN_CELL_TYPE.DATE,
    dateFormat: 'PPpp',
  },
];
