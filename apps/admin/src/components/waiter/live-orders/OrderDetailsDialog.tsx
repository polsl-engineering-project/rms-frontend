import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Badge,
  ScrollArea,
  User,
  MapPin,
  Clock,
  ShoppingBag,
} from '@repo/ui';
import { Phone } from 'lucide-react';
import { OrderDetailsResponse } from '../../../types/orders-ws';

interface OrderDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderDetailsResponse;
}

export function OrderDetailsDialog({ isOpen, onClose, order }: OrderDetailsDialogProps) {
  const formatTime = (timeString?: string | null) => {
    if (!timeString) return 'ASAP';
    if (timeString.includes('T')) {
      return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return timeString.substring(0, 5);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 pr-8">
            <span>Order Details</span>
            <Badge variant="outline" className="font-mono text-xs font-normal">
              #{order.id}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider">
                Customer
              </h3>
              <div className="bg-slate-50 p-3 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">
                    {order.customerInfo.firstName} {order.customerInfo.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{order.customerInfo.phoneNumber}</span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider">
                Delivery Details
              </h3>
              <div className="bg-slate-50 p-3 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>
                    {order.deliveryMode === 'ASAP'
                      ? 'ASAP'
                      : 'Scheduled: ' + formatTime(order.scheduledFor)}
                  </span>
                </div>
                {order.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                    <span>
                      {order.address.street} {order.address.houseNumber}
                      {order.address.apartmentNumber ? `/${order.address.apartmentNumber}` : ''}
                      <br />
                      {order.address.city} {order.address.postalCode}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Order Items
              </h3>
              <div className="border rounded-lg divide-y">
                {order.orderLines.map((line, index) => (
                  <div key={index} className="p-3 flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-50 text-amber-700 w-6 h-6 rounded flex items-center justify-center text-xs font-bold mt-0.5">
                        {line.quantity}x
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{line.name || 'Item'}</p>
                        {/* If we had options/modifiers, they would go here */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
