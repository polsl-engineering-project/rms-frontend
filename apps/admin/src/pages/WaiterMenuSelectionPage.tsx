import { useParams, useNavigate } from 'react-router-dom';
import { useBill, useRemoveItem } from '../hooks/useBills';
import { useAddItemsToBill } from '../hooks/useMenu';
import { WaiterLayout } from '../components/waiter/WaiterLayout';
import { MenuSelection } from '../components/waiter/MenuSelection';
import type { CartItem } from '../types';
import { toast, Loader2 } from '@repo/ui';
import { queryClient } from '../lib/queryClient';

export function WaiterMenuSelectionPage() {
  const { id: billId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: bill, isLoading } = useBill(billId!);
  const { mutateAsync: addItems, isPending: isAdding } = useAddItemsToBill();
  const { mutateAsync: removeItems, isPending: isRemoving } = useRemoveItem();

  const handleConfirmOrder = async (newCart: CartItem[]) => {
    if (!billId) return;

    try {
      // Get initial items from bill
      const initialItems: CartItem[] =
        bill?.billLines?.map((line) => ({
          id: line.menuItemId!,
          name: line.name || 'Unknown',
          price: 0, // Price not available in BillLineResponse
          quantity: line.quantity || 0,
        })) || [];

      // Calculate items to remove (completely removed OR decreased quantity)
      const itemsToRemove: Array<{ menuItemId: string; quantity: number }> = [];

      initialItems.forEach((initialItem) => {
        const newItem = newCart.find((item) => item.id === initialItem.id);
        if (!newItem) {
          // Item completely removed
          itemsToRemove.push({
            menuItemId: initialItem.id,
            quantity: initialItem.quantity,
          });
        } else if (newItem.quantity < initialItem.quantity) {
          // Quantity decreased - remove the difference
          itemsToRemove.push({
            menuItemId: initialItem.id,
            quantity: initialItem.quantity - newItem.quantity,
          });
        }
      });

      // Calculate items to add (new items OR increased quantity)
      const itemsToAdd: Array<{ menuItemId: string; quantity: number }> = [];

      newCart.forEach((item) => {
        const initialItem = initialItems.find((i) => i.id === item.id);
        if (!initialItem) {
          // New item - add full quantity
          itemsToAdd.push({
            menuItemId: item.id,
            quantity: item.quantity,
          });
        } else if (item.quantity > initialItem.quantity) {
          // Increased quantity - add only the difference
          itemsToAdd.push({
            menuItemId: item.id,
            quantity: item.quantity - initialItem.quantity,
          });
        }
      });

      // First, add items if any
      if (itemsToAdd.length > 0) {
        await addItems({
          params: { path: { id: billId } },
          body: {
            newLines: itemsToAdd,
          },
        });
        queryClient.invalidateQueries({
          queryKey: ['get', '/api/v1/bills/{id}', { params: { path: { id: billId } } }],
        });
      }

      // Then, remove items if any
      if (itemsToRemove.length > 0) {
        await removeItems({
          params: { path: { id: billId } },
          body: {
            removedLines: itemsToRemove,
          },
        });
        queryClient.invalidateQueries({
          queryKey: ['get', '/api/v1/bills/{id}', { params: { path: { id: billId } } }],
        });
      }

      if (itemsToRemove.length > 0 || itemsToAdd.length > 0) {
        toast.success('Bill updated successfully');
      }
      navigate(`/waiter/bill/${billId}`);
    } catch (error) {
      toast.error('Failed to update bill');
    }
  };

  if (isLoading) {
    return (
      <WaiterLayout showBack>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </WaiterLayout>
    );
  }

  const initialCartItems: CartItem[] =
    bill?.billLines?.map((line) => ({
      id: line.menuItemId!,
      name: line.name || 'Unknown',
      price: 0, // Price not available in BillLineResponse, will be populated by MenuSelection
      quantity: line.quantity || 0,
    })) || [];

  return (
    <WaiterLayout showBack backPath={`/waiter/bill/${billId}`}>
      <div className="h-[calc(100vh-100px)]">
        <MenuSelection
          onConfirm={handleConfirmOrder}
          isSubmitting={isAdding || isRemoving}
          confirmLabel="Update Bill"
          initialItems={initialCartItems}
        />
      </div>
    </WaiterLayout>
  );
}
