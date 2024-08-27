import * as z from "zod";
import { convertTo24Hour } from "./utils";


export const contactSchema = z.object({
    firstName: z.string().min(3, {
        message: "Name must be at least 3 characters long"
    }).max(50, {
        message: "Name must be at most 50 characters long"
    }),
    lastName: z.string().min(3, {
        message: "Name must be at least 3 characters long"
    }).max(50, {
        message: "Name must be at most 50 characters long"
    }),
    email: z.string().email({
        message: "Invalid email address",
    }),
    phone: z.string().max(15, {
        message: "Phone number must be at most 15 characters long"
    }).optional(),
    message: z.string().min(12, {
        message: "Message must be at least 12 characters long"
    }).max(200, {
        message: "Message must be at most 200 characters long"
    }),
});

export const loginFormSchema = z.object({
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

export const newPasswordSchema = z.object({
    newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
})

export const resetPasswordSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
});

export const timeSchema = z.object({
    hour: z.enum(["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]),
    minute: z.enum(["00", "15", "30", "45"]),
    period: z.enum(["AM", "PM"]),
});


const subjectSchema = z.object({
    name: z.string().min(1, "Subject name is required"),
    teacher: z.string().optional().or(z.literal("").transform(e => undefined)).nullable(),
    startTime: z.string(),
    endTime: z.string(),
    attendance: z.coerce.number().min(0).nonnegative({ message: "Attendance must be a non-negative number" }),
    absence: z.coerce.number().min(0).nonnegative({ message: "Absence must be a non-negative number" }),
})
// .refine(({ startTime, endTime }) => {
//     const start = convertTo24Hour(startTime);
//     const end = convertTo24Hour(endTime);

//     return (start.hour < end.hour) || (start.hour === end.hour && start.minute < end.minute);
// }, {
//     message: "Start time must be before end time",
//     path: ["startTime"]
// });

const daysSchema = z.object({
    Monday: z.object({ subjects: z.array(subjectSchema).optional() }),
    Tuesday: z.object({ subjects: z.array(subjectSchema).optional() }),
    Wednesday: z.object({ subjects: z.array(subjectSchema).optional() }),
    Thursday: z.object({ subjects: z.array(subjectSchema).optional() }),
    Friday: z.object({ subjects: z.array(subjectSchema).optional() }),
    Saturday: z.object({ subjects: z.array(subjectSchema) }), // Can be empty
    Sunday: z.object({ subjects: z.array(subjectSchema) }),   // Can be empty
});

export const createAttendanceTableSchema = z.object({
    tableName: z.string()
        .min(3, { message: "Table name must be at least 3 characters" })
        .max(50, { message: "Table name must be at most 50 characters" }),
    isPublic: z.boolean(),
    userId: z.number(),
    days: daysSchema
});

export type ContactSchema = z.infer<typeof contactSchema>
export type LoginFormSchema = z.infer<typeof loginFormSchema>
export type SignUpFormSchema = z.infer<typeof signUpFormSchema>
export type UserUpdateSchema = z.infer<typeof userUpdateSchema>
export type PasswordSchema = z.infer<typeof passwordSchema>
export type NewPasswordSchema = z.infer<typeof newPasswordSchema>
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>

export type CreateAttendanceTableSchema = z.infer<typeof createAttendanceTableSchema>