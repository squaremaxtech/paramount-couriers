import React from 'react'
import styles from "./style.module.css"
import Link from 'next/link'

type itemsType = {
    link: string,
    title: string,
    amount?: number
}

export default function SmallCardList({ items, heading }: { items: itemsType[], heading: string }) {
    return (
        <div className={styles.cont}>
            <div className='resetTextMargin' style={{ borderLeft: "3px solid var(--c1)", padding: "0 var(--spacingR)" }}>
                <h3>{heading}</h3>
            </div>

            <ul className={styles.menu}>
                {items.map((eachItem, eachItemIndex) => {
                    return (
                        <li key={eachItemIndex}>
                            <Link href={eachItem.link} className={`${styles.menuItem} flexContainer`} style={{ paddingBlock: "var(--spacingR)", marginInline: "var(--spacingR)", borderTop: eachItemIndex !== 0 ? "1px solid var(--shade2)" : "" }}>
                                <span className="material-symbols-outlined">
                                    play_arrow
                                </span>

                                <h5 className={styles.title}>{eachItem.title}</h5>

                                {eachItem.amount !== undefined && (
                                    <div className='resetTextMargin' style={{ marginLeft: "auto", borderRadius: "var(--borderRadiusEL)", backgroundColor: "var(--c1)", aspectRatio: "1/1", width: "var(--sizeL)", padding: "var(--spacingS)", position: "relative", }}>
                                        <p style={{ position: "absolute", top: "50%", left: "50%", translate: "-50% -50%", color: "var(--textC2)" }}>
                                            {eachItem.amount}
                                        </p>
                                    </div>
                                )}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
