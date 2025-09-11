import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import { servicesData } from "@/lib/data";

export default function BaseWebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <Navbar
        menuInfoArr={[
          {
            title: "home",
            link: "/",
          },
          {
            title: "services",
            link: "/services",
            subMenu: servicesData.map(eachService => {
              return {
                title: eachService.title,
                link: `/services#${eachService.slug}`
              }
            })
          },
          {
            title: "about us",
            link: "/aboutUs",
          },
          {
            title: "contact us",
            link: "/contactUs",
          },
          {
            title: "rates",
            link: "/rates",
          },
        ]}
      />

      {children}

      <Footer />
    </>
  );
}