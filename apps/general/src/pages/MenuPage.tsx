import { useParams } from 'react-router-dom';

export function MenuPage() {
  const { categoryId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-2">Menu Page</h1>
      <p className="text-gray-600">
        Category: {categoryId || 'All Categories (will auto-redirect to first)'}
      </p>
    </div>
  );
}
