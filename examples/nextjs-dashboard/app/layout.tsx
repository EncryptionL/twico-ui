import type { Metadata } from "next";
import "twico-ui/styles.css";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Twico Dashboard",
  description: "Admin dashboard example built with Twico UI — authentication + RBAC.",
};

// Apply the persisted theme before first paint to avoid a flash of the wrong
// theme. Matches the storage key used by Twico UI's `useColorScheme` ("twico-theme").
// Static string, no user input — the standard Next.js anti-FOUC pattern.
const themeScript = `(function(){try{var t=localStorage.getItem("twico-theme");var d=t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d){document.documentElement.classList.add("dark")}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
