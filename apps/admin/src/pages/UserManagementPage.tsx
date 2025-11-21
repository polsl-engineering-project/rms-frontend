import { useState } from 'react';
import type { components } from '@repo/api-client';
import { UserDialog } from '../components/dialogs/UserDialog';
import { DeleteUserDialog } from '../components/dialogs/DeleteUserDialog';
import { ChangeUserPasswordDialog } from '../components/dialogs/ChangeUserPasswordDialog';
import { UserTable } from '../components/tables/UserTable';

type UserResponse = components['schemas']['UserResponse'];

export function UserManagementPage() {
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserResponse | null>(null);
  const [changingPasswordUser, setChangingPasswordUser] = useState<UserResponse | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="bg-background p-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2 text-foreground">User Management</h1>
        <p className="text-muted-foreground">Manage users and their roles</p>
      </div>

      <UserTable
        onCreateUser={() => setIsCreateDialogOpen(true)}
        onEditUser={setEditingUser}
        onDeleteUser={setDeletingUser}
        onChangePassword={setChangingPasswordUser}
      />

      {/* Create/Edit Dialog */}
      <UserDialog
        open={isCreateDialogOpen || !!editingUser}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setEditingUser(null);
          }
        }}
        user={editingUser}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteUserDialog
        open={!!deletingUser}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setDeletingUser(null);
          }
        }}
        user={deletingUser}
      />

      {/* Change Password Dialog */}
      <ChangeUserPasswordDialog
        open={!!changingPasswordUser}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setChangingPasswordUser(null);
          }
        }}
        user={changingPasswordUser}
      />
    </div>
  );
}
