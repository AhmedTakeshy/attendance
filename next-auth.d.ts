declare module "@auth/core/adapters" {
    interface AdapterUser extends User {
        id: string
        email: string
        emailVerified: Date | null
        role: string
    }
}