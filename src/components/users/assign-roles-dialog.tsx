'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useRoles } from '@/hooks/use-roles';
import { useAssignRoles } from '@/hooks/use-users';
import { User } from '@/types';
import { Loader2 } from 'lucide-react';

interface AssignRolesDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignRolesDialog({ user, open, onOpenChange }: AssignRolesDialogProps) {
  const { data: rolesData, isLoading: rolesLoading } = useRoles({ limit: 100 });
  const { mutate: assignRoles, isPending } = useAssignRoles();
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setSelectedRoleIds(user.roles.map((r) => r.id));
    }
  }, [user]);

  const handleToggleRole = (roleId: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSubmit = () => {
    assignRoles(
      { id: user.id, roleIds: selectedRoleIds },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-800 text-black dark:text-white border-gray-200 shadow-lg outline outline-black/5">
        <DialogHeader>
          <DialogTitle>Assign Roles</DialogTitle>
          <DialogDescription>
            Select roles for {user.firstName} {user.lastName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {rolesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {rolesData?.data?.map((role) => (
                <div key={role.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={role.id}
                    checked={selectedRoleIds.includes(role.id)}
                    onCheckedChange={() => handleToggleRole(role.id)}
                  />
                  <Label htmlFor={role.id} className="cursor-pointer flex-1">
                    <div>
                      <p className="font-medium">{role.name}</p>
                      {role.description && (
                        <p className="text-sm text-muted-foreground">
                          {role.description}
                        </p>
                      )}
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || rolesLoading}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              'Assign Roles'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}