import type { ReactNode } from 'react';

/** Cell type constants */
export const COLUMN_CELL_TYPE = {
  TEXT: 'text',
  NUMBER: 'number',
  COMPONENT: 'component',
  DATE: 'date',
} as const;

export type ColumnCellType = (typeof COLUMN_CELL_TYPE)[keyof typeof COLUMN_CELL_TYPE];

/** Pagination state */
export type Pagination = {
  /** Current page number (0-indexed) */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items across all pages */
  total: number;
};

/** Extracts all possible paths to nested properties of the provided object type */
type RecursiveGetPossiblePaths<T> =
  T extends Record<string, unknown>
    ? {
        [K in keyof T]-?: K extends string
          ? `${K}` | `${K}.${RecursiveGetPossiblePaths<T[K]>}`
          : never;
      }[keyof T]
    : never;

/** Extracts the type of the data model at the provided dot path */
export type GetTypeAtPath<
  T,
  Path extends string,
  Undefined = never,
> = Path extends `${infer First}.${infer Rest}`
  ? First extends keyof T
    ? T[First] extends infer D
      ? GetTypeAtPath<Exclude<D, undefined>, Rest, D extends undefined ? undefined : Undefined>
      : never
    : never
  : Path extends keyof T
    ? T[Path] | Undefined
    : never;

export type PathType<T> = RecursiveGetPossiblePaths<T>;

/** Common properties for all column types */
type CommonColumnCell = {
  /** Column header label */
  label: string;
  /** Tooltip displayed when hovering over the column header */
  tooltip?: string;
  /** Align content of the cell */
  align?: 'left' | 'center' | 'right';
  /** Choose if column should be hidden by default */
  hiddenByDefault?: boolean;
  /** Enable sorting for this column */
  enableSorting?: boolean;
  /** Custom className for the column cells */
  className?: string;
};

/** Text column cell definition */
type TextColumnCell<Id extends string, Data> = {
  /** Unique identifier of the column (dot path to nested property) */
  id: Id;
  /** Type of the cell */
  type: typeof COLUMN_CELL_TYPE.TEXT;
  /** Function to transform cell value to string */
  transform?: (cellValue: Data) => string;
  /** Fallback string/component to render when cell value is undefined */
  noDataFallback?: ReactNode;
};

/** Number column cell definition */
type NumberColumnCell<Id extends string, Data> = {
  /** Unique identifier of the column (dot path to nested property) */
  id: Id;
  /** Type of the cell */
  type: typeof COLUMN_CELL_TYPE.NUMBER;
  /** Number of decimal places to round the number to */
  precision?: number;
  /** Function to transform cell value to number */
  transform?: (cellValue: Data) => number;
  /** Fallback string/component to render when cell value is undefined */
  noDataFallback?: ReactNode;
};

/** Component column cell definition */
type ComponentColumnCell<Id extends string, Data, RowData> = {
  /** Unique identifier of the column */
  id: Id;
  /** Type of the cell */
  type: typeof COLUMN_CELL_TYPE.COMPONENT;
  /** Function to render cell content */
  render: (cellValue: Data, row: RowData) => ReactNode;
};

/** Date column cell definition */
type DateColumnCell<Id extends string, Data> = {
  /** Unique identifier of the column (dot path to nested property) */
  id: Id;
  /** Type of the cell */
  type: typeof COLUMN_CELL_TYPE.DATE;
  /** Fallback string/component to render when cell value is undefined */
  noDataFallback?: ReactNode;
} & (
  | {
      /** Date format string (e.g. 'MM/dd/yyyy', 'HH:mm:ss') */
      dateFormat?: never;
      /** Function to transform cell value to string */
      transform?: (cellValue: Data) => string;
    }
  | {
      /** Date format string (e.g. 'MM/dd/yyyy', 'HH:mm:ss') */
      dateFormat: string;
      /** Function to transform cell value to string */
      transform?: never;
    }
);

/**
 * Represents a column definition for a table.
 *
 * @template TData The type of the data model that the table is displaying
 * @template __Id Internal type for path calculation - do not provide manually
 */
export type Column<TData = unknown, __Id = PathType<TData>> = __Id extends string
  ? CommonColumnCell &
      (
        | TextColumnCell<__Id, GetTypeAtPath<TData, __Id>>
        | NumberColumnCell<__Id, GetTypeAtPath<TData, __Id>>
        | ComponentColumnCell<__Id, GetTypeAtPath<TData, __Id>, TData>
        | DateColumnCell<__Id, GetTypeAtPath<TData, __Id>>
      )
  : never;

/** DataTable component props */
export type DataTableProps<TData> = {
  /** Column definitions */
  columns: Column<TData>[];
  /** Data to display */
  data?: TData[];
  /** Loading state (initial load with skeleton) */
  loading?: boolean;
  /** Fetching state (data refresh with overlay/spinner) */
  fetching?: boolean;
  /** Message displayed when there is no data */
  noDataMessage?: string;
  /** Pagination configuration (controlled) */
  pagination?: Pagination;
  /** Callback when pagination changes */
  onPaginationChange?: (pagination: Pick<Pagination, 'page' | 'pageSize'>) => void;
  /** Search query for client-side filtering */
  searchQuery?: string;
  /** Custom filter function for client-side filtering */
  customFilterFn?: (data: TData[], searchQuery: string) => TData[];
  /** Callback when row is clicked */
  onRowClick?: (row: TData) => void;
  /** Function to determine if a row is clickable */
  isRowClickable?: (row: TData) => boolean;
  /** Custom className for the table */
  className?: string;
};
