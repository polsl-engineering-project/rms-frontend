import { useParams } from 'react-router-dom';

export function OrderDetailsPage() {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-2">Order Details</h1>
      <p className="text-gray-600">Order ID: {orderId}</p>
      <p className="text-sm text-gray-500 mt-2">Close order or view closed ones</p>
    </div>
  );
}
