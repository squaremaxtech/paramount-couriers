import DashboardLayout from "@/components/dashboardLayout/DashboardLayout";
import Logo from "@/components/logo/Logo";
import { adminCheck } from "@/serverFunctions/handleAuth";

export default async function AdminLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  await adminCheck()

  return (
    <DashboardLayout
      navMenu={[
        {
          icon: (
            <Logo />
          ),
          link: null,
          title: ""
        },
      ]}
    >
      {children}
    </DashboardLayout>
  );
}