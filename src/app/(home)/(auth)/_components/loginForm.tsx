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
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { LoginFormSchema, loginFormSchema } from "@/lib/formSchemas"
import SubmitButton from "@/_components/submitButton"
import Link from "next/link"
import LoginWithProvider from "./loginWithProvider"
import BottomGradient from "@/_components/bottomGradient"
import { login } from "@/_actions/userActions"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { useSession } from "next-auth/react"



export default function LoginForm() {

    const [isPending, setIsPending] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const router = useRouter()
    const searchParams = useSearchParams()
    const session = useSession()

    const form = useForm<LoginFormSchema>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })



    async function signIn(data: LoginFormSchema) {
        setIsPending(true)
        try {
            const result = await loginFormSchema.safeParseAsync(data)
            if (!result.success) {
                toast.error("Error!", {
                    description: "Something went wrong with the form data. Please try again.",
                })
                return
            }
            const res = await login(result.data)
            if (res?.status === "Success") {
                toast.success("Successfully", {
                    description: res.successMessage,
                })
                session.update({ user: { ...session.data?.user } })
                router.push(searchParams.get("callbackUrl") || DEFAULT_LOGIN_REDIRECT)
            } else {
                toast.error("Oops!", {
                    description: "Please check your email and password and try again.",
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
        <Form {...form} >
            <div className="w-full max-sm:max-w-sm mx-auto md:p-8 p-4 rounded-md md:rounded-2xl shadow-input ">
                <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                    Welcome to Attendance
                </h2>
                <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                    Login to attendance to create a table and start tracking your attendance.
                </p>
                <form onSubmit={form.handleSubmit(signIn)}
                    className="my-8">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="flex flex-col space-y-2 w-full mb-4">
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <FormControl>
                                    <Input id="email" placeholder="example@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="flex flex-col space-y-2 w-full mb-4">
                                <FormLabel htmlFor="password">Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input id="password" placeholder="*******" {...field} type={`${showPassword ? "text" : "password"}`} />
                                        {showPassword ?
                                            <PiEyeBold
                                                className={`hover:cursor-pointer absolute right-[10%] bottom-[28%]`}
                                                onClick={() => setShowPassword(false)} /> :
                                            <PiEyeClosedBold
                                                className={`hover:cursor-pointer absolute right-[10%] bottom-[28%]`}
                                                onClick={() => setShowPassword(true)} />
                                        }
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <SubmitButton
                        className="relative group/btn w-full text-neutral-700 dark:text-neutral-300 rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        pending={isPending}>
                        Login &rarr;
                        <BottomGradient />
                    </SubmitButton>
                    <Link href="/reset-password" className="text-blue-500 text-sm inline-block hover:text-blue-700 mt-3 text-right w-full">
                        Forgot password
                    </Link>
                    <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-px w-full" />
                    <LoginWithProvider />
                </form>
                <div className="flex items-center justify-center mt-6 md:justify-between">
                    <div className="block w-5/12 h-px dark:bg-gray-300 bg-slate-800"></div>
                    <p className="mx-2 text-sm font-semibold dark:text-gray-400 text-slate-900">OR</p>
                    <div className="block w-5/12 h-px dark:bg-gray-300 bg-slate-800"></div>
                </div>
                <p className="mt-3 text-center">If you don&apos;t have an account, please <Link href="/signup" className="text-blue-500 hover:text-blue-700">Sign up</Link></p>
            </div>
        </Form>
    )
}
