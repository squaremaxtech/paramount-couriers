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

export function ViewUser({ user, selectionAction, fullView = true }: { user: userType, selectionAction?: (eachUser: userType) => void, fullView?: boolean }) {
    return (
        <div className="card">
            <p>name: {user.name}</p>

            <p>email: {user.email}</p>

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