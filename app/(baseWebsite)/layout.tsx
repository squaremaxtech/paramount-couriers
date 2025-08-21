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
            link: "/about",
          },
          {
            title: "contact us",
            link: "/contact",
          },
          {
            title: "rates",
            link: "/rates",
          },
        ]}
      />

      {children}
    </>
  );
}