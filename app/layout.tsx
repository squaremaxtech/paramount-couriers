import "./globals.css";
import type { Metadata } from "next";
import { Alegreya, Rubik } from "next/font/google"
import { Toaster } from "react-hot-toast";
import localFont from "next/font/local";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth/auth";

const rubik = Rubik({
  variable: "--rubik",
  subsets: ["latin"],
});

const alegreya = Alegreya({
  variable: "--alegreya",
  subsets: ["latin"],
});

const materialSymbolsOutlined = localFont({
  src: "./fonts/MaterialSymbolsOutlined-VariableFont_FILL,GRAD,opsz,wght.ttf",
  variable: "--materialSymbolsOutlined",
});
const materialSymbolsRounded = localFont({
  src: "./fonts/MaterialSymbolsRounded-VariableFont_FILL,GRAD,opsz,wght.ttf",
  variable: "--materialSymbolsRounded",
});
const materialSymbolsSharp = localFont({
  src: "./fonts/MaterialSymbolsSharp-VariableFont_FILL,GRAD,opsz,wght.ttf",
  variable: "--materialSymbolsSharp",
});

const metadataInfo = {
  title: "Paramount Couriers",
  description: "Paramount Couriers provides fast, reliable, and affordable shipping services from the U.S. to Jamaica. From standard and express deliveries to store-to-door service and secure warehousing, we make it simple to shop abroad and receive your packages hassle-free."
}

export const metadata: Metadata = {
  title: metadataInfo.title,
  description: metadataInfo.description,
  metadataBase: new URL('https://paramount-couriers.com'),
  openGraph: {
    title: metadataInfo.title,
    description: metadataInfo.description,
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()

  return (
    <html lang="en">
      <body className={`${alegreya.variable} ${rubik.variable} ${materialSymbolsOutlined.variable} ${materialSymbolsRounded.variable} ${materialSymbolsSharp.variable} antialiased`}>
        <SessionProvider session={session}>

          <Toaster position="top-center" reverseOrder={false} />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}