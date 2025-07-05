import { auth } from '@/auth/auth'
import React from 'react'
import LogButton from '../logButtons/LogButton'

// export default async function Navbar() {
//     const session = await auth()

//     return (
//         <nav style={{ display: "flex", overflow: "auto", gap: "var(--spacingR)", whiteSpace: "nowrap" }}>
//             <Logo />


//         </nav>
//     )
// }
import styles from "./style.module.css"
import Link from 'next/link'
import Logo from "@/components/logo/Logo"
import { Session } from 'next-auth'

type menuItem = {
    title: string,
    link: string,
    subMenu?: subMenuItem[]
}

type subMenuItem = {
    title: string,
    link: string,
    subSubMenu?: subSubMenuItem[]
}

type subSubMenuItem = {
    title: string,
    link: string
}

export default async function MainNav({ menuInfoArr, session }: { menuInfoArr: menuItem[], session: Session | null }) {

    return (
        <nav id='mainNav' className={styles.mainNav}>
            <MobileNav menuInfoArr={menuInfoArr} />

            <Logo />

            <DesktopNav menuInfoArr={menuInfoArr} />

            <div style={{ justifySelf: "flex-end", display: "grid", alignContent: "flex-start" }}>
                {session === null ? (
                    <>
                        <LogButton option='login' />
                    </>
                ) : (
                    <>
                        <LogButton option='logout' />
                    </>
                )}
            </div>
        </nav>
    )
}


function DesktopNav({ menuInfoArr }: { menuInfoArr: menuItem[] }) {
    const pathname = ""

    return (
        <ul className={`${styles.mainMenu} ${styles.desktopMenu} noScrollBar`}>
            {menuInfoArr.map((eachMenuItem, eachMenuItemIndex) => (
                <li key={eachMenuItemIndex} className={styles.mainMenuItem}>
                    <div style={{ display: "flex", alignItems: "center", gap: ".3rem", justifyContent: "space-between" }}>
                        <Link style={{ color: pathname === eachMenuItem.link ? "var(--color1)" : "" }} href={eachMenuItem.link}>{eachMenuItem.title}</Link>

                        {eachMenuItem.subMenu !== undefined && (
                            <svg style={{ width: ".7rem", fill: pathname === eachMenuItem.link ? "var(--color1)" : "" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                        )}
                    </div>

                    {eachMenuItem.subMenu && (
                        <ul className={styles.subMenu}>
                            {eachMenuItem.subMenu.map((eachSubMenuItem, eachSubMenuItemIndex) => (
                                <li key={eachSubMenuItemIndex} className={styles.subMenuItem}>
                                    <div style={{ display: "flex", alignItems: "center", gap: ".3rem", justifyContent: "space-between" }}>
                                        <Link style={{ color: pathname === eachSubMenuItem.link ? "var(--color1)" : "" }} href={eachSubMenuItem.link}>{eachSubMenuItem.title}</Link>

                                        {eachSubMenuItem.subSubMenu !== undefined && (
                                            <svg style={{ width: ".7rem", color: pathname === eachSubMenuItem.link ? "var(--color1)" : "" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                                        )}
                                    </div>


                                    {eachSubMenuItem.subSubMenu && (
                                        <ul className={styles.subSubMenu}>
                                            {eachSubMenuItem.subSubMenu.map((seenSubSubMenuItem, seenSubSubMenuItemIndex) => (
                                                <li key={seenSubSubMenuItemIndex} style={{ color: pathname === seenSubSubMenuItem.link ? "var(--color1)" : "" }} className={styles.subSubMenuItem}><Link href={seenSubSubMenuItem.link}>{seenSubSubMenuItem.title}</Link></li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    )
}


function MobileNav({ menuInfoArr }: { menuInfoArr: menuItem[] }) {
    const showingMenu = false

    return (
        <div className={styles.mobileMenu}>
            <div style={{ margin: "0 auto", cursor: "pointer" }}>
                <svg style={{ width: "2rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" /></svg>
            </div>

            {showingMenu && (
                <ul className={`${styles.mainMenu} noScrollBar`}>
                    {menuInfoArr.map((eachMenuItem, eachMenuItemIndex) => (
                        <MenuItem key={eachMenuItemIndex} seenMenuItem={eachMenuItem} seenSubMenuArr={eachMenuItem.subMenu} />
                    ))}
                </ul>
            )}
        </div>
    )
}

function MenuItem({ seenMenuItem, seenSubMenuArr }: { seenMenuItem: menuItem, seenSubMenuArr: subMenuItem[] | undefined }) {
    const showingSubMenu = false
    const pathname = ""

    return (
        <li className={styles.mainMenuItem}>
            <div style={{ display: "flex", alignItems: "center", gap: ".3rem", justifyContent: "space-between" }}>
                <Link style={{ color: pathname === seenMenuItem.link ? "var(--color1)" : "" }} href={seenMenuItem.link}>{seenMenuItem.title}</Link>

                {seenSubMenuArr !== undefined && (
                    <svg style={{ width: ".7rem", fill: pathname === seenMenuItem.link ? "var(--color1)" : "", rotate: showingSubMenu ? "180deg" : "" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                )}
            </div>

            {showingSubMenu && seenSubMenuArr !== undefined && (
                <ul className={styles.subMenu}>
                    {seenSubMenuArr.map((eachSubMenuItem, eachSubMenuItemIndex) => <SubMenuItem key={eachSubMenuItemIndex} seenSubMenuItem={eachSubMenuItem} seenSubSubMenuArr={eachSubMenuItem.subSubMenu} />)}
                </ul>
            )}
        </li>
    )
}

function SubMenuItem({ seenSubMenuItem, seenSubSubMenuArr }: { seenSubMenuItem: subMenuItem, seenSubSubMenuArr: subSubMenuItem[] | undefined }) {
    const showingSubSubMenu = false
    const pathname = ""

    return (
        <li className={styles.subMenuItem}>
            <div style={{ display: "flex", alignItems: "center", gap: ".3rem", justifyContent: "space-between" }}>
                <Link style={{ color: pathname === seenSubMenuItem.link ? "var(--color1)" : "" }} href={seenSubMenuItem.link}>{seenSubMenuItem.title}</Link>

                {seenSubSubMenuArr !== undefined && (
                    <svg style={{ width: ".7rem", color: pathname === seenSubMenuItem.link ? "var(--color1)" : "", rotate: showingSubSubMenu ? "180deg" : "" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                )}
            </div>

            {showingSubSubMenu && seenSubSubMenuArr !== undefined && (
                <ul className={styles.subSubMenu}>
                    {seenSubSubMenuArr.map((seenSubSubMenuItem, seenSubSubMenuItemIndex) => <SubSubMenuItem key={seenSubSubMenuItemIndex} seenSubSubMenuItem={seenSubSubMenuItem} />)}
                </ul>
            )}
        </li>
    )
}

function SubSubMenuItem({ seenSubSubMenuItem }: { seenSubSubMenuItem: subSubMenuItem }) {
    const pathname = ""

    return (
        <li style={{ color: pathname === seenSubSubMenuItem.link ? "var(--color1)" : "" }} className={styles.subSubMenuItem}><Link href={seenSubSubMenuItem.link}>{seenSubSubMenuItem.title}</Link></li>
    )
}
