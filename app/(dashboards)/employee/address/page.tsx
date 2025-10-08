import CopyClipboard from '@/components/copyClipboard/CopyClipboard'
import { siteInfo } from '@/lib/data'
import React from 'react'

export default async function Page() {
    return (
        <main style={{ display: "grid", alignContent: "flex-start", gap: "var(--spacingR)", padding: "var(--spacingR)" }}>
            <div className="titleBox">
                <p>
                    Miami Address

                    <CopyClipboard text={`${siteInfo.shippingAddress.street} ${siteInfo.shippingAddress.city} ${siteInfo.shippingAddress.state} ${siteInfo.shippingAddress.zipCode} ${siteInfo.phoneNumbers[0]}`} />
                </p>

                <ul className="titleBoxMenu">
                    <li>
                        <p>Address Line</p>

                        <p>
                            {siteInfo.shippingAddress.street}

                            <CopyClipboard text={siteInfo.shippingAddress.street} />
                        </p>
                    </li>

                    <li>
                        <p>City</p>

                        <p>
                            {siteInfo.shippingAddress.city}

                            <CopyClipboard text={siteInfo.shippingAddress.city} />
                        </p>
                    </li>

                    <li>
                        <p>State</p>

                        <p>
                            {siteInfo.shippingAddress.state}

                            <CopyClipboard text={siteInfo.shippingAddress.state} />
                        </p>
                    </li>

                    <li>
                        <p>Zip code</p>

                        <p>
                            {siteInfo.shippingAddress.zipCode}

                            <CopyClipboard text={siteInfo.shippingAddress.zipCode} />
                        </p>
                    </li>

                    <li>
                        <p>Phone number</p>

                        <p>
                            {siteInfo.phoneNumbers[0]}

                            <CopyClipboard text={siteInfo.phoneNumbers[0]} />
                        </p>
                    </li>
                </ul>
            </div>
        </main>
    )
}