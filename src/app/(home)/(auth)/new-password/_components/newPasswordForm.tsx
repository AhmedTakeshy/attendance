"use client"
import { useState } from 'react'
import { newPassword } from "@/_actions/tokenActions";
import { newPasswordSchema, NewPasswordSchema, } from '@/lib/formSchemas';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import SubmitButton from '@/_components/submitButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/_components/ui/card';
import { Input } from '@/_components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/_components/ui/form';
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi';

export default function NewPasswordForm() {
    const [isPending, setIsPending] = useState<boolean>(false)
    const searchParams = useSearchParams()
    const [showPassword, setShowPassword] = useState<{
        password: boolean,
        confirmPassword: boolean
    }>
        ({
            password: false,
            confirmPassword: false,
        })
    const router = useRouter()

    const form = useForm<NewPasswordSchema>({
        resolver: zodResolver(newPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    })




    async function handleNewPassword(data: NewPasswordSchema) {
        setIsPending(true)
        try {
            const result = await newPasswordSchema.safeParseAsync(data)
            if (!result.success) {
                toast.error("Error!", {
                    description: "Something went wrong with the form data. Please try again.",
                })
                return
            }
            const res = await newPassword(result.data, searchParams?.get("token") ?? "")
            if (res?.status === "Success") {
                toast.success("Successfully", {
                    description: res.successMessage,
                })
                router.push("/login")
            } else {
                toast.error("Error!", {
                    description: res.errorMessage,
                })
            }
        } catch (error) {
            toast.error("Error!", {
                description: "Something went wrong. Please try again.",
            })
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Card className='flex items-center flex-col justify-center my-12 max-w-sm w-full mx-auto p-0 rounded-md md:rounded-2xl'>
            <CardHeader>
                <CardTitle>Password reset</CardTitle>
            </CardHeader>
            <CardContent className='w-full'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleNewPassword)}>
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem className="flex flex-col space-y-2 w-full mb-4">
                                    <FormLabel htmlFor="password">New Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input id="password" placeholder="*******" {...field} type={`${showPassword.password ? "text" : "password"}`} />
                                            {showPassword.password ?
                                                <PiEyeBold
                                                    className={`hover:cursor-pointer absolute right-[10%] bottom-[28%]`}
                                                    onClick={() => setShowPassword(prevState => ({ ...prevState, password: false }))} /> :
                                                <PiEyeClosedBold
                                                    className={`hover:cursor-pointer absolute right-[10%] bottom-[28%]`} onClick={() => setShowPassword(prevState => ({ ...prevState, password: true }))} />
                                            }
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="flex flex-col space-y-2 w-full mb-8">
                                    <FormLabel htmlFor="confirmPassword">Confirm password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input id="confirmPassword" placeholder="*******" {...field} type={`${showPassword.confirmPassword ? "text" : "password"}`} />
                                            {showPassword.confirmPassword ?
                                                <PiEyeBold
                                                    className={`hover:cursor-pointer absolute right-[10%] bottom-[28%]`}
                                                    onClick={() => setShowPassword(prevState => ({ ...prevState, confirmPassword: false }))} /> :
                                                <PiEyeClosedBold
                                                    className={`hover:cursor-pointer absolute right-[10%] bottom-[28%]`} onClick={() => setShowPassword(prevState => ({ ...prevState, confirmPassword: true }))} />}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <SubmitButton pending={isPending} className='mt-2'>
                            Reset Password
                        </SubmitButton>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
