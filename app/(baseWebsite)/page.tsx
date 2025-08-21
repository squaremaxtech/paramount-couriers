import GetStarted from "@/components/getStarted/GetStarted";
import Image from "next/image";
import welcomeBgImage from "@/public/welcome/welcomeBg.jpg"
import welcomeStandardImage from "@/public/welcome/standard.jpg"
import welcomeExpressImage from "@/public/welcome/express.jpg"
import welcomeDoorToDoorImage from "@/public/welcome/doorToDoor.jpg"
import welcomeWareHousingImage from "@/public/welcome/wareHousing.jpg"
import aboutUsIntroImg1 from "@/public/aboutUs/aboutUsIntro1.jpg"
import aboutUsIntroImg2 from "@/public/aboutUs/aboutUsIntro2.jpg"
import Link from "next/link";
import styles from "./page.module.css"
import { servicesData } from "@/lib/data";
import AnimateRateChange from "@/components/animate/AnimateRateChange";

export default function Home() {
  return (
    <main>
      <GetStarted />

      <div style={{ position: "relative", zIndex: 0, padding: "var(--spacingEL) var(--spacingL)" }}>
        <Image alt="mainImg" src={welcomeBgImage} priority={true} fill={true} sizes="100vw" style={{ objectFit: "cover", zIndex: -1 }} />

        <h2 style={{ textTransform: "uppercase", color: "var(--textC1)" }}>WELCOME TO WRAPO</h2>

        <p className="titleText"><span style={{ color: "var(--c1)" }}>Best Courier &</span> Parcel Services</p>

        <ul style={{ display: "grid", alignContent: "flex-start", gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))", gap: "var(--spacingL)" }}>
          {[
            {
              img: welcomeStandardImage,
              title: "standard",
              link: "/services/#",
            },
            {
              img: welcomeExpressImage,
              title: "express",
              link: "/services/#",
            },
            {
              img: welcomeDoorToDoorImage,
              title: "store to door",
              link: "/services/#",
            },
            {
              img: welcomeWareHousingImage,
              title: "ware housing",
              link: "/services/#",
            },
          ].map((eachViewMoreObj, eachViewMoreObjIndex) => {
            return (
              <li key={eachViewMoreObjIndex} className={`${styles.welcomeItem} container`} style={{ aspectRatio: "1/1", position: "relative", zIndex: 0, justifyItems: "center", alignContent: "flex-end", }}>
                {/* 1920 */}
                <Image alt={`${eachViewMoreObj.title} image`} src={eachViewMoreObj.img} fill={true} sizes="(max-width: 800px) 100vw, 50vw" style={{ objectFit: "cover", zIndex: -1 }} />

                <div style={{ display: "grid", justifyItems: "center", margin: "var(--spacingL)" }} className="resetTextMargin">
                  <h4>{eachViewMoreObj.title}</h4>

                  <Link href={eachViewMoreObj.title} className={styles.welcomeItemButton}>
                    <button className="button1">
                      view more
                    </button>
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <section>
        <div className="twoColumnFlex">
          <div style={{ position: "relative" }}>
            <Image alt="aboutUsIntroImg1" src={aboutUsIntroImg1} width={1000} height={1000} style={{ objectFit: "contain", width: "80%" }} />

            <Image alt="aboutUsIntroImg2" src={aboutUsIntroImg2} width={1000} height={1000} style={{ objectFit: "contain", position: "absolute", width: "70%", bottom: 0, right: 0 }} />

            <div style={{ position: "absolute", top: 0, right: 0, rotate: "-90deg", transformOrigin: "top right", translate: "-50% 0%" }}>
              <h4 style={{ maxWidth: "150px" }}><span className="highlightText">25</span> Years Of Experience</h4>
            </div>

            <div style={{ borderRadius: "var(--borderRadiusEL)", backgroundColor: "var(--c1)", aspectRatio: "1/1", width: "var(--sizeEEL)", padding: "var(--spacingS)", position: "relative", margin: "var(--spacingR)" }}>
              <span className="material-symbols-outlined largeIcon" style={{ position: "absolute", top: "50%", left: "50%", translate: "-50% -50%" }}>
                play_arrow
              </span>
            </div>
          </div>

          <div>
            <h2>About us</h2>

            <h1 style={{ textAlign: "start" }}>Top Courier <span className="highlightText">& Mover Service</span></h1>

            <h4>Build a Unique Creative Website with Courier Delivery & Storage Services</h4>

            <p>Couriers are distinguished from ordinary mail services by features such as speed, security, tracking, signature, specialization</p>

            <ul className="container" style={{ gridTemplateColumns: "1fr 1fr", paddingBlock: "var(--spacingR)" }}>
              {[
                {
                  title: "standard",
                },
                {
                  title: "ware housing",
                },
                {
                  title: "express",
                },
                {
                  title: "apply online",
                },
                {
                  title: "door to door",
                },
                {
                  title: "receive goods",
                },
              ].map((eachOffserService, eachOffserServiceIndex) => {
                return (
                  <li key={eachOffserServiceIndex} className="flexContainer resetTextMargin" style={{ gap: 'var(--spacingM)' }}>
                    <div style={{ borderRadius: "var(--borderRadiusEL)", backgroundColor: "var(--c1)", aspectRatio: "1/1", width: "var(--sizeS)", padding: "var(--spacingR)", position: "relative", color: "var(--textC2)" }}>
                      <span className="material-symbols-outlined" style={{ position: "absolute", top: "50%", left: "50%", translate: "-50% -50%" }}>
                        check
                      </span>
                    </div>

                    <h5>{eachOffserService.title}</h5>
                  </li>
                )
              })}
            </ul>

            <button className="button1">learn more</button>
          </div>
        </div>
      </section>

      <section>
        <h1>our services</h1>

        <ul className="container" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "var(--spacingL)", overflow: "auto" }}>
          {servicesData.map((eachService, eachServiceIndex) => {
            return (
              <li key={eachServiceIndex}>
                <Link href={eachService.link} className={`${styles.eachService} container`}>
                  <span className={`${styles.swapColor} material-symbols-outlined largeIcon`}>
                    {eachService.iconName}
                  </span>

                  <h3>{eachService.title}</h3>

                  <p>{eachService.shortDescription}</p>

                  <ul className="container" style={{ gap: "var(--spacingS)" }}>
                    {eachService.subItems.map((eachSubItem, eachSubItemIndex) => {
                      return (
                        <li key={eachSubItemIndex} className="flexContainer resetTextMargin">
                          <span className={styles.swapColor}>-</span>

                          <p>{eachSubItem}</p>
                        </li>
                      )
                    })}
                  </ul>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section>
        <div className="twoColumnFlex">
          <div>
            <h1 style={{ textAlign: "start" }}>Mission & <span className="highlightText">Vision</span></h1>

            <p>Couriers are distinguished from ordinary mail services by features such as speed, security, tracking, signature, specialization and individualization of express services.</p>

            <ul className="container" style={{ paddingBlock: "var(--spacingR)" }}>
              {[
                {
                  title: "standard courier",
                },
                {
                  title: "express courier",
                },
                {
                  title: "pallet courier",
                },
              ].map((eachMissionCheck, eachMissionCheckIndex) => {
                return (
                  <li key={eachMissionCheckIndex} className="flexContainer resetTextMargin" style={{ gap: 'var(--spacingM)' }}>
                    <span className="material-symbols-outlined highlightText" style={{ fontSize: "var(--fontSizeM)" }}>
                      check
                    </span>

                    <h5>{eachMissionCheck.title}</h5>
                  </li>
                )
              })}
            </ul>
          </div>

          <div style={{ backgroundColor: "var(--c1)", padding: "var(--spacingL)", color: "var(--textC2)" }}>
            <ul className="container">
              {[
                {
                  iconName: "person_apron",
                  amount: 500,
                  title: "expert & professional staff",
                  plus: true
                },
                {
                  iconName: "package",
                  amount: 250,
                  title: "goods delivered",
                },
                {
                  iconName: "rewarded_ads",
                  amount: 520,
                  title: "awards achieved",
                  plus: true
                },
              ].map((eachMissionGoal, eachMissionGoalIndex) => {
                return (
                  <li key={eachMissionGoalIndex} className="container" style={{ gridTemplateColumns: "auto 1fr", borderTop: eachMissionGoalIndex !== 0 ? "1px solid var(--bg1)" : "" }}>
                    <span className="material-symbols-outlined largeIcon">
                      {eachMissionGoal.iconName}
                    </span>

                    <div>
                      <div className="flexContainer">
                        <p style={{ fontSize: "var(--fontSizeML)", fontWeight: 600 }}>
                          <AnimateRateChange
                            amount={eachMissionGoal.amount}
                          />
                        </p>

                        {eachMissionGoal.plus && <span className="">+</span>}
                      </div>

                      <h5 style={{ color: "inherit" }}>{eachMissionGoal.title}</h5>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>
    </main >
  );
}