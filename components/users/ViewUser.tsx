import { userType } from '@/types'
import React from 'react'

export default function ViewUsers({ users, selectionAction }: { users: userType[], selectionAction?: (eachUser: userType) => void }) {
    return (
        <div className='container'>
            <div className='gridColumn snap'>
                {users.map(eachUser => {
                    return (
                        <ViewUser key={eachUser.id} user={eachUser}
                            selectionAction={selectionAction}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export function ViewUser({ user, selectionAction, fullView = true, ...elProps }: { user: userType, selectionAction?: (eachUser: userType) => void, fullView?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div {...elProps} className={`card ${elProps.className ?? ""}`}>
            <h3>{user.name}</h3>

            <p>{user.email}</p>

            {fullView && (
                <>

                </>
            )}

            {selectionAction !== undefined && (
                <button className='button1'
                    onClick={() => { selectionAction(user) }}
                >select</button>
            )}
        </div>
    )
}