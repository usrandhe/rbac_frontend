"use client"

import { useProfile } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Key } from "lucide-react"

export function RolesPermissionsCard() {
    const { data: user, isLoading } = useProfile()

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return null
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Roles & Permissions
                </CardTitle>
                <CardDescription>
                    View your assigned roles and permissions.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="mb-2 text-sm font-medium text-muted-foreground flex items-center gap-2">
                        Assigned Roles
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {user.roles && user.roles.length > 0 ? (
                            user.roles.map((role: any) => (
                                <Badge key={typeof role === 'string' ? role : role.id} variant="secondary">
                                    {typeof role === 'string' ? role : role.name}
                                </Badge>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No roles assigned</p>
                        )}
                    </div>
                </div>

                {/* Separator if needed, or just specific spacing */}

                <div>
                    <h3 className="mb-2 text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        Permissions
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {user.permissions && user.permissions.length > 0 ? (
                            user.permissions.map((permission, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                    {permission}
                                </Badge>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No permissions assigned</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
