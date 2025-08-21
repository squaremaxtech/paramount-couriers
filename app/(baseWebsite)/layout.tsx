import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";

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
            subMenu: [
              {
                title: "service details",
                link: "/services",
              },
            ]
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