import type { ReactNode } from "react";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full bg-off font-sans text-black">{children}</div>
  );
}
