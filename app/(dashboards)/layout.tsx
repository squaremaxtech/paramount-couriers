import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}