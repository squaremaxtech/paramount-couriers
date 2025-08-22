import React from 'react'
import styles from "./page.module.css"
import PageTopImage from '@/components/pageTopImage/PageTopImage'

export default function Page() {
    return (
        <main className={styles.main}>
            <PageTopImage title='rates' />
        </main>
    )
}