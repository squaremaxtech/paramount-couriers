import AddEditPreAlert from '@/components/preAlerts/AddEditPreAlert'
import { getSpecificPreAlert } from '@/serverFunctions/handlePreAlerts'
import { preAlertType } from '@/types'
import React from 'react'

export default async function Page({ params }: { params: { id: preAlertType["id"] } }) {
    const seenPreAlert = await getSpecificPreAlert(params.id)

    //validate

    if (seenPreAlert === undefined) return (<p>not seeing specific pre Alert</p>)

    return (
        <main>
            <AddEditPreAlert sentPreAlert={seenPreAlert} />
        </main>
    )
}
