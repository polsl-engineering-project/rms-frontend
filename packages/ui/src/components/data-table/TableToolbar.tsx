import * as React from 'react';
import { Search, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import '../../styles/globals.css';

export type TableToolbarProps = {
  /** Search query value */
  searchQuery?: string;
  /** Callback when search query changes */
  onSearchChange?: (query: string) => void;
  /** Placeholder text for search input */
  searchPlaceholder?: string;
  /** Show info tooltip about search limitations */
  showSearchInfo?: boolean;
  /** Info message for search tooltip */
  searchInfoMessage?: string;
  /** Additional filter components */
  children?: React.ReactNode;
  /** Custom className */
  className?: string;
};

export function TableToolbar({
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  showSearchInfo = false,
  searchInfoMessage = 'For better search results, increase the page size to include more data.',
  children,
  className,
}: TableToolbarProps) {
  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <div className="flex flex-1 items-center gap-2">
        {onSearchChange && (
          <div className="relative flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-9 w-[200px] pl-8 lg:w-[300px]"
              />
            </div>
            {showSearchInfo && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={() => setShowTooltip(!showTooltip)}
                >
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Search info</span>
                </Button>
                {showTooltip && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-md border bg-popover p-3 text-sm text-popover-foreground shadow-md">
                    {searchInfoMessage}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
