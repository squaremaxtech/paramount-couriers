import React from 'react'
import styles from "./page.module.css"
import PageTopImage from '@/components/pageTopImage/PageTopImage'
import { rateByWeightArr } from '@/lib/data'
import { ratePricingType } from '@/types'
import { formatAsMoney } from '@/utility/utility'

export default function Page() {
    const rows = 3

    return (
        <main className={styles.main}>
            <PageTopImage title='rates' />

            <section>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(350px, 100%), 1fr))", }}>
                    {new Array(rows).fill("").map((_, eachRowIndex) => {
                        const total = rateByWeightArr.length;
                        const itemCount = Math.floor(total / rows);
                        const startingPoint = eachRowIndex * itemCount;

                        const smallArray =
                            eachRowIndex === rows - 1
                                ? rateByWeightArr.slice(startingPoint)
                                : rateByWeightArr.slice(startingPoint, startingPoint + itemCount);

                        return (
                            <ShowTable
                                key={eachRowIndex}
                                seenRateByWeightArr={smallArray}
                            />
                        );
                    })}
                </div>
            </section>
        </main>
    )
}

function ShowTable({ seenRateByWeightArr }: { seenRateByWeightArr: ratePricingType[] }) {
    const seenHeadings = Object.keys(seenRateByWeightArr[0])

    return (
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
                {seenRateByWeightArr.map((eachSeenRateByWeightObj, eachSeenRateByWeightObjIndex) => {
                    return (
                        <tr key={eachSeenRateByWeightObjIndex}>
                            {seenHeadings.map(eachHeading => {
                                const eachHeadingTyped = eachHeading as keyof ratePricingType
                                const seenValue = eachSeenRateByWeightObj[eachHeadingTyped]

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
    )
}