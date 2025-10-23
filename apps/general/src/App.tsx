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
          <Badge className="mb-2">General App</Badge>
          <h1 className="text-4xl font-bold mb-2">RMS General Portal</h1>
          <p className="text-slate-600">Using shared components from @repo/ui</p>
        </div>

        <Separator className="my-8" />

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Shared Components</CardTitle>
              <CardDescription>All components below are imported from @repo/ui</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge>Badge</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Component Variants</CardTitle>
              <CardDescription>Testing different button variants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                <Button variant="destructive">Destructive</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Setup Verified</CardTitle>
            <CardDescription>
              If you can see this page with styled components, your monorepo is working correctly!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Turborepo build system</li>
              <li>Shared UI package with shadcn/ui</li>
              <li>TypeScript compilation</li>
              <li>Tailwind CSS styling</li>
              <li>Vite HMR (try editing this file!)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
