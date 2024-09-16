import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/context/theme-provider";
import { Toaster } from "@/_components/ui/sonner";
// import NextWebVitals from "nextlevelpackage";


const dm = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Attendance App",
  description: "Attendance App for students to track their attendance in the schools and universities.",
};

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default async function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className={`${dm.className} antialiased `}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >

          {children}
          {/* <NextWebVitals /> */}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
