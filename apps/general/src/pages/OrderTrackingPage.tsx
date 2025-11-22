import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  ArrowLeft,
  AlertCircle,
} from '@repo/ui';
import { ORDER_STATUSES } from '../constants/order';
import { useOrderTracking } from '../hooks/useOrderTracking';
import { OrderStatusCard } from '../components/tracking/OrderStatusCard';
import { OrderTimeline } from '../components/tracking/OrderTimeline';
import { OrderEstimatedTime } from '../components/tracking/OrderEstimatedTime';
import { OrderCancellationReason } from '../components/tracking/OrderCancellationReason';

export function OrderTrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const { data, isLoading, error } = useOrderTracking(orderId);

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full border-amber-100">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">Loading order...</h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full border-amber-100">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
            <h2 className="text-2xl font-bold mb-2">Order not found</h2>
            <p className="text-gray-600 mb-6">
              {error instanceof Error ? error.message : 'Unable to load order details'}
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isCompleted =
    data?.status === ORDER_STATUSES.COMPLETED || data?.status === ORDER_STATUSES.CANCELLED;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4">
      <div className="max-w-3xl mx-auto py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-amber-700 hover:text-amber-800 hover:bg-amber-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
          Order Tracking
        </h1>
        <p className="text-gray-600 mb-8">Order ID: {orderId!}</p>

        <div className="space-y-6">
          <OrderStatusCard status={data.status} />

          <OrderEstimatedTime minutes={data.estimatedPreparationMinutes} />

          <OrderCancellationReason status={data.status} reason={data.cancellationReason} />

          <OrderTimeline status={data.status} />

          {/* Action Buttons */}
          {isCompleted && (
            <div className="flex gap-4">
              <Button
                onClick={() => navigate('/menu')}
                className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              >
                Order Again
              </Button>
              <Button onClick={() => navigate('/')} variant="outline" className="flex-1">
                Go Home
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
