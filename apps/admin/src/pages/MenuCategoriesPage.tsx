import { useState } from 'react';
import type { components } from '@repo/api-client';
import { MenuCategoryDialog } from '../components/dialogs/MenuCategoryDialog';
import { DeleteMenuCategoryDialog } from '../components/dialogs/DeleteMenuCategoryDialog';
import { MenuCategoriesTable } from '../components/tables/MenuCategoriesTable';

type MenuCategoryResponse = components['schemas']['MenuCategoryResponse'];

export function MenuCategoriesPage() {
  const [editingCategory, setEditingCategory] = useState<MenuCategoryResponse | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<MenuCategoryResponse | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="bg-background p-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2 text-foreground">Menu Categories</h1>
        <p className="text-muted-foreground">Manage menu categories</p>
      </div>

      <MenuCategoriesTable
        onCreateCategory={() => setIsCreateDialogOpen(true)}
        onEditCategory={setEditingCategory}
        onDeleteCategory={setDeletingCategory}
      />

      <MenuCategoryDialog
        open={isCreateDialogOpen || !!editingCategory}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setEditingCategory(null);
          }
        }}
        category={editingCategory}
      />

      <DeleteMenuCategoryDialog
        open={!!deletingCategory}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setDeletingCategory(null);
          }
        }}
        category={deletingCategory}
      />
    </div>
  );
}
