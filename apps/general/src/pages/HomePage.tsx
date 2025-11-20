import { Button, UtensilsCrossed, Clock, MapPin } from '@repo/ui';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100vh] flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-6">
              <UtensilsCrossed className="w-5 h-5 text-amber-700" />
              <span className="text-sm font-medium text-amber-900">Demo Restaurant System</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-amber-700 via-orange-600 to-rose-600 bg-clip-text text-transparent">
              RMS Demo
            </h1>

            <p className="text-xl md:text-2xl mb-6 text-gray-700 font-light">
              Restaurant Management System
            </p>

            <p className="text-lg mb-10 text-gray-600 max-w-2xl mx-auto">
              Experience a modern restaurant ordering platform with an elegant menu, seamless cart
              management, and intuitive design. All data is for demonstration purposes only.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-lg px-8 py-6 shadow-lg"
                onClick={() => navigate('/menu')}
              >
                Browse Menu
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Demo Features</h2>
            <p className="text-gray-600">
              Explore the capabilities of this restaurant management system
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-sm">
                <UtensilsCrossed className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Interactive Menu</h3>
              <p className="text-gray-600">
                Browse categorized items with detailed information, dietary tags, and spice levels
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-orange-50 to-rose-50">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-sm">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Smart Cart</h3>
              <p className="text-gray-600">
                Persistent cart with automatic expiration and real-time quantity tracking
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-rose-50 to-pink-50">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-sm">
                <MapPin className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Responsive Design</h3>
              <p className="text-gray-600">
                Optimized experience across all devices with mobile-first approach
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <footer className="py-8 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            This is a demonstration system. All menu items, orders, and data are for testing
            purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
