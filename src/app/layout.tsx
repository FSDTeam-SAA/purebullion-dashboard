import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import MainProviders from "@/Providers/MainProviders";

const sfProDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/SFProDisplay-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/SFProDisplay-Ultralight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/SFProDisplay-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/SFProDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/SFProDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/SFProDisplay-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/SFProDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/SFProDisplay-Heavy.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/SFProDisplay-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/SFProDisplay-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/SFProDisplay-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/SFProDisplay-SemiboldItalic.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../public/fonts/SFProDisplay-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-sf-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pure Bullion Dashboard",
  description: "Pure Bullion - Information Creates Opportunity",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sfProDisplay.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <MainProviders>{children}</MainProviders>
      </body>
    </html>
  );
}
