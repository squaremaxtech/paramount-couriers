import AddEditPreAlert from '@/components/preAlerts/AddEditPreAlert'
import { getSpecificPreAlert } from '@/serverFunctions/handlePreAlerts'
import { preAlertType } from '@/types'
import React from 'react'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    //validate
    const seenPreAlert = await getSpecificPreAlert(id, { crud: "ro", resourceId: id })
    if (seenPreAlert === undefined) return (<p>not seeing specific pre Alert</p>)

    return (
        <main>
            <AddEditPreAlert sentPreAlert={seenPreAlert} wantedCrudObj={{ crud: "uo", resourceId: seenPreAlert.id }} />
        </main>
    )
}