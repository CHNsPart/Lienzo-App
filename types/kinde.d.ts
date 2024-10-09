import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";

declare module "@kinde-oss/kinde-auth-nextjs" {
  export interface KindeAuth {
    login: () => Promise<void>;
    logout: () => Promise<void>;
    register: () => Promise<void>;
    getUser: () => Promise<KindeUser<Record<string, string>> | null>;
  }

  export function useKindeAuth(): KindeAuth;
}