import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateBill } from '../hooks/useBills';
import { MenuSelection } from '../components/waiter/MenuSelection';
import type { CartItem } from '../types';
import { WaiterLayout } from '../components/waiter/WaiterLayout';
import { Input, Label, toast } from '@repo/ui';
import { useAuthStore } from '../stores/auth';

export function WaiterCreateBillPage() {
  const navigate = useNavigate();
  const { mutateAsync: createBill, isPending } = useCreateBill();
  const user = useAuthStore((state) => state.user);
  const [tableNumber, setTableNumber] = useState<number | ''>('');

  const handleCreateBill = async (cart: CartItem[]) => {
    if (!tableNumber) {
      toast.error('Please enter a table number');
      return;
    }

    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const response = await createBill({
        body: {
          tableNumber: Number(tableNumber),
          userId: user.id,
          initialLines: cart.map((item) => ({
            menuItemId: item.id,
            quantity: item.quantity,
          })),
        },
      });

      const bill = response as { id: string };
      const billId = bill.id;

      toast.success('Bill opened successfully');
      navigate(`/waiter/bill/${billId}`);
    } catch (error) {
      toast.error('Failed to open bill');
    }
  };

  return (
    <WaiterLayout showBack>
      <div className="flex flex-col h-[calc(100vh-100px)] gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <Label htmlFor="tableNumber" className="text-lg font-medium mb-2 block">
            Table Number
          </Label>
          <Input
            id="tableNumber"
            type="number"
            min="1"
            placeholder="Enter table number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value ? Number(e.target.value) : '')}
            className="text-lg h-12"
          />
        </div>

        <div className="flex-1 overflow-hidden">
          <MenuSelection
            onConfirm={handleCreateBill}
            isSubmitting={isPending}
            confirmLabel="Open Bill"
          />
        </div>
      </div>
    </WaiterLayout>
  );
}
