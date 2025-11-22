import type { components } from '@repo/api-client';

type Category = components['schemas']['MenuCategoryResponse'];

interface CategorySidebarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
}

export function CategorySidebar({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategorySidebarProps) {
  return (
    <div className="w-64 flex-shrink-0">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-amber-100 p-4 sticky top-24">
        <h2 className="font-semibold mb-4 text-gray-900">Categories</h2>
        <nav className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id!)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedCategoryId === category.id
                  ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 font-medium shadow-sm'
                  : 'hover:bg-amber-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
