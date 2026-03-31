import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./queryClientProvider";
import { AuthProvider } from "../components/context/AuthContext";
import { ThemeProvider } from "@/components/wrapper/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { NotificationProvider } from "@/components/context/NotificationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "esecai - AI Activity Checker",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SpeedInsights/>
        <Analytics/>
        <ThemeProvider attribute={"class"} defaultTheme="dark">
          <TooltipProvider>
            <Provider>
              <NotificationProvider>
                <AuthProvider>{children}</AuthProvider>
              </NotificationProvider>
            </Provider>
          </TooltipProvider>
          <Toaster/>
        </ThemeProvider>
      </body>
    </html>
  );
}
