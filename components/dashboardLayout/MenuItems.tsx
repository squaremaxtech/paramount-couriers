"use client"
import { dashboardMenu } from '@/types'
import Link from 'next/link'
import React from 'react'
import styles from "./style.module.css"
import { usePathname } from 'next/navigation'

export default function MenuItems({ navMenu }: { navMenu: dashboardMenu[] }) {
    const pathname = usePathname()

    return (
        <>
            {navMenu.map((menuItem, menuItemIndex) => {
                const menuItemContent = (
                    <>
                        {menuItem.icon}

                        {menuItem.title !== "" && (
                            <div>{menuItem.title}</div>
                        )}
                    </>
                )

                return (
                    <li key={menuItemIndex} className={`${styles.menuItem} ${pathname === menuItem.link ? styles.selected : ""}`}>
                        {menuItem.link !== null ? (
                            <Link href={menuItem.link}>
                                {menuItemContent}
                            </Link>
                        ) : (
                            <>
                                {menuItemContent}
                            </>
                        )}
                    </li>
                )
            })}
        </>
    )
}
