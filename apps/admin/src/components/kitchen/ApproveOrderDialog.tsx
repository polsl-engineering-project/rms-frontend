import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Label,
} from '@repo/ui';
import { useState } from 'react';

interface ApproveOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (estimatedMinutes: number) => void;
  isLoading?: boolean;
}

export function ApproveOrderDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: ApproveOrderDialogProps) {
  const [estimatedMinutes, setEstimatedMinutes] = useState(15);

  const handleConfirm = () => {
    onConfirm(estimatedMinutes);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Order</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="estimatedTime">Estimated Preparation Time (minutes)</Label>
            <Input
              type="number"
              id="estimatedTime"
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 0)}
              min={1}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? 'Confirming...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
