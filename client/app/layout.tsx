import ClientProvider from "@/components/ClientProvider";
import { Navbar } from "@/components/navbar";
import { fontSans } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import "@/styles/globals.css";
import clsx from "clsx";
import { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ClientProvider>
          <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
            <Toaster />
            <div className="relative flex flex-col h-screen">
              <Navbar />
              <main>{children}</main>
              {/* <footer className="w-full flex items-center justify-center py-3">
                <Link
                  isExternal
                  className="flex items-center gap-1 text-current"
                  href="https://github.com/shivesh-anand"
                  title="About BlockCharge"
                >
                  <span className="text-default-600">Powered by</span>
                  <p className="text-primary">BlockCharge</p>
                </Link>
              </footer> */}
            </div>
          </Providers>
        </ClientProvider>
      </body>
    </html>
  );
}
