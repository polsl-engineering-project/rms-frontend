import { Button, Input, X } from '@repo/ui';
import type { Category } from '../../types';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Input
        placeholder="Search items..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 text-lg pr-12"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
  onSelectCategory: (categoryId?: string) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <Button
        variant={!selectedCategory ? 'default' : 'outline'}
        onClick={() => onSelectCategory(undefined)}
        className="whitespace-nowrap"
      >
        All
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant={selectedCategory === cat.id ? 'default' : 'outline'}
          onClick={() => onSelectCategory(cat.id)}
          className="whitespace-nowrap"
        >
          {cat.name}
        </Button>
      ))}
    </div>
  );
}
