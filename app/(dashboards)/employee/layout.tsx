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
            <span className="material-symbols-outlined largeIcon">
              home
            </span>
          ),
          link: `/employee`,
          title: "home",
          dashboardHome: true,
        },
        {
          icon: (
            <span className="material-symbols-outlined largeIcon">
              package_2
            </span>
          ),
          link: `/employee/packages/add`,
          title: "packages"
        },
        {
          icon: (
            <span className="material-symbols-outlined largeIcon">
              help_center
            </span>
          ),
          link: ``,
          title: "faq"
        },
        {
          icon: (
            <span className="material-symbols-outlined largeIcon">
              add_card
            </span>
          ),
          link: ``,
          title: "rates"
        },
        {
          icon: (
            <span className="material-symbols-outlined largeIcon">
              add_location_alt
            </span>
          ),
          link: ``,
          title: "addresses"
        },
        //  {
        //   icon: (
        //     <span className="material-symbols-outlined largeIcon">

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
