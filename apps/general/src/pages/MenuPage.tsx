import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { components } from '@repo/api-client';
import {
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  ShoppingCart,
  Package,
  UtensilsCrossed,
} from '@repo/ui';
import { fetchClient } from '../api/client';
import { useCartStore } from '../stores/cart';
import { MenuItemCard } from '../components/MenuItemCard';
import { ItemDetailDialog } from '../components/ItemDetailDialog';
import { EmptyState } from '../components/EmptyState';

type MenuItemResponse = components['schemas']['MenuItemResponse'];

export function MenuPage() {
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItemResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const cartItemCount = getTotalItems();

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await fetchClient.GET('/api/v1/menu/category', {
        params: {
          query: {
            page: 0,
            size: 100,
          },
        },
      });
      if (error) throw new Error('Failed to fetch categories');
      return data;
    },
  });

  useEffect(() => {
    if (categoriesData?.content && !selectedCategoryId) {
      const firstActiveCategory = categoriesData.content.find((cat) => cat.active);
      if (firstActiveCategory?.id) {
        setSelectedCategoryId(firstActiveCategory.id);
      }
    }
  }, [categoriesData, selectedCategoryId]);

  const { data: itemsData, isLoading: itemsLoading } = useQuery({
    queryKey: ['menuItems', selectedCategoryId],
    queryFn: async () => {
      const { data, error } = await fetchClient.GET('/api/v1/menu/item', {
        params: {
          query: {
            page: 0,
            size: 100,
          },
        },
      });
      if (error) throw new Error('Failed to fetch menu items');
      return data;
    },
    enabled: !!selectedCategoryId,
  });

  const activeCategories = categoriesData?.content?.filter((cat) => cat.active) || [];
  const menuItems =
    itemsData?.content?.filter((item) => item.categoryId === selectedCategoryId) || [];

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
                <Badge className="ml-2 px-2 bg-amber-600">{cartItemCount}</Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Desktop: Sidebar Layout */}
        <div className="hidden md:flex gap-8">
          {/* Categories Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-amber-100 p-4 sticky top-24">
              <h2 className="font-semibold mb-4 text-gray-900">Categories</h2>
              <nav className="space-y-2">
                {activeCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategoryId(category.id!)}
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

          {/* Items Grid */}
          <div className="flex-1">
            {itemsLoading ? (
              <p className="text-gray-600">Loading items...</p>
            ) : menuItems.length === 0 ? (
              <EmptyState
                icon={UtensilsCrossed}
                title="No Items Available"
                description="There are no items in this category yet."
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile: Tabs Layout */}
        <div className="md:hidden">
          <Tabs
            value={selectedCategoryId || ''}
            onValueChange={setSelectedCategoryId}
            className="w-full"
          >
            <TabsList className="w-full overflow-x-auto flex justify-start mb-6">
              {activeCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id!}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Items Grid */}
          {itemsLoading ? (
            <p className="text-gray-600">Loading items...</p>
          ) : menuItems.length === 0 ? (
            <EmptyState
              icon={UtensilsCrossed}
              title="No Items Available"
              description="There are no items in this category yet."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <MenuItemCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Item Detail Dialog */}
      <ItemDetailDialog item={selectedItem} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
