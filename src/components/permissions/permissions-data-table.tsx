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
import { MoreHorizontal, ChevronLeft, ChevronRight, Search, Edit, Trash2, Lock } from 'lucide-react';
import { Permission } from '@/types';
import { EditPermissionDialog } from '@/components/permissions/edit-permission-dialog';
import { DeletePermissionDialog } from '@/components/permissions/delete-permission-dialog';
import { useSession } from 'next-auth/react';
import { hasPermission } from '@/lib/auth';
import { useDebouncedSearch } from '@/hooks/use-debounced-search';

interface PermissionsDataTableProps {
    data: Permission[];
    totalCount: number;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    onSearchChange: (search: string) => void;
    isLoading: boolean;
}

export function PermissionsDataTable({
    data,
    totalCount,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
    onSearchChange,
    isLoading,
}: PermissionsDataTableProps) {
    const [editPermission, setEditPermission] = useState<Permission | null>(null);
    const [deletePermission, setDeletePermission] = useState<Permission | null>(null);

    const { data: session } = useSession();
    const canUpdate = hasPermission(session?.user || null, 'permissions:update');
    const canDelete = hasPermission(session?.user || null, 'permissions:delete');

    const columns: ColumnDef<Permission>[] = [
        {
            accessorKey: 'name',
            header: 'Permission',
            cell: ({ row }) => {
                const name = row.getValue('name') as string;
                return (
                    <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium font-mono text-sm">{name}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'resource',
            header: 'Resource',
            cell: ({ row }) => {
                const resource = row.getValue('resource') as string;
                return (
                    <Badge variant="outline" className="capitalize">
                        {resource}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'action',
            header: 'Action',
            cell: ({ row }) => {
                const action = row.getValue('action') as string;
                const colorMap: Record<string, string> = {
                    create: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
                    read: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
                    update: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
                    delete: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
                };
                return (
                    <Badge className={colorMap[action] || ''} variant="secondary">
                        {action}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => {
                const description = row.getValue('description') as string;
                return (
                    <span className="text-muted-foreground text-sm">
                        {description || 'No description'}
                    </span>
                );
            },
        },
        {
            id: 'roles',
            header: 'Roles',
            cell: ({ row }) => {
                const count = row.original.roleCount || 0;
                return <Badge variant="secondary">{count} role(s)</Badge>;
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const permission = row.original;

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
                                <DropdownMenuItem onClick={() => setEditPermission(permission)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                            )}
                            {canDelete && (
                                <DropdownMenuItem
                                    onClick={() => setDeletePermission(permission)}
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
                        placeholder="Search permissions..."
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
                        <SelectContent>
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
            {editPermission && (
                <EditPermissionDialog
                    permission={editPermission}
                    open={!!editPermission}
                    onOpenChange={(open) => !open && setEditPermission(null)}
                />
            )}
            {deletePermission && (
                <DeletePermissionDialog
                    permission={deletePermission}
                    open={!!deletePermission}
                    onOpenChange={(open) => !open && setDeletePermission(null)}
                />
            )}
        </div>
    );
}