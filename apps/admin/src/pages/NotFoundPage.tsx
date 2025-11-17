import { Link } from 'react-router-dom';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@repo/ui';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="text-6xl font-bold text-gray-900 mb-4">404</div>
          <CardTitle>Page Not Found</CardTitle>
          <CardDescription>
            The page you're looking for doesn't exist in the admin portal or you don't have access.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Link to="/dashboard" className="w-full">
            <Button className="w-full">Go to Dashboard</Button>
          </Link>
          <Link to="/login" className="w-full">
            <Button variant="outline" className="w-full">
              Go to Login
            </Button>
          </Link>
          <p className="text-sm text-gray-500 text-center mt-2">
            If you believe this is an error, contact your administrator.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
