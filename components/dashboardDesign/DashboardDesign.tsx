import React from 'react'
import styles from "./style.module.css"
import Link from 'next/link';
import { headers } from 'next/headers';
import DashboardProfile from '../dashboardProfile/DashboardProfile';

type dashboardMenu = {
    icon: React.JSX.Element,
    link: string | null,
    title: string,
    dashboardHome?: true,
}

export default async function DashboardDesign({ navMenu, children, additionalContent }: { navMenu: dashboardMenu[], additionalContent?: React.JSX.Element, children: React.ReactNode; }) {
    const headersList = await headers();
    const fullUrl = headersList.get('x-url') || headersList.get('referer') || '';
    let pathname = ""

    try {
        pathname = new URL(fullUrl).pathname;

    } catch (error) {
        console.log(`$error happened dasboard url`, error);
    }

    const foundNavItem = navMenu.find(eachItem => eachItem.link === pathname)

    return (
        <div className={styles.main}>
            <div className={styles.sidebar}>
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

                        {foundNavItem.dashboardHome && (
                            <DashboardProfile />
                        )}
                    </div>
                )}

                {children}
            </div>
        </div>
    )
}