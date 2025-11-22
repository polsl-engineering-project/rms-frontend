import { Card, CardContent, Clock } from '@repo/ui';

interface OrderEstimatedTimeProps {
  minutes: number | null | undefined;
}

export function OrderEstimatedTime({ minutes }: OrderEstimatedTimeProps) {
  if (minutes === null || minutes === undefined) return null;

  return (
    <Card className="border-amber-100 bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Estimated Preparation Time</p>
            <p className="text-2xl font-bold text-amber-700">{minutes} minutes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
