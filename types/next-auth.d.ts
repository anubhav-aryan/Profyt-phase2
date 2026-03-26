import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: "analyst" | "client";
    clientId?: string | null;
  }

  interface Session {
    user: DefaultSession["user"] & {
      role: "analyst" | "client";
      clientId: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "analyst" | "client";
    clientId?: string | null;
  }
}
