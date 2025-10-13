import ViewTable from '@/components/viewTable/ViewTable'
import { users } from '@/db/schema'
import { ensureCanAccessTable } from '@/serverFunctions/handleAuth'
import { getUsers } from '@/serverFunctions/handleUsers'
import { userType, tableFilterTypes } from '@/types'
import { handleEnsureCanAccessTableResultsBool, provideFilterAndColumnForTable } from '@/utility/utility'
import Link from 'next/link'
import React from 'react'

export default async function Page() {
    const seenUsers = await getUsers({}, { action: "r" }, {}, 50)
    const ensureCanAccessTableResults = await ensureCanAccessTable("users", [], { action: "c" })
    const canAddToUsersTable = handleEnsureCanAccessTableResultsBool(ensureCanAccessTableResults, "table")

    return (
        <main className='container' style={{ gridTemplateRows: canAddToUsersTable ? "auto 1fr" : "1fr", overflow: "auto" }}>
            {canAddToUsersTable && (
                <Link href={`/employee/users/add`} style={{ justifySelf: "flex-end" }}>
                    <button className='button1'>add</button>
                </Link>
            )}

            {seenUsers.length > 0 ? (
                <ViewTable
                    wantedItems={seenUsers}
                    tableProvider={provideFilterAndColumnForTable(users)}
                    sizeClass={{
                        largest: ["id", "email"],
                        large: ["address"],
                        small: []
                    }}
                    searchFunc={async (activeFilters, wantedItemsSearchObj) => {
                        "use server"
                        return await getUsers(activeFilters as tableFilterTypes<userType>, { action: "r" }, {}, wantedItemsSearchObj.limit, wantedItemsSearchObj.offset)
                    }}
                    headingOrder={["id", "name", "email", "emailVerified", "role", "accessLevel"]}
                    replaceData={{
                        id: {
                            link: `/employee/users/edit`,
                            materialIconClass: "link",
                            transformLink: true,
                        }
                    }}
                />
            ) : (
                <p>users will show here</p>
            )}
        </main>
    )
}