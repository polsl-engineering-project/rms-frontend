import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Separator,
} from '@repo/ui';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Badge className="mb-2" variant="destructive">
            Admin App
          </Badge>
          <h1 className="text-4xl font-bold mb-2">RMS Admin Portal</h1>
          <p className="text-slate-600">Using shared components from @repo/ui</p>
        </div>

        <Separator className="my-8" />

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage system users</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">View Users</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>System configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="secondary">
                Configure
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Analytics dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Reports
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Portal Active</CardTitle>
            <CardDescription>All shared components working correctly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-slate-600">Button variants:</p>
              <div className="flex gap-2 flex-wrap">
                <Button>Default</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
              <Separator className="my-4" />
              <p className="text-sm text-slate-600">Badge variants:</p>
              <div className="flex gap-2 flex-wrap">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
