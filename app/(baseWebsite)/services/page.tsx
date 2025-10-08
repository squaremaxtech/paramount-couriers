import React from 'react'
import styles from "./page.module.css"
import PageTopImage from '@/components/pageTopImage/PageTopImage'
import SmallCardList from '@/components/cards/smallCardList/SmallCardList'
import Image from 'next/image'
import servicesStart1 from "@/public/services/servicesStart1.jpg"
import servicesStart2 from "@/public/services/servicesStart2.jpg"
import servicesStart3 from "@/public/services/servicesStart3.jpg"
import servicesStart4 from "@/public/services/servicesStart4.jpg"
import servicesStart5 from "@/public/services/servicesStart5.jpg"
import ShortCardDescription from '@/components/cards/shortCardDescription/ShortCardDescription'
import { servicesData } from '@/lib/data'

export default function Page() {
    return (
        <main className={styles.main}>
            <PageTopImage title='services' />

            <section>
                <div className='twoColumnFlex'>
                    <div className='container' style={{ flex: "2 1 700px", }}>
                        <Image alt='servicesStart1 image' src={servicesStart1} width={2000} height={2000} style={{ objectFit: 'cover', width: "100%" }} />

                        <div className="container" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: "var(--spacingL)", overflow: "auto", marginTop: "var(--spacingL)" }}>
                            <Image alt='servicesStart2 image' src={servicesStart2} width={2000} height={2000} style={{ objectFit: "contain" }} />

                            <Image alt='servicesStart3 image' src={servicesStart3} width={2000} height={2000} style={{ objectFit: "contain" }} />

                            <Image alt='servicesStart4 image' src={servicesStart4} width={2000} height={2000} style={{ objectFit: "contain" }} />
                        </div>

                        <h1 style={{ fontSize: "var(--fontSizeML)" }}>STELLAR DELIVERY</h1>

                        {servicesData.map((eachService, eachServiceIndex) => {
                            return (
                                <React.Fragment key={eachServiceIndex}>
                                    <h3 id={eachService.slug}>{eachService.title}</h3>
                                    <p>{eachService.description}</p>
                                </React.Fragment>
                            )
                        })}

                        <h3>FAQs</h3>
                        <p>Have questions about our services, rates, or policies? Check out our FAQ section for quick answers to the most common shipping concerns. From how to pre-alert a package to understanding customs fees, our FAQs are here to guide you every step of the way.</p>

                        <Image alt='servicesStart5 image' src={servicesStart5} width={2000} height={2000} style={{ objectFit: 'cover', width: "100%" }} />

                        <h3>Service Highlights</h3>

                        <div
                            className="container"
                            style={{
                                gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
                                gap: "var(--spacingL)",
                            }}
                        >
                            <ShortCardDescription
                                iconName="box"
                                title="Fast Delivery"
                                description="Quick, reliable shipping with delivery across all of Jamaica."
                                link="#shipment"
                            />

                            <ShortCardDescription
                                iconName="phone_forwarded"
                                title="Worldwide Shipping"
                                description="Shop anywhere in the U.S. and get your packages delivered right to Jamaica."
                                link="#shipment"
                            />
                        </div>

                        {/* <div className='twoColumnFlex'>
                            <div className='container' style={{ flex: "1 1 200px" }}>
                                <p>
                                    At Paramount Couriers, speed and reliability are at the core of what we do.
                                    Our express delivery service ensures packages reach Jamaica in record time,
                                    with many shipments arriving within just a few days.
                                    Beyond speed, we pride ourselves on exceptional customer service,
                                    ensuring every package is handled with care and every client stays informed.
                                </p>

                                <div className='twoColumnFlex'>
                                    <div style={{ flex: "1 1 100px" }}>
                                        <CircularPercentage
                                            title='Fast Delivery'
                                            value={92}
                                        />
                                    </div>

                                    <div style={{ flex: "1 1 100px" }}>
                                        <CircularPercentage
                                            title='Customer Satisfaction'
                                            value={95}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ flex: "1 1 200px" }}>
                                <Image
                                    alt='servicesStart6 image'
                                    src={servicesStart6}
                                    width={2000}
                                    height={2000}
                                    style={{ objectFit: 'cover', width: "100%" }}
                                />
                            </div>
                        </div> */}

                        {/* <div className='twoColumnFlex'>
                            <div style={{ flex: "1 1 200px" }}>
                                <Image alt='servicesStart7 image' src={servicesStart7} width={2000} height={2000} style={{ objectFit: 'cover', width: "100%" }} />
                            </div>

                            <div style={{ flex: "1.5 1 300px" }}>
                                <p>White glove refers to the highest service level for last-mile delivery of heavy goods. It involves the delivery team bringing the item to the room of choice, unpacking and assembling it, and removing all packaging and debris from the customer's home. There are over 4,000 white glove delivery companies in the United States, most of which only perform local deliveries. Some large less-than-truckload shipping carriers also offer white glove delivery service, and in recent years start-ups have emerged that offer</p>
                            </div>
                        </div> */}
                    </div>

                    <div style={{ flex: "1 1 300px" }} className='container'>
                        <SmallCardList
                            heading='Our Services'
                            items={servicesData.map(eachService => {
                                return {
                                    link: `#${eachService.slug}`,
                                    title: eachService.title,
                                    amount: eachService.amtOfPoints,
                                }
                            })}
                        />
                    </div>
                </div>
            </section>
        </main>
    )
}