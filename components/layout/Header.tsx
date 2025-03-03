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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { LoginLink, LogoutLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Roles, Role } from "@/lib/roles";
import { LayoutDashboard, LogOut, Menu, Settings, Phone, Info, Headset, HelpCircle, X } from "lucide-react";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export default function Header() {
  const { isAuthenticated, user } = useKindeAuth();
  const [userRole, setUserRole] = useState<Role>(Roles.USER);
  const [isOpen, setIsOpen] = useState(false);

  const NavigationLinks = () => (
    <ul className="flex flex-col md:flex-row md:mt-2 space-y-6 md:space-y-0 md:space-x-6 text-gray-500 font-medium">
      <li className="hover:text-lienzo transition-colors duration-200">
        <Link href="/contact" className="flex items-center gap-2">
          <Phone className="h-5 w-5 md:hidden" />
          Contact
        </Link>
      </li>
      <li className="hover:text-lienzo transition-colors duration-200">
        <Link href="/about" className="flex items-center gap-2">
          <Info className="h-5 w-5 md:hidden" />
          About Us
        </Link>
      </li>
      <li className="hover:text-lienzo transition-colors duration-200">
        <Link href="/maintenance" className="flex items-center gap-2">
          <Headset className="h-5 w-5 md:hidden" />
          Support
        </Link>  
      </li>
      <li className="hover:text-lienzo transition-colors duration-200">
        <Link href="/faq" className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 md:hidden" />
          FAQ
        </Link>
      </li>
    </ul>
  );

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

  const UserMenu = () => (
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
              <Link className="gap-2 text-gray-500" href="/dashboard">
                <LayoutDashboard className="size-4" /> Dashboard
              </Link>
            </DropdownMenuItem>
            {userRole === Roles.ADMIN && (
              <DropdownMenuItem asChild>
                <Link className="gap-2 text-gray-500" href="/settings">
                  <Settings className="size-4" /> Settings
                </Link>
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
  );

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="w-full py-5 px-4 md:px-10 mx-auto sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center">
            <div className='flex items-start gap-2'>
              <Image src="/lienzo-logo.png" alt="Lienzo Logo" width={40} height={50} />
              <div className='flex flex-col items-start'>
                <h1 className='text-4xl font-bold'>Lienzo</h1>
              </div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <NavigationLinks />
          </nav>
        </div>

        {/* Desktop User Menu */}
        <div className="hidden md:block">
          <UserMenu />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[96%]">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2">
                    <Image src="/lienzo-logo.png" alt="Lienzo Logo" width={32} height={40} />
                    <h1 className='text-2xl font-bold'>Lienzo</h1>
                  </Link>
                  <DrawerClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                    </Button>
                  </DrawerClose>
                </div>

                <Separator className="my-4" />
                
                <NavigationLinks />
                
                <Separator className="my-4" />
                
                <div className="flex flex-col space-y-4">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="size-10">
                          <AvatarImage src={user?.picture ?? ""} alt={user?.given_name ?? "User"} />
                          <AvatarFallback>{getInitials(user?.given_name ?? "User")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user?.given_name}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                      </div>

                      <Badge 
                        className={cn(
                          "w-full flex items-center justify-center py-1 border text-sm",
                          getBadgeVariant(userRole)
                        )}
                      >
                        {userRole}
                      </Badge>

                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start gap-2"
                          asChild
                          size={"lg"}
                        >
                          <Link href="/dashboard">
                            <LayoutDashboard className="size-4" /> Dashboard
                          </Link>
                        </Button>

                        {userRole === Roles.ADMIN && (
                          <Button 
                            variant="outline"
                            className="w-full justify-start gap-2"
                            asChild
                            size={"lg"}
                          >
                            <Link href="/settings">
                              <Settings className="size-4" /> Settings
                            </Link>
                          </Button>
                        )}

                        <LogoutLink>
                          <Button 
                            variant="destructive"
                            className="w-full justify-start gap-2 mt-2"
                            size={"lg"}
                          >
                            <LogOut className="size-4" /> Logout
                          </Button>
                        </LogoutLink>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button className="w-full" size={"lg"} asChild>
                        <LoginLink>Sign In</LoginLink>
                      </Button>
                      <Button className="w-full bg-lienzo hover:bg-lienzo/90" size={"lg"} asChild>
                        <RegisterLink>Get Started</RegisterLink>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}