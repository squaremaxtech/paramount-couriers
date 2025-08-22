import React from 'react'
import styles from "./page.module.css"
import PageTopImage from '@/components/pageTopImage/PageTopImage'
import { rateByWeightArr } from '@/lib/data'
import { ratePricingType } from '@/types'
import { formatAsMoney } from '@/utility/utility'

export default function Page() {
    const seenHeadings = Object.keys(rateByWeightArr[0])

    return (
        <main className={styles.main}>
            <PageTopImage title='rates' />

            <section>
                <table className='recordTable'>
                    <thead>
                        <tr>
                            {seenHeadings.map(eachHeading => {
                                const eachHeadingTyped = eachHeading as keyof ratePricingType

                                return (
                                    <th key={eachHeadingTyped} className='noBorder'>{eachHeadingTyped} {eachHeadingTyped === "weight" ? "(lbs)" : eachHeadingTyped === "rate" ? "(JMD)" : ""}</th>
                                )
                            })}
                        </tr>
                    </thead>

                    <tbody>
                        {rateByWeightArr.map((eachRateByWeightObj, eachRateByWeightObjIndex) => {
                            return (
                                <tr key={eachRateByWeightObjIndex}>
                                    {seenHeadings.map(eachHeading => {
                                        const eachHeadingTyped = eachHeading as keyof ratePricingType
                                        const seenValue = eachRateByWeightObj[eachHeadingTyped]

                                        return (
                                            <td key={eachHeadingTyped}>
                                                {eachHeadingTyped === "rate" ? (
                                                    <>{formatAsMoney(`${seenValue}`, 0)}</>
                                                ) : (
                                                    <>{seenValue}</>
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </section>
        </main>
    )
}