import React from 'react'
import styles from "./style.module.css"
import { withId } from '@/types'

export default function ViewItems<T extends withId>({ itemObjs, selectionAction, selectedId }: { itemObjs: { item: T, Element: React.JSX.Element }[], selectionAction?: (eachItem: T) => void, selectedId?: withId["id"] }) {
    return (
        <div className='container'>
            <div className='gridColumn snap'>
                {itemObjs.map(eachItemObj => {
                    return (
                        <ViewItem key={eachItemObj.item.id} itemObj={eachItemObj} selectedId={selectedId}
                            selectionAction={selectionAction}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export function ViewItem<T extends withId>({ itemObj, selectionAction, selectedId }: {
    itemObj: {
        item: T,
        Element: React.JSX.Element
    }, selectionAction?: (eachItem: T) => void, selectedId?: string | number
}) {
    const selected = selectedId === itemObj.item.id

    return (
        <div className={`container ${styles.item} ${selected ? styles.selected : ""}`}>
            {selectionAction !== undefined && (
                <button className='button1' style={{ backgroundColor: selected ? "var(--c1Light)" : "" }}
                    onClick={() => { selectionAction(itemObj.item) }}
                >{selected ? "selected" : "select"}</button>
            )}

            {itemObj.Element}
        </div>
    )
}