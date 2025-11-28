import { Button, cn } from '@repo/ui';
import { X, RefreshCw } from 'lucide-react';
import { ReactNode } from 'react';

interface FilterToolbarProps {
  onClear: () => void;
  onRefresh: () => void;
  children: ReactNode;
  className?: string;
}

export function FilterToolbar({ onClear, onRefresh, children, className }: FilterToolbarProps) {
  return (
    <div className={cn('flex flex-wrap items-end gap-2', className)}>
      {children}
      <Button
        variant="outline"
        size="icon"
        onClick={onRefresh}
        title="Refresh"
        className="shrink-0"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onClear}
        title="Clear Filters"
        className="shrink-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
