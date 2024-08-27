import AuthProvider from "@/context/auth-provider"
import NavMenu from "./_components/NavMenu"
import { auth } from "@/lib/auth"
import Footer from "@/_components/footer"

type Props = {
    children: React.ReactNode
}
export default async function HomeLayout({ children }: Props) {
    const session = await auth()

    return (
        <AuthProvider session={session}>
            <NavMenu />
            <main className="flex flex-col items-center justify-center gap-y-12 min-h-[calc(100vh-14rem)]">
                {children}
            </main>
            <Footer />
        </AuthProvider>
    )
}