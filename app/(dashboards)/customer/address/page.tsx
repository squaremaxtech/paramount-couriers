import { auth } from '@/auth/auth'
import CopyClipboard from '@/components/copyClipboard/CopyClipboard'
import ShowMore from '@/components/showMore/ShowMore'
import { siteInfo } from '@/lib/data'
import React from 'react'
import styles from "./page.module.css"

export default async function Page() {
    const session = await auth()
    if (session === null) return (<p>not seeing sessiong</p>)

    const seenUser = session.user

    return (
        <main style={{ display: "grid", alignContent: "flex-start", gap: "var(--spacingR)", padding: "var(--spacingR)" }}>
            <div>
                <p>Here you can find the Miami address assigned to your account, which you should enter as the shipping destination when shopping on your favorite online stores like Amazon, eBay, Temu, SHEIN and many others.</p>

                <p>If you have questions about how to do it, you can check our step-by-step guide or give us a call.</p>

                <ShowMore label='guide' content={(
                    <ul className={styles.guideList}>
                        <li>
                            <p className={styles.siteTitle}>Amazon</p>
                            <div className={styles.formPreview}>
                                <div className={styles.formRow}>
                                    <label>Full name:</label>
                                    <input value="John Doe" readOnly />
                                </div>
                                <div className={styles.formRow}>
                                    <label>Address line 1:</label>
                                    <input value={siteInfo.shippingAddress.street} readOnly />
                                </div>
                                <div className={styles.formRow}>
                                    <label>City:</label>
                                    <input value={siteInfo.shippingAddress.city} readOnly />
                                </div>
                                <div className={styles.formRow}>
                                    <label>State:</label>
                                    <input value={siteInfo.shippingAddress.state} readOnly />
                                </div>
                                <div className={styles.formRow}>
                                    <label>ZIP Code:</label>
                                    <input value={siteInfo.shippingAddress.zipCode} readOnly />
                                </div>
                                <div className={styles.formRow}>
                                    <label>Country:</label>
                                    <input value="United States" readOnly />
                                </div>
                                <p className={styles.note}>Example of how your address appears on Amazon</p>
                            </div>
                        </li>

                        <li>
                            <p className={styles.siteTitle}>Shein</p>
                            <div className={styles.formPreview}>
                                <div className={styles.formRow}>
                                    <label>Address:</label>
                                    <input value={`${siteInfo.shippingAddress.street}, ${siteInfo.shippingAddress.city}, ${siteInfo.shippingAddress.state} ${siteInfo.shippingAddress.zipCode}`} readOnly />
                                </div>
                                <div className={styles.formRow}>
                                    <label>ZIP Code:</label>
                                    <input value={siteInfo.shippingAddress.zipCode} readOnly />
                                </div>
                                <div className={styles.formRow}>
                                    <label>Country/Region:</label>
                                    <input value="United States" readOnly />
                                </div>
                                <p className={styles.note}>Example of how your address appears on Shein</p>
                            </div>
                        </li>
                    </ul>
                )} />
            </div>

            <div className="titleBox">
                <p>
                    Your Miami Address

                    <CopyClipboard text={`id: ${seenUser.id} ${seenUser.name} ${siteInfo.shippingAddress.street} ${siteInfo.shippingAddress.city} ${siteInfo.shippingAddress.state} ${siteInfo.shippingAddress.zipCode} ${siteInfo.phoneNumbers[0]}`} />
                </p>

                <ul className="titleBoxMenu">
                    <li>
                        <p>Full name</p>

                        <p>
                            {seenUser.name}

                            <CopyClipboard text={seenUser.name ?? ""} />
                        </p>
                    </li>

                    <li>
                        <p>Address Line 1</p>

                        <p>
                            {siteInfo.shippingAddress.street}

                            <CopyClipboard text={siteInfo.shippingAddress.street} />
                        </p>
                    </li>

                    <li>
                        <p>Address Line 2</p>

                        <p>
                            {siteInfo.shippingAddress.street2}

                            <CopyClipboard text={siteInfo.shippingAddress.street2} />
                        </p>
                    </li>

                    <li>
                        <p>City</p>

                        <p>
                            {siteInfo.shippingAddress.city}

                            <CopyClipboard text={siteInfo.shippingAddress.city} />
                        </p>
                    </li>

                    <li>
                        <p>State</p>

                        <p>
                            {siteInfo.shippingAddress.state}

                            <CopyClipboard text={siteInfo.shippingAddress.state} />
                        </p>
                    </li>

                    <li>
                        <p>Zip code</p>

                        <p>
                            {siteInfo.shippingAddress.zipCode}

                            <CopyClipboard text={siteInfo.shippingAddress.zipCode} />
                        </p>
                    </li>

                    <li>
                        <p>Phone number</p>

                        <p>
                            {siteInfo.phoneNumbers[0]}

                            <CopyClipboard text={siteInfo.phoneNumbers[0]} />
                        </p>
                    </li>
                </ul>
            </div>
        </main>
    )
}