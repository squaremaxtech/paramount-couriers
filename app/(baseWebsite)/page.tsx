import GetStarted from "@/components/getStarted/GetStarted";
import Image from "next/image";
import welcomeBgImage from "@/public/welcome/welcomeBg.jpg"
import welcomeStandardImage from "@/public/welcome/standard.jpg"
import welcomeExpressImage from "@/public/welcome/express.jpg"
import welcomeDoorToDoorImage from "@/public/welcome/doorToDoor.jpg"
import welcomeWareHousingImage from "@/public/welcome/wareHousing.jpg"
import aboutUsIntroImg1 from "@/public/aboutUs/aboutUsIntro1.jpg"
import aboutUsIntroImg2 from "@/public/aboutUs/aboutUsIntro2.jpg"
import expressHomeDeliveryImg from "@/public/expressHomeDelivery.jpg"
import Link from "next/link";
import styles from "./page.module.css"
import { servicesData, siteInfo, testimonialsData } from "@/lib/data";
import AnimateRateChange from "@/components/animate/AnimateRateChange";
import DisplayStars from "@/components/displayStars/DisplayStars";
import { ShowFAQ } from "@/components/FAQ/FAQ";

export default function Home() {
  return (
    <main>
      <GetStarted />

      <div style={{ position: "relative", zIndex: 0, padding: "var(--spacingEL) var(--spacingL)" }}>
        <Image alt="mainImg" src={welcomeBgImage} priority={true} fill={true} sizes="100vw" style={{ objectFit: "cover", zIndex: -1 }} />

        <h2 style={{ textTransform: "uppercase", color: "var(--textC1)" }}>WELCOME TO PARAMOUNT COURIERS</h2>

        <p className="titleText"><span style={{ color: "var(--c1)" }}>Fast and reliable</span> U.S. to Jamaica shipping</p>

        <ul style={{ display: "grid", alignContent: "flex-start", gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))", gap: "var(--spacingL)" }}>
          {[
            {
              img: welcomeStandardImage,
              title: "barrel shipping",
              link: "/services/#shipment",
            },
            {
              img: welcomeExpressImage,
              title: "freight shipping",
              link: "/services/#shipment",
            },
            {
              img: welcomeDoorToDoorImage,
              title: "air & sea cargo",
              link: "/services/#shipment",
            },
            {
              img: welcomeWareHousingImage,
              title: "delivery",
              link: "/services/#delivery",
            },
          ].map((eachViewMoreObj, eachViewMoreObjIndex) => {
            return (
              <li key={eachViewMoreObjIndex} className={`${styles.welcomeItem} container`} style={{ aspectRatio: "1/1", position: "relative", zIndex: 0, justifyItems: "center", alignContent: "flex-end", }}>
                {/* 1920 */}
                <Image alt={`${eachViewMoreObj.title} image`} src={eachViewMoreObj.img} fill={true} sizes="(max-width: 800px) 100vw, 50vw" style={{ objectFit: "cover", zIndex: -1 }} />

                <div style={{ display: "grid", justifyItems: "center", margin: "var(--spacingL)" }} className="resetTextMargin">
                  <h4 style={{ textAlign: "center" }}>{eachViewMoreObj.title}</h4>

                  <Link href={eachViewMoreObj.link} className={styles.welcomeItemButton}>
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
            <Image alt="aboutUsIntroImg1" src={aboutUsIntroImg1} width={2000} height={2000} style={{ objectFit: "contain", width: "80%" }} />

            <Image alt="aboutUsIntroImg2" src={aboutUsIntroImg2} width={2000} height={2000} style={{ objectFit: "contain", position: "absolute", width: "70%", bottom: 0, right: 0 }} />

            <div style={{ position: "absolute", top: 0, right: 0, rotate: "-90deg", transformOrigin: "top right", translate: "-50% 0%" }}>
              <h4 style={{ maxWidth: "150px" }}><span className="highlightText">5</span> Years Of Experience</h4>
            </div>

            <div style={{ borderRadius: "var(--borderRadiusEL)", backgroundColor: "var(--c1)", aspectRatio: "1/1", width: "var(--sizeEEL)", padding: "var(--spacingS)", position: "relative", margin: "var(--spacingR)" }}>
              <span className="material-symbols-outlined largerIcon" style={{ position: "absolute", top: "50%", left: "50%", translate: "-50% -50%" }}>
                play_arrow
              </span>
            </div>
          </div>

          <div>
            <h2>About us</h2>

            <h1>Your<span className="highlightText"> Trusted Shipping</span> Partner</h1>

            <h4>Supreme service, supreme speed, from your favorite stores to your door the Paramount way</h4>

            <p>We specialize in bridging the gap between the U.S. and Jamaica, offering a service built on speed, security, tracking, and convenience. With Paramount Couriers, you can ship with confidence, knowing your packages are handled with care and delivered on time.</p>

            <ul className="container" style={{ gridTemplateColumns: "1fr 1fr", paddingBlock: "var(--spacingR)" }}>
              {[
                {
                  title: "barrel shipping",
                },
                {
                  title: "freight shipping",
                },
                {
                  title: "air cargo",
                },
                {
                  title: "sea cargo",
                },
                {
                  title: "store-to-Door Delivery",
                },
                {
                  title: "local pickup",
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

            <Link href={"/services"}>
              <button className="button1">learn more</button>
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h1 style={{ textAlign: "center" }}>our services</h1>

        <ul className="container" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "var(--spacingL)", overflow: "auto" }}>
          {servicesData.map((eachService, eachServiceIndex) => {
            return (
              <li key={eachServiceIndex}>
                <Link href={`services#${eachService.slug}`} className={`${styles.eachService} container`}>
                  <span className={`${styles.swapColor} material-symbols-outlined largerIcon`}>
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
            <h1>Our <span className="highlightText">Mission</span></h1>

            <p>To make shipping from the U.S. to Jamaica simple, affordable, and reliable, by giving customers full visibility of their packages from purchase to delivery.</p>

            <ul className="container" style={{ paddingBlock: "var(--spacingR)" }}>
              {[
                {
                  title: "Transparency",
                },
                {
                  title: "Speed & Reliability",
                },
                {
                  title: "Customer Care",
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
                  iconName: "calendar_month",
                  amount: 5,
                  title: "years in business",
                  plus: "+",
                },
                {
                  iconName: "package",
                  amount: 1200,
                  title: "packages delivered",
                  plus: "+",
                },
                {
                  iconName: "groups",
                  amount: 100,
                  title: "happy customers",
                  plus: "+",
                },
                {
                  iconName: "support_agent",
                  amount: 24,
                  title: "customer support available",
                  short: "hours",
                  plus: "hrs",
                },
              ].map((eachMissionGoal, eachMissionGoalIndex) => {
                return (
                  <li key={eachMissionGoalIndex} className="container" style={{ gridTemplateColumns: "auto 1fr", borderTop: eachMissionGoalIndex !== 0 ? "1px solid var(--bg2)" : "" }}>
                    <span className="material-symbols-outlined largerIcon">
                      {eachMissionGoal.iconName}
                    </span>

                    <div>
                      <div className="flexContainer">
                        <p style={{ fontSize: "var(--fontSizeML)", fontWeight: 600 }}>
                          <AnimateRateChange
                            amount={eachMissionGoal.amount}
                          />
                        </p>

                        {eachMissionGoal.plus !== undefined && <span className="">{eachMissionGoal.plus}</span>}
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

      <section>
        <div className="twoColumnFlex">
          <div>
            <Image alt="expressHomeDeliveryImg" src={expressHomeDeliveryImg} width={2000} height={2000} style={{ objectFit: "contain", width: "100%" }} />
          </div>

          <div>
            <h1>Express <span className="highlightText">Home</span> Delivery</h1>

            <p>With Paramount Couriers, your packages don&apos;t just stop at Jamaica — we bring them directly to you. Enjoy secure, on-time delivery from the U.S. store to your doorstep, with full tracking every step of the way.</p>
          </div>
        </div>
      </section>

      <section>
        <h1 style={{ textAlign: "center" }}>opening hours</h1>

        <ul style={{ display: "grid", gap: "var(--spacingR)", justifyItems: "center" }}>
          {siteInfo.branches.map(eachBranch => {
            return (
              <li key={eachBranch.name} style={{ display: "grid", justifyItems: "center" }}>
                <h5>{eachBranch.name}</h5>
                <p>{eachBranch.openingHours}</p>
              </li>
            )
          })}
        </ul>
      </section>

      <section>
        <h1 style={{ textAlign: "center" }}>faq</h1>

        <ShowFAQ />
      </section>

      <section>
        <h1 style={{ textAlign: "center" }}>Our Testimonial</h1>

        <ul className="container snap" style={{ gridAutoColumns: "min(550px, 100%)", overflow: "auto", gridAutoFlow: "column", }}>
          {testimonialsData.map((eachTestimonial, eachTestimonialIndex) => {
            return (
              <li key={eachTestimonialIndex} className="container" style={{ position: "relative", zIndex: 0 }}>
                <div style={{ position: "absolute", zIndex: -1, top: "50%", right: 0, translate: "0 -40%" }}>
                  <svg style={{ width: "var(--sizeEEL)", height: "var(--sizeEEL)", fill: "var(--shade2)" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M544 360C544 426.3 490.3 480 424 480L416 480C398.3 480 384 465.7 384 448C384 430.3 398.3 416 416 416L424 416C454.9 416 480 390.9 480 360L480 352L416 352C380.7 352 352 323.3 352 288L352 224C352 188.7 380.7 160 416 160L480 160C515.3 160 544 188.7 544 224L544 360zM288 360C288 426.3 234.3 480 168 480L160 480C142.3 480 128 465.7 128 448C128 430.3 142.3 416 160 416L168 416C198.9 416 224 390.9 224 360L224 352L160 352C124.7 352 96 323.3 96 288L96 224C96 188.7 124.7 160 160 160L224 160C259.3 160 288 188.7 288 224L288 360z" /></svg>
                </div>

                <p>{eachTestimonial.text}</p>

                <div className="container" style={{ gridTemplateColumns: "auto 1fr" }}>
                  <Image alt={`${eachTestimonial.name} profile`} src={eachTestimonial.image} width={100} height={100} style={{ objectFit: "contain", width: "var(--sizeEL)", aspectRatio: "1/1", borderRadius: "var(--borderRadiusEL)", }} />

                  <div>
                    <span className="flexContainer resetTextMargin" style={{ textTransform: "capitalize" }}><h4>{eachTestimonial.name}</h4><p>/ {eachTestimonial.position}</p></span>

                    <DisplayStars starRating={eachTestimonial.rating} />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </main >
  );
}