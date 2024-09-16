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
  title: "Attendance Tracker for Students | Simplify Attendance Management",
  description: "Effortlessly manage and track your academic attendance with our student-focused attendance tracker. Create tables for subjects, mark attendance, and stay on top of your schedule. Log in now to access all features.",
  keywords: "Attendance Tracker, Attendance Management, Student Attendance Tracker, Attendance Tracker for Students, Attendance Tracker App, Attendance Tracker Online, Attendance Tracker for School, Attendance Tracker for College, Attendance Tracker for University, Attendance Tracker for Students Online, Attendance Tracker for Students App, Attendance Tracker for Students School, Attendance Tracker for Students College, Attendance Tracker for Students University, Attendance Tracker for Students Online App, Attendance Tracker for Students School App, Attendance Tracker for Students College App, Attendance Tracker for Students University App,student attendance tracker, academic attendance tracking, attendance management, track subjects attendance, online attendance tracker, student schedule, attendance tracking app",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://attendancetracking.vercel.app",
    title: "Attendance Tracker for Students | Simplify Attendance Management",
    description: "Effortlessly manage and track your academic attendance with our student-focused attendance tracker. Create tables for subjects, mark attendance, and stay on top of your schedule. Log in now to access all features.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Attendance Tracker for Students",
      }
    ],
  },
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/icons/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/icons/favicon-16x16.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/icons/apple-touch-icon.png",
    },
    {
      rel: "manifest",
      type: "application/manifest+json",
      url: "/manifest.json",
    },
  ],
  applicationName: "Attendance Tracker",
  generator: "Next.js",
  referrer: 'origin-when-cross-origin',
  authors: { name: "Ahmed Takeshy", url: "https://takeshy.tech" },
  creator: "Ahmed Takeshy",
  publisher: "Ahmed Takeshy",
  metadataBase: new URL('https://attendancetracking.vercel.app'),
  alternates: {
    canonical: '/',
  },
  twitter: {
    site: "https://attendancetracking.vercel.app",
    card: "summary_large_image",
    siteId: "https://attendancetracking.vercel.app",
    creatorId: "Attendance Tracker",
    creator: "https://attendancetracking.vercel.app",
    title: "Attendance Tracker for Students | Simplify Attendance Management",
    description: "Effortlessly manage and track your academic attendance with our student-focused attendance tracker. Create tables for subjects, mark attendance, and stay on top of your schedule. Log in now to access all features.",
  },
  robots: "index, follow",
  classification: "Education and Attendance Management",
  category: "Education",
  other: {
    copyRight: "2024 Attendance Tracker",
    rating: "General",
    Distribution: "global",
    Revisit: "1 day",
    language: "English",
    resourceType: "document",
    referrer: "origin",
    "og:type": "website",
    "og:locale": "en_US",
    "og:url": "https://attendancetracking.vercel.app",
    "og:title": "Attendance Tracker for Students | Simplify Attendance Management",
    "og:description": "Effortlessly manage and track your academic attendance with our student-focused attendance tracker. Create tables for subjects, mark attendance, and stay on top of your schedule. Log in now to access all features.",
    "og:image": "/logo.png",
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:alt": "Attendance Tracker for Students",
    "og:site_name": "Attendance Tracker",
  },
  appLinks: {
    web: { url: "https://attendancetracking.vercel.app" },
  },

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
