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
  scheduledFor?: string | null;
  placedAt?: string;
}

export function ApproveOrderDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  scheduledFor,
  placedAt,
}: ApproveOrderDialogProps) {
  const [estimatedMinutes, setEstimatedMinutes] = useState(15);

  const handleMatchScheduledTime = () => {
    if (!scheduledFor) return;
    const now = new Date();
    let scheduledTime: Date | null = null;

    // Handle full ISO string
    if (scheduledFor.includes('T')) {
      scheduledTime = new Date(scheduledFor);
    }
    // Handle time-only string (e.g. "12:00:00")
    else if (scheduledFor.includes(':')) {
      const [hours, minutes] = scheduledFor.split(':').map(Number);
      if (!isNaN(hours) && !isNaN(minutes)) {
        // Use placedAt date if available, otherwise use today
        scheduledTime = placedAt ? new Date(placedAt) : new Date();
        scheduledTime.setHours(hours, minutes, 0, 0);
      }
    }

    if (!scheduledTime || isNaN(scheduledTime.getTime())) return;

    const diffMs = scheduledTime.getTime() - now.getTime();
    const diffMins = Math.max(1, Math.ceil(diffMs / (1000 * 60)));
    setEstimatedMinutes(diffMins);
  };

  const handleConfirm = () => {
    onConfirm(estimatedMinutes);
  };

  const PRESET_TIMES = [15, 30, 45, 60, 75, 90];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Approve Order & Set Time</DialogTitle>
        </DialogHeader>
        <div className="py-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Quick Select Time</Label>
            <div className="grid grid-cols-3 gap-3">
              {PRESET_TIMES.map((time) => (
                <Button
                  key={time}
                  variant={estimatedMinutes === time ? 'default' : 'outline'}
                  onClick={() => setEstimatedMinutes(time)}
                  className={`h-12 ${
                    estimatedMinutes === time ? 'bg-indigo-600 hover:bg-indigo-700' : ''
                  }`}
                >
                  {time} min
                </Button>
              ))}
            </div>
          </div>

          {scheduledFor && (
            <Button
              variant="outline"
              onClick={handleMatchScheduledTime}
              className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            >
              Match Scheduled Time
            </Button>
          )}

          <div className="space-y-3">
            <Label htmlFor="estimatedTime" className="text-sm font-medium text-gray-700">
              Manual Entry (minutes)
            </Label>
            <Input
              type="number"
              id="estimatedTime"
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 0)}
              min={1}
              className="h-12 text-lg"
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-between gap-4">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
          >
            {isLoading ? 'Confirming...' : 'Approve Order'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
