import Link from 'next/link'
import React from 'react'
import styles from "./style.module.css"

export default function ShortCardDescription({ iconName, title, description, link }: { iconName: string, title: string, description: string, link: string }) {
    return (
        <div className={`${styles.card} container`}>
            <div style={{ position: "relative", color: "var(--c1)", backgroundColor: "color-mix(in hsl, var(--c1), transparent 80%)", justifySelf: "flex-start", borderRadius: "var(--borderRadiusR)", width: "var(--sizeEL)", aspectRatio: "1/1" }}>
                <span className="material-symbols-outlined largeIcon" style={{ position: "absolute", top: "50%", left: "50%", translate: "-50% -50%" }}>
                    {iconName}
                </span>
            </div>

            <h3>{title}</h3>

            <p>{description}</p>

            <Link href={link} className={`${styles.linkCont} flexContainer resetTextMargin`}>
                <p>learn more</p>

                <span className="material-symbols-outlined">
                    chevron_right
                </span>
            </Link>
        </div>
    )
}
