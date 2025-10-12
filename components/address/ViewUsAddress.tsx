import { siteInfo } from "@/lib/data"
import CopyClipboard from "../copyClipboard/CopyClipboard"
import { userType } from "@/types"

export default function ViewUsAddress({ seenUser }: { seenUser?: userType }) {
    return (
        <ul className="titleBoxMenu">
            {seenUser !== undefined && (
                <li>
                    <p>Full name</p>

                    <p>
                        {seenUser.name}

                        <CopyClipboard text={seenUser.name ?? ""} />
                    </p>
                </li>
            )}

            <li>
                <p>Address Line 1</p>

                <p>
                    {siteInfo.shippingAddress.street}

                    <CopyClipboard text={siteInfo.shippingAddress.street} />
                </p>
            </li>

            <li>
                <p>Address Line 2</p>

                <p>
                    {siteInfo.shippingAddress.street2}

                    <CopyClipboard text={siteInfo.shippingAddress.street2} />
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

                <div style={{ display: "flex", alignItems: "center" }}>
                    <ul style={{}}>
                        {siteInfo.branches.map(eachBranch => {
                            return (
                                <li key={eachBranch.name}>
                                    {eachBranch.name}:{" "}
                                    {eachBranch.number.flow !== "" && (<>Flow - {eachBranch.number.flow} </>)}
                                    {eachBranch.number.digicel !== "" && (<>Digicel - {eachBranch.number.digicel}</>)}
                                </li>
                            )
                        })}
                    </ul>

                    <CopyClipboard text={siteInfo.branches.map(eachBranch => {
                        return `${eachBranch.name} ${eachBranch.number.flow !== "" ? `Flow - ${eachBranch.number.flow}` : ""}${eachBranch.number.digicel !== "" ? `, Digicel - ${eachBranch.number.digicel}` : ""}`
                    }).join("\n")} />
                </div>
            </li>
        </ul>
    )
}