import AuthProvider from "@/context/auth-provider"
import NavMenu from "./_components/NavMenu"
import { auth } from "@/lib/auth"

type Props = {
    children: React.ReactNode
}
export default async function HomeLayout({ children }: Props) {
    const session = await auth()

    return (
        <AuthProvider session={session}>
            <NavMenu />
            {children}
        </AuthProvider>
    )
}