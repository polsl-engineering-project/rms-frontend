import { useState } from 'react';
import type { components } from '@repo/api-client';
import { MenuItemDialog } from '../components/dialogs/MenuItemDialog';
import { DeleteMenuItemDialog } from '../components/dialogs/DeleteMenuItemDialog';
import { MenuItemsTable } from '../components/tables/MenuItemsTable';

type MenuItemResponse = components['schemas']['MenuItemResponse'];

export function MenuItemsPage() {
  const [editingItem, setEditingItem] = useState<MenuItemResponse | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItemResponse | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="bg-background p-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2 text-foreground">Menu Items</h1>
        <p className="text-muted-foreground">Manage menu items</p>
      </div>

      <MenuItemsTable
        onCreateItem={() => setIsCreateDialogOpen(true)}
        onEditItem={setEditingItem}
        onDeleteItem={setDeletingItem}
      />

      <MenuItemDialog
        open={isCreateDialogOpen || !!editingItem}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setEditingItem(null);
          }
        }}
        item={editingItem}
      />

      <DeleteMenuItemDialog
        open={!!deletingItem}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setDeletingItem(null);
          }
        }}
        item={deletingItem}
      />
    </div>
  );
}
