import { auth } from '@/auth/auth'
import { getPackages } from '@/serverFunctions/handlePackages'
import { locationIconMatch, locationOptions } from '@/types'
import React from 'react'
import styles from "./page.module.css"
import Link from 'next/link'
import { calculatePackageServiceCost, formatAsMoney, generateTrackingNumber } from '@/utility/utility'

export default async function Page() {
  //look through packages for user
  //see how many have yeah
  const session = await auth()
  if (session === null) return <p>not seeing session</p>

  //ensures can only read own records
  const seenPackages = await getPackages({ userId: session.user.id }, { action: "r", skipOwnershipCheck: true }, {})

  const packagesInProgress = seenPackages.filter(eachPackage => eachPackage.status === "in progress" || eachPackage.status === "pre-alerted")

  const packagesNeedingPayment = seenPackages.filter(eachPackage => {
    const seenPayment = parseFloat(eachPackage.payment)
    const seenTotalCharge = calculatePackageServiceCost(eachPackage.charges)

    const seenNeedingPayment = seenTotalCharge - seenPayment > 0

    return seenNeedingPayment

  })

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const recentlyDelivered = seenPackages.filter(eachPackage =>
    eachPackage.status === "delivered" &&
    new Date(eachPackage.dateCreated) >= threeMonthsAgo
  );

  return (
    <main style={{ display: "grid", gap: "var(--spacingR)", padding: "var(--spacingR)" }}>
      <div>
        <h3>overview</h3>

        <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: "var(--spacingR)" }}>
          {locationOptions.map(eachLocation => {
            let packageInLocationCount = 0
            seenPackages.forEach(eachSeenPackage => {
              if (eachSeenPackage.location === eachLocation) {
                packageInLocationCount++
              }
            })

            return (
              <li key={eachLocation}>
                <Link href={`${packageInLocationCount > 0 ? `/customer/packages?location=${eachLocation}` : ``}`} className={`${styles.locationOption} ${packageInLocationCount > 0 ? styles.canHover : ""}`} style={{ boxShadow: `0px 0px 7px 2px color-mix(in hsl, var(--bg1), transparent ${packageInLocationCount > 0 ? "70%" : "90%"})` }}>
                  <button className='button3' style={{ justifySelf: "flex-end", padding: "0 var(--spacingS)" }}>
                    {packageInLocationCount}
                  </button>

                  <div style={{ width: "50px", height: "50px", position: "relative", backgroundColor: "var(--c1)", borderRadius: "var(--borderRadiusEL)", overflow: "clip" }}>
                    <span className="material-symbols-outlined mediumIcon" style={{ color: "var(--textC2)", position: "absolute", top: "50%", left: "50%", translate: "-50% -50%" }}>
                      {locationIconMatch[eachLocation]}
                    </span>
                  </div>

                  <h5>{eachLocation}</h5>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div style={{ display: 'grid' }}>
        <h3>your packages</h3>

        {packagesInProgress.length > 0 ? (
          <ul style={{ display: "grid", gridAutoFlow: "column", gridAutoColumns: "200px", gap: "var(--spacingR)", overflow: "auto", padding: "var(--spacingR)" }}>
            {packagesInProgress.map(eachPackage => {
              return (
                <li key={eachPackage.id} className={styles.eachPackage}>
                  <Link href={`/customer/packages/view/${generateTrackingNumber(eachPackage.id)}`} style={{ padding: "var(--spacingR)" }}>
                    <p>{new Date(eachPackage.dateCreated).toLocaleDateString()}</p>

                    <p>{eachPackage.description}</p>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <>
            <p>You have no packages at this moment</p>
          </>
        )}
      </div>

      <div style={{ display: 'grid' }}>
        <h3>pending payments</h3>

        {packagesNeedingPayment.length > 0 ? (
          <ul style={{ display: "grid", gridAutoFlow: "column", gridAutoColumns: "300px", gap: "var(--spacingR)", overflow: "auto", padding: "var(--spacingR)" }}>
            {packagesNeedingPayment.map(eachPackage => {
              return (
                <li key={eachPackage.id}>
                  <Link href={`/customer/packages/view/${generateTrackingNumber(eachPackage.id)}`} className={styles.eachPackage} style={{ padding: "var(--spacingR)" }} >
                    <p>{new Date(eachPackage.dateCreated).toLocaleDateString()}</p>

                    <p>{eachPackage.description}</p>

                    <p style={{}}>Charges: {formatAsMoney(`${calculatePackageServiceCost(eachPackage.charges)}`)} JMD</p>

                    <p style={{}}>Total Payment: {formatAsMoney(eachPackage.payment)} JMD</p>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <>
            <p>You have no pending payments</p>
          </>
        )}
      </div>

      <div style={{ display: 'grid' }}>
        <h3>recently delivered</h3>

        {recentlyDelivered.length > 0 ? (
          <ul style={{ display: "grid", gridAutoFlow: "column", gridAutoColumns: "300px", gap: "var(--spacingR)", overflow: "auto", padding: "var(--spacingR)" }}>
            {recentlyDelivered.map(eachPackage => {
              return (
                <li key={eachPackage.id}>
                  <Link href={`/customer/packages/view/${generateTrackingNumber(eachPackage.id)}`} className={styles.eachPackage} style={{ padding: "var(--spacingR)" }} >
                    <p>{new Date(eachPackage.dateCreated).toLocaleDateString()}</p>

                    <p>{eachPackage.description}</p>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <>
            <p>No packages recently delivered</p>
          </>
        )}
      </div>
    </main>
  )
}