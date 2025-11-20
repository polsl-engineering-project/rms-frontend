import { Pencil, Trash2 } from 'lucide-react';
import type { components } from '@repo/api-client';
import { Column, COLUMN_CELL_TYPE, Button, Badge } from '@repo/ui';

type MenuCategoryResponse = components['schemas']['MenuCategoryResponse'];

type MenuCategoryTableActionsProps = {
  onEdit: (category: MenuCategoryResponse) => void;
  onDelete: (category: MenuCategoryResponse) => void;
};

export const createMenuCategoryColumns = ({
  onEdit,
  onDelete,
}: MenuCategoryTableActionsProps): Column<MenuCategoryResponse>[] => [
  {
    id: 'name',
    label: 'Name',
    type: COLUMN_CELL_TYPE.TEXT,
    enableSorting: true,
  },
  {
    id: 'description',
    label: 'Description',
    type: COLUMN_CELL_TYPE.TEXT,
    enableSorting: false,
    noDataFallback: '-',
  },
  {
    id: 'active',
    label: 'Status',
    type: COLUMN_CELL_TYPE.COMPONENT,
    render: (active) => (
      <Badge variant={active ? 'default' : 'secondary'}>{active ? 'Active' : 'Inactive'}</Badge>
    ),
    enableSorting: true,
  },
  {
    id: 'id',
    label: 'Actions',
    type: COLUMN_CELL_TYPE.COMPONENT,
    render: (_, category) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(category);
          }}
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit category</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(category);
          }}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete category</span>
        </Button>
      </div>
    ),
  },
];
