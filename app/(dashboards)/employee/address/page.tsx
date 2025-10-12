import ViewUsAddress from '@/components/address/ViewUsAddress'
import CopyClipboard from '@/components/copyClipboard/CopyClipboard'
import { siteInfo } from '@/lib/data'
import React from 'react'

export default async function Page() {
    return (
        <main style={{ display: "grid", alignContent: "flex-start", gap: "var(--spacingR)", padding: "var(--spacingR)" }}>
            <div className="titleBox">
                <p>
                    Lauderhill Address

                    <CopyClipboard text={`${siteInfo.shippingAddress.street} ${siteInfo.shippingAddress.city} ${siteInfo.shippingAddress.state} ${siteInfo.shippingAddress.zipCode} ${siteInfo.branches[0].number.flow}`} />
                </p>

                <ViewUsAddress />
            </div>
        </main>
    )
}