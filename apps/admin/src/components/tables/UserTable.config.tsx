import { Pencil, Trash2, Key } from 'lucide-react';
import type { components } from '@repo/api-client';
import {
  Column,
  COLUMN_CELL_TYPE,
  Button,
  Badge,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui';
import type { CurrentUser } from '../../types/auth';

type UserResponse = components['schemas']['UserResponse'];

const ROLE_COLORS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  ADMIN: 'destructive',
  MANAGER: 'default',
  WAITER: 'secondary',
  COOK: 'outline',
  DRIVER: 'outline',
};

type UserTableActionsProps = {
  onEdit: (user: UserResponse) => void;
  onDelete: (user: UserResponse) => void;
  onChangePassword: (user: UserResponse) => void;
  currentUser: CurrentUser | null;
  adminCount: number;
};

export const createUserColumns = ({
  onEdit,
  onDelete,
  onChangePassword,
  currentUser,
  adminCount,
}: UserTableActionsProps): Column<UserResponse>[] => [
  {
    id: 'username',
    label: 'Username',
    type: COLUMN_CELL_TYPE.TEXT,
    enableSorting: true,
  },
  {
    id: 'firstName',
    label: 'First Name',
    type: COLUMN_CELL_TYPE.TEXT,
    enableSorting: true,
    noDataFallback: '-',
  },
  {
    id: 'lastName',
    label: 'Last Name',
    type: COLUMN_CELL_TYPE.TEXT,
    enableSorting: true,
    noDataFallback: '-',
  },
  {
    id: 'phoneNumber',
    label: 'Phone Number',
    type: COLUMN_CELL_TYPE.TEXT,
    noDataFallback: '-',
  },
  {
    id: 'role',
    label: 'Role',
    type: COLUMN_CELL_TYPE.COMPONENT,
    render: (role) => (
      <Badge variant={ROLE_COLORS[role as string] || 'default'}>{role as string}</Badge>
    ),
    enableSorting: true,
  },
  {
    id: 'id',
    label: 'Actions',
    type: COLUMN_CELL_TYPE.COMPONENT,
    render: (_, user) => {
      const isSelf = currentUser?.id === user.id;
      const isLastAdmin = user.role === 'ADMIN' && adminCount === 1;
      const cannotDelete = isSelf || isLastAdmin;
      const isAdmin = user.role === 'ADMIN';

      let deleteTooltipMessage = '';
      if (isSelf) {
        deleteTooltipMessage = 'You cannot delete your own account';
      } else if (isLastAdmin) {
        deleteTooltipMessage = 'Cannot delete the last admin user';
      }

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(user);
            }}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit user</span>
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isAdmin) {
                        onChangePassword(user);
                      }
                    }}
                    disabled={isAdmin}
                  >
                    <Key className="h-4 w-4" />
                    <span className="sr-only">Change password</span>
                  </Button>
                </span>
              </TooltipTrigger>
              {isAdmin && (
                <TooltipContent>
                  <p>Admin passwords cannot be changed</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!cannotDelete) {
                        onDelete(user);
                      }
                    }}
                    disabled={cannotDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete user</span>
                  </Button>
                </span>
              </TooltipTrigger>
              {cannotDelete && (
                <TooltipContent>
                  <p>{deleteTooltipMessage}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];
