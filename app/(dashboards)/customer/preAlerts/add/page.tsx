import AddEditPreAlert from '@/components/preAlerts/AddEditPreAlert'
import React from 'react'

export default function Page() {
    return (
        <main>
            <AddEditPreAlert wantedCrudObj={{ crud: "c" }} />
        </main>
    )
}
