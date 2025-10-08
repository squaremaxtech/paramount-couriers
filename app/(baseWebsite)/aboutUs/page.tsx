import React from 'react'
import styles from "./page.module.css"
import PageTopImage from '@/components/pageTopImage/PageTopImage'
import Image from 'next/image'
import aboutUsStart1 from "@/public/aboutUs/aboutUsStart1.jpg"
import PercentCard from '@/components/cards/percentCard/PercentCard'
import AnimateRateChange from '@/components/animate/AnimateRateChange'
import { ShowFAQ } from '@/components/FAQ/FAQ'

export default function Page() {
    return (
        <main className={styles.main}>
            <PageTopImage title='about us' />

            <section>
                <div className='twoColumnFlex'>
                    <div>
                        <Image alt='aboutUsStart1 image' src={aboutUsStart1} width={2000} height={2000} style={{ objectFit: 'cover', width: "100%" }} />
                    </div>

                    <div className='container'>
                        <h2>about us</h2>

                        <h1>Secured, Affordable <span className='highlightText'>& Reliable Service</span></h1>

                        <h3>Are you Looking for Professional Courier Services. Please Contact Us</h3>

                        <p>Package delivery or parcel delivery is the delivery of shipping containers, parcels, or high value mail as single shipments</p>

                        <PercentCard
                            value={83}
                            title='Courier Deliver'
                            description='Package delivery or parcel delivery is the delivery of shipping containers'
                        />

                        <PercentCard
                            value={75}
                            title='Experience'
                            description='Package delivery or parcel delivery is the delivery of shipping containers'
                        />
                    </div>
                </div>

            </section>

            <section>
                <h1 style={{ textAlign: "center" }}>Fun Facts</h1>

                <ul className='container' style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: "var(--spacingL)", overflow: "auto", }}>
                    {[
                        {
                            amount: 100,
                            title: "Complete Deliveries Per Month"
                        },
                        {
                            amount: 5,
                            title: "Years Practical Experience"
                        },
                        {
                            amount: 20,
                            title: "Awesome Team Members"
                        },
                    ].map((eachFunFact, eachFunFactIndex) => {
                        return (
                            <li key={eachFunFactIndex} className='container'>
                                <div className='flexContainer highlightText' style={{}}>
                                    <p style={{ fontSize: "var(--fontSizeML)", fontWeight: 600 }}>
                                        <AnimateRateChange
                                            amount={eachFunFact.amount}
                                        />
                                    </p>

                                    <span className="">+</span>
                                </div>

                                <h5>{eachFunFact.title}</h5>
                            </li>
                        )
                    })}
                </ul>
            </section>

            <section>
                <h1 style={{ textAlign: "center" }}>FAQ</h1>

                <ShowFAQ />
            </section>
        </main>
    )
}