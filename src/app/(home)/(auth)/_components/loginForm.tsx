"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/_components/ui/form"
import { Input } from "@/_components/ui/input"
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"
import { LoginFormSchema, loginFormSchema } from "@/lib/formSchemas"
// import SubmitButton from "@/components/SubmitButton"
import Link from "next/link"
// import { signIn } from "next-auth/react"





export default function LoginForm() {

    const [isPending, setIsPending] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const router = useRouter()


    const form = useForm<LoginFormSchema>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })



    async function signInCredentials(data: LoginFormSchema) {
        setIsPending(true)
        try {
            const result = await loginFormSchema.safeParseAsync(data)
            if (!result.success) {
                toast.error("Error!", {
                    description: "Something went wrong with the form data. Please try again.",
                })
                return
            }
            const { email, password } = result.data
            // const res = await signIn("credentials", {
            //     redirect: false,
            //     email: email.toLowerCase(),
            //     password,
            // })
            // if (res?.status === 200) {
            //     router.push(`/`)
            // } else {
            //     toast("Oops!", {
            //         description: "Please check your email and password and try again.",
            //     })
            // }
        } catch (error) {
            toast("Error!", {
                description: "Something went wrong. Please try again.",
            })
        }
        setIsPending(false)
    }

    return (
        <Form {...form} >
            <div className="w-full max-sm:max-w-xs p-4 mb-4 space-y-2 border-2 rounded-md border-slate-800 dark:border-slate-400">
                <form onSubmit={form.handleSubmit(signInCredentials)}
                    className="space-y-2">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="example@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input placeholder="*******" {...field} type={`${showPassword ? "text" : "password"}`} />
                                        {showPassword ?
                                            <PiEyeBold
                                                className={`hover:cursor-pointer absolute right-[10%] bottom-[28%]`}
                                                onClick={() => setShowPassword(false)} /> :
                                            <PiEyeClosedBold
                                                className={`hover:cursor-pointer absolute right-[10%] bottom-[28%]`} onClick={() => setShowPassword(true)} />
                                        }
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* <SubmitButton className="w-full !mt-6" text="Login" pending={isPending} /> */}
                </form>
                <div className="flex items-center justify-center !mt-6 md:justify-between">
                    <div className="block w-5/12 h-px dark:bg-gray-300 bg-slate-800"></div>
                    <p className="mx-2 text-sm font-semibold dark:text-gray-400 text-slate-900">OR</p>
                    <div className="block w-5/12 h-px dark:bg-gray-300 bg-slate-800"></div>
                </div>
                <p className="mt-3 text-center">If you don&apos;t have an account, please <Link href="/signup" className="text-blue-500 hover:text-blue-700">Sign up</Link></p>
            </div>
        </Form>
    )
}
