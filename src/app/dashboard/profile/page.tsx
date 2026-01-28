import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "@/components/profile/profile-form"
import { SecurityForm } from "@/components/profile/security-form"
import { RolesPermissionsCard } from "@/components/profile/roles-permissions-card"

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <Tabs defaultValue="general" className="w-full max-w-2xl">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-4">
                    <ProfileForm />
                    <RolesPermissionsCard />
                </TabsContent>
                <TabsContent value="security" className="space-y-4">
                    <SecurityForm />
                </TabsContent>
            </Tabs>
        </div>
    )
}