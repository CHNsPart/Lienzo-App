"use client";

import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { LoginButton, LogoutButton, RegisterButton } from '../AuthButtons';

export function AuthStatus() {
  const { isAuthenticated, user }: any = useKindeAuth();

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {user?.given_name || 'User'}!</p>
        <LogoutButton />
      </div>
    );
  }

  return (
    <div>
      <LoginButton />
      <RegisterButton />
    </div>
  );
}