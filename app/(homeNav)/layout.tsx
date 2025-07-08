import { auth } from "@/auth/auth";
import Navbar from "@/components/navbar/Navbar";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()

  return (
    <>
      <Navbar menuInfoArr={[
        {
          title: "home",
          link: "/",
          subMenu: [
            {
              title: "homeSub",
              link: "/",
            },
            {
              title: "homeSub2",
              link: "/",
              subSubMenu: [
                {
                  title: "homeSubSub1",
                  link: "/",
                },
                {
                  title: "homeSubSub2",
                  link: "/",
                },
              ]
            },
            {
              title: "homeSub3",
              link: "/",
            },
          ]
        },
        {
          title: "how it works",
          link: "/howItWorks",
        },
        {
          title: "pricing & rates",
          link: "/rates",
        },
        {
          title: "support",
          link: "/support",
        },
        {
          title: "about us",
          link: "/aboutUs",
        },
        {
          title: "contact",
          link: "/contact",
        },
      ]} session={session} />

      {children}
    </>
  );
}
