'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeletePermission } from '@/hooks/use-permissions';
import { Permission } from '@/types';
import { Loader2 } from 'lucide-react';

interface DeletePermissionDialogProps {
  permission: Permission;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeletePermissionDialog({ permission, open, onOpenChange }: DeletePermissionDialogProps) {
  const { mutate: deletePermission, isPending } = useDeletePermission();

  const handleDelete = () => {
    deletePermission(permission.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white dark:bg-slate-800 text-black dark:text-white border-gray-200 shadow-lg outline outline-black/5">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the permission{' '}
            <strong className="font-mono">{permission.name}</strong>.
            {permission._count?.roles ? (
              <span className="text-destructive font-medium">
                {' '}
                This permission is currently assigned to {permission._count.roles} role(s).
              </span>
            ) : null}
            {' '}This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}