import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsList,
  TabsTrigger,
  Label,
  RadioGroup,
  RadioGroupItem,
  Input,
  Calendar,
} from '@repo/ui';
import { ORDER_TYPES, DELIVERY_MODES } from '../constants/order';
import type { OrderType, DeliveryMode } from '../constants/order';

interface OrderTypeSelectorProps {
  orderType: OrderType;
  deliveryMode: DeliveryMode;
  scheduledTime: string;
  onOrderTypeChange: (orderType: OrderType) => void;
  onDeliveryModeChange: (deliveryMode: DeliveryMode) => void;
  onScheduledTimeChange: (scheduledTime: string) => void;
}

export function OrderTypeSelector({
  orderType,
  deliveryMode,
  scheduledTime,
  onOrderTypeChange,
  onDeliveryModeChange,
  onScheduledTimeChange,
}: OrderTypeSelectorProps) {
  return (
    <>
      {/* Order Type Selection */}
      <Card className="border-amber-100 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Order Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={orderType} onValueChange={(value) => onOrderTypeChange(value as OrderType)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value={ORDER_TYPES.PICKUP}>Pick-up</TabsTrigger>
              <TabsTrigger value={ORDER_TYPES.DELIVERY}>Delivery</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Delivery Mode Selection */}
      <Card className="border-amber-100 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>When do you want your order?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={deliveryMode}
            onValueChange={(value) => onDeliveryModeChange(value as DeliveryMode)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={DELIVERY_MODES.ASAP} id="asap" />
              <Label htmlFor="asap" className="cursor-pointer">
                As soon as possible
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={DELIVERY_MODES.SCHEDULED} id="scheduled" />
              <Label htmlFor="scheduled" className="cursor-pointer">
                Schedule for later
              </Label>
            </div>
          </RadioGroup>

          {deliveryMode === DELIVERY_MODES.SCHEDULED && (
            <div className="mt-4">
              <Label htmlFor="scheduledTime">Scheduled Time</Label>
              <div className="relative">
                <Input
                  id="scheduledTime"
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => onScheduledTimeChange(e.target.value)}
                  className="pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
