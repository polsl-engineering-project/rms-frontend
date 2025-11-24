import { useState } from 'react';
import { useCreateBill } from '../../hooks/useBills';
import { useAuthStore } from '../../stores/auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Label,
  toast,
} from '@repo/ui';
import { useNavigate } from 'react-router-dom';

interface CreateBillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBillDialog({ open, onOpenChange }: CreateBillDialogProps) {
  const [tableNumber, setTableNumber] = useState('');
  const { mutateAsync: createBill, isPending } = useCreateBill();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber || !user?.id) return;

    try {
      const result = await createBill({
        body: {
          tableNumber: parseInt(tableNumber, 10),
          userId: user.id,
          initialLines: [],
        },
      });

      toast.success('Bill created successfully');
      onOpenChange(false);
      setTableNumber('');

      if (result?.id) {
        navigate(`/waiter/orders/${result.id}`);
      }
    } catch (error) {
      // Error is handled by the mutation or global handler usually, but we can add specific handling here
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Open New Bill</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tableNumber">Table Number</Label>
            <Input
              id="tableNumber"
              type="number"
              min="1"
              placeholder="Enter table number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !tableNumber}>
              {isPending ? 'Creating...' : 'Create Bill'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
