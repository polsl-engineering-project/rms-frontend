import { COLUMN_CELL_TYPE, type Column } from './types';

/**
 * Get value from object using dot notation path
 * @example getValueByPath({ user: { name: 'John' } }, 'user.name') => 'John'
 */
export function getValueByPath<T>(obj: T, path: string): unknown {
  const keys = path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return result;
}

/**
 * Default fuzzy search implementation
 * Searches across all TEXT and NUMBER columns
 */
export function defaultFilterFn<TData>(
  data: TData[],
  searchQuery: string,
  columns: Column<TData>[]
): TData[] {
  if (!searchQuery.trim()) {
    return data;
  }

  const query = searchQuery.toLowerCase();

  return data.filter((row) => {
    // Search across all TEXT and NUMBER columns
    return columns.some((column) => {
      if (column.type === COLUMN_CELL_TYPE.TEXT || column.type === COLUMN_CELL_TYPE.NUMBER) {
        const value = getValueByPath(row, column.id);

        if (value === undefined || value === null) {
          return false;
        }

        const stringValue = String(value).toLowerCase();
        return stringValue.includes(query);
      }

      return false;
    });
  });
}

/**
 * Format number with specified precision
 */
export function formatNumber(value: number, precision?: number): string {
  if (precision !== undefined) {
    return value.toFixed(precision);
  }
  return String(value);
}

/**
 * Format date using basic formatting
 * This is a simple implementation - for advanced formatting, integrate date-fns or similar
 */
export function formatDate(date: Date | string, format?: string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  if (!format) {
    return dateObj.toLocaleDateString();
  }

  // Simple format implementation - extend as needed
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');

  return format
    .replace('yyyy', String(year))
    .replace('MM', month)
    .replace('dd', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}
