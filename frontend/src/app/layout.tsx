import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToastContainer } from "@/components/ui/Toast";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { EnquireNowButton } from "@/components/ui/EnquireNowButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TDA Skills | Construction Training & Qualifications",
  description: "Leading provider of construction training, NVQs, CSCS cards, and CITB tests in the UK. Get qualified, get certified, and get on site.",
  icons: {
    icon: "/TDA-logo.webp",
  },
};

import { api } from "@/lib/api";
import { UTMTracker } from "@/components/analytics/UTMTracker";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch courses dynamically for the navbar
  const { data } = await api.get<any>('/courses');
  const courses = data?.courses || [];

  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased min-h-screen flex flex-col bg-[var(--background)]`}
      >
        <UTMTracker />
        <Navbar initialCourses={courses} />
        <main className="flex-grow">
          {children}
        </main>
        <EnquireNowButton />
        <WhatsAppButton />
        <Footer />
        <ToastContainer />
      </body>
    </html>
  );
}
