import ViewPackages from '@/components/packages/ViewPackages'
import { sessionCheck } from '@/serverFunctions/handleAuth'
import { getPackages } from '@/serverFunctions/handlePackages'
import React from 'react'

export default async function Page() {
    const session = await sessionCheck()
    const packages = await getPackages({ userId: session.user.id, }, { crud: "r" })

    return (
        <main>
            <ViewPackages packages={packages}
                hideColumns={["userId", "comments"]}
                mandatorySearchFilters={{
                    userId: session.user.id
                }}
            />
        </main>
    )
}