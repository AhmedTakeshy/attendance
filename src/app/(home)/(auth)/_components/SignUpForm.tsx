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
import { toast } from "sonner"
import { SignUpFormSchema, signUpFormSchema } from "@/lib/formSchemas"

import SubmitButton from "@/_components/submitButton"
import { login, signUpAction } from "@/_actions/userActions"
import { useRouter } from "next/navigation"
import BottomGradient from "@/_components/bottomGradient"
import { DialogDescription, DialogHeader, DialogTitle } from "@/_components/ui/dialog"
import LoginWithProvider from "./loginWithProvider"


export default function SignUpForm() {

    const [isPending, setIsPending] = useState<boolean>(false)

    const [showPassword, setShowPassword] = useState<{
        password: boolean,
        confirmPassword: boolean
    }>
        ({
            password: false,
            confirmPassword: false,
        })
    const router = useRouter()
    const form = useForm<SignUpFormSchema>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "USER",
        },
    })

    async function signUp(data: SignUpFormSchema) {
        setIsPending(true)
        try {
            const result = await signUpFormSchema.safeParseAsync(data)
            if (!result.success) {
                toast("Error!", {
                    description: "Something went wrong with the form data. Please try again.",
                })
                return
            }

            const res = await signUpAction(result.data)

            if (res?.status === 201) {
                toast.success("Successfully!", {
                    description: res?.message,
                })
                await login({ type: "credentials", email: result.data.email, password: result.data.password })
                form.reset()
                router.refresh()
            } else {
                toast.error("Oops!", {
                    description: res?.message,
                })
            }
        } catch (error) {
            toast.error("Error!", {
                description: "Something went wrong. Please try again.",
            })
            setIsPending(false)
        }
    }
    return (
        <Form {...form} >
            <div className="w-full max-sm:max-w-md mx-auto md:p-8 p-4 rounded-sm md:rounded-2xl shadow-input ">
                <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                    Welcome to Attendance
                </h2>
                <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                    Sign up to attendance to create a table and start tracking your attendance.
                </p>
                <form
                    onSubmit={form.handleSubmit(signUp)}
                    className="my-8"
                >
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className="flex flex-col space-y-2 w-full">
                                    <FormLabel htmlFor="firstName">First name</FormLabel>
                                    <FormControl>
                                        <Input id="firstName" type="text" placeholder="Harvey" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className="flex flex-col space-y-2 w-full">
                                    <FormLabel htmlFor="lastName">Last name</FormLabel>
                                    <FormControl>
                                        <Input id="lastName" type="text" placeholder="specter" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="flex flex-col space-y-2 w-full mb-4">
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <FormControl>
                                    <Input id="email" type="email" placeholder="example@email.com" {...field} />
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
                    <SubmitButton
                        className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        pending={isPending}>
                        Sign up &rarr;
                        <BottomGradient />
                    </SubmitButton>
                    <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
                    <LoginWithProvider />
                </form>
            </div>
        </Form>
    )
}

