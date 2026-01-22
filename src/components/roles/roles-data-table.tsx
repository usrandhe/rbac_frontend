'use client';

import { useState } from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, ChevronLeft, ChevronRight, Search, Edit, Trash2, Shield } from 'lucide-react';
import { Role } from '@/types';
import { EditRoleDialog } from '@/components/roles/edit-role-dialog';
import { DeleteRoleDialog } from '@/components/roles/delete-role-dialog';
import { ManagePermissionsDialog } from '@/components/roles/manage-permissions-dialog';
import { useSession } from 'next-auth/react';
import { hasPermission } from '@/lib/auth';
import { useDebouncedSearch } from '@/hooks/use-debounced-search';

interface RolesDataTableProps {
    data: Role[];
    totalCount: number;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    onSearchChange: (search: string) => void;
    isLoading: boolean;
}

export function RolesDataTable({
    data,
    totalCount,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
    onSearchChange,
    isLoading,
}: RolesDataTableProps) {
    const [editRole, setEditRole] = useState<Role | null>(null);
    const [deleteRole, setDeleteRole] = useState<Role | null>(null);
    const [managePermissionsRole, setManagePermissionsRole] = useState<Role | null>(null);

    const { data: session } = useSession();
    const canUpdate = hasPermission(session?.user || null, 'roles:update');
    const canDelete = hasPermission(session?.user || null, 'roles:delete');

    const columns: ColumnDef<Role>[] = [
        {
            accessorKey: 'name',
            header: 'Role Name',
            cell: ({ row }) => {
                const name = row.getValue('name') as string;
                return (
                    <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{name}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => {
                const description = row.getValue('description') as string;
                return (
                    <span className="text-muted-foreground">
                        {description || 'No description'}
                    </span>
                );
            },
        },
        {
            id: 'users',
            header: 'Users',
            cell: ({ row }) => {
                const count = row.original.userCount || 0;
                return <Badge variant="secondary">{count} users</Badge>;
            },
        },
        {
            id: 'permissions',
            header: 'Permissions',
            cell: ({ row }) => {
                const count = row.original.permissionCount || 0;
                return <Badge variant="outline">{count} permissions</Badge>;
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const role = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white dark:bg-slate-800 text-black dark:text-white border-gray-200 shadow-lg outline outline-black/5">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {canUpdate && (
                                <>
                                    <DropdownMenuItem onClick={() => setEditRole(role)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setManagePermissionsRole(role)}>
                                        <Shield className="mr-2 h-4 w-4" />
                                        Manage Permissions
                                    </DropdownMenuItem>
                                </>
                            )}
                            {canDelete && (
                                <DropdownMenuItem
                                    onClick={() => setDeleteRole(role)}
                                    className="text-red-600"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(totalCount / pageSize),
    });

    const { searchValue, handleSearch } = useDebouncedSearch({
        onSearchChange,
        onPageChange,
    });


    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search roles..."
                        value={searchValue}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <p className="text-sm text-muted-foreground">
                        Showing {(page - 1) * pageSize + 1} to{' '}
                        {Math.min(page * pageSize, totalCount)} of {totalCount} results
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Select
                        value={pageSize.toString()}
                        onValueChange={(value) => {
                            onPageSizeChange(Number(value));
                            onPageChange(1);
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-black border-gray-200 shadow-lg outline">
                            <SelectItem value="10">10 / page</SelectItem>
                            <SelectItem value="20">20 / page</SelectItem>
                            <SelectItem value="50">50 / page</SelectItem>
                            <SelectItem value="100">100 / page</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <div className="text-sm">
                        Page {page} of {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(page + 1)}
                        disabled={page >= totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Dialogs */}
            {editRole && (
                <EditRoleDialog
                    role={editRole}
                    open={!!editRole}
                    onOpenChange={(open) => !open && setEditRole(null)}
                />
            )}
            {deleteRole && (
                <DeleteRoleDialog
                    role={deleteRole}
                    open={!!deleteRole}
                    onOpenChange={(open) => !open && setDeleteRole(null)}
                />
            )}
            {managePermissionsRole && (
                <ManagePermissionsDialog
                    role={managePermissionsRole}
                    open={!!managePermissionsRole}
                    onOpenChange={(open) => !open && setManagePermissionsRole(null)}
                />
            )}
        </div>
    );
}