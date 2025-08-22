import React from 'react'
import styles from "./page.module.css"
import PageTopImage from '@/components/pageTopImage/PageTopImage'
import AddressMap from '@/components/addressMap/AddressMap'
import ContactForm from '@/components/contactForm/ContactForm'

export default function Page() {
    return (
        <main className={styles.main}>
            <PageTopImage title='contact us' />

            <div className='twoColumnFlex'>
                <div>
                    <AddressMap />
                </div>

                <div className='container' style={{ padding: "var(--spacingL)" }}>
                    <h1>contact <span className='highlightText'>us</span></h1>

                    <p>We Provide Various Courier Delivery Services</p>

                    <ContactForm />
                </div>
            </div>
        </main>
    )
}