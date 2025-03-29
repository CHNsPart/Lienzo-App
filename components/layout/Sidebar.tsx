import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Key, Store, Users, FileText, MessageSquareQuote, Quote, Loader2, Headset } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Roles, Role } from "@/lib/roles";

export default function Sidebar() {
  const { isAuthenticated } = useKindeAuth();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<Role>(Roles.USER);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      fetch('/api/user-claims')
        .then(response => response.json())
        .then(data => {
          setUserRole(data.role || Roles.USER);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching user claims:', error);
          setIsLoading(false);
        });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;
  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-lienzo" />
    </div>
  );

  // Base links for all users
  const baseLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/licenses", label: "Licenses", icon: Key },
    { href: "/store", label: "Store", icon: Store },
    { href: "/support", label: "Support", icon: Headset }
  ];

  // Admin-only links
  const adminLinks = [
    { href: "/clients", label: "Clients", icon: Users },
    { href: "/license-requests", label: "License Requests", icon: FileText },
    { href: "/quote-requests", label: "Quote Requests", icon: MessageSquareQuote },
    { href: "/quote-maintenance", label: "Quote Maintenance", icon: Quote },
  ];

  // Support link
  // const supportLink = [
  //   { href: "/support", label: "Support", icon: Headset }
  // ];

  // Determine which links to show based on role
  let links = [...baseLinks];

  if (userRole === Roles.ADMIN) {
    links = [...baseLinks, ...adminLinks];
  }

  // if (userRole === Roles.ADMIN || userRole === Roles.SUPPORT) {
  //   links = [...links, ...supportLink];
  // }

  return (
    <aside className="bg-[#F9F9F9] border-r text-black w-64 min-h-screen p-4">
      <nav>
        <ul>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.href} className="mb-2">
                <Link
                  href={link.href}
                  className={`flex items-center px-5 py-2 rounded hover:bg-[#373A42] hover:text-white ${
                    pathname === link.href ? "bg-[#373A42] border-bg-black text-white" : ""
                  }`}
                >
                  <Icon className="mr-2 size-5" />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}