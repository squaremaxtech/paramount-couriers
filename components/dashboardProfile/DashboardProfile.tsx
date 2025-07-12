"use client"
import Image from "next/image"
import { useState } from "react"
import defaultProfileIcon from "@/public/defaultProfileIcon.png"
import styles from "./styles.module.css"
import LogButton from "../logButtons/LogButton"
import { useSession } from "next-auth/react"

export default function DashboardProfile() {
    const { data: session } = useSession()
    const [showingNav, showingNavSet] = useState(false)

    if (session === null) return null

    return (
        <div className={styles.cont}>
            <div style={{ display: "flex", gap: "var(--spacingS)", cursor: "pointer", color: "var(--textC2)", alignItems: "center" }}
                onClick={() => { showingNavSet(prev => !prev) }}
            >
                <Image alt="userImage" src={session.user.image !== null ? session.user.image : defaultProfileIcon} width={40} height={40} style={{ objectFit: "cover", borderRadius: "var(--borderRadiusEL)" }} />

                <span>{session.user.name}</span>
            </div>

            {showingNav && (
                <ul className={styles.moreItemsMenu}
                    onClick={() => { showingNavSet(false) }}
                >
                    <li style={{ padding: ".5rem" }}>{session.user.name}</li>

                    <li className={styles.moreIntemsItem}>account</li>

                    <li className={styles.moreIntemsItem}>settings</li>

                    <li className={styles.moreIntemsItem}>
                        <LogButton option='logout' />
                    </li>
                </ul>
            )}
        </div>
    )
}