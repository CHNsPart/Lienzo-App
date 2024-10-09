// components/KindeProvider.tsx
"use client";

import { KindeProvider as KindeProviderBase } from "@kinde-oss/kinde-auth-nextjs";
import { ReactNode } from "react";

export function KindeProvider({ children }: { children: ReactNode }) {
  return <KindeProviderBase>{children}</KindeProviderBase>;
}