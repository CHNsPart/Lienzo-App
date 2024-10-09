// components/layout/SidebarWrapper.tsx
"use client";

import { usePathname } from 'next/navigation';
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import Sidebar from './Sidebar';

export default function SidebarWrapper() {
  const pathname = usePathname();
  const { isAuthenticated }:any = useKindeAuth();

  // Hide sidebar on home page ("/") for non-authenticated users
  if (pathname === "/") {
    return null;
  }

/*   || "/contact" || "/aboutus" || "/faq" */

  

  // Show sidebar for authenticated users on all other pages
  if (isAuthenticated) {
    return <Sidebar />;
  }

  // Hide sidebar for non-authenticated users on all other pages
  return null;
}