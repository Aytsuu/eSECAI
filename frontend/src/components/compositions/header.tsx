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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import Link from "next/link";

interface NavItem {
  path: string;
  title: string;
}

interface DropdownItem {
  title: string;
  icon: LucideIcon;
  action: () => void;
}

export const Header = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const split_path = pathname.split("/").slice(1);
  const formattedPaths = split_path.map((pathName, index) => {
    const firstLetter = pathName[0].toUpperCase();
    const capitalizedHeader = firstLetter + pathName.slice(1);
    const url = "/" + split_path.slice(0,index + 1).join("/");

    return {
      header: capitalizedHeader,
      url: url,
    };
  });

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
      <div className="flex justify-between items-center bg-custom-primary-contrast py-2 px-5 border-b border-white/10">
        <Breadcrumb>
          <BreadcrumbList>
            {formattedPaths.map((path, index) => {
              if (index == formattedPaths.length - 1) {
                return (
                  <BreadcrumbItem key={`${path}-${index}`}>
                    <BreadcrumbPage>
                      <h1 className="font-medium text-base">{path.header}</h1>
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                );
              }

              return (
                <React.Fragment key={`${path}-${index}`}>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={path.url}>
                        <h1 className="font-medium text-base">{path.header}</h1>
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator/>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex gap-4 items-center">
          <CircleQuestionMark
            size={22}
            className="cursor-pointer hover:scale-105"
          />

          <Popover>
            <PopoverTrigger>
              <Bell size={22} className="cursor-pointer hover:scale-105" />
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
              <div className="flex items-center gap-4 cursor-pointer p-2 hover:bg-sidebar-accent rounded-sm group">
                <Avatar>
                  <AvatarImage src={user?.displayImage} alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="text-start flex flex-col  leading-5">
                  <span className="font-medium">
                    {user?.displayName ?? "User"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                {dropdown_items.map((item: DropdownItem, index: number) => (
                  <DropdownMenuItem
                    key={index}
                    className="cursor-pointer"
                    onClick={item.action}
                  >
                    <item.icon /> {item.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={isOpenLogoutDialog}>
        <AlertDialogContent className="bg-custom-primary-contrast">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure of this action?</AlertDialogTitle>
            <AlertDialogDescription>asdasd</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpenLogoutDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-red-600"
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
