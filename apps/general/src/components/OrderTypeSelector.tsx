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
  TimePicker,
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
              <RadioGroupItem
                value={DELIVERY_MODES.ASAP}
                id="asap"
                className="text-amber-600 border-amber-600 focus-visible:ring-amber-600 data-[state=checked]:bg-amber-600 data-[state=checked]:text-white"
              />
              <Label htmlFor="asap" className="cursor-pointer">
                As soon as possible
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={DELIVERY_MODES.SCHEDULED}
                id="scheduled"
                className="text-amber-600 border-amber-600 focus-visible:ring-amber-600 data-[state=checked]:bg-amber-600 data-[state=checked]:text-white"
              />
              <Label htmlFor="scheduled" className="cursor-pointer">
                Schedule for later
              </Label>
            </div>
          </RadioGroup>

          {deliveryMode === DELIVERY_MODES.SCHEDULED && (
            <div className="mt-4">
              <Label htmlFor="scheduledTime">Scheduled Time</Label>
              <TimePicker value={scheduledTime} onChange={onScheduledTimeChange} />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
