type Props = {
    children: React.ReactNode
    authentication: React.ReactNode
}

export default function AuthLayout({ children, authentication }: Props) {
    return (
        <>
            {children}
            {authentication}
        </>
    )
}
