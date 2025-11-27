import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from '@repo/ui';
import { useEffect, useState } from 'react';

interface SessionExpiryDialogProps {
  isOpen: boolean;
  timeUntilExpiry: number; // in milliseconds
  onRefresh: () => void;
  onLogout: () => void;
  isRefreshing: boolean;
}

export function SessionExpiryDialog({
  isOpen,
  timeUntilExpiry,
  onRefresh,
  onLogout,
  isRefreshing,
}: SessionExpiryDialogProps) {
  const [timeLeft, setTimeLeft] = useState(timeUntilExpiry);

  // Update the countdown every second
  useEffect(() => {
    if (!isOpen) return;

    setTimeLeft(timeUntilExpiry);

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isOpen, timeUntilExpiry]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Session Expiring Soon</DialogTitle>
          <DialogDescription>
            Your session will expire in {minutes}:{seconds.toString().padStart(2, '0')}. Please
            refresh your session to continue working.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onLogout}
            disabled={isRefreshing}
            className="w-full sm:w-auto"
          >
            Logout
          </Button>
          <Button onClick={onRefresh} disabled={isRefreshing} className="w-full sm:w-auto">
            {isRefreshing ? 'Refreshing...' : 'Refresh Session'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
