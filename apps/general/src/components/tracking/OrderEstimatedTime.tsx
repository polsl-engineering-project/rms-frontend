import { Card, CardContent, Clock } from '@repo/ui';

interface OrderEstimatedTimeProps {
  approvedAt?: string;
  minutes?: number;
}

export function OrderEstimatedTime({ approvedAt, minutes }: OrderEstimatedTimeProps) {
  if (!approvedAt || !minutes) return null;

  const getEstimatedTime = () => {
    // Ensure the date is treated as UTC if no timezone is specified
    const dateStr = approvedAt.endsWith('Z') ? approvedAt : `${approvedAt}Z`;
    const date = new Date(dateStr);
    date.setMinutes(date.getMinutes() + minutes);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="border-amber-100 bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Estimated Ready Time</p>
            <p className="text-2xl font-bold text-amber-700">{getEstimatedTime()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
