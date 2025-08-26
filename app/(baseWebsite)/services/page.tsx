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
import servicesStart6 from "@/public/services/servicesStart6.jpg"
import servicesStart7 from "@/public/services/servicesStart7.jpg"
import ShortCardDescription from '@/components/cards/shortCardDescription/ShortCardDescription'
import CircularPercentage from '@/components/animate/CircularPercentage'

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






                        <Image alt='servicesStart5 image' src={servicesStart5} width={2000} height={2000} style={{ objectFit: 'cover', width: "100%" }} />

                        <div className='separator'></div>


























                        <h3>Facility provided</h3>

                        <div className='container' style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "var(--spacingL)" }}>
                            <ShortCardDescription
                                iconName='box'
                                title='fast delivery'
                                description='Air mail was conceived of early, and scheduled service began in 1918.'
                                link='#fastDelivery'
                            />

                            <ShortCardDescription
                                iconName='phone_forwarded'
                                title='world wide shipping'
                                description='Air mail was conceived of early, and scheduled service began in 1918.'
                                link='#worldWideShipping'
                            />
                        </div>

                        <p>Air mail was conceived of early, and scheduled service began in 1918. Scheduled airlines carried high valued and perishable goods from early on. The most important advance, however, came with the "hub and spoke" system pioneered by Federal Express (now known as FedEx) in 1973. With deregulation in 1977, they were able to establish an air-based system capable of delivering small packages</p>

                        <div className='twoColumnFlex'>
                            <div className='container' style={{ flex: "1 1 200px" }}>
                                <p>overnight throughout most of the country. In response, the postal service initiated a comparable Express Mail service. In the same period, they also began contracting with Amtrak to carry mail by rail. Thus at the beginning of the 21st century, the U.S.</p>


                                <div className='twoColumnFlex'>
                                    <div style={{ flex: "1 1 100px" }}>
                                        <CircularPercentage
                                            title='fast delivery'
                                            value={83}
                                        />
                                    </div>

                                    <div style={{ flex: "1 1 100px" }}>
                                        <CircularPercentage
                                            title='secured services'
                                            value={83}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ flex: "1 1 200px" }}>
                                <Image alt='servicesStart6 image' src={servicesStart6} width={2000} height={2000} style={{ objectFit: 'cover', width: "100%" }} />
                            </div>
                        </div>

                        <div className='separator'></div>

                        <div className='twoColumnFlex'>
                            <div style={{ flex: "1 1 200px" }}>
                                <Image alt='servicesStart7 image' src={servicesStart7} width={2000} height={2000} style={{ objectFit: 'cover', width: "100%" }} />
                            </div>

                            <div style={{ flex: "1.5 1 300px" }}>
                                <p>White glove refers to the highest service level for last-mile delivery of heavy goods. It involves the delivery team bringing the item to the room of choice, unpacking and assembling it, and removing all packaging and debris from the customer's home. There are over 4,000 white glove delivery companies in the United States, most of which only perform local deliveries. Some large less-than-truckload shipping carriers also offer white glove delivery service, and in recent years start-ups have emerged that offer</p>
                            </div>
                        </div>

                        <p>The individual sorting and handling systems of small parcel carriers can put severe stress on the packages and contents. Packaging needs to be designed for the potential hazards which may be encountered in parcel delivery systems. The major carriers have a packaging engineering staff which provides packaging guidelines and sometimes package design and package testing services.</p>
                    </div>

                    <div style={{ flex: "1 1 300px" }} className='container'>
                        <SmallCardList
                            heading='categories'
                            items={[
                                {
                                    link: "#standardCourier",
                                    title: "standard courier",
                                    amount: 12
                                },
                                {
                                    link: "#expressCourier",
                                    title: "express courier",
                                    amount: 9
                                },
                                {
                                    link: "#palletCourier",
                                    title: "pallet courier",
                                    amount: 7
                                },
                                {
                                    link: "#overNightCourier",
                                    title: "over night courier",
                                    amount: 5
                                },
                                {
                                    link: "#internationalCourier",
                                    title: "international courier",
                                    amount: 3
                                },
                            ]}
                        />
                    </div>
                </div>
            </section>
        </main>
    )
}
