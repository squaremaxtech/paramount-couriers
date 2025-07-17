import AddEditPreAlert from '@/components/preAlerts/AddEditPreAlert'
import { getSpecificPreAlert } from '@/serverFunctions/handlePreAlerts'
import { preAlertType } from '@/types'
import React from 'react'

export default async function Page({ params }: { params: Promise<{ id: preAlertType["id"] }> }) {
    const { id } = await params
    const seenPreAlert = await getSpecificPreAlert(id)

    //validate

    if (seenPreAlert === undefined) return (<p>not seeing specific pre Alert</p>)

    return (
        <main>
            <AddEditPreAlert sentPreAlert={seenPreAlert} />
        </main>
    )
}