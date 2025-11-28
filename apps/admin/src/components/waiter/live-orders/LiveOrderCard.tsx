import {
  Card,
  CardContent,
  Badge,
  toast,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Clock,
  MapPin,
  User,
  ShoppingBag,
  Check,
  X,
  ChefHat,
  Truck,
  Eye,
  DropdownMenuSeparator,
  Package,
} from '@repo/ui';
import { OrderDetailsResponse } from '../../../types/orders-ws';
import { fetchClient } from '../../../api/client';
import { useState } from 'react';
import { OrderDetailsDialog } from './OrderDetailsDialog';
import { ApproveOrderDialog } from '../../orders/ApproveOrderDialog';

interface LiveOrderCardProps {
  order: OrderDetailsResponse;
}
export function LiveOrderCard({ order }: LiveOrderCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);

  const handleApprove = async (estimatedMinutes: number) => {
    setIsLoading(true);
    try {
      const response = await fetchClient.POST('/api/v1/orders/{id}/approve', {
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

  const handleAction = async (
    action: 'approve' | 'cancel' | 'ready' | 'complete' | 'start-delivery'
  ) => {
    setIsLoading(true);
    try {
      let response;
      switch (action) {
        case 'approve':
          setIsApproveDialogOpen(true);
          setIsLoading(false);
          return;
        case 'cancel':
          response = await fetchClient.POST('/api/v1/orders/{id}/cancel', {
            params: { path: { id: order.id } },
            body: { reason: 'Rejected by waiter' },
          });
          break;
        case 'ready':
          response = await fetchClient.POST('/api/v1/orders/{id}/ready', {
            params: { path: { id: order.id } },
          });
          break;
        case 'complete':
          response = await fetchClient.POST('/api/v1/orders/{id}/complete', {
            params: { path: { id: order.id } },
          });
          break;
        case 'start-delivery':
          response = await fetchClient.POST('/api/v1/orders/{id}/start-delivery', {
            params: { path: { id: order.id } },
          });
          break;
      }

      if (response?.error) {
        toast.error('Failed to update order');
      } else {
        toast.success('Order updated successfully');
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
      case 'PLACED':
      case 'DELIVERY_ORDER_PLACED':
      case 'PICK_UP_ORDER_PLACED':
      case 'PENDING_APPROVAL':
        return 'bg-blue-500';
      case 'APPROVED_BY_FRONT_DESK':
        return 'bg-indigo-500';
      case 'APPROVED_BY_KITCHEN':
      case 'APPROVED':
        return 'bg-orange-500';
      case 'READY_FOR_PICKUP':
      case 'READY_FOR_DRIVER':
        return 'bg-green-500';
      case 'DELIVERY_STARTED':
        return 'bg-purple-500';
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

  const renderMenuContent = () => {
    const isPlaced = [
      'PLACED',
      'DELIVERY_ORDER_PLACED',
      'PICK_UP_ORDER_PLACED',
      'PENDING_APPROVAL',
    ].includes(order.status);
    const hasActions = [
      'PLACED',
      'DELIVERY_ORDER_PLACED',
      'PICK_UP_ORDER_PLACED',
      'PENDING_APPROVAL',
      'APPROVED_BY_FRONT_DESK',
      'APPROVED_BY_KITCHEN',
      'APPROVED',
      'READY_FOR_PICKUP',
      'READY_FOR_DRIVER',
      'DELIVERY_STARTED',
    ].includes(order.status);

    return (
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => setIsDetailsOpen(true)}>
          <Eye className="w-4 h-4 mr-2" /> View Details
        </DropdownMenuItem>

        {hasActions && <DropdownMenuSeparator />}

        {isPlaced && (
          <>
            <DropdownMenuItem onClick={() => handleAction('approve')}>
              <Check className="w-4 h-4 mr-2 text-green-600" /> Accept Order
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleAction('cancel')}
              className="text-destructive focus:text-destructive"
            >
              <X className="w-4 h-4 mr-2" /> Reject Order
            </DropdownMenuItem>
          </>
        )}
        {order.status === 'APPROVED_BY_FRONT_DESK' && (
          <DropdownMenuItem
            onClick={() => handleAction('cancel')}
            className="text-destructive focus:text-destructive"
          >
            <X className="w-4 h-4 mr-2" /> Reject Order
          </DropdownMenuItem>
        )}
        {(order.status === 'APPROVED_BY_KITCHEN' || order.status === 'APPROVED') && (
          <DropdownMenuItem onClick={() => handleAction('ready')}>
            <ChefHat className="w-4 h-4 mr-2 text-orange-500" /> Mark Ready
          </DropdownMenuItem>
        )}
        {order.status === 'READY_FOR_PICKUP' && (
          <DropdownMenuItem onClick={() => handleAction('complete')}>
            <Check className="w-4 h-4 mr-2 text-green-600" /> Complete Order
          </DropdownMenuItem>
        )}
        {order.status === 'READY_FOR_DRIVER' && (
          <DropdownMenuItem onClick={() => handleAction('start-delivery')}>
            <Truck className="w-4 h-4 mr-2 text-purple-600" /> Start Delivery
          </DropdownMenuItem>
        )}
        {order.status === 'DELIVERY_STARTED' && (
          <DropdownMenuItem onClick={() => handleAction('complete')}>
            <Check className="w-4 h-4 mr-2 text-green-600" /> Complete Order
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Card
            className={`w-full h-full flex flex-col cursor-pointer hover:border-primary/50 transition-colors active:scale-95 transform duration-100 ${
              isLoading ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <CardContent className="p-4 h-full flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col gap-1 items-start">
                  <Badge className={`${getStatusColor(order.status)} text-white border-0`}>
                    {order.status === 'APPROVED_BY_FRONT_DESK'
                      ? 'PRE-APPROVED'
                      : order.status.replace(/_/g, ' ')}
                  </Badge>
                  {order.address ? (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Truck className="w-3 h-3 mr-1" /> Delivery
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-orange-50 text-orange-700 border-orange-200"
                    >
                      <Package className="w-3 h-3 mr-1" /> Pickup
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center text-slate-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTime(order.scheduledFor)}
                  </div>
                  <span className="text-xs text-slate-400 mt-0.5" title={order.id}>
                    #{order.id.substring(0, 8)}
                  </span>
                </div>
              </div>
              <div className="text-lg font-semibold truncate mb-3">
                {order.customerInfo.firstName} {order.customerInfo.lastName}
              </div>

              <div className="flex-1 flex flex-col gap-3 text-sm">
                <div className="flex items-start gap-2 text-slate-600">
                  <User className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{order.customerInfo.phoneNumber}</span>
                </div>

                {order.address && (
                  <div className="flex items-start gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">
                      {order.address.street} {order.address.houseNumber}
                      {order.address.apartmentNumber
                        ? `/${order.address.apartmentNumber}`
                        : ''}, {order.address.city}
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-2 text-slate-600 mt-auto pt-2">
                  <ShoppingBag className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="font-medium">
                    {order.orderLines.reduce((acc, line) => acc + (line.quantity || 0), 0)} items
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </DropdownMenuTrigger>
        {renderMenuContent()}
      </DropdownMenu>

      <OrderDetailsDialog
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        order={order}
      />

      <ApproveOrderDialog
        isOpen={isApproveDialogOpen}
        onClose={() => setIsApproveDialogOpen(false)}
        onConfirm={handleApprove}
        isLoading={isLoading}
        scheduledFor={order.scheduledFor}
        placedAt={order.placedAt}
      />
    </>
  );
}
