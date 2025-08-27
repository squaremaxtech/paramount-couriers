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

                        <h3>Pre-Alert Your Packages</h3>
                        <p>Before your items even leave the U.S., submit a pre-alert through our simple online form. This lets us know what to expect, ensures faster processing when your package arrives, and keeps everything organized under your account. Whether you’re shipping one item or many, pre-alerts save time and help avoid delays.</p>

                        <h3>Package Processing</h3>
                        <p>Once we receive your goods at our U.S. address, our team immediately gets to work. Every item is verified, secured, and properly packaged for shipping. If you have multiple orders, we can consolidate them into one box to save you on shipping costs. From careful packaging to accurate labeling, we make sure your shipment is ready for a smooth trip to Jamaica.</p>

                        <h3>Real-Time Tracking</h3>
                        <p>Stay in the loop with real-time package tracking. From the moment we receive your items until they’re handed over in Jamaica, you’ll have full visibility of your shipment. Track updates at every stage, receive notifications by email or SMS, and enjoy the peace of mind that comes with knowing where your package is at all times.</p>

                        <h3>Shipment to Jamaica</h3>
                        <p>We take care of all the logistics needed to get your items from the U.S. to Jamaica quickly and safely. Choose from standard shipping for regular deliveries or express shipping for urgent items. Large or special-handling goods are also managed with care. No matter the size or urgency, we make sure your package gets to Jamaica securely.</p>

                        <h3>Air Freight</h3>
                        <p>Need to move bulkier shipments or commercial goods? Our Air Freight option is the most efficient way to get large packages and pallets from the U.S. to Jamaica. With competitive rates and flexible schedules, we ensure your freight arrives on time and in excellent condition.</p>

                        <h3>General Shipping</h3>
                        <p>Whether it’s a small online order or multiple boxes, we offer reliable shipping solutions to meet your needs. Customers can select from flat-rate options, express delivery, or economy shipping—always backed by our secure handling and transparent tracking system.</p>

                        <h3>Customs & Clearing</h3>
                        <p>We simplify the customs process by handling clearance for you. Our experienced team guides you through any duties or taxes owed, making sure your packages are processed quickly and without unnecessary hold-ups. This means less stress for you and faster access to your goods.</p>

                        <h3>Pickup & Delivery</h3>
                        <p>Once cleared, you choose how to receive your packages. Opt for convenient <strong>door-to-door delivery</strong> straight to your home or pick up at one of our partner locations across Jamaica. Either way, we make sure your items are delivered securely into your hands.</p>

                        <h3>FAQs</h3>
                        <p>Have questions about our services, rates, or policies? Check out our FAQ section for quick answers to the most common shipping concerns. From how to pre-alert a package to understanding customs fees, our FAQs are here to guide you every step of the way.</p>

                        {/* <Image alt='servicesStart5 image' src={servicesStart5} width={2000} height={2000} style={{ objectFit: 'cover', width: "100%" }} /> */}

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

                        <div className='twoColumnFlex'>
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
                            heading='Our Services'
                            items={[
                                {
                                    link: "#standard",
                                    title: "Standard Shipping",
                                    amount: 15,
                                },
                                {
                                    link: "#express",
                                    title: "Express Shipping",
                                    amount: 10,
                                },
                                {
                                    link: "#storeToDoor",
                                    title: "Store-to-Door Delivery",
                                    amount: 8,
                                },
                                {
                                    link: "#barrel",
                                    title: "Barrel & Crate Shipping",
                                    amount: 6,
                                },
                                {
                                    link: "#freight",
                                    title: "Freight & Pallet Shipping",
                                    amount: 4,
                                },
                                {
                                    link: "#pickup",
                                    title: "Local Pickup in Jamaica",
                                    amount: 12,
                                },
                            ]}
                        />
                    </div>
                </div>
            </section>
        </main>
    )
}
