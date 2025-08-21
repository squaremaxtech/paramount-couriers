import React from 'react'
import styles from "./page.module.css"
import { siteInfo } from '@/lib/data'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.cardCont}>
                <div className={styles.card}>
                    <div className={styles.cardTop}>
                        <div className={styles.circle} style={{ "--cStart": "var(--c1)", "--bgStart": "var(--bg2)", width: "var(--sizeL)", padding: "var(--spacingL)" } as React.CSSProperties}>
                            <span className="material-symbols-outlined mediumIcon" style={{ position: "absolute", top: "50%", left: "50%", translate: "-50% -50%" }}>
                                mail
                            </span>
                        </div>

                        <div className=''>
                            <h3>email address</h3>

                            <p>send email asap anytime</p>
                        </div>
                    </div>

                    <div className={styles.cardBody}>
                        <div>
                            {siteInfo.emailAddresses.map((eachEmailAddress, eachEmailAddressIndex) => {
                                return (
                                    <p key={eachEmailAddressIndex}>{eachEmailAddress}</p>
                                )
                            })}
                        </div>

                        <div className={styles.circle}>
                            <span className="material-symbols-outlined mediumIcon" style={{ position: "absolute", top: "50%", left: "50%", translate: "-50% -50%" }}>
                                arrow_forward
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardTop}>
                        <div className={styles.circle} style={{ "--cStart": "var(--c1)", "--bgStart": "var(--bg2)", width: "var(--sizeL)", padding: "var(--spacingL)" } as React.CSSProperties}>
                            <span className="material-symbols-outlined mediumIcon" style={{ position: "absolute", top: "50%", left: "50%", translate: "-50% -50%" }}>
                                mail
                            </span>
                        </div>

                        <div className=''>
                            <h3>address</h3>

                            <p>find us asap anytime</p>
                        </div>
                    </div>

                    <div className={styles.cardBody}>
                        <div>
                            {siteInfo.addresses.map((eachAddress, eachAddressIndex) => {
                                return (
                                    <p key={eachAddressIndex}>{eachAddress}</p>
                                )
                            })}
                        </div>

                        <div className={styles.circle}>
                            <span className="material-symbols-outlined mediumIcon" style={{ position: "absolute", top: "50%", left: "50%", translate: "-50% -50%" }}>
                                arrow_forward
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardTop}>
                        <div className={styles.circle} style={{ "--cStart": "var(--c1)", "--bgStart": "var(--bg2)", width: "var(--sizeL)", padding: "var(--spacingL)" } as React.CSSProperties}>
                            <span className="material-symbols-outlined mediumIcon" style={{ position: "absolute", top: "50%", left: "50%", translate: "-50% -50%" }}>
                                mail
                            </span>
                        </div>

                        <div className=''>
                            <h3>call us</h3>

                            <p>call us asap anytime</p>
                        </div>
                    </div>

                    <div className={styles.cardBody}>
                        <div>
                            {siteInfo.phoneNumbers.map((eachPhoneNumber, eachPhoneNumberIndex) => {
                                return (
                                    <p key={eachPhoneNumberIndex}>{eachPhoneNumber}</p>
                                )
                            })}
                        </div>

                        <div className={styles.circle}>
                            <span className="material-symbols-outlined mediumIcon" style={{ position: "absolute", top: "50%", left: "50%", translate: "-50% -50%" }}>
                                arrow_forward
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='container' style={{ borderTop: "1px solid var(--shade1)", paddingBlock: "var(--spacingL)", justifySelf: "center", width: "80%", justifyItems: "center" }}>
                <p>© ReggaeRush - 2025, Made With Love</p>
            </div>
        </footer>
    )
}
