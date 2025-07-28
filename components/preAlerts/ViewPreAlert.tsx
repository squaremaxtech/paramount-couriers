import { preAlertType } from '@/types'
import { formatLocalDateTime } from '@/utility/utility'
import React from 'react'
import { ViewUser } from '../users/ViewUser'
import styles from "./style.module.css"

export default function ViewPreAlerts({ preAlerts, selectionAction, selectedId }: { preAlerts: preAlertType[], selectionAction?: (eachPreAlert: preAlertType) => void, selectedId?: preAlertType["id"] }) {
    return (
        <div className='container'>
            <div className='gridColumn snap'>
                {preAlerts.map(eachPreAlert => {
                    return (
                        <ViewPreAlert key={eachPreAlert.id} preAlert={eachPreAlert} selectedId={selectedId}
                            selectionAction={selectionAction}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export function ViewPreAlert({ preAlert, selectionAction, selectedId }: { preAlert: preAlertType, selectionAction?: (eachPreAlert: preAlertType) => void, selectedId?: preAlertType["id"] }) {
    return (
        <div className={`${styles.preAlert} card ${selectedId === preAlert.id ? styles.selected : ""}`}>
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