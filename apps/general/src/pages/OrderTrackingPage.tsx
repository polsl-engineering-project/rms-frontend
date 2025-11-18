import { useParams } from 'react-router-dom';

export function OrderTrackingPage() {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-2">Order Tracking Page</h1>
      <p className="text-gray-600">Live order status for Order ID: {orderId}</p>
      <p className="text-sm text-gray-500 mt-2">(polling/WebSocket implementation goes here)</p>
    </div>
  );
}
