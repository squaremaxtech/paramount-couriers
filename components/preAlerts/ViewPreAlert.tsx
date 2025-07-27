import { preAlertType } from '@/types'
import { formatLocalDateTime } from '@/utility/utility'
import React from 'react'
import { ViewUser } from '../users/ViewUser'

export default function ViewPreAlerts({ preAlerts, selectionAction }: { preAlerts: preAlertType[], selectionAction?: (eachPreAlert: preAlertType) => void }) {
    return (
        <div className='container'>
            <div className='gridColumn snap'>
                {preAlerts.map(eachPreAlert => {
                    return (
                        <ViewPreAlert key={eachPreAlert.id} preAlert={eachPreAlert}
                            selectionAction={selectionAction}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export function ViewPreAlert({ preAlert, selectionAction }: { preAlert: preAlertType, selectionAction?: (eachPreAlert: preAlertType) => void }) {
    return (
        <div className="card">
            {preAlert.fromUser !== undefined && (
                <ViewUser user={preAlert.fromUser} />
            )}

            <p>tracking number: {preAlert.trackingNumber}</p>

            <p>store: {preAlert.store}</p>

            <p>consignee: {preAlert.consignee}</p>

            <p>price: {preAlert.price}</p>

            <p>acknowledged: {preAlert.acknowledged.toString()}</p>

            <p>{formatLocalDateTime(preAlert.dateCreated)}</p>

            {selectionAction !== undefined && (
                <button className='button1'
                    onClick={() => { selectionAction(preAlert) }}
                >select</button>
            )}
        </div>
    )
}