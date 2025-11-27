import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { cn } from '../../lib/utils';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [hours, setHours] = React.useState<string>('12');
  const [minutes, setMinutes] = React.useState<string>('00');

  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      if (h) setHours(h);
      if (m) setMinutes(m);
    }
  }, [value]);

  const handleHourChange = (newHour: string) => {
    setHours(newHour);
    onChange(`${newHour}:${minutes}`);
  };

  const handleMinuteChange = (newMinute: string) => {
    setMinutes(newMinute);
    onChange(`${hours}:${newMinute}`);
  };

  const hoursOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutesOptions = Array.from({ length: 4 }, (_, i) => (i * 15).toString().padStart(2, '0'));

  return (
    <div className={cn('flex items-center border rounded-md bg-white px-3 py-1 w-fit', className)}>
      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
      <div className="flex items-center gap-1">
        <Select value={hours} onValueChange={handleHourChange}>
          <SelectTrigger
            id="hours"
            className="w-[60px] border-0 focus:ring-0 px-1 h-8 text-center font-mono shadow-none"
          >
            <SelectValue placeholder="HH" />
          </SelectTrigger>
          <SelectContent position="popper" className="max-h-[200px] min-w-[60px]">
            {hoursOptions.map((hour) => (
              <SelectItem key={hour} value={hour} className="justify-center">
                {hour}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-muted-foreground font-semibold">:</span>
        <Select value={minutes} onValueChange={handleMinuteChange}>
          <SelectTrigger
            id="minutes"
            className="w-[60px] border-0 focus:ring-0 px-1 h-8 text-center font-mono shadow-none"
          >
            <SelectValue placeholder="MM" />
          </SelectTrigger>
          <SelectContent position="popper" className="min-w-[60px]">
            {minutesOptions.map((minute) => (
              <SelectItem key={minute} value={minute} className="justify-center">
                {minute}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
