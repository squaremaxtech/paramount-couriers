import React from 'react'
import styles from "./page.module.css"
import PageTopImage from '@/components/pageTopImage/PageTopImage'
import Image from 'next/image'
import aboutUsStart1 from "@/public/aboutUs/aboutUsStart1.jpg"
import AddressMap from '@/components/addressMap/AddressMap'

export default function Page() {
    return (
        <main className={styles.main}>
            <PageTopImage title='contact us' />

            <div className='twoColumnFlex'>
                <AddressMap />

                <div className='container'>
                    <h1>contact <span className='highlightText'>us</span></h1>

                    <p>We Provide Various Courier Delivery Services</p>
                </div>
            </div>
        </main>
    )
}