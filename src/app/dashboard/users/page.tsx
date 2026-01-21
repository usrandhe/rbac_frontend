// src/app/dashboard/users/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { UsersDataTable } from '@/components/users/users-data-table';
import { CreateUserDialog } from '@/components/users/create-user-dialog';
import { useUsers } from '@/hooks/use-users';
import { hasPermission } from '@/lib/auth';
import { useSession } from 'next-auth/react';

export default function UsersPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  
  const { data: session } = useSession();
  const canCreate = hasPermission(session?.user || null, 'users:create');

  const { data, isLoading } = useUsers({
    page,
    limit: pageSize,
    search: search || undefined,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-2">
            Manage user accounts and permissions
          </p>
        </div>
        {canCreate && (
          <Button variant="outline" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create User
          </Button>
        )}
      </div>

      <UsersDataTable
        data={data?.data || []}
        totalCount={data?.meta?.total || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSearchChange={setSearch}
        isLoading={isLoading}
      />

      <CreateUserDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}