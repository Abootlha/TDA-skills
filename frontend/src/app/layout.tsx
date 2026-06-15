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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased min-h-screen flex flex-col bg-[var(--background)]`}
      >
        <Navbar />
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
