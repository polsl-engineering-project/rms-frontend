import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ArrowLeft,
  Clock,
  AlertCircle,
} from '@repo/ui';
import { fetchClient } from '../api/client';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { ORDER_STATUSES } from '../constants/order';

export function OrderTrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [pollingInterval, setPollingInterval] = useState(3000); // Start with 3 seconds

  const { data, isLoading, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) throw new Error('Order ID is required');

      const response = await fetchClient.GET('/api/v1/orders/{id}/customer-view', {
        params: { path: { id: orderId } },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch order');
      }

      return response.data;
    },
    enabled: !!orderId,
    refetchInterval: pollingInterval,
  });

  // Adjust polling based on order status
  useEffect(() => {
    if (data?.status) {
      if (data.status === ORDER_STATUSES.PLACED) {
        // Poll aggressively while waiting for acceptance
        setPollingInterval(3000); // 3 seconds
      } else if (data.status === ORDER_STATUSES.ACCEPTED) {
        // Slow down polling after acceptance
        setPollingInterval(30000); // 30 seconds
      } else if (
        data.status === ORDER_STATUSES.COMPLETED ||
        data.status === ORDER_STATUSES.CANCELLED
      ) {
        // Stop polling for terminal states
        setPollingInterval(0);
      } else {
        // Moderate polling for other states
        setPollingInterval(15000); // 15 seconds
      }
    }
  }, [data?.status]);

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
          {/* Order Status Card */}
          <Card className="border-amber-100 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Current Status</span>
                <OrderStatusBadge status={data.status!} />
              </div>

              {!isCompleted && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-pulse flex items-center gap-2 text-amber-700">
                    <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    ></div>
                    <span className="ml-2 text-sm">Updating live...</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estimated Time Card */}
          {data.estimatedPreparationMinutes !== null &&
            data.estimatedPreparationMinutes !== undefined && (
              <Card className="border-amber-100 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estimated Preparation Time</p>
                      <p className="text-2xl font-bold text-amber-700">
                        {data.estimatedPreparationMinutes} minutes
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Cancellation Reason Card */}
          {data.status === ORDER_STATUSES.CANCELLED && data.cancellationReason && (
            <Card className="border-red-200 bg-red-50/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-red-900">Cancellation Reason</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-800">{data.cancellationReason}</p>
              </CardContent>
            </Card>
          )}

          {/* Order Progress Timeline */}
          <Card className="border-amber-100 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Order Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { status: ORDER_STATUSES.PLACED, label: 'Order Placed' },
                  { status: ORDER_STATUSES.ACCEPTED, label: 'Order Accepted' },
                  { status: ORDER_STATUSES.READY, label: 'Order Ready' },
                  data.status === ORDER_STATUSES.IN_DELIVERY
                    ? { status: ORDER_STATUSES.IN_DELIVERY, label: 'Out for Delivery' }
                    : null,
                  { status: ORDER_STATUSES.COMPLETED, label: 'Order Completed' },
                ]
                  .filter(Boolean)
                  .map((stage, _index, _arr) => {
                    if (!stage) return null;

                    const statusOrder = [
                      ORDER_STATUSES.PLACED,
                      ORDER_STATUSES.ACCEPTED,
                      ORDER_STATUSES.READY,
                      ORDER_STATUSES.IN_DELIVERY,
                      ORDER_STATUSES.COMPLETED,
                    ];

                    const currentIndex = statusOrder.indexOf(
                      data.status as (typeof statusOrder)[number]
                    );
                    const stageIndex = statusOrder.indexOf(
                      stage.status as (typeof statusOrder)[number]
                    );
                    const isActive = stageIndex <= currentIndex;
                    const isCurrent = stage.status === data.status;

                    return (
                      <div key={stage.status} className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                            isActive
                              ? 'bg-amber-600 border-amber-600 text-white'
                              : 'bg-white border-gray-300 text-gray-400'
                          }`}
                        >
                          {isActive && '✓'}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              isCurrent
                                ? 'text-amber-700'
                                : isActive
                                  ? 'text-gray-900'
                                  : 'text-gray-400'
                            }`}
                          >
                            {stage.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

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
