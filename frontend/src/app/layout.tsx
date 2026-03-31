import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./queryClientProvider";
import { AuthProvider } from "../components/context/AuthContext";
import { ThemeProvider } from "@/components/wrapper/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { NotificationProvider } from "@/components/context/NotificationContext";

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
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
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <SpeedInsights/>
        <Analytics/>
        <ThemeProvider attribute={"class"} defaultTheme="light">
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
