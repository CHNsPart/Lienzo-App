// types/kinde-auth.d.ts

import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";

declare module "@kinde-oss/kinde-auth-nextjs" {
  export interface KindeAuth {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: KindeUser | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    register: () => Promise<void>;
    getToken: () => Promise<string | null>;
    getPermissions: () => Promise<string[]>;
    // Add any other properties or methods you're using from useKindeAuth
  }

  export function useKindeAuth(): KindeAuth;
}