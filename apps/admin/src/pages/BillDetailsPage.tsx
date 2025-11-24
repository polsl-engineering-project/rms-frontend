import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBill, useCloseBill, useRemoveItem } from '../hooks/useBills';
import { useAddItemsToBill } from '../hooks/useMenu';
import { WaiterLayout } from '../components/waiter/WaiterLayout';
import { Button, toast, Card, CardContent, Loader2, Plus, Trash2, Receipt, Minus } from '@repo/ui';
import { ConfirmCloseBillDialog } from '../components/dialogs/ConfirmCloseBillDialog';

export function BillDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isConfirmCloseOpen, setIsConfirmCloseOpen] = useState(false);
  const { data: bill, isLoading, error, refetch } = useBill(id!);
  const { mutateAsync: closeBill, isPending: isClosing } = useCloseBill();
  const { mutateAsync: removeItem, isPending: isRemoving } = useRemoveItem();
  const { mutateAsync: addItem, isPending: isAdding } = useAddItemsToBill();

  if (isLoading) {
    return (
      <WaiterLayout showBack>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </WaiterLayout>
    );
  }

  if (error || !bill) {
    return (
      <WaiterLayout showBack>
        <div className="text-center p-8 text-red-500">Failed to load bill details.</div>
      </WaiterLayout>
    );
  }

  const confirmCloseBill = async () => {
    if (!id) return;
    try {
      await closeBill({
        params: { path: { id } },
      });
      toast.success('Bill closed successfully');
      navigate('/waiter');
    } catch (e) {
      toast.error('Failed to close bill');
    } finally {
      setIsConfirmCloseOpen(false);
    }
  };

  const handleRemoveItem = async (menuItemId: string, quantity: number) => {
    if (!id) return;
    try {
      await removeItem({
        params: { path: { id } },
        body: {
          removedLines: [{ menuItemId, quantity }],
        },
      });
      toast.success('Item removed');
      await refetch();
    } catch (e) {
      toast.error('Failed to remove item');
    }
  };

  const handleAddItem = async (menuItemId: string, quantity: number) => {
    if (!id) return;
    try {
      await addItem({
        params: { path: { id } },
        body: {
          newLines: [{ menuItemId, quantity }],
        },
      });
      toast.success('Item added');
      await refetch();
    } catch (e) {
      toast.error('Failed to add item');
    }
  };

  const items = bill.billLines || [];

  return (
    <>
      <WaiterLayout showBack backPath="/waiter">
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
            <div>
              <p className="text-sm text-slate-500">Total Amount</p>
              <p className="text-3xl font-bold">${bill.totalAmount?.toFixed(2) || '0.00'}</p>
            </div>
            <Button onClick={() => navigate(`/waiter/bill/${id}/menu`)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Items
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              {items.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <Receipt className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No items in this bill yet.</p>
                </div>
              ) : (
                <ul className="divide-y">
                  {items.map((item, index) => (
                    <li key={index} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name || 'Unknown Item'}</p>
                        <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleRemoveItem(item.menuItemId!, 1)}
                            disabled={isRemoving || isAdding}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleAddItem(item.menuItemId!, 1)}
                            disabled={isRemoving || isAdding}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-50"
                          onClick={() => handleRemoveItem(item.menuItemId!, item.quantity!)}
                          disabled={isRemoving || isAdding}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <div className="pt-4">
            <Button
              className="w-full h-12 text-lg"
              variant="destructive"
              onClick={() => setIsConfirmCloseOpen(true)}
              disabled={isClosing || bill.status === 'CLOSED'}
            >
              {isClosing ? 'Closing...' : 'Close Bill & Pay'}
            </Button>
          </div>
        </div>
      </WaiterLayout>

      <ConfirmCloseBillDialog
        isOpen={isConfirmCloseOpen}
        onClose={() => setIsConfirmCloseOpen(false)}
        onConfirm={confirmCloseBill}
        isPending={isClosing}
        billTableNumber={bill?.tableNumber}
      />
    </>
  );
}
