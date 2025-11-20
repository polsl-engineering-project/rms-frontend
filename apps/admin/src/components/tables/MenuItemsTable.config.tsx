import { Pencil, Trash2, AlertTriangle } from 'lucide-react';
import type { components } from '@repo/api-client';
import { Column, COLUMN_CELL_TYPE, Button, Badge } from '@repo/ui';

type MenuItemResponse = components['schemas']['MenuItemResponse'];
type MenuCategoryResponse = components['schemas']['MenuCategoryResponse'];

type MenuItemTableActionsProps = {
  onEdit: (item: MenuItemResponse) => void;
  onDelete: (item: MenuItemResponse) => void;
  categoriesMap: Map<string, MenuCategoryResponse>;
};

const SPICE_LEVEL_DISPLAY: Record<string, string> = {
  NONE: '',
  MILD: '🌶️',
  MEDIUM: '🌶️🌶️',
  HOT: '🌶️🌶️🌶️',
  EXTRA_HOT: '🌶️🌶️🌶️🌶️',
};

export const createMenuItemColumns = ({
  onEdit,
  onDelete,
  categoriesMap,
}: MenuItemTableActionsProps): Column<MenuItemResponse>[] => [
  {
    id: 'name',
    label: 'Name',
    type: COLUMN_CELL_TYPE.TEXT,
    enableSorting: true,
  },
  {
    id: 'categoryId',
    label: 'Category',
    type: COLUMN_CELL_TYPE.COMPONENT,
    render: (categoryId, item) => {
      const category = categoryId ? categoriesMap.get(categoryId as string) : null;

      if (!item.categoryId) {
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            No Category
          </Badge>
        );
      }

      return (
        <Badge variant="outline" className="font-normal">
          {category?.name || 'Loading...'}
        </Badge>
      );
    },
    enableSorting: false,
  },
  {
    id: 'price',
    label: 'Price',
    type: COLUMN_CELL_TYPE.COMPONENT,
    render: (price) => <span>${(price as number)?.toFixed(2) || '0.00'}</span>,
    enableSorting: true,
  },
  {
    id: 'spiceLevel',
    label: 'Spice',
    type: COLUMN_CELL_TYPE.COMPONENT,
    render: (level) => (
      <span className="text-base" title={(level as string) || 'NONE'}>
        {SPICE_LEVEL_DISPLAY[(level as string) || 'NONE'] || '-'}
      </span>
    ),
    enableSorting: false,
  },
  {
    id: 'vegetarian',
    label: 'Dietary',
    type: COLUMN_CELL_TYPE.COMPONENT,
    render: (_, item) => (
      <div className="flex gap-1">
        {item.vegetarian && (
          <Badge variant="outline" className="text-xs">
            🥗 Veg
          </Badge>
        )}
        {item.vegan && (
          <Badge variant="outline" className="text-xs">
            🌱 Vegan
          </Badge>
        )}
        {item.glutenFree && (
          <Badge variant="outline" className="text-xs">
            🌾 GF
          </Badge>
        )}
        {!item.vegetarian && !item.vegan && !item.glutenFree && (
          <span className="text-muted-foreground">-</span>
        )}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: 'calories',
    label: 'Calories',
    type: COLUMN_CELL_TYPE.TEXT,
    noDataFallback: '-',
    enableSorting: false,
  },
  {
    id: 'id',
    label: 'Actions',
    type: COLUMN_CELL_TYPE.COMPONENT,
    render: (_, item) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item);
          }}
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit item</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item);
          }}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete item</span>
        </Button>
      </div>
    ),
  },
];
