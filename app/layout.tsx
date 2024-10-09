// app/layout.tsx
import { KindeProvider } from "@/components/KindeProvider";
import Header from "@/components/layout/Header";
import SidebarWrapper from "@/components/layout/SidebarWrapper";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import GlobalFooter from "@/components/layout/GlobalFooter";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Lienzo - Enterprise-Level Software License Management",
  description: "Manage your software licenses efficiently with Lienzo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <KindeProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1">
              <SidebarWrapper />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                {children}
              </main>
            </div>
            <GlobalFooter />
          </div>
          <Toaster />
        </body>
      </KindeProvider>
    </html>
  );
}