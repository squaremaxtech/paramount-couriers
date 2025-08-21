import DashboardLayout from "@/components/dashboardLayout/DashboardLayout";
import Logo from "@/components/logo/Logo";
import { employeeOrAdminCheck } from "@/serverFunctions/handleAuth";

export default async function EmployeeLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  await employeeOrAdminCheck()

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
          link: `/employee`,
          title: "home",
          dashboardHome: true,
        },
        {
          icon: (
            <span className="material-symbols-outlined largerIcon">
              package_2
            </span>
          ),
          link: `/employee/packages`,
          title: "packages"
        },
        {
          icon: (
            <span className="material-symbols-outlined largerIcon">
              quick_reorder
            </span>
          ),
          link: `/employee/preAlerts`,
          title: "preAlerts"
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
        //  {
        //   icon: (
        //     <span className="material-symbols-outlined largerIcon">

        //     </span>
        //   ),
        //   link: "",
        //   title: ""
        // },
      ]}
    >
      {children}
    </DashboardLayout>
  );
}
