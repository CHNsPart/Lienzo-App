"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { AuthButtons } from "@/components/AuthButtons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Roles, Role } from "@/lib/roles";
import { LayoutDashboard, LogOut, Settings } from "lucide-react";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export default function Header() {
  const { isAuthenticated, user } = useKindeAuth();
  const [userRole, setUserRole] = useState<Role>(Roles.USER);

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/user-claims')
        .then(response => response.json())
        .then(data => {
          setUserRole(data.role || Roles.USER);
        })
        .catch(error => console.error('Error fetching user claims:', error));
    }
  }, [isAuthenticated]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getBadgeVariant = (role: string) => {
    switch (role) {
      case Roles.ADMIN:
        return "border-violet-200 bg-gradient-to-r from-violet-50 via-violet-100 to-violet-50 text-violet-700 hover:bg-violet-100 hover:border-violet-300 hover:text-violet-800";
      case Roles.MANAGER:
        return "border-sky-200 bg-gradient-to-r from-sky-50 via-sky-100 to-sky-50 text-sky-700 hover:bg-sky-100 hover:border-sky-300 hover:text-sky-800";
      case Roles.SUPPORT:
        return "border-emerald-200 bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 hover:text-emerald-800";
      case Roles.USER:
        return "border-gray-200 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-800";
      default:
        return "border-gray-200 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-800";
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="w-full py-5 px-10 mx-auto sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center">
            <div className='flex items-start gap-2'>
              <Image src="/lienzo-logo.png" alt="Lienzo Logo" width={40} height={50} />
              <div className='flex flex-col items-start'>
                <h1 className='text-4xl font-bold'>Lienzo</h1>
              </div>
            </div>
          </Link>
          <nav>
            <ul className="flex mt-2 space-x-6 text-gray-400 font-medium">
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative size-12 rounded-full">
                  <Avatar className="size-12">
                    <AvatarImage src={user?.picture ?? ""} alt={user?.given_name ?? "User"} />
                    <AvatarFallback>{getInitials(user?.given_name ?? "User")}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="flex-col items-start">
                  <div className="text-sm font-medium">{user?.given_name}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                  <Badge 
                    className={cn(
                      "mt-1 w-full flex items-center justify-center border text-xs",
                      "transition-colors duration-200",
                      getBadgeVariant(userRole)
                    )}
                  >
                    {userRole}
                  </Badge>
                </DropdownMenuItem>
                <Separator className="my-2" />
                <DropdownMenuItem asChild>
                  <Link className="gap-2 text-gray-500" href="/dashboard"><LayoutDashboard className="size-4" /> Dashboard</Link>
                </DropdownMenuItem>
                {userRole === Roles.ADMIN && (
                  <DropdownMenuItem asChild>
                    <Link className="gap-2 text-gray-500" href="/settings"><Settings className="size-4" /> Settings</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="hover:bg-red-100 hover:text-red-500 text-red-500" asChild>
                  <LogoutLink className="gap-2"><LogOut className="size-4" /> Logout</LogoutLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AuthButtons />
          )}
        </div>
      </div>
    </header>
  );
}