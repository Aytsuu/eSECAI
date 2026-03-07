"use client";

import { AppSidebar } from "@/components/compositions/app-sidebar";
import { Header } from "@/components/compositions/header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default ({children} : {children: React.ReactNode}) => {
  return (
    <div className="w-screen h-screen flex bg-custom-primary overflow-hidden">
      <div>
        <SidebarProvider>
          <AppSidebar/>
        </SidebarProvider>
      </div>
      <div className="w-full h-full flex flex-col overflow-hidden">
        <Header/>
        <div className="w-full flex-1 overflow-y-auto p-5">
          {children}
        </div>
      </div>
    </div>
  )
}