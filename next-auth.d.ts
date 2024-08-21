
declare module "@auth/core/adapters" {
    interface AdapterUser extends User {
        id: string
        publicId: string
        email: string
        role: string
    }
}