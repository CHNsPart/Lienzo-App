// components/AuthButtons.tsx
"use client";

import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "@/components/ui/button";
import { LoginLink, RegisterLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export function LoginButton() {
  return (
    <LoginLink>
      <Button variant="outline">Sign in</Button>
    </LoginLink>
  );
}

export function LogoutButton() {
  return (
    <LogoutLink>
      <Button variant="outline">Sign out</Button>
    </LogoutLink>
  );
}

export function RegisterButton() {
  return (
    <RegisterLink>
      <Button className="bg-[#F26B60] hover:bg-[#F26B60]/90 text-white">Get Started</Button>
    </RegisterLink>
  );
}

export function AuthButtons() {
  const { isAuthenticated, user }:any = useKindeAuth();

  if (isAuthenticated) {
    return (
      <>
        <span>Welcome, {user?.given_name || 'User'}!</span>
        <Button variant="outline" asChild>
          <a href="/dashboard">Dashboard</a>
        </Button>
        <LogoutButton />
      </>
    );
  }

  return (
    <>
      <LoginButton />
      <RegisterButton />
    </>
  );
}