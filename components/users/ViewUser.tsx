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

export function ViewUser({ user, selectionAction, fullView = true, ...elProps }: { user: userType; selectionAction?: (eachUser: userType) => void; fullView?: boolean; } & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div {...elProps} className={`card p-4 rounded-2xl shadow-md border border-gray-200 bg-white ${elProps.className ?? ""}`}  >
            <div className="flex items-center gap-3">
                {user.image && (
                    <img
                        src={user.image}
                        alt={user.name ?? "User image"}
                        className="w-14 h-14 rounded-full object-cover border border-gray-300"
                    />
                )}
                <div>
                    <h3 className="font-semibold text-lg">{user.name ?? "Unnamed User"}</h3>
                    <p className="text-sm text-gray-600">{user.email ?? "No email provided"}</p>

                    <p>Deliver: {user.packageDeliveryMethod === "home" ? "Home" : `${user.packageDeliveryMethod} Branch`}</p>
                    {user.address !== null && user.packageDeliveryMethod === "home" && (
                        <p>Home Parish: {user.address.parish}</p>
                    )}
                </div>
            </div>

            {fullView && (
                <>
                    <div className="mt-4 border-t pt-3 text-sm text-gray-700 space-y-2">
                        <p>
                            <span className="font-medium">Role:</span>{" "}
                            {user.role?.toString() ?? "N/A"}
                        </p>

                        <p>
                            <span className="font-medium">Access Level:</span>{" "}
                            {user.accessLevel?.toString() ?? "N/A"}
                        </p>

                        <p>
                            <span className="font-medium">Delivery Method:</span>{" "}
                            {user.packageDeliveryMethod}
                        </p>

                        {user.address ? (
                            <div>
                                <p className="font-medium mb-1">Address:</p>
                                <p className="ml-2">
                                    street: {user.address.street}, city: {user.address.city}, parish: {user.address.parish}
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-500">No address set</p>
                        )}

                        <p>
                            <span className="font-medium">Authorized Users:</span>{" "}
                            {user.authorizedUsers.length > 0 ? user.authorizedUsers.map((au) => au.userId).join(", ") : "None"}
                        </p>

                        {user.emailVerified && (
                            <p>
                                <span className="font-medium">Email Verified:</span>{" "}
                                {new Date(user.emailVerified).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                </>
            )}

            {selectionAction !== undefined && (
                <button
                    className="button1 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    onClick={() => {
                        selectionAction(user);
                    }}
                >
                    Select
                </button>
            )}
        </div>
    );
}