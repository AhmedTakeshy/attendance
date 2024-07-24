import AuthProvider from "@/context/auth-provider"
import NavMenu from "./_components/NavMenu"

export default function MainLayout({
    children,
    auth,
}: {
    children: React.ReactNode
    auth: React.ReactNode
}) {

    return (
        <>
            <AuthProvider>
                <NavMenu />
                {children}
                {auth}
            </AuthProvider>
        </>
    )
}