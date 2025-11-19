import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type PaginationState,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { COLUMN_CELL_TYPE, type Column, type DataTableProps } from './types';
import { defaultFilterFn, formatDate, formatNumber, getValueByPath } from './utils';
import '../../styles/globals.css';

function DataTableSkeleton({ columnCount }: { columnCount: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: columnCount }).map((_, j) => (
            <TableCell key={j}>
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function DataTablePagination<TData>({
  table,
  pagination,
  onPaginationChange,
}: {
  table: ReturnType<typeof useReactTable<TData>>;
  pagination?: { page: number; pageSize: number; total: number };
  onPaginationChange?: (pagination: { page: number; pageSize: number }) => void;
}) {
  const handlePageSizeChange = (pageSize: number) => {
    if (onPaginationChange) {
      onPaginationChange({ page: 0, pageSize });
    } else {
      table.setPageSize(pageSize);
    }
  };

  const handlePageChange = (page: number) => {
    if (onPaginationChange) {
      onPaginationChange({ page, pageSize: pagination?.pageSize || 10 });
    } else {
      table.setPageIndex(page);
    }
  };

  const currentPage = pagination?.page ?? table.getState().pagination.pageIndex;
  const pageSize = pagination?.pageSize ?? table.getState().pagination.pageSize;
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : table.getPageCount();
  const totalItems = pagination?.total ?? table.getFilteredRowModel().rows.length;

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground">
        Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalItems)}{' '}
        of {totalItems} results
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <select
            className="h-8 w-[70px] rounded-md border border-input bg-transparent px-2 text-sm"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {currentPage + 1} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(0)}
              disabled={currentPage === 0}
            >
              <span className="sr-only">Go to first page</span>«
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              <span className="sr-only">Go to previous page</span>‹
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
            >
              <span className="sr-only">Go to next page</span>›
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={currentPage >= totalPages - 1}
            >
              <span className="sr-only">Go to last page</span>»
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Convert custom Column definition to TanStack Table ColumnDef
 */
function convertToTanStackColumn<TData>(column: Column<TData>): ColumnDef<TData, unknown> {
  return {
    id: column.id,
    accessorKey: column.id as keyof TData & string,
    header: ({ column: col }) => {
      if (!column.enableSorting) {
        return <div className={cn('font-medium', column.className)}>{column.label}</div>;
      }

      return (
        <Button
          variant="ghost"
          className="-ml-4 h-auto p-2 hover:bg-transparent"
          onClick={() => col.toggleSorting(col.getIsSorted() === 'asc')}
        >
          <span className={cn('font-medium', column.className)}>{column.label}</span>
          {col.getIsSorted() === 'asc' ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : col.getIsSorted() === 'desc' ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = getValueByPath(row.original, column.id);

      if (value === undefined || value === null) {
        return column.type !== COLUMN_CELL_TYPE.COMPONENT && column.noDataFallback
          ? column.noDataFallback
          : '-';
      }

      switch (column.type) {
        case COLUMN_CELL_TYPE.TEXT: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const displayValue = column.transform ? column.transform(value as any) : String(value);
          return <div className={cn('text-left', column.className)}>{displayValue}</div>;
        }

        case COLUMN_CELL_TYPE.NUMBER: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const numValue = column.transform ? column.transform(value as any) : Number(value);
          const displayValue = formatNumber(numValue, column.precision);
          return <div className={cn('text-right', column.className)}>{displayValue}</div>;
        }

        case COLUMN_CELL_TYPE.DATE: {
          const displayValue = column.transform
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              column.transform(value as any)
            : formatDate(value as Date | string, column.dateFormat);
          return <div className={cn('text-left', column.className)}>{displayValue}</div>;
        }

        case COLUMN_CELL_TYPE.COMPONENT: {
          type CellValue = string extends keyof TData ? TData[keyof TData & string] : never;
          return (
            <div className={column.className}>
              {column.render(value as CellValue, row.original)}
            </div>
          );
        }

        default:
          return String(value);
      }
    },
    enableSorting: column.enableSorting ?? false,
    enableHiding: !column.hiddenByDefault,
  };
}

export function DataTable<TData>({
  columns,
  data = [],
  loading = false,
  fetching = false,
  noDataMessage = 'No results found.',
  pagination,
  onPaginationChange,
  searchQuery,
  customFilterFn,
  onRowClick,
  isRowClickable,
  className,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Apply client-side filtering if search query is provided
  const filteredData = React.useMemo(() => {
    if (!searchQuery || !data.length) {
      return data;
    }

    if (customFilterFn) {
      return customFilterFn(data, searchQuery);
    }

    return defaultFilterFn(data, searchQuery, columns);
  }, [data, searchQuery, columns, customFilterFn]);

  // Convert columns to TanStack format
  const tanStackColumns = React.useMemo(
    () => columns.map((col) => convertToTanStackColumn(col)),
    [columns]
  );

  // Setup pagination state
  const paginationState: PaginationState = pagination
    ? { pageIndex: pagination.page, pageSize: pagination.pageSize }
    : { pageIndex: 0, pageSize: 10 };

  const table = useReactTable({
    data: filteredData,
    columns: tanStackColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    manualPagination: !!pagination,
    pageCount: pagination ? Math.ceil(pagination.total / pagination.pageSize) : undefined,
    state: {
      sorting,
      pagination: paginationState,
    },
  });

  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative rounded-md border">
        {fetching && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className={columns[header.index]?.align}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <DataTableSkeleton columnCount={columns.length} />
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const clickable = isRowClickable ? isRowClickable(row.original) : !!onRowClick;
                return (
                  <TableRow
                    key={row.id}
                    className={cn(clickable && 'cursor-pointer')}
                    onClick={() => clickable && onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className={columns[cell.column.getIndex()]?.align}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {noDataMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {(pagination || data.length > 10) && (
        <DataTablePagination
          table={table}
          pagination={pagination}
          onPaginationChange={onPaginationChange}
        />
      )}
    </div>
  );
}
