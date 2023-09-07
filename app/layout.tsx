import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/toaster";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    site: "@alanaagoyal",
    creator: "@alanaagoyal",
    title: siteConfig.name,
    description: siteConfig.description,
    images: siteConfig.ogImage,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="relative flex min-h-screen flex-col">
            <div className="banner">
              <a href="https://basecase.vc/blog/building-with-the-batch-s23">
                Read about how we built Rebase 👉🏼
              </a>
            </div>
            <SiteHeader />
            <Toaster />
            {children}
            <div className="flex-1"></div>
          </div>
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
