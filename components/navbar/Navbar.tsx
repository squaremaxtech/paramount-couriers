import React, { HTMLAttributes } from 'react'
import LogButton from '../logButtons/LogButton'
import styles from "./style.module.css"
import Link from 'next/link'
import Logo from "@/components/logo/Logo"
import Image from 'next/image'
import defaultImage from "@/public/defaultProfileImage.jpg"
import { auth } from '@/auth/auth'

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

export default function MainNav({ menuInfoArr }: { menuInfoArr: menuItem[] }) {
    return (
        <nav className={styles.mainNav}>
            <DesktopNav menuItems={menuInfoArr} />

            <MobileNav menuItems={menuInfoArr} />
        </nav>
    )
}

async function DesktopNav({ menuItems }: { menuItems: menuItem[] }) {

    return (
        <div className={styles.desktopMenu}>
            <Logo />

            <Menu menu={menuItems} className={styles.desktopMenu} calledFrom='desktop' />

            <LoginMenu calledFrom='desktop' />
        </div>
    )
}

async function MobileNav({ menuItems }: { menuItems: menuItem[] }) {

    return (
        <div className={styles.mobileMenu}>
            <Logo />

            <label htmlFor='mobileMenuCheckbox'>
                <svg style={{ width: "var(--sizeL)", height: "var(--sizeL)", cursor: "pointer" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" /></svg>
            </label>

            {/* use checkbox styling to hide the menu */}
            <input id='mobileMenuCheckbox' className={`visibilityCheckbox ${styles.visibilityCheckbox}`} type="checkbox" />
            <Menu menu={menuItems} calledFrom='mobile'
                mobileAddOn={(
                    <div className='container'>
                        <div className='flexContainer' style={{ justifyContent: "space-between", paddingInline: "var(--spacingR)" }}>
                            <Logo />

                            <label htmlFor='mobileMenuCheckbox' style={{ cursor: "pointer" }}>
                                <span className="material-symbols-outlined">
                                    close
                                </span>
                            </label>
                        </div>

                        <LoginMenu calledFrom="mobile" />
                    </div>
                )}
            />
        </div>
    )
}

function Menu({ menu, mobileAddOn = null, calledFrom, ...elProps }: { menu: menuItem[], mobileAddOn?: React.JSX.Element | null, calledFrom: "desktop" | "mobile" } & HTMLAttributes<HTMLUListElement>) {
    const pathname = ""

    return (
        <ul {...elProps} className={`${styles.mainMenu} noScrollBar ${elProps.className ?? ""}`}>
            {mobileAddOn}

            {menu.map((eachMenuItem, eachMenuItemIndex) => (
                <li key={eachMenuItemIndex} className={styles.mainMenuItem}>
                    <div className={styles.mainMenuItemTopCont} style={{}}>
                        <Link style={{ color: pathname === eachMenuItem.link ? "var(--color1)" : "" }} href={eachMenuItem.link}>{eachMenuItem.title}</Link>

                        {eachMenuItem.subMenu !== undefined && (
                            <label htmlFor={`${calledFrom}${eachMenuItemIndex}MenuItemCheckbox`} className={styles.onlyOnMobile}>
                                <svg style={{ width: "var(--sizeS)", fill: pathname === eachMenuItem.link ? "var(--color1)" : "" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                            </label>
                        )}
                    </div>

                    {eachMenuItem.subMenu !== undefined && eachMenuItem.subMenu.length > 0 && (
                        <>
                            <input id={`${calledFrom}${eachMenuItemIndex}MenuItemCheckbox`} className="visibilityCheckbox" type="checkbox" />
                            <SubMenu subMenu={eachMenuItem.subMenu} calledFrom={calledFrom} />
                        </>
                    )}
                </li>
            ))}
        </ul>
    )
}

function SubMenu({ subMenu, calledFrom }: { subMenu: subMenuItem[], calledFrom: "desktop" | "mobile" }) {
    const pathname = ""

    return (
        <ul className={styles.subMenu}>
            {subMenu.map((eachSubMenuItem, eachSubMenuItemIndex) => (
                <li key={eachSubMenuItemIndex} className={styles.subMenuItem}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--spacingES)", justifyContent: "space-between" }}>
                        <Link style={{ color: pathname === eachSubMenuItem.link ? "var(--color1)" : "" }} href={eachSubMenuItem.link}>{eachSubMenuItem.title}</Link>

                        {eachSubMenuItem.subSubMenu !== undefined && (
                            <label htmlFor={`${calledFrom}${eachSubMenuItemIndex}SubMenuItemCheckbox`} className={styles.onlyOnMobile}>
                                <svg style={{ width: "var(--sizeS)", color: pathname === eachSubMenuItem.link ? "var(--color1)" : "" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" /></svg>
                            </label>
                        )}
                    </div>

                    {eachSubMenuItem.subSubMenu !== undefined && eachSubMenuItem.subSubMenu.length > 0 && (
                        <>
                            <input id={`${calledFrom}${eachSubMenuItemIndex}SubMenuItemCheckbox`} className="visibilityCheckbox" type="checkbox" />
                            <SubSubMenu subSubMenu={eachSubMenuItem.subSubMenu} />
                        </>
                    )}
                </li>
            ))}
        </ul>
    )
}

function SubSubMenu({ subSubMenu }: { subSubMenu: subSubMenuItem[] }) {
    const pathname = ""

    return (
        <ul className={styles.subSubMenu}>
            {subSubMenu.map((seenSubSubMenuItem, seenSubSubMenuItemIndex) => (
                <li key={seenSubSubMenuItemIndex} style={{ color: pathname === seenSubSubMenuItem.link ? "var(--color1)" : "" }} className={styles.subSubMenuItem}><Link href={seenSubSubMenuItem.link}>{seenSubSubMenuItem.title}</Link></li>
            ))}
        </ul>
    )
}

async function LoginMenu({ calledFrom }: { calledFrom: "desktop" | "mobile" }) {
    const session = await auth()

    return (
        <div className={styles.loginMenu}>
            {session === null ? (
                <LogButton option='login' />

            ) : (
                <div className={styles.contDiv}>
                    <label htmlFor={`${calledFrom}userOptionsCheckbox`} style={{ margin: "0 auto", cursor: "pointer" }}>
                        <Image alt="userImage" src={session.user.image !== null ? session.user.image : defaultImage} width={30} height={30} style={{ objectFit: "cover" }} />
                    </label>

                    {calledFrom === "desktop" && (
                        <input id={`${calledFrom}userOptionsCheckbox`} className="visibilityCheckbox" type="checkbox" />
                    )}
                    <ul className={styles.moreItemsMenu}>
                        <li className={styles.moreIntemsItem}
                        >
                            <Link href={session.user.role === "customer" ? "/customer" : "/employee"}>dashboard</Link>
                        </li>

                        {session.user.role === "admin" && (
                            <li className={styles.moreIntemsItem}
                            >
                                <Link href={"/admin"}>admin dashboard</Link>
                            </li>
                        )}

                        <li className={styles.moreIntemsItem}>
                            <LogButton option='logout' />
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}