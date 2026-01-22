// src/components/roles/manage-permissions-dialog.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useGroupedPermissions } from '@/hooks/use-permissions';
import { useAssignPermissions } from '@/hooks/use-roles';
import { Role } from '@/types';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ManagePermissionsDialogProps {
  role: Role;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManagePermissionsDialog({
  role,
  open,
  onOpenChange,
}: ManagePermissionsDialogProps) {
  const { data: groupedPermissions, isLoading } = useGroupedPermissions();
  const { mutate: assignPermissions, isPending } = useAssignPermissions();
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);

  useEffect(() => {
    if (role.permissions) {
      setSelectedPermissionIds(role.permissions.map((p) => p.id));
    }
  }, [role]);

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAllInResource = (resource: string, select: boolean) => {
    if (!groupedPermissions) return;

    const resourcePermissions = groupedPermissions[resource] || [];
    const resourcePermissionIds = resourcePermissions.map((p) => p.id);

    if (select) {
      setSelectedPermissionIds((prev) => [
        ...new Set([...prev, ...resourcePermissionIds]),
      ]);
    } else {
      setSelectedPermissionIds((prev) =>
        prev.filter((id) => !resourcePermissionIds.includes(id))
      );
    }
  };

  const handleSubmit = () => {
    assignPermissions(
      { id: role.id, data: { permissionIds: selectedPermissionIds } },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };



  const resources = groupedPermissions ? Object.keys(groupedPermissions) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-800 text-black dark:text-white border-gray-200 shadow-lg outline outline-black/5">
        <DialogHeader>
          <DialogTitle>Manage Permissions</DialogTitle>
          <DialogDescription>
            Assign permissions to the role: <strong>{role.name}</strong>
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-6 py-4">
            <div className="flex space-x-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-24" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <Tabs defaultValue="permissions" className="w-full">
              <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${resources.length}, 1fr)` }}>
                {resources.map((resource) => (
                  <TabsTrigger key={resource} value={resource} className="capitalize dark:text-black">
                    {resource}
                  </TabsTrigger>
                ))}
              </TabsList>

              {resources.map((resource) => {
                const permissions = groupedPermissions?.[resource] || [];
                const allSelected = permissions.every((p) =>
                  selectedPermissionIds.includes(p.id)
                );
                const someSelected = permissions.some((p) =>
                  selectedPermissionIds.includes(p.id)
                );

                return (
                  <TabsContent key={resource} value={resource} className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <Label className="text-base font-semibold capitalize">
                        {resource == 'permissions' ? 'Permissions' : resource + ' Permissions'}
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectAllInResource(resource, !allSelected)}
                      >
                        {allSelected ? 'Deselect All' : 'Select All'}
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-start space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={selectedPermissionIds.includes(permission.id)}
                            onCheckedChange={() => handleTogglePermission(permission.id)}
                          />
                          <Label
                            htmlFor={permission.id}
                            className="cursor-pointer flex-1"
                          >
                            <div>
                              {permission.description && (
                                <p className="text-sm text-muted-foreground">
                                  {permission.description}
                                </p>
                              )}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>

            <DialogFooter>
              <div className="flex items-center justify-between w-full">
                <p className="text-sm text-muted-foreground">
                  {selectedPermissionIds.length} permission(s) selected
                </p>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={isPending} variant="outline" className='border-gray-200'>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Permissions'
                    )}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}