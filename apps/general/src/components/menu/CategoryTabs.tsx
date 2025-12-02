import { Tabs, TabsList, TabsTrigger } from '@repo/ui';
import type { components } from '@repo/api-client';

type Category = components['schemas']['MenuCategoryResponse'];

interface CategoryTabsProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
}

export function CategoryTabs({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <Tabs value={selectedCategoryId || ''} onValueChange={onSelectCategory} className="w-full">
      <TabsList className="w-full overflow-x-auto flex justify-start mb-6 bg-amber-100 py-0 px-1">
        {categories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id!}
            className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
          >
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
