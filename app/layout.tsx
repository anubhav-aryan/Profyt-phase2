import type { Metadata } from "next";
import { DM_Mono, DM_Serif_Display, Instrument_Sans } from "next/font/google";
import Script from "next/script";
import { Providers } from "@/components/Providers";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans-instrument",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PROFYT — Analyst Tool",
  description:
    "PROFYT financial diagnostics — profit scale, engineered. Internal analyst and client portal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={`${instrumentSans.variable} ${dmSerif.variable} ${dmMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning={true}>
        {/* Runs before React hydrates — removes attrs some extensions inject on <body> (e.g. cz-shortcut-listen). */}
        <Script id="strip-extension-body-attrs" strategy="beforeInteractive">
          {`try{var b=document.body;if(b)b.removeAttribute("cz-shortcut-listen");}catch(e){}`}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
