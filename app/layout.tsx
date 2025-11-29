import type { Metadata } from "next";
import { Josefin_Sans, Jost } from "next/font/google";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/constants";
import AppProvider from "./(providers)/AppProvider";
import TanstackProvider from "./(providers)/QueryProvider";
import { GlobalRouteLoader } from "@/common/widgets/GlobalLoader";
import { Toaster } from "react-hot-toast";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const josefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
});
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: ["fashion", "clothing", "apparel", "style", "design", "craftsmanship", "elegance", "luxury", "christian", "tailored", "bespoke", "quality fabrics", "timeless fashion"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jost.variable} ${josefinSans.variable} font-jost font-josefin-sans antialiased text-foreground bg-background`}
      >
        <GlobalRouteLoader />
        <Toaster position="top-right" />
        <AppProvider>
          <TanstackProvider>
            {children}
          </TanstackProvider>
        </AppProvider>
      </body>
    </html>
  );
}
