import { useState, useEffect } from 'react';
import { useCategories, useMenuItems } from '../../hooks/useMenu';
import type { CartItem, MenuItem, MenuSelectionProps } from '../../types';
import { Button, Loader2, ShoppingCart, Card, CardContent } from '@repo/ui';
import { SearchBar, CategoryFilter } from './MenuFilters';
import { MenuItemCard } from './MenuItemCard';
import { CartReviewDialog } from '../dialogs/CartReviewDialog';

export function MenuSelection({
  onConfirm,
  isSubmitting,
  confirmLabel = 'Confirm',
  initialItems = [],
}: MenuSelectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>(initialItems);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { data: categories } = useCategories();
  const { data: allItems, isLoading: isLoadingItems } = useMenuItems(selectedCategory);

  // Sync initial items with menu data to populate prices
  useEffect(() => {
    if (initialItems.length > 0 && allItems?.content) {
      const syncedCart = initialItems.map((item) => {
        const menuItem = allItems.content?.find((mi: MenuItem) => mi.id === item.id);
        return menuItem && menuItem.price !== undefined
          ? { ...item, price: menuItem.price, name: menuItem.name || item.name }
          : item;
      });
      setCart(syncedCart);
    }
  }, [allItems?.content, initialItems]);

  // Filter items locally based on search query
  const filteredItems = allItems?.content?.filter((item: MenuItem) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.name?.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query)
    );
  });

  const handleAddToCart = (item: MenuItem) => {
    if (!item.id || item.price === undefined) return;

    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...prev,
        { id: item.id!, name: item.name || 'Unknown', price: item.price!, quantity: 1 },
      ];
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((i) => (i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i));
      }
      return prev.filter((i) => i.id !== itemId);
    });
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Search and Categories */}
      <div className="space-y-4 mb-4 p-1">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CategoryFilter
          categories={categories?.content || []}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Items Grid */}
      <div className="flex-1 overflow-y-auto pb-20">
        {isLoadingItems ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems?.map((item: MenuItem) => {
              const cartItem = cart.find((i) => i.id === item.id);
              return (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  cartItem={cartItem}
                  onAdd={handleAddToCart}
                  onRemove={handleRemoveFromCart}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Cart Summary / Floating Action Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 md:left-64 md:right-8 z-20">
          <Card
            className="bg-primary text-primary-foreground shadow-lg cursor-pointer hover:bg-primary/90 transition-colors"
            onClick={() => setIsCartOpen(true)}
          >
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-2 rounded-full">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold">{cart.reduce((acc, i) => acc + i.quantity, 0)} items</p>
                  <p className="text-sm opacity-90">${totalAmount.toFixed(2)}</p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirm(cart);
                }}
                disabled={isSubmitting}
                className="font-bold"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : confirmLabel}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cart Review Dialog */}
      <CartReviewDialog
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onAddQuantity={(id: string) => {
          const item = cart.find((i) => i.id === id);
          if (item) handleAddToCart({ id: item.id, price: item.price, name: item.name });
        }}
        onRemoveQuantity={handleRemoveFromCart}
        totalAmount={totalAmount}
      />
    </div>
  );
}
