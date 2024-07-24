import * as z from "zod";


export const contactSchema = z.object({
    fullName: z.string().min(3, {
        message: "Name must be at least 3 characters long"
    }).max(50, {
        message: "Name must be at most 50 characters long"
    }),
    email: z.string().email({
        message: "Invalid email address",
    }),
    message: z.string().min(12, {
        message: "Message must be at least 12 characters long"
    })
});

export const signInFormSchema = z.object({
    email: z.string().trim().email({
        message: "Please enter a valid email address",
    }),
    password: z.string().trim().min(8, {
        message: "Password must be at least 8 characters",
    })
})

export const signUpFormSchema = z.object({
    firstName: z.string().min(3, {
        message: "Username must be at least 3 characters",
    }),
    lastName: z.string().min(3, {
        message: "Username must be at least 3 characters",
    }),
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
    role: z.enum(["USER", "ADMIN"]),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters",
    }),
    confirmPassword: z.string().min(8, {
        message: "Password must be at least 8 characters",
    })
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
})

export const userUpdateSchema = z.object({
    firstName: z.union([
        z.string().min(3, { message: "Username must be at least 3 characters" }).optional(),
        z.literal("").optional(),
    ]).transform(e => e === "" ? undefined : e),
    lastName: z.union([
        z.string().min(3, { message: "Username must be at least 3 characters" }).optional(),
        z.literal("").optional(),
    ]).transform(e => e === "" ? undefined : e),
    email: z.string().email(),
    newEmail: z.union([
        z.string().email({ message: "Please enter a valid email address" }).optional(),
        z.literal("").optional(),
    ]).transform(e => e === "" ? undefined : e),
});

export const passwordSchema = z.object({
    email: z.string().email(),
    currentPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
    newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
})

export type ContactSchema = z.infer<typeof contactSchema>
export type SignInFormSchema = z.infer<typeof signInFormSchema>
export type SignUpFormSchema = z.infer<typeof signUpFormSchema>
export type UserUpdateSchema = z.infer<typeof userUpdateSchema>
export type PasswordSchema = z.infer<typeof passwordSchema>