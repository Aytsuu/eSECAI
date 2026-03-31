"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Bell,
  LogOut,
  User,
  LucideIcon,
  CircleQuestionMark,
  LayoutDashboard,
  GraduationCap,
  Settings
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/popover";
import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DropdownItem {
  title: string;
  icon: LucideIcon;
  action: () => void;
}

const navLinks = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Classrooms",
    url: "/classrooms",
    icon: GraduationCap,
  }
];

export const Header = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const [isOpenLogoutDialog, setIsOpenLogoutDialog] =
    React.useState<boolean>(false);

  const dropdown_items: DropdownItem[] = [
    {
      title: "Profile",
      icon: User,
      action: () => {},
    },
    {
      title: "Logout",
      icon: LogOut,
      action: () => setIsOpenLogoutDialog(true),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center bg-background px-6 border-b border-border/50 sticky top-0 z-50 h-14">
        <div className="flex items-center gap-8 h-full">
          <Link href="/dashboard" className="flex items-center gap-2 mr-4">
            <span className="font-bold text-xl tracking-tight">esecai</span>
          </Link>
          
          <nav className="items-center gap-6 hidden md:flex h-full">
            {navLinks.map((item) => {
              const isActive = pathname.startsWith(item.url);
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  className={cn(
                    "flex items-center gap-2 py-4 text-sm font-medium transition-colors relative",
                    isActive 
                      ? "text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon size={16} />
                  {item.title}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-blue-500 to-indigo-500 rounded-t-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex gap-4 items-center h-full">
          <Link href="/settings" className="flex items-center">
            <Settings size={20} className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors" />
          </Link>
          
          <CircleQuestionMark
            size={20}
            className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
          />

          <Popover>
            <PopoverTrigger>
              <Bell size={20} className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors" />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>
                <PopoverTitle>Notification</PopoverTitle>
                <PopoverDescription>
                  Be notified with the latest updates
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-4 cursor-pointer p-1 rounded-full group hover:bg-secondary/50 transition-colors">
                <div className="p-0.5 rounded-full bg-linear-to-r from-blue-500 to-indigo-500">
                  <Avatar className="w-8 h-8 border-2 border-background">
                    <AvatarImage src={user?.displayImage} alt="User Avatar" />
                    <AvatarFallback className="text-xs">
                      {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                {dropdown_items.map((item: DropdownItem, index: number) => (
                  <DropdownMenuItem
                    key={index}
                    className="cursor-pointer focus:bg-blue-500/10 focus:text-blue-600 dark:focus:text-blue-400"
                    onSelect={item.action}
                  >
                    <item.icon className="mr-2" size={16} /> {item.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={isOpenLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out of your account?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be signed out of your session. Make sure you've saved any 
              current classroom progress before leaving.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpenLogoutDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={logout}
            >
              Yes, Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
