import React from 'react'
import styles from "./style.module.css"
import Link from 'next/link';
import { headers } from 'next/headers';

type dashboardMenu = {
    icon: React.JSX.Element,
    link: string | null,
    title: string
}

export default async function DashboardDesign({ navMenu, children, additionalContent }: { navMenu: dashboardMenu[], additionalContent?: React.JSX.Element, children: React.ReactNode; }) {
    const headersList = await headers();
    const fullUrl = headersList.get('x-url') || headersList.get('referer') || '';
    const pathname = new URL(fullUrl).pathname;
    const foundNavItem = navMenu.find(eachItem => eachItem.link === pathname)

    return (
        <div className={styles.main}>
            <div className={styles.sidebar}>
                {navMenu.map((menuItem, menuItemIndex) => {
                    const menuItemContent = (
                        <>
                            {menuItem.icon}

                            {menuItem.title !== "" && (
                                <p>{menuItem.title}</p>
                            )}
                        </>
                    )

                    return (
                        <li key={menuItemIndex} className={`${styles.menuItem} ${foundNavItem !== undefined && foundNavItem.link === menuItem.link ? styles.selected : ""}`}>
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

                {additionalContent}
            </div>

            <div className={styles.contentCont}>
                {foundNavItem !== undefined && (
                    <div className={`${styles.headerCont} textResetMargin`}>
                        <h1>{foundNavItem.title}</h1>
                    </div>
                )}

                {children}
            </div>
        </div>
    )
}