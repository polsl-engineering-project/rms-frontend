import {
  Card,
  CardContent,
  Badge,
  toast,
  Clock,
  ShoppingBag,
  ChefHat,
  Check,
  Button,
} from '@repo/ui';
import { OrderDetailsResponse } from '../../types/orders-ws';
import { fetchClient } from '../../api/client';
import { useState } from 'react';
import { ApproveOrderDialog } from './ApproveOrderDialog';

interface KitchenOrderCardProps {
  order: OrderDetailsResponse;
}

export function KitchenOrderCard({ order }: KitchenOrderCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);

  const handleApprove = async (estimatedMinutes: number) => {
    setIsLoading(true);
    try {
      const response = await fetchClient.POST('/api/v1/orders/{id}/approve/kitchen', {
        params: { path: { id: order.id } },
        body: { estimatedPreparationMinutes: estimatedMinutes },
      });

      if (response?.error) {
        toast.error('Failed to approve order');
      } else {
        toast.success('Order approved successfully');
        setIsApproveDialogOpen(false);
      }
    } catch (error) {
      console.error('Action failed', error);
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReady = async () => {
    setIsLoading(true);
    try {
      const response = await fetchClient.POST('/api/v1/orders/{id}/ready', {
        params: { path: { id: order.id } },
      });

      if (response?.error) {
        toast.error('Failed to mark order as ready');
      } else {
        toast.success('Order marked as ready');
      }
    } catch (error) {
      console.error('Action failed', error);
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED_BY_FRONT_DESK':
        return 'bg-indigo-500';
      case 'APPROVED_BY_KITCHEN':
      case 'CONFIRMED':
        return 'bg-orange-500';
      case 'MARKED_AS_READY':
        return 'bg-green-500';
      default:
        return 'bg-slate-500';
    }
  };

  const formatTime = (timeString?: string | null) => {
    if (!timeString) return 'ASAP';
    if (timeString.includes('T')) {
      return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return timeString.substring(0, 5);
  };

  return (
    <>
      <Card
        className={`w-full h-full flex flex-col hover:border-primary/50 transition-colors ${
          isLoading ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <CardContent className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <Badge className={`${getStatusColor(order.status)} text-white border-0`}>
              {order.status === 'APPROVED_BY_FRONT_DESK'
                ? 'PRE-APPROVED'
                : order.status.replace(/_/g, ' ')}
            </Badge>
            <div className="flex flex-col items-end">
              <div className="flex items-center text-slate-500 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {formatTime(order.scheduledFor)}
              </div>
              {order.estimatedPreparationTimeMinutes && (
                <div className="text-xs font-medium text-orange-600">
                  Prep: {order.estimatedPreparationTimeMinutes}m
                </div>
              )}
            </div>
          </div>
          <div className="text-lg font-semibold truncate mb-3">#{order.id.substring(0, 8)}</div>

          <div className="flex-1 flex flex-col gap-3 text-sm">
            <div className="flex items-start gap-2 text-slate-600">
              <ShoppingBag className="w-4 h-4 mt-0.5 shrink-0" />
              <div className="flex flex-col w-full">
                {order.orderLines.map((line, index) => (
                  <div key={index} className="flex justify-between w-full">
                    <span>
                      {line.quantity}x {line.name || 'Unknown Item'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
            {order.status === 'APPROVED_BY_FRONT_DESK' && (
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600"
                onClick={() => setIsApproveDialogOpen(true)}
              >
                <ChefHat className="w-4 h-4 mr-2" /> Start Cooking
              </Button>
            )}
            {(order.status === 'APPROVED_BY_KITCHEN' || order.status === 'CONFIRMED') && (
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleReady}>
                <Check className="w-4 h-4 mr-2" /> Mark Ready
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <ApproveOrderDialog
        isOpen={isApproveDialogOpen}
        onClose={() => setIsApproveDialogOpen(false)}
        onConfirm={handleApprove}
        isLoading={isLoading}
      />
    </>
  );
}
