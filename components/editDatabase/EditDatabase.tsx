"use client"
import React, { useRef, useState } from 'react'
import styles from "./style.module.css"
import * as schema from "@/db/schema"
import toast from 'react-hot-toast'
import AddEditUser from '../users/AddEditUser'
import { packageType, searchObjType, userType } from '@/types'
import { deleteUser, getSpecificUser, getUsers } from '@/serverFunctions/handleUsers'
import { deletePackage, getPackages, getSpecificPackage } from '@/serverFunctions/handlePackages'
import Search from '../search/Search'
import AddEditPackage from '../packages/AddEditPackage'
import ConfirmationBox from '../confirmationBox/ConfirmationBox'

type schemaType = typeof schema;
type activeTableType = keyof schemaType;

type editingType = {
    users?: userType,
    packages?: packageType,
}

//handle filtering properly

export default function Page() {
    const allTableNames = Object.keys(schema) as activeTableType[];
    const allTables = allTableNames.filter(key => !key.endsWith("Relations") && !key.endsWith("Enum") && key !== "accounts" && key !== "sessions" && key !== "authenticators" && key !== "verificationTokens").sort((a, b) => a.localeCompare(b)) //get all tables defined in the schema, sort it alphabetically

    const [activeTable, activeTableSet] = useState<activeTableType | undefined>(undefined)
    const [showingSideBar, showingSideBarSet] = useState(true)

    const [usersSearchObj, usersSearchObjSet] = useState<searchObjType<userType>>({
        searchItems: [],
    })
    const [packagesSearchObj, packagesSearchObjSet] = useState<searchObjType<packageType>>({
        searchItems: [],
    })
    // const [usersToDepartmentsSearchObj, usersToDepartmentsSearchObjSet] = useState<searchObjType<userToDepartment>>({
    //     searchItems: [],
    // })

    const [adding, addingSet] = useState<Partial<{ [key in activeTableType]: boolean }>>({})
    const [editing, editingSet] = useState<editingType>({})

    const searchDebounce = useRef<NodeJS.Timeout | undefined>(undefined)

    type updateOption = { type: "all" } | { type: "specific", id: string }

    async function loadStarterValues<T>(sentActiveTable: activeTableType, updateOption: updateOption): Promise<T[]> {
        async function getResults<T>(updateOption: updateOption, specificFunction: () => Promise<T | undefined>, getAllFunction: () => Promise<T[]>): Promise<T[]> {
            let results: T[] = []

            if (updateOption.type === "specific") {
                const seenSpecificResult = await specificFunction()
                if (seenSpecificResult !== undefined) {
                    results = [(seenSpecificResult as T)]
                }

            } else if (updateOption.type === "all") {
                results = await getAllFunction()
            }

            return results
        }

        //perform update or new array
        function setSearchItemsOnSearchObj<T>(sentSearchObjSet: React.Dispatch<React.SetStateAction<searchObjType<T>>>, searchItems: T[], seenUpdateOption: updateOption) {
            sentSearchObjSet(prevSearchObj => {
                const newSearchObj = { ...prevSearchObj }

                //handle update
                if (seenUpdateOption.type === "specific") {
                    //in array
                    //@ts-expect-error type
                    const inArrayAlready = newSearchObj.searchItems.find(eachSearchItem => eachSearchItem.id === seenUpdateOption.id) !== undefined

                    if (inArrayAlready) {
                        newSearchObj.searchItems = newSearchObj.searchItems.map(eachSearchItemMap => {
                            //@ts-expect-error type
                            if (eachSearchItemMap.id !== undefined && eachSearchItemMap.id === seenUpdateOption.id && searchItems[0] !== undefined) {//protection against empty arrays
                                return searchItems[0]
                            }

                            return eachSearchItemMap
                        })

                    } else {
                        newSearchObj.searchItems = [...newSearchObj.searchItems, searchItems[0]]
                    }

                } else if (seenUpdateOption.type === "all") {
                    newSearchObj.searchItems = searchItems
                }

                return newSearchObj
            })
        }

        function respondToResults(sentResults: unknown[]) {
            //tell of results
            if (sentResults.length === 0) {
                toast.error("not seeing anything")
            }
        }

        if (sentActiveTable === "users") {
            const results = await getResults<userType>(updateOption,
                async () => {
                    if (updateOption.type !== "specific") throw new Error("incorrect updateOption sent")

                    return await getSpecificUser(updateOption.id, { action: "r" })
                },
                async () => {
                    return await getUsers({}, { action: "r" }, {}, usersSearchObj.limit, usersSearchObj.offset)
                },
            )

            //general send off
            respondToResults(results)

            //update state
            setSearchItemsOnSearchObj(usersSearchObjSet, results, updateOption)

            return results as T[]

        } else if (sentActiveTable === "packages") {
            const results = await getResults<packageType>(updateOption,
                async () => {
                    if (updateOption.type !== "specific") throw new Error("incorrect updateOption sent")

                    return await getSpecificPackage(parseInt(updateOption.id), { action: "r" })
                },
                async () => {
                    return await getPackages({}, { action: "r" }, {}, packagesSearchObj.limit, packagesSearchObj.offset)
                },
            )

            //general send off
            respondToResults(results)

            //update state
            setSearchItemsOnSearchObj(packagesSearchObjSet, results, updateOption)

            return results as T[]

        } else {
            throw new Error("invalid selection")
        }
    }

    async function deleteTableRecord(sentActiveTable: activeTableType, funcToRun: () => Promise<void>) {
        await funcToRun()

        toast.success("deleted")

        editingSet(prevEditing => {
            const newEditing = { ...prevEditing }

            //@ts-expect-error type
            newEditing[sentActiveTable] = undefined
            return newEditing
        })

        //refresh
        loadStarterValues<activeTableType>(sentActiveTable, { type: "all" })
    }

    return (
        <main className={styles.main} style={{ gridTemplateColumns: showingSideBar ? "auto 1fr" : "1fr" }}>
            <div className={styles.sidebar} style={{ display: showingSideBar ? "" : "none" }}>
                <button style={{ justifySelf: "flex-end" }}
                    onClick={() => {
                        showingSideBarSet(false)
                    }}
                >
                    <svg style={{ fill: "var(--shade1)" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                </button>

                <h3>Choose a screen</h3>

                <select value={activeTable !== undefined ? activeTable : ""}
                    onChange={async (event: React.ChangeEvent<HTMLSelectElement>) => {
                        if (event.target.value === "") return

                        const eachScreenOption = event.target.value as activeTableType

                        activeTableSet(eachScreenOption)
                    }}
                >
                    <option value={''}
                    >select a screen</option>

                    {allTables.map(eachEditableTableName => {

                        return (
                            <option key={eachEditableTableName} value={eachEditableTableName}
                            >{eachEditableTableName}</option>
                        )
                    })}
                </select>
            </div>

            <div className={styles.mainContent}>
                {!showingSideBar && (
                    <button style={{ alignSelf: "flex-start" }}
                        onClick={() => {
                            showingSideBarSet(true)
                        }}
                    >
                        <svg style={{ fill: "var(--shade1)", width: "1.5rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z" /></svg>
                    </button>
                )}

                {activeTable !== undefined ? (
                    <>
                        {activeTable === "users" && (
                            <>
                                <AddResourceButton
                                    adding={adding}
                                    addingSet={addingSet}
                                    keyName={activeTable}
                                />

                                {adding.users === true && (
                                    <AddEditUser
                                        submissionAction={() => {
                                            loadStarterValues(activeTable, { type: "all" })
                                        }}
                                    />
                                )}

                                <Search
                                    searchObj={usersSearchObj}
                                    searchObjSet={usersSearchObjSet}
                                    searchFunc={async () => {
                                        return loadStarterValues<userType>(activeTable, { type: "all" })
                                    }}
                                    showPage={true}
                                    searchFilters={{
                                        id: {
                                            value: "",
                                        },
                                        name: {
                                            value: "",
                                        },
                                        email: {
                                            value: "",
                                        }
                                    }}
                                    handleResults={false}
                                />

                                {usersSearchObj.searchItems.length > 0 && (
                                    <div style={{ display: "grid", alignContent: "flex-start", gap: "var(--spacingR)", }}>
                                        <div style={{ display: "grid", alignContent: "flex-start", gap: "var(--spacingR)", gridAutoFlow: "column", gridAutoColumns: "min(90%, 400px)", overflow: "auto" }} className='snap'>
                                            {usersSearchObj.searchItems.map(eachUser => {

                                                return (
                                                    <div key={eachUser.id} style={{ display: "grid", alignContent: "flex-start", gap: "var(--spacingR)", backgroundColor: "var(--color3)", padding: "var(--spacingR)" }}>
                                                        <h3>{eachUser.email}</h3>

                                                        <EditResourceButton
                                                            editing={editing}
                                                            editingSet={editingSet}
                                                            keyName={activeTable}
                                                            eachObj={eachUser}
                                                        />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {editing.users !== undefined && (
                                    <>
                                        <ConfirmationBox text='delete' confirmationText='are you sure you want to delete this record?' successMessage='deleted!'
                                            buttonProps={{
                                                style: {
                                                    justifySelf: "flex-end"
                                                }
                                            }}
                                            runAction={async () => {
                                                deleteTableRecord(activeTable, async () => {
                                                    if (editing.users === undefined) return
                                                    await deleteUser(editing.users.id, { action: "d" })
                                                })
                                            }}
                                        />

                                        <h3> Edit form:</h3>

                                        <div style={{ display: "grid", alignContent: "flex-start", gap: "var(--spacingR)" }}>
                                            <AddEditUser
                                                sentUser={editing.users}
                                                submissionAction={() => {
                                                    if (editing.users === undefined) return

                                                    loadStarterValues(activeTable, { type: "specific", id: editing.users.id })
                                                }}
                                            />
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {activeTable === "packages" && (
                            <>
                                <AddResourceButton
                                    adding={adding}
                                    addingSet={addingSet}
                                    keyName={activeTable}
                                />

                                {adding.packages === true && (
                                    <AddEditPackage
                                        submissionAction={() => {
                                            loadStarterValues(activeTable, { type: "all" })
                                        }}
                                    />
                                )}

                                <Search
                                    searchObj={packagesSearchObj}
                                    searchObjSet={packagesSearchObjSet}
                                    searchFunc={async () => {
                                        return loadStarterValues<packageType>(activeTable, { type: "all" })
                                    }}
                                    showPage={true}
                                    handleResults={false}
                                    searchFilters={{
                                        id: {
                                            value: 0,
                                        },
                                        userId: {
                                            value: "",
                                        },
                                        description: {
                                            value: "",
                                        },
                                    }}
                                />

                                {packagesSearchObj.searchItems.length > 0 && (
                                    <div style={{ display: "grid", alignContent: "flex-start", gap: "var(--spacingR)", }}>
                                        <div style={{ display: "grid", alignContent: "flex-start", gap: "var(--spacingR)", gridAutoFlow: "column", gridAutoColumns: "min(90%, 400px)", overflow: "auto" }} className='snap'>
                                            {packagesSearchObj.searchItems.map(eachPackage => {

                                                return (
                                                    <div key={eachPackage.id} style={{ display: "grid", alignContent: "flex-start", gap: "var(--spacingR)", backgroundColor: "var(--color3)", padding: "var(--spacingR)" }}>
                                                        <h3>{eachPackage.id}</h3>

                                                        <EditResourceButton
                                                            editing={editing}
                                                            editingSet={editingSet}
                                                            keyName={activeTable}
                                                            eachObj={eachPackage}
                                                        />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {editing.packages !== undefined && (
                                    <>
                                        <ConfirmationBox text='delete' confirmationText='are you sure you want to delete this record?' successMessage='deleted!'
                                            buttonProps={{
                                                style: {
                                                    justifySelf: "flex-end"
                                                }
                                            }}
                                            runAction={async () => {
                                                deleteTableRecord(activeTable, async () => {
                                                    if (editing.packages === undefined) return

                                                    await deletePackage(editing.packages.id, { action: "d" })
                                                })
                                            }}
                                        />

                                        <h3>Edit form:</h3>

                                        <div style={{ display: "grid", alignContent: "flex-start", gap: "var(--spacingR)" }}>
                                            <AddEditPackage
                                                sentPackage={editing.packages}
                                                submissionAction={() => {
                                                    if (editing.packages === undefined) return

                                                    loadStarterValues(activeTable, { type: "specific", id: `${editing.packages.id}` })
                                                }}
                                            />
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {/* {activeTable === "usersToDepartments" && (
                            <>
                                <AddResourceButton
                                    adding={adding}
                                    addingSet={addingSet}
                                    keyName={activeTable}
                                />

                                {adding.usersToDepartments === true && (
                                    <AddEditUserDepartment departmentsStarter={departmentsSearchObj.searchItems}
                                        submissionAction={() => {
                                            loadStarterValues(activeTable, { type: "all" })
                                        }}
                                    />
                                )}

                                <h3>search by department</h3>

                                <Search
                                    searchObj={departmentsSearchObj}
                                    searchObjSet={departmentsSearchObjSet}
                                    searchFunc={async () => {
                                        return await loadStarterValues<department>("departments", { type: "all" }, false)
                                    }}
                                    showPage={true}
                                    handleResults={false}
                                />

                                {departmentsSearchObj.searchItems.length > 0 && (
                                    <>
                                        <h3>department selection</h3>

                                        <select defaultValue={""}
                                            onChange={async (event: React.ChangeEvent<HTMLSelectElement>) => {
                                                try {
                                                    if (event.target.value === "") return
                                                    toast.success("searching")

                                                    const eachDepartmentId = event.target.value as department["id"]

                                                    const seenUsersToDepartments = await getUsersToDepartments({ type: "department", departmentId: eachDepartmentId })

                                                    //search latest usersToDepartments
                                                    usersToDepartmentsSearchObjSet(prevUsersToDepartmentsSearchObj => {
                                                        const newUsersToDepartmentsSearchObj = { ...prevUsersToDepartmentsSearchObj }

                                                        newUsersToDepartmentsSearchObj.searchItems = seenUsersToDepartments

                                                        return newUsersToDepartmentsSearchObj
                                                    })

                                                } catch (error) {
                                                    consoleAndToastError(error)
                                                }
                                            }}
                                        >
                                            <option value={""}
                                            >select</option>

                                            {departmentsSearchObj.searchItems.map(eachDepartment => {

                                                return (
                                                    <option key={eachDepartment.id} value={eachDepartment.id}
                                                    >{eachDepartment.name}</option>
                                                )
                                            })}
                                        </select>
                                    </>
                                )}

                                <h3>search all</h3>

                                <Search
                                    searchObj={usersToDepartmentsSearchObj}
                                    searchObjSet={usersToDepartmentsSearchObjSet}
                                    searchFunc={async () => {
                                        return await loadStarterValues<userToDepartment>(activeTable, { type: "all" }, false)
                                    }}
                                    showPage={true}
                                    handleResults={false}
                                />

                                {usersToDepartmentsSearchObj.searchItems.length > 0 && (
                                    <div style={{ display: "grid", alignContent: "flex-start", gap: "var(--spacingR)", }}>
                                        <div style={{ display: "grid", alignContent: "flex-start", gap: "var(--spacingR)", gridAutoFlow: "column", gridAutoColumns: "min(90%, 400px)", overflow: "auto" }} className='snap'>
                                            {usersToDepartmentsSearchObj.searchItems.map(eachUserToDepartment => {
                                                if (eachUserToDepartment.user === undefined || eachUserToDepartment.department === undefined) return null

                                                return (
                                                    <div key={eachUserToDepartment.id} style={{ display: "grid", alignContent: "flex-start", gap: "var(--spacingR)", backgroundColor: "var(--color3)", padding: "var(--spacingR)" }}>
                                                        <h3>{eachUserToDepartment.user.name}</h3>

                                                        <h3>{eachUserToDepartment.department.name}</h3>

                                                        <EditResourceButton
                                                            editing={editing}
                                                            editingSet={editingSet}
                                                            keyName={activeTable}
                                                            eachObj={eachUserToDepartment}
                                                        />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {editing.usersToDepartments !== undefined && (
                                    <>
                                        <h3>Edit form:</h3>

                                        <div style={{ display: "grid", alignContent: "flex-start", gap: "var(--spacingR)" }}>
                                            <AddEditUserDepartment
                                                sentUserDepartment={editing.usersToDepartments}
                                                departmentsStarter={departmentsSearchObj.searchItems}
                                                submissionAction={() => {
                                                    if (editing.usersToDepartments === undefined) return

                                                    loadStarterValues(activeTable, { type: "specific", id: editing.usersToDepartments.id })
                                                }}
                                            />
                                        </div>
                                    </>
                                )}
                            </>
                        )} */}
                    </>
                ) : (
                    <h3>Choose a screen</h3>
                )}
            </div>
        </main >
    )
}

function AddResourceButton({ keyName, adding, addingSet }: { keyName: activeTableType, adding: Partial<{ [key in activeTableType]: boolean }>, addingSet: React.Dispatch<React.SetStateAction<Partial<{ [key in activeTableType]: boolean }>>> }) {
    return (
        <button className='button1'
            onClick={() => {
                addingSet(prevAdding => {
                    const newAdding = { ...prevAdding }
                    if (newAdding[keyName] === undefined) newAdding[keyName] = false

                    newAdding[keyName] = !newAdding[keyName]
                    return newAdding
                })
            }}
        >{adding[keyName] ? "close" : `add ${keyName}`}</button>
    )
}

function EditResourceButton<K extends keyof editingType>({ editing, editingSet, keyName, eachObj }: {
    editing: editingType,
    editingSet: React.Dispatch<React.SetStateAction<editingType>>,
    keyName: K,
    eachObj: NonNullable<editingType[K]>
}) {

    const viewingThisItem = editing[keyName] !== undefined && editing[keyName].id === eachObj.id

    return (
        <>
            <button className='button1' style={{ backgroundColor: viewingThisItem ? "var(--color1)" : "" }}
                onClick={() => {
                    editingSet(prevEditing => {
                        const newEditing = { ...prevEditing }

                        //toggle
                        newEditing[keyName] = newEditing[keyName] === undefined ? eachObj : undefined

                        return newEditing
                    })
                }}
            >{viewingThisItem ? "cancel edit" : `edit ${keyName}`}</button>
        </>
    )
}