import AuthProvider from "@/context/auth-provider"
import NavMenu from "./_components/NavMenu"

export default function MainLayout({
    children,
    authentication,
}: {
    children: React.ReactNode
    authentication: React.ReactNode
}) {

    return (
        <AuthProvider>
            <NavMenu />
            {children}
            {authentication}
        </AuthProvider>
    )
}