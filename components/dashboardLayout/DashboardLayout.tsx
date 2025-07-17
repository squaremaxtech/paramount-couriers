import React from 'react'
import styles from "./style.module.css"
import { dashboardMenu } from '@/types';
import Header from './Header';
import MenuItems from './MenuItems';

export default function DashboardLayout({ navMenu, children, additionalContent }: { navMenu: dashboardMenu[], additionalContent?: React.JSX.Element, children: React.ReactNode; }) {

    return (
        <div className={styles.main}>
            <div className={styles.sidebar}>
                <MenuItems
                    navMenu={navMenu}
                />

                {additionalContent}
            </div>

            <div className={styles.contentCont}>
                <Header navMenu={navMenu} />

                {children}
            </div>
        </div>
    )
}