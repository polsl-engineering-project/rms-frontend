import { useNavigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@repo/ui';

export function AdminPageLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract tab from current path (e.g., /admin/users -> users)
  const currentTab = location.pathname.split('/admin/')[1] || 'users';

  const handleTabChange = (value: string) => {
    navigate(`/admin/${value}`);
  };

  return (
    <div className="bg-background mt-2 flex-col w-full">
      <div className="flex justify-center mb-2">
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-auto">
          <TabsList className="grid grid-cols-4 gap-1">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="bills">Bills</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}
