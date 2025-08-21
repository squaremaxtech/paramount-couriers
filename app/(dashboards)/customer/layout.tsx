import DashboardLayout from "@/components/dashboardLayout/DashboardLayout";
import Logo from "@/components/logo/Logo";
import { customerCheck } from "@/serverFunctions/handleAuth";

export default async function CustomerLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  await customerCheck()

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
            <span className="material-symbols-outlined largerIcon">
              home
            </span>
          ),
          link: `/customer`,
          title: "home",
          dashboardHome: true,
        },
        {
          icon: (
            <span className="material-symbols-outlined largerIcon">
              package_2
            </span>
          ),
          link: `/customer/packages`,
          title: "packages"
        },
        {
          icon: (
            <span className="material-symbols-outlined largerIcon">
              quick_reorder
            </span>
          ),
          link: `/customer/preAlerts`,
          title: "pre alerts"
        },
        {
          icon: (
            <span className="material-symbols-outlined largerIcon">
              add_card
            </span>
          ),
          link: ``,
          title: "rates"
        },
        {
          icon: (
            <span className="material-symbols-outlined largerIcon">
              add_location_alt
            </span>
          ),
          link: ``,
          title: "addresses"
        },
      ]}
    >
      {children}
    </DashboardLayout>
  );
}