import { locationOptions, locationType, packageType } from "@/types";
import styles from "./style.module.css"
import { formatAsMoney, formatWeight, generateTrackingNumber, makeDownloadFileUrl } from "@/utility/utility";
import Image from "next/image";
import Link from "next/link";

type locationIconMatchType = {
    [key in locationType]: string
}
const locationIconMatch: locationIconMatchType = {
    "on way to warehouse": "airplane_ticket",
    "warehouse delivered": "deployed_code_update",
    "in transit to jamaica": "travel",
    "jamaica arrived": "distance",
    "ready for pickup": "celebration"
}

export function ViewPackage({ seenPackage }: { seenPackage: packageType }) {
    return (
        <main className={`${styles.main} container`}>
            <p className="tag">{generateTrackingNumber(seenPackage.id)}</p>

            <div className="titleBox">
                <p className="ignoreTitleBoxStyle">Current Status</p>

                <p className="popoutText">{seenPackage.status}</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: `repeat(${locationOptions.length}, 1fr)`, overflow: "auto" }}>
                {locationOptions.map((eachLocationOption, eachLocationOptionIndex) => {
                    const reachedIndexSeen = locationOptions.findIndex(eachLocationOptionFindIndex => eachLocationOptionFindIndex === seenPackage.location)
                    const reachedIndex = eachLocationOptionIndex <= reachedIndexSeen
                    const nextReachedIndex = eachLocationOptionIndex + 1 <= reachedIndexSeen

                    const stretchBackward = reachedIndex && eachLocationOptionIndex !== 0
                    const stretchForward = reachedIndex && eachLocationOptionIndex !== locationOptions.length - 1 && nextReachedIndex

                    return (
                        <div key={eachLocationOption} style={{ display: "grid", justifyItems: "center", textAlign: "center", minWidth: "100px", gap: "var(--spacingS)", textTransform: "capitalize", fontWeight: "bold" }}>
                            <div style={{ position: "relative", width: "100%", display: "grid", justifyItems: "center", zIndex: 0 }}>
                                <div style={{ position: "absolute", height: ".5rem", top: "50%", width: "100%", translate: "0 -50%", zIndex: -1 }}>
                                    {stretchBackward && <div style={{ height: "100%", position: "absolute", left: 0, width: "50%", backgroundColor: "var(--c1)" }}> </div>}

                                    {stretchForward && <div style={{ height: "100%", position: "absolute", right: 0, width: "50%", backgroundColor: "var(--c1)" }}></div>}
                                </div>

                                <div style={{ aspectRatio: "1/1", borderRadius: "var(--borderRadiusEL)", backgroundColor: reachedIndex ? "var(--c1)" : "var(--bg3)", width: "min-content" }}>
                                    <span className="material-symbols-outlined largeIcon" style={{ color: "var(--textC2)" }}>
                                        {locationIconMatch[eachLocationOption]}
                                    </span>
                                </div>
                            </div>

                            <p>{eachLocationOption}</p>
                        </div>
                    )
                })}
            </div>

            <div className="titleBox">
                <p>package information</p>

                <ul className={styles.customListMenu}>
                    <li>
                        <p>consignee</p>

                        <p>{seenPackage.consignee}</p>
                    </li>

                    <li>
                        <p>store</p>

                        <p>{seenPackage.store}</p>
                    </li>

                    <li>
                        <p>tracking no.</p>

                        <p>{seenPackage.trackingNumber}</p>
                    </li>

                    <li>
                        <p>description</p>

                        <p>{seenPackage.description}</p>
                    </li>

                    <li>
                        <p>declared value</p>

                        <p>{formatAsMoney(seenPackage.price)}</p>
                    </li>

                    <li>
                        <p>cif value</p>

                        <p>{formatAsMoney(seenPackage.price)}</p>
                    </li>


                    <li>
                        <p>weight</p>

                        <p>{formatWeight(seenPackage.weight)}</p>
                    </li>
                </ul>
            </div>

            <div className="titleBox">
                <p>charges</p>

                <ul className={`${styles.customListMenu} ${styles.noBorder}`}>
                    <li className={styles.large}>
                        <p>services fee</p>

                        <p>{formatAsMoney(`11.35`)}</p>
                    </li>

                    <li>
                        <p>freight</p>

                        <p>{formatAsMoney(`8.39`)}</p>
                    </li>

                    <li>
                        <p>fuel</p>

                        <p>{formatAsMoney(`1.48`)}</p>
                    </li>

                    <li>
                        <p>insurance</p>

                        <p>{formatAsMoney(`1.48`)}</p>
                    </li>

                    <li className={styles.large}>
                        <p>government fee</p>

                        <p>{formatAsMoney(`0.00`)}</p>
                    </li>
                </ul>

                <div>
                    <h2 style={{ textAlign: "center" }}>Total: {formatAsMoney(`11.35`)}</h2>

                    <h1 style={{ textAlign: "end", color: "var(--c1)" }}>Total Paid: {formatAsMoney(`11.35`)}</h1>
                </div>

                {parseInt(seenPackage.payment) !== 0 && (
                    <div style={{ backgroundColor: "var(--c1)", color: "var(--textC2)", fontWeight: "bold", display: "grid", justifyItems: "center", padding: "var(--spacingR)" }} className="resetTextMargin">
                        <h2 style={{ color: "var(--textC2)" }}>Thanks for your payment!</h2>

                        <p>Payment made successfully</p>
                    </div>
                )}
            </div>

            <div className="titleBox">
                <p>documents</p>

                <p style={{ fontSize: "var(--fontSizeS)" }}>You can upload your files, whether invoices or other documents. The limit is a maximum of 10 files, each under 3 MB in size.</p>

                <p style={{ fontSize: "var(--fontSizeS)" }}>Allowed formats: pdf, jpg, bmp, gif, png, doc and docx</p>

                {seenPackage.invoices.length > 0 && (
                    <div style={{ display: "flex", gap: "var(--spacingR)", overflow: "auto", alignItems: "flex-start" }}>
                        {seenPackage.invoices.map(eachDbInvoice => {
                            return (
                                <Link key={eachDbInvoice.file.src} href={makeDownloadFileUrl(eachDbInvoice)} target="blank_" style={{ flex: "0 0 auto", fontSize: "var(--fontSizeS)", backgroundColor: "var(--bg2)", padding: "var(--spacingS)", borderRadius: "var(--borderRadiusS)", maxWidth: "300px" }} className="resetTextMargin">
                                    <p style={{ color: "var(--c4)" }}>{eachDbInvoice.type} invoice</p>

                                    <p>{eachDbInvoice.file.fileName}</p>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>

            <div className="titleBox">
                <p>photos</p>

                {seenPackage.images.length > 0 && (
                    <div style={{ display: "flex", gap: "var(--spacingR)", overflow: "auto", justifyContent: 'flex-start' }}>
                        {seenPackage.images.map(eachDbImage => {
                            return (
                                <div key={eachDbImage.file.src} style={{ flex: "0 0 auto" }}>
                                    <Image alt={eachDbImage.alt} width={300} height={300} src={makeDownloadFileUrl(eachDbImage)} style={{ objectFit: "contain" }} />
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </main>
    )
}