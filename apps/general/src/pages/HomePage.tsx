import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '@repo/ui';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4">Public Portal</Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to RMS</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Restaurant Management System - Your complete solution for modern restaurant operations
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Browse Menu</CardTitle>
              <CardDescription>Explore our delicious offerings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                View our full menu with detailed descriptions, prices, and dietary information.
              </p>
              <Button className="w-full">View Menu</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Online</CardTitle>
              <CardDescription>Quick and convenient ordering</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Place your order for pickup or delivery with just a few clicks.
              </p>
              <Button className="w-full" variant="secondary">
                Start Order
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Track Order</CardTitle>
              <CardDescription>Real-time order updates</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Stay informed with live updates on your order status and estimated time.
              </p>
              <Button className="w-full" variant="outline">
                Track Now
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Everything you need to know</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">For Customers</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Browse our menu and special offers</li>
                  <li>✓ Place orders for pickup or delivery</li>
                  <li>✓ Track your order in real-time</li>
                  <li>✓ Save your favorite items</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Easy-to-use interface</li>
                  <li>✓ Secure payment processing</li>
                  <li>✓ Order history and reordering</li>
                  <li>✓ Special promotions and discounts</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
