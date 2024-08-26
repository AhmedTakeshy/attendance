"use client"
import { useState } from 'react'
import { resetPasswordEmail } from "@/_actions/tokenActions";
import { resetPasswordSchema, ResetPasswordSchema } from '@/lib/formSchemas';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import SubmitButton from '@/_components/submitButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/_components/ui/card';
import { Input } from '@/_components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/_components/ui/form';

export default function ResetPasswordForm() {
    const [isPending, setIsPending] = useState<boolean>(false)

    const router = useRouter()

    const form = useForm<ResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: "",
        },
    })

    async function handleResetPassword(data: ResetPasswordSchema) {
        setIsPending(true)
        try {
            const result = await resetPasswordSchema.safeParseAsync(data)
            if (!result.success) {
                toast.error("Error!", {
                    description: "Something went wrong with the form data. Please try again.",
                })
                return
            }
            const res = await resetPasswordEmail(result.data)
            if (res?.status === "Success") {
                toast.success("Successfully", {
                    description: res.successMessage,
                })
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
                    <form onSubmit={form.handleSubmit(handleResetPassword)}>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="email">Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" id="email" {...field} />
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
