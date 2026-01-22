'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { RolesDataTable } from '@/components/roles/roles-data-table';
import { CreateRoleDialog } from '@/components/roles/create-role-dialog';
import { useRoles } from '@/hooks/use-roles';
import { hasPermission } from '@/lib/auth';
import { useSession } from 'next-auth/react';

export default function RolesPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  
  const { data: session } = useSession();
  const canCreate = hasPermission(session?.user || null, 'roles:create');

  const { data, isLoading } = useRoles({
    page,
    limit: pageSize,
    search: search || undefined,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
          <p className="text-muted-foreground mt-2">
            Manage roles and their permissions
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        )}
      </div>

      <RolesDataTable
        data={data?.data || []}
        totalCount={data?.meta?.total || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSearchChange={setSearch}
        isLoading={isLoading}
      />

      <CreateRoleDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}