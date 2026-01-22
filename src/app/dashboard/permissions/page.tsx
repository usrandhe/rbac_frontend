'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PermissionsDataTable } from '@/components/permissions/permissions-data-table';
import { CreatePermissionDialog } from '@/components/permissions/create-permission-dialog';
import { usePermissions } from '@/hooks/use-permissions';
import { hasPermission } from '@/lib/auth';
import { useSession } from 'next-auth/react';

export default function PermissionsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  
  const { data: session } = useSession();
  const canCreate = hasPermission(session?.user || null, 'permissions:create');

  const { data, isLoading } = usePermissions({
    page,
    limit: pageSize,
    search: search || undefined,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
          <p className="text-muted-foreground mt-2">
            Manage system permissions and access controls
          </p>
        </div>
        {canCreate && (
          <Button variant="default" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Permission
          </Button>
        )}
      </div>

      <PermissionsDataTable
        data={data?.data || []}
        totalCount={data?.meta?.total || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSearchChange={setSearch}
        isLoading={isLoading}
      />

      <CreatePermissionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}