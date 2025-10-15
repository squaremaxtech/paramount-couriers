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
        {
          icon: (
            <span className="material-symbols-outlined mediumIcon">
              account_circle
            </span>
          ),
          link: `/employee/users`,
          title: "users"
        },
        {
          icon: (
            <span className="material-symbols-outlined mediumIcon">
              database
            </span>
          ),
          link: `/admin/database`,
          title: "database"
        },
      ]}
    >
      {children}
    </DashboardLayout>
  );
}