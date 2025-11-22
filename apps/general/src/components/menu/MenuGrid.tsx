import { UtensilsCrossed } from '@repo/ui';
import { EmptyState } from '../EmptyState';
import { MenuItemCard } from '../MenuItemCard';
import type { components } from '@repo/api-client';

type MenuItemResponse = components['schemas']['MenuItemResponse'];

interface MenuGridProps {
  isLoading: boolean;
  items: MenuItemResponse[];
  onItemClick: (item: MenuItemResponse) => void;
  columns?: 'responsive' | 'mobile';
}

export function MenuGrid({ isLoading, items, onItemClick, columns = 'responsive' }: MenuGridProps) {
  if (isLoading) {
    return <p className="text-gray-600">Loading items...</p>;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={UtensilsCrossed}
        title="No Items Available"
        description="There are no items in this category yet."
      />
    );
  }

  const gridClass =
    columns === 'mobile'
      ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
      : 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6';

  return (
    <div className={gridClass}>
      {items.map((item) => (
        <MenuItemCard key={item.id} item={item} onClick={() => onItemClick(item)} />
      ))}
    </div>
  );
}
