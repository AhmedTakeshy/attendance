"use client"
import { login, updatePassword, updateUser } from "@/_actions/userActions"
import SubmitButton from "@/_components/submitButton"
import { Button } from "@/_components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/_components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/_components/ui/form"
import { Input } from "@/_components/ui/input"
import { Label } from "@/_components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/_components/ui/tabs"
import { PasswordSchema, passwordSchema, userUpdateSchema, UserUpdateSchema } from "@/lib/formSchemas"
import { createPublicId } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi"
import { toast } from "sonner"

export default function UpdateProfileForm() {
    const session = useSession()
    const router = useRouter()
    const [isPending, setIsPending] = useState<{ user: boolean, password: boolean }>({ user: false, password: false })
    const [showPassword, setShowPassword] = useState<{ currentPassword: boolean, newPassword: boolean, confirmPassword: boolean }>({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    const userForm = useForm<UserUpdateSchema>({
        resolver: zodResolver(userUpdateSchema),
        defaultValues: {
            firstName: session.data?.user.name?.split(" ")[0] ?? "",
            lastName: session.data?.user.name?.split(" ")[1] ?? "",
            email: session.data?.user.email ?? "",
            newEmail: "",
        },
    })

    const passwordForm = useForm<PasswordSchema>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            email: session.data?.user.email ?? "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    async function handleUserUpdate(data: UserUpdateSchema) {
        setIsPending(prev => ({ ...prev, user: true }))
        try {
            const result = await userUpdateSchema.safeParseAsync(data)
            if (!result.success) {
                toast.error("Error!", {
                    description: "Something went wrong with the form data. Please try again.",
                })
                return
            }
            const { firstName, lastName, email, newEmail } = result.data
            const response = await updateUser({ firstName, lastName, email, newEmail })
            if (response.status === "Success") {
                toast.success("Success!", {
                    description: "User information updated successfully.",
                })
                session.update({ user: { ...session.data?.user, name: `${firstName} ${lastName}`, email: newEmail || email } })
                userForm.reset()
                router.refresh()
            } else {
                toast.error("Error!", {
                    description: response.errorMessage,
                })
            }
        } catch (error) {
            toast.error("Error!", {
                description: "Something went wrong. Please try again.",
            })
        }
        setIsPending(prev => ({ ...prev, user: false }))
    }

    async function handlePasswordUpdate(data: PasswordSchema) {
        setIsPending(prev => ({ ...prev, password: true }))
        try {
            const result = await passwordSchema.safeParseAsync(data)
            if (!result.success) {
                toast.error("Error!", {
                    description: "Something went wrong with the form data. Please try again.",
                })
                return
            }
            const { currentPassword, newPassword, confirmPassword, email } = result.data
            const response = await updatePassword({ currentPassword, newPassword, confirmPassword, email })
            if (response.status === "Success") {
                toast.success("Success!", {
                    description: "Password updated successfully.",
                })
                passwordForm.reset()
                router.refresh()
            } else {
                toast.error("Error!", {
                    description: response.errorMessage,
                })
            }
        } catch (error) {
            toast.error("Error!", {
                description: "Something went wrong. Please try again.",
            })
        }
        setIsPending(prev => ({ ...prev, password: false }))
    }

    return (
        <Tabs defaultValue="account" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <Card>
                    <Form {...userForm}>
                        <form onSubmit={userForm.handleSubmit(handleUserUpdate)}>
                            <CardHeader>
                                <CardTitle>Account</CardTitle>
                                <CardDescription>
                                    Make changes to your account here. Click save when you&apos;re done.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                                    <FormField
                                        control={userForm.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col space-y-2 w-full">
                                                <FormLabel htmlFor="firstName">First name</FormLabel>
                                                <FormControl>
                                                    <Input id="firstName" type="text" defaultValue={field.value} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={userForm.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col space-y-2 w-full">
                                                <FormLabel htmlFor="lastName">Last name</FormLabel>
                                                <FormControl>
                                                    <Input id="lastName" type="text" defaultValue={field.value} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={userForm.control}
                                    name="newEmail"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col space-y-2 w-full">
                                            <FormLabel htmlFor="newEmail">New email</FormLabel>
                                            <FormControl>
                                                <Input id="newEmail" type="text" defaultValue={field.value} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                            <CardFooter>
                                <SubmitButton pending={isPending.user}>Save changes</SubmitButton>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </TabsContent>
            <TabsContent value="password">
                <Card>
                    <Form {...passwordForm}>
                        <form
                            onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)}>
                            <CardHeader>
                                <CardTitle>Password</CardTitle>
                                <CardDescription>
                                    Change your password here. After saving, you&apos;ll be logged out.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <FormField
                                    control={passwordForm.control}
                                    name="currentPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor='currentPassword' className="block w-full mb-2 text-sm font-bold ">Current password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        className="w-full h-12 px-4 py-2 transition-colors duration-300 bg-transparent border-2 rounded-lg focus:border-primary focus:outline-none"
                                                        id="currentPassword"
                                                        {...field}
                                                        type={`${showPassword.currentPassword ? "text" : "password"}`} />
                                                    {showPassword.currentPassword ?
                                                        <PiEyeBold
                                                            className={`hover:cursor-pointer absolute right-[10%] bottom-[28%]`}
                                                            onClick={() => setShowPassword(prev => ({ ...prev, currentPassword: false }))} /> :
                                                        <PiEyeClosedBold
                                                            className={`hover:cursor-pointer absolute right-[10%] bottom-[28%]`}
                                                            onClick={() => setShowPassword(prev => ({ ...prev, currentPassword: true }))} />
                                                    }
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={passwordForm.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor='newPassword' className="block w-full mb-2 text-sm font-bold ">New password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        className="w-full h-12 px-4 py-2 transition-colors duration-300 bg-transparent border-2 rounded-lg focus:border-primary focus:outline-none"
                                                        id="newPassword"
                                                        {...field}
                                                        type={`${showPassword.newPassword ? "text" : "password"}`} />
                                                    {showPassword.newPassword ?
                                                        <PiEyeBold
                                                            className={`hover:cursor-pointer absolute right-[10%] bottom-[28%]`}
                                                            onClick={() => setShowPassword(prev => ({ ...prev, newPassword: false }))} /> :
                                                        <PiEyeClosedBold
                                                            className={`hover:cursor-pointer absolute right-[10%] bottom-[28%]`}
                                                            onClick={() => setShowPassword(prev => ({ ...prev, newPassword: true }))} />
                                                    }
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={passwordForm.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor='confirmPassword' className="block w-full mb-2 text-sm font-bold ">Confirm password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        className="w-full h-12 px-4 py-2 transition-colors duration-300 bg-transparent border-2 rounded-lg focus:border-primary focus:outline-none"
                                                        id="confirmPassword"
                                                        {...field}
                                                        type={`${showPassword.confirmPassword ? "text" : "password"}`} />
                                                    {showPassword.confirmPassword ?
                                                        <PiEyeBold
                                                            className={`hover:cursor-pointer absolute right-[10%] bottom-[28%]`}
                                                            onClick={() => setShowPassword(prev => ({ ...prev, confirmPassword: false }))} /> :
                                                        <PiEyeClosedBold
                                                            className={`hover:cursor-pointer absolute right-[10%] bottom-[28%]`}
                                                            onClick={() => setShowPassword(prev => ({ ...prev, confirmPassword: true }))} />
                                                    }
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                            <CardFooter>
                                <SubmitButton pending={isPending.password}>Save changes</SubmitButton>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
