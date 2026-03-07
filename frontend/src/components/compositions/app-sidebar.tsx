"use client";

import * as React from "react";
import { FcBarChart } from "react-icons/fc";
import { FcGraduationCap } from "react-icons/fc";
import { FcSettings } from "react-icons/fc";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: FcBarChart,
    },
    {
      title: "Classrooms",
      url: "/classrooms",
      icon: FcGraduationCap,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: FcSettings
    }
  ],
};

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname();
  const currentPath = pathname.split("/").slice(1)[0];

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex gap-2 p-2">
          eSECAI
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={item.url.slice(1) == currentPath}
                  // className="data-[active=true]:bg-blue-700 data-[active=true]:text-white"
                >
                  <Link href={item.url}>
                    <item.icon />
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
