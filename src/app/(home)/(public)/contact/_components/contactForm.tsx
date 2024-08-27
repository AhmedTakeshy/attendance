"use client"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormMessage, FormItem } from "@/_components/ui/form"
import { ContactSchema, contactSchema } from "@/lib/formSchemas"
import SubmitButton from "@/_components/submitButton"
import { contactFormAction } from "@/_actions/userActions"
import { toast } from "sonner"
import { FaMapMarkerAlt } from "react-icons/fa"
import { FaFacebookMessenger, FaSquareWhatsapp } from "react-icons/fa6"
import Link from "next/link"

export default function ContactForm() {
    const [isPending, setIsPending] = useState<boolean>(false)

    const form = useForm<ContactSchema>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            message: "",
        },
    })


    async function submitContact(data: ContactSchema) {
        setIsPending(true)
        try {
            const result = await contactSchema.safeParseAsync(data)
            if (!result.success) {
                setIsPending(false)
                return
            }
            const res = await contactFormAction(result.data)
            if (res.statusCode === 200) {
                form.reset()
                toast.success("Contact form submitted successfully", {
                    description: "We will get back to you soon, thank you!",
                })
            }
        } catch (error) {
            toast.error("Error", {
                description: "Internal Server Error message not sent!",
            })
        }
        setIsPending(false)
    }
    return (
        <div className="container relative z-10 px-4 mx-auto my-4 lg:px-20">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submitContact)}
                    className="w-full p-8 my-4 mr-auto shadow-2xl md:px-12 lg:w-9/12 lg:pl-20 lg:pr-40 rounded-2xl dark:bg-navy-800 bg-slate-200">
                    <h1 className="text-5xl font-bold uppercase text-navy-900">Send us a <br /> message</h1>

                    <div className="grid grid-cols-1 gap-5 mt-5 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <input {...field} className="w-full p-3 mt-2 rounded-lg dark:bg-slate-200 text-slate-900 focus:outline-none"
                                            type="text" placeholder="First Name*" />
                                    </FormControl>
                                    <FormMessage className="text-rose-400" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <input
                                            {...field}
                                            className="w-full p-3 mt-2 rounded-lg dark:bg-slate-100 text-slate-900 focus:outline-none"
                                            type="text"
                                            placeholder="Last Name*" />
                                    </FormControl>
                                    <FormMessage className="text-rose-400" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <input
                                            {...field}
                                            className="w-full p-3 mt-2 rounded-lg dark:bg-slate-100 text-slate-900 focus:outline-none"
                                            type="email"
                                            placeholder="Email*" />
                                    </FormControl>
                                    <FormMessage className="text-rose-400" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <input
                                            {...field}
                                            className="w-full p-3 mt-2 rounded-lg dark:bg-slate-100 text-slate-900 focus:outline-none"
                                            type="text"
                                            placeholder="Phone" />
                                    </FormControl>
                                    <FormMessage className="text-rose-400" />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <textarea
                                        {...field}
                                        placeholder="Message*"
                                        className="w-full h-32 p-3 mt-6 rounded-lg dark:bg-slate-100 text-slate-900 focus:outline-none"
                                    />
                                </FormControl>
                                <FormMessage className="text-rose-400 mb-4" />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center justify-between">
                        <SubmitButton
                            pending={isPending}
                            className="w-1/2 p-3 my-2 text-sm font-bold tracking-wide uppercase transition-colors duration-500 rounded-lg font-man bg-blue-950 text-slate-100 focus:outline-none lg:w-1/4 hover:bg-blue-900">
                            Send Message
                        </SubmitButton>
                        <div className="flex items-center justify-between gap-2">
                            <Link
                                href='https://api.whatsapp.com/send?phone=905511635796'
                                target='_blank'
                                rel='noopener noreferrer'

                            >
                                <FaSquareWhatsapp size={25} className='fill-green-500 hover:fill-green-700 text-white' />
                            </Link>
                            <Link
                                href={`https://m.me/ahmed.takeshy.1`}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-blue-500 hover:text-blue-700 '
                            >
                                <FaFacebookMessenger size={25} />
                            </Link>
                        </div>
                    </div>
                </form>
            </Form>

            <div
                className="w-full px-8 py-12 ml-auto lg:-mt-96 lg:w-2/6 bg-blue-950 rounded-2xl">
                <div className="flex flex-col text-white">
                    <h1 className="mb-4 text-3xl font-bold text-center text-transparent sm:text-4xl font-nekst md:text-6xl bg-clip-text bg-gradient-to-b from-neutral-200 to-neutral-600">
                        Contact Us
                    </h1>
                    <p className="leading-6 text-slate-300">
                        Welcome to Attendance! <br />
                        The best place to track your attendance, and keep yourself updated We are here to help you with any questions you may have, so don&apos;t hesitate to contact us.
                    </p>
                    <div className="flex justify-start w-2/3 gap-2 mt-6">
                        <FaMapMarkerAlt className='pt-2' size={25} />
                        <div className="flex flex-col">
                            <h2 className="text-2xl">Main Office</h2>
                            <p className="text-gray-400">
                                Literature department, <br />
                                Erciyes university, <br />
                                Kayseri, Turkey.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}