import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import {
  cn,
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Input,
  Label,
} from '../../index';

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date?: Date) => void;
  placeholder?: string;
  className?: string;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  className,
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value);
  const [timeValue, setTimeValue] = React.useState<{ hours: string; minutes: string }>({
    hours: value ? format(value, 'HH') : '00',
    minutes: value ? format(value, 'mm') : '00',
  });

  React.useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setTimeValue({
        hours: format(value, 'HH'),
        minutes: format(value, 'mm'),
      });
    } else {
      setSelectedDate(undefined);
      setTimeValue({ hours: '00', minutes: '00' });
    }
  }, [value]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // On close, apply the changes
      if (selectedDate) {
        const newDate = new Date(selectedDate);
        const hours = parseInt(timeValue.hours, 10) || 0;
        const minutes = parseInt(timeValue.minutes, 10) || 0;
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        onChange?.(newDate);
      } else {
        onChange?.(undefined);
      }
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (type: 'hours' | 'minutes', val: string) => {
    setTimeValue((prev) => ({ ...prev, [type]: val }));
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'PPP HH:mm') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} initialFocus />
        <div className="p-3 border-t border-border">
          <div className="flex items-end gap-2">
            <div className="grid gap-1 text-center">
              <Label htmlFor="hours" className="text-xs">
                Hours
              </Label>
              <Input
                id="hours"
                className="w-16 text-center"
                value={timeValue.hours}
                onChange={(e) => handleTimeChange('hours', e.target.value)}
                maxLength={2}
              />
            </div>
            <span className="pb-2">:</span>
            <div className="grid gap-1 text-center">
              <Label htmlFor="minutes" className="text-xs">
                Minutes
              </Label>
              <Input
                id="minutes"
                className="w-16 text-center"
                value={timeValue.minutes}
                onChange={(e) => handleTimeChange('minutes', e.target.value)}
                maxLength={2}
              />
            </div>
            <div className="flex h-10 items-center justify-center ml-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
