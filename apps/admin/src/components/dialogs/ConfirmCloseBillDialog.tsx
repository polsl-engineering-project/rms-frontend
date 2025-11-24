import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from '@repo/ui';

interface ConfirmCloseBillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  billTableNumber?: number;
}

export function ConfirmCloseBillDialog({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  billTableNumber,
}: ConfirmCloseBillDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Close Bill?</DialogTitle>
          <DialogDescription>
            Are you sure you want to close the bill for Table {billTableNumber}? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Closing...' : 'Close Bill'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
