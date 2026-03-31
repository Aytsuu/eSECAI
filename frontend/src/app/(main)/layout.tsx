"use client";

import { Header } from "@/components/compositions/header";

export default ({children} : {children: React.ReactNode}) => {
  return (
    <div className="w-screen h-screen flex flex-col bg-custom-primary overflow-hidden">
      <Header/>
      <div className="w-full flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}