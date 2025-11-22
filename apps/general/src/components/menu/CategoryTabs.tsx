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
    <Tabs
      value={selectedCategoryId || ''}
      onValueChange={onSelectCategory}
      className="w-full"
    >
      <TabsList className="w-full overflow-x-auto flex justify-start mb-6">
        {categories.map((category) => (
          <TabsTrigger key={category.id} value={category.id!}>
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
