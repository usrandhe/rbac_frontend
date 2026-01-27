'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreatePermission } from '@/hooks/use-permissions';
import { Loader2 } from 'lucide-react';

const createPermissionSchema = z.object({
  resource: z.string().min(2, 'Resource must be at least 2 characters'),
  action: z.string().min(2, 'Action must be at least 2 characters'),
  description: z.string().min(2, 'Description must be at least 2 characters'),
});

type CreatePermissionFormData = z.infer<typeof createPermissionSchema>;

interface CreatePermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const commonResources = ['users', 'roles', 'permissions', 'posts', 'comments', 'settings'];
const commonActions = ['create', 'read', 'update', 'delete', 'manage', 'view', 'edit'];

export function CreatePermissionDialog({ open, onOpenChange }: CreatePermissionDialogProps) {
  const { mutate: createPermission, isPending } = useCreatePermission();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreatePermissionFormData>({
    resolver: zodResolver(createPermissionSchema),
  });

  const selectedResource = watch('resource');
  const selectedAction = watch('action');

  const onSubmit = (data: CreatePermissionFormData) => {
    createPermission(data, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-800 text-black dark:text-white border-gray-200 shadow-lg outline outline-black/5">
        <DialogHeader>
          <DialogTitle>Create Permission</DialogTitle>
          <DialogDescription>
            Add a new permission to the system. Format: resource:action
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resource">Resource</Label>
            <Select
              value={selectedResource}
              onValueChange={(value) => setValue('resource', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select resource" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 text-black dark:text-white border-gray-200 shadow-lg outline outline-black/5">
                {commonResources.map((resource) => (
                  <SelectItem key={resource} value={resource}>
                    {resource}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              id="resource"
              placeholder="Or enter custom resource"
              {...register('resource')}
              className="mt-2"
              disabled
            />
            {errors.resource && (
              <p className="text-sm text-destructive">{errors.resource.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="action">Action</Label>
            <Select
              value={selectedAction}
              onValueChange={(value) => setValue('action', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 text-black dark:text-white border-gray-200 shadow-lg outline outline-black/5">
                {commonActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              id="action"
              placeholder="Or enter custom action"
              {...register('action')}
              className="mt-2"
              disabled
            />
            {errors.action && (
              <p className="text-sm text-destructive">{errors.action.message}</p>
            )}
          </div>

          {selectedResource && selectedAction && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">Permission name:</p>
              <p className="font-mono font-semibold">
                {selectedResource}:{selectedAction}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this permission allows"
              rows={3}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Permission'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}