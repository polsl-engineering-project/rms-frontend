import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { components } from '@repo/api-client';
import { Button, Badge, ShoppingCart, Package } from '@repo/ui';
import { useCartStore } from '../stores/cart';
import { ItemDetailDialog } from '../components/ItemDetailDialog';
import { EmptyState } from '../components/EmptyState';
import { useMenu } from '../hooks/useMenu';
import { CategorySidebar } from '../components/menu/CategorySidebar';
import { MenuGrid } from '../components/menu/MenuGrid';
import { CategoryTabs } from '../components/menu/CategoryTabs';

type MenuItemResponse = components['schemas']['MenuItemResponse'];

export function MenuPage() {
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItemResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const cartItemCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  const { categoriesLoading, itemsLoading, activeCategories, menuItems } =
    useMenu(selectedCategoryId);

  useEffect(() => {
    if (activeCategories.length > 0 && !selectedCategoryId) {
      const firstActiveCategory = activeCategories[0];
      if (firstActiveCategory?.id) {
        setSelectedCategoryId(firstActiveCategory.id);
      }
    }
  }, [activeCategories, selectedCategoryId]);

  const handleItemClick = (item: MenuItemResponse) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  if (categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading menu...</p>
      </div>
    );
  }

  if (activeCategories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          icon={Package}
          title="No Categories Available"
          description="There are no menu categories available at this time."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Header with Cart */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
              Our Menu
            </h1>
            <Button
              variant="outline"
              className="relative border-amber-300 hover:bg-amber-50"
              onClick={() => navigate('/order')}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart
              {cartItemCount > 0 && (
                <Badge className="ml-2 px-2 bg-amber-600 text-white hover:bg-amber-600 hover:text-white cursor-default">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Desktop: Sidebar Layout */}
        <div className="hidden md:flex gap-8">
          <CategorySidebar
            categories={activeCategories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />

          {/* Items Grid */}
          <div className="flex-1">
            <MenuGrid isLoading={itemsLoading} items={menuItems} onItemClick={handleItemClick} />
          </div>
        </div>

        {/* Mobile: Tabs Layout */}
        <div className="md:hidden">
          <CategoryTabs
            categories={activeCategories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />

          {/* Items Grid */}
          <MenuGrid
            isLoading={itemsLoading}
            items={menuItems}
            onItemClick={handleItemClick}
            columns="mobile"
          />
        </div>
      </div>

      {/* Item Detail Dialog */}
      <ItemDetailDialog item={selectedItem} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
