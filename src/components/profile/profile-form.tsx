"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useProfile, useUpdateProfile } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect } from "react"

const profileSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    avatarUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileForm() {
    const { data: user, isLoading } = useProfile()
    const { mutate: updateProfile, isPending } = useUpdateProfile()

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
    })

    // Watch avatarUrl for preview
    const avatarUrl = watch("avatarUrl");
    const firstName = watch("firstName");
    const lastName = watch("lastName");

    useEffect(() => {
        if (user) {
            setValue("firstName", user.firstName)
            setValue("lastName", user.lastName)
            setValue("avatarUrl", user.avatarUrl || "")
        }
    }, [user, setValue])

    const onSubmit = (data: ProfileFormValues) => {
        updateProfile(data)
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    const getInitials = (first: string, last: string) => {
        return `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`.toUpperCase()
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                    Update your personal details here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Avatar Section */}
                    <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={avatarUrl || user?.avatarUrl} alt="Profile" />
                            <AvatarFallback className="text-lg">
                                {getInitials(firstName, lastName)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="avatarUrl">Avatar URL</Label>
                            <Input
                                id="avatarUrl"
                                placeholder="https://example.com/avatar.png"
                                {...register("avatarUrl")}
                            />
                            <p className="text-xs text-muted-foreground">
                                Enter a URL for your profile picture.
                            </p>
                            {errors.avatarUrl && (
                                <p className="text-sm text-red-500">{errors.avatarUrl.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                {...register("firstName")}
                                placeholder="John"
                            />
                            {errors.firstName && (
                                <p className="text-sm text-red-500">{errors.firstName.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                {...register("lastName")}
                                placeholder="Doe"
                            />
                            {errors.lastName && (
                                <p className="text-sm text-red-500">{errors.lastName.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            value={user?.email || ""}
                            disabled
                            className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
