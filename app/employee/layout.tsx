import DashboardDesign from "@/components/dashboardDesign/DashboardDesign";
import Logo from "@/components/logo/Logo";

export default async function EmployeeLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <DashboardDesign
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
          title: "home"
        },
        {
          icon: (
            <span className="material-symbols-outlined largeIcon">
              package_2
            </span>
          ),
          link: `/employee/packages`,
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
    </DashboardDesign>
  );
}
