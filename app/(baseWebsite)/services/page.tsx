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

                        <h1 style={{ fontSize: "var(--fontSizeML)" }}>AWESOME TEMPLATE FOR COURIER & DELIVERY SERVICES</h1>

                        <p>In 1852 Wells Fargo, then just one of many such services, was formed to provide both banking and express services. These went hand-in-hand, as the handling of California gold and other financial matters required a secure method for transporting them across the country. This put Wells Fargo securely in the stagecoach business and prompted them to participate in the Pony Express venture</p>

                        <h3>Sit at Home We Will Take Care</h3>

                        <p>From 1869 on, package services rapidly moved to the rail, which was faster and cheaper. The express office was a universal feature of the staffed railroad station. Packages travelled as "head-end" traffic in passenger trains. In 1918 the formation of the United States Railroad Administration resulted in a consolidation of all such services into a single agency, which after the war</p>

                        <Image alt='servicesStart5 image' src={servicesStart5} width={2000} height={2000} style={{ objectFit: 'cover', width: "100%" }} />

                        <h3>We Provide Various Courier Delivery Services</h3>

                        <p>1 January 1913, parcel post service began providing rural postal customers with package service along with their regular mail and obviating a trip to a town substantial enough to support an express office. This, along with Rural Free Delivery, fueled a huge rise in catalogue sales. By this time the post office monopoly on mail was effectively enforced, and Wells Fargo had exited the business in favour of its banking enterprises</p>

                        <div className='separator'></div>

                        <h3>You Deserve a Beautiful Service</h3>

                        <p>freight services arose quickly with the advent of gasoline and diesel-powered trucks. United Parcel Service had its origins in this era, initially as a private courier service. The general improvement of the highway system following World War II prompted its expansion into a nationwide service, and other similar services arose. At the same time, the contraction of rail passenger service hurt rail-based package shipping; these contractions led to the cancellation of the mail contracts with the railroads, which in turn caused further passenger cuts. Eventually</p>

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
