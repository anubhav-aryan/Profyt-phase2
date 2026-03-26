"use client";

import { signOut } from "next-auth/react";

export function ClientSignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/portal/login" })}
      className="profyt-btn-secondary px-6"
    >
      Sign out
    </button>
  );
}
