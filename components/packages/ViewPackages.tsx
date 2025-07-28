"use client"
import { dateSchma, dbImageSchema, dbImageType, dbInvoiceSchema, dbInvoiceType, locationOptions, packageType, searchObjType, statusOptions, tableFilterTypes } from '@/types'
import React, { useRef, useState } from 'react'
import styles from "./style.module.css"
import { formatAsMoney, formatWeight, generateTrackingNumber, makeDateTimeLocalInput, spaceCamelCase } from '@/utility/utility'
import CheckInput from '../checkInput/CheckInput'
import Link from 'next/link'
import { getPackages } from '@/serverFunctions/handlePackages'
import { consoleAndToastError } from '@/useful/consoleErrorWithToast'

type baseFilterSearchType = {
    using?: boolean, //only use if true
    hide?: true, //if undefined not hiding
}

type filterSearchType =
    {
        type: "string",
        value: string,
        base: baseFilterSearchType,
    } |
    {
        type: "number",
        value: number | undefined,
        base: baseFilterSearchType,
    } |
    {
        type: "boolean",
        value: boolean
        base: baseFilterSearchType,
    } |
    {
        type: "options",
        options: readonly string[],
        value: string | undefined,
        base: baseFilterSearchType,
    } |
    {
        type: "date",
        value: Date | undefined
        base: baseFilterSearchType,
    } |
    {
        type: "array",
        value: [] | undefined
        base: baseFilterSearchType,
    }

type allFilters = {
    [key in keyof packageType]?: filterSearchType
}

export default function ViewPackages({ packages, hideColumns, mandatorySearchFilters }: { packages: packageType[], hideColumns?: (keyof packageType)[], mandatorySearchFilters?: tableFilterTypes<packageType> }) {
    const [packagesSearchObj, packagesSearchObjSet] = useState<searchObjType<packageType>>({
        searchItems: packages,
    })

    const [packagesSelected, packagesSelectedSet] = useState<packageType["id"][]>([])
    const allPackageFilters = useRef<allFilters>({
        id: {
            type: "number",
            value: undefined,
            base: {},
        },
        location: {
            type: "options",
            options: locationOptions,
            value: undefined,
            base: {},
        },
        status: {
            type: "options",
            options: statusOptions,
            value: undefined,
            base: {},
        },
        dateCreated: {
            type: "date",
            value: undefined,
            base: {},
        },
        invoices: {
            type: "array",
            value: undefined,
            base: {},
        },
        images: {
            type: "array",
            value: undefined,
            base: {},
        },
    })

    const tableHeadings = ["id", "userId", "trackingNumber", "store", "description", "location", "status", "consignee", "price", "dateCreated", "invoices", "images", "weight", "payment", "comments"]
        .filter(eachHeading => hideColumns === undefined ? eachHeading : !hideColumns.includes(eachHeading as keyof packageType)) as (keyof packageType)[]

    const searchTriggerDebounce = useRef<NodeJS.Timeout | undefined>(undefined)
    const [, refresherSet] = useState(false)

    function returnSizeClass(tableHeading: keyof packageType) {
        const largeTableHeadings: (keyof packageType)[] = ["id", "trackingNumber", "dateCreated"]
        const smallTableHeadings: (keyof packageType)[] = []

        if (largeTableHeadings.includes(tableHeading)) {
            return "larger"

        } else if (smallTableHeadings.includes(tableHeading)) {
            return "smaller"

        } else {
            return ""
        }
    }

    function resetFilters(eachTableHeading?: keyof packageType) {
        const seenTableHeadings: (keyof packageType)[] = eachTableHeading === undefined ? tableHeadings : [eachTableHeading]

        allPackageFilters.current = { ...allPackageFilters.current }
        seenTableHeadings.forEach(eachTableHeading => {
            if (allPackageFilters.current[eachTableHeading] === undefined) return

            //react refresh
            allPackageFilters.current[eachTableHeading] = { ...allPackageFilters.current[eachTableHeading] }

            //reset
            if (allPackageFilters.current[eachTableHeading].type === "string") {
                allPackageFilters.current[eachTableHeading].value = ""

            } else if (allPackageFilters.current[eachTableHeading].type === "number") {
                allPackageFilters.current[eachTableHeading].value = 0

            } else if (allPackageFilters.current[eachTableHeading].type === "boolean") {
                allPackageFilters.current[eachTableHeading].value = false

            } else if (allPackageFilters.current[eachTableHeading].type === "options") {
                allPackageFilters.current[eachTableHeading].value = undefined

            } else if (allPackageFilters.current[eachTableHeading].type === "date") {
                allPackageFilters.current[eachTableHeading].value = undefined

            } else if (allPackageFilters.current[eachTableHeading].type === "array") {
                allPackageFilters.current[eachTableHeading].value = undefined
            }
        })
    }

    //searchFilters exist for each key in object...
    //there are different types: string, number, boolean, options, dateAfter...
    //dynamically make filters at each column name...
    //gather all filters pass them to search function...
    //handle pages - page size/offset

    async function handleSearch() {
        try {
            type activeFilterType = {
                [key in keyof packageType]: filterSearchType["value"]
            }
            const activeFilters: activeFilterType = Object.fromEntries(
                Object.entries(allPackageFilters.current).map(eachEntry => {
                    const eachKey = eachEntry[0]
                    const eachValue = eachEntry[1]

                    if (eachValue.base.using !== true) return null

                    return [eachKey, eachValue.value]
                }).filter(eachEntryArr => eachEntryArr !== null)
            )

            console.log(`$activeFilters`, activeFilters);

            const packages = await getPackages({ ...(activeFilters as tableFilterTypes<packageType>), ...mandatorySearchFilters }, { crud: "r" }, packagesSearchObj.limit, packagesSearchObj.offset)

            packagesSearchObjSet(prevPackagesSearchObj => {
                const newPackagesSearchObj = { ...prevPackagesSearchObj }

                newPackagesSearchObj.searchItems = packages

                return newPackagesSearchObj
            })

        } catch (error) {
            consoleAndToastError(error)
        }
    }

    function triggerSearch() {
        if (searchTriggerDebounce.current) clearTimeout(searchTriggerDebounce.current)
        searchTriggerDebounce.current = setTimeout(() => {
            handleSearch()
        }, 1000);
    }

    function refresh() {
        refresherSet(prev => !prev)
    }

    function runSameOnAll() {
        refresh()

        triggerSearch()
    }

    return (
        <div className='container' style={{ zIndex: 0 }}>
            <table className={`${styles.table} recordTable`}>
                <thead>
                    <tr className={styles.row} style={{ alignItems: "flex-start" }}>
                        <th className='smaller center noBorder' style={{ alignSelf: "center" }}>
                            <CheckInput
                                checked={packagesSelected.length >= packagesSearchObj.searchItems.length}
                                name='checkedAll'
                                onChange={() => {
                                    const checked = packagesSelected.length >= packagesSearchObj.searchItems.length
                                    if (checked) {
                                        packagesSelectedSet([])

                                    } else {
                                        packagesSelectedSet(packagesSearchObj.searchItems.map(eachP => eachP.id))
                                    }
                                }}
                            />
                        </th>

                        {tableHeadings.map(eachTableHeading => {
                            const seenHeading = eachTableHeading === "id" ? "reggaeRushTrack" : eachTableHeading

                            const filterSearchType: filterSearchType | undefined = allPackageFilters.current[eachTableHeading]
                            if (filterSearchType === undefined) {
                                //assign for first time
                                allPackageFilters.current[eachTableHeading] = {
                                    type: "string",
                                    value: "",
                                    base: {}
                                }
                            }

                            return (
                                <th key={eachTableHeading} className={`${styles.heading} ${returnSizeClass(eachTableHeading)} ${eachTableHeading === "id" ? "noBorder" : ""} resetTextMargin`}>
                                    <p>{spaceCamelCase(seenHeading)}</p>

                                    {filterSearchType !== undefined && (
                                        <span style={{ display: "grid", position: "relative", gap: "var(--spacingS)", alignItems: "center", gridTemplateColumns: "1fr auto" }} className='resetTextMargin'>
                                            {filterSearchType.type === "string" && (
                                                <input type='text' value={filterSearchType.value}
                                                    onChange={(e) => {
                                                        if (allPackageFilters.current[eachTableHeading] === undefined) return

                                                        //react refresh
                                                        allPackageFilters.current[eachTableHeading] = { ...allPackageFilters.current[eachTableHeading] }

                                                        if (allPackageFilters.current[eachTableHeading].type === "string") {
                                                            const seenText = e.target.value

                                                            allPackageFilters.current[eachTableHeading].value = seenText

                                                            if (seenText === "") {
                                                                allPackageFilters.current[eachTableHeading].base.using = false
                                                            } else {
                                                                allPackageFilters.current[eachTableHeading].base.using = true
                                                            }
                                                        }

                                                        runSameOnAll()
                                                    }}
                                                />
                                            )}

                                            {filterSearchType.type === "number" && (
                                                <input type='number' value={filterSearchType.value !== undefined ? filterSearchType.value : ""}
                                                    onChange={(e) => {
                                                        if (allPackageFilters.current[eachTableHeading] === undefined) return

                                                        //react refresh
                                                        allPackageFilters.current[eachTableHeading] = { ...allPackageFilters.current[eachTableHeading] }

                                                        if (allPackageFilters.current[eachTableHeading].type === "number") {
                                                            const seenNumber = parseInt(e.target.value)
                                                            if (isNaN(seenNumber)) {
                                                                allPackageFilters.current[eachTableHeading].value = undefined
                                                                allPackageFilters.current[eachTableHeading].base.using = false

                                                            } else {
                                                                allPackageFilters.current[eachTableHeading].value = seenNumber
                                                                allPackageFilters.current[eachTableHeading].base.using = true
                                                            }
                                                        }

                                                        runSameOnAll()
                                                    }}
                                                />
                                            )}

                                            {filterSearchType.type === "boolean" && (
                                                <button className='button2'
                                                    onClick={() => {
                                                        if (allPackageFilters.current[eachTableHeading] === undefined) return

                                                        //react refresh
                                                        allPackageFilters.current[eachTableHeading] = { ...allPackageFilters.current[eachTableHeading] }

                                                        if (allPackageFilters.current[eachTableHeading].type === "boolean") {
                                                            allPackageFilters.current[eachTableHeading].value = !allPackageFilters.current[eachTableHeading].value

                                                            allPackageFilters.current[eachTableHeading].base.using = true
                                                        }

                                                        runSameOnAll()
                                                    }}
                                                >{filterSearchType.value.toString()}</button>
                                            )}

                                            {filterSearchType.type === "options" && (
                                                <>
                                                    {filterSearchType.value !== undefined && (
                                                        <p>{filterSearchType.value}</p>
                                                    )}
                                                </>
                                            )}

                                            {filterSearchType.type === "date" && (
                                                <input type="datetime-local" value={filterSearchType.value !== undefined ? makeDateTimeLocalInput(filterSearchType.value) : ""}
                                                    onChange={(e) => {
                                                        if (allPackageFilters.current[eachTableHeading] === undefined) return

                                                        //react refresh
                                                        allPackageFilters.current[eachTableHeading] = { ...allPackageFilters.current[eachTableHeading] }

                                                        if (allPackageFilters.current[eachTableHeading].type === "date") {
                                                            console.log(`$e.target.value`, e.target.value);

                                                            if (e.target.value === "") {
                                                                allPackageFilters.current[eachTableHeading].value = undefined
                                                                allPackageFilters.current[eachTableHeading].base.using = false

                                                            } else {
                                                                allPackageFilters.current[eachTableHeading].value = new Date(e.target.value)
                                                                allPackageFilters.current[eachTableHeading].base.using = true
                                                            }
                                                        }

                                                        runSameOnAll()
                                                    }}
                                                />
                                            )}

                                            {filterSearchType.type === "array" && (
                                                <button className='button2'
                                                    onClick={() => {
                                                        if (allPackageFilters.current[eachTableHeading] === undefined) return

                                                        //react refresh
                                                        allPackageFilters.current[eachTableHeading] = { ...allPackageFilters.current[eachTableHeading] }

                                                        if (allPackageFilters.current[eachTableHeading].type === "array") {
                                                            if (allPackageFilters.current[eachTableHeading].value === undefined) {
                                                                allPackageFilters.current[eachTableHeading].value = []
                                                                allPackageFilters.current[eachTableHeading].base.using = true

                                                            } else {
                                                                allPackageFilters.current[eachTableHeading].value = undefined
                                                                allPackageFilters.current[eachTableHeading].base.using = false
                                                            }
                                                        }

                                                        runSameOnAll()
                                                    }}
                                                >{filterSearchType.value !== undefined ? "has items" : "no preference"}</button>
                                            )}

                                            <label htmlFor={`${eachTableHeading}checkbox`} style={{ margin: "0 auto", cursor: "pointer" }}>
                                                <span className="material-symbols-outlined">
                                                    dehaze
                                                </span>
                                            </label>

                                            <input id={`${eachTableHeading}checkbox`} className="visibilityCheckbox" type="checkbox" style={{ display: "none" }} />
                                            <span className={`${styles.moreCont} container`}
                                            >
                                                {filterSearchType.type === "options" && (//additional options
                                                    <>
                                                        <label>select {eachTableHeading}</label>

                                                        <select value={filterSearchType.value}
                                                            onChange={async (event: React.ChangeEvent<HTMLSelectElement>) => {
                                                                const eachOption = event.target.value

                                                                if (allPackageFilters.current[eachTableHeading] === undefined) return

                                                                //react refresh
                                                                allPackageFilters.current[eachTableHeading] = { ...allPackageFilters.current[eachTableHeading] }

                                                                if (allPackageFilters.current[eachTableHeading].type === "options") {
                                                                    allPackageFilters.current[eachTableHeading].value = eachOption

                                                                    allPackageFilters.current[eachTableHeading].base.using = true
                                                                }

                                                                runSameOnAll()
                                                            }}
                                                        >
                                                            {filterSearchType.options.map(eachOption => {

                                                                return (
                                                                    <option key={eachOption} value={eachOption}
                                                                    >{eachOption}</option>
                                                                )
                                                            })}
                                                        </select>
                                                    </>
                                                )}

                                                <label className='resetTextMargin' style={{ color: filterSearchType.base.using ? "var(--c4)" : "var(--textC3)", }}
                                                    onClick={() => {
                                                        if (allPackageFilters.current[eachTableHeading] === undefined) return

                                                        //react refresh
                                                        allPackageFilters.current[eachTableHeading] = { ...allPackageFilters.current[eachTableHeading] }
                                                        allPackageFilters.current[eachTableHeading].base = { ...allPackageFilters.current[eachTableHeading].base }

                                                        let seenBool = allPackageFilters.current[eachTableHeading].base.using

                                                        //default false
                                                        if (seenBool === undefined) seenBool = false
                                                        console.log(`$allPackageFilters.current[eachTableHeading].base.using`, allPackageFilters.current[eachTableHeading].base.using);
                                                        //flip
                                                        allPackageFilters.current[eachTableHeading].base.using = !seenBool

                                                        runSameOnAll()
                                                    }}
                                                >
                                                    active

                                                    <button style={{ marginLeft: "var(--spacingS)" }}>
                                                        <span className="material-symbols-outlined" >
                                                            check_circle
                                                        </span>
                                                    </button>
                                                </label>


                                                <button className='button2'
                                                    onClick={() => {
                                                        resetFilters(eachTableHeading)

                                                        runSameOnAll()
                                                    }}
                                                >reset</button>
                                            </span>
                                        </span>
                                    )}
                                </th>
                            )
                        })}
                    </tr>
                </thead>

                <tbody>
                    {packagesSearchObj.searchItems.map(eachPackage => {
                        const checked = packagesSelected.includes(eachPackage.id)

                        return (
                            <tr key={eachPackage.id} className={`${styles.row} ${checked ? "selected" : ""}`}>
                                <td className='smaller center'>
                                    <CheckInput
                                        checked={packagesSelected.includes(eachPackage.id)}
                                        name='checked'
                                        onChange={() => {
                                            packagesSelectedSet(prevPackagesSelected => {
                                                let newPackagesSelected = [...prevPackagesSelected]

                                                if (checked) {
                                                    newPackagesSelected = newPackagesSelected.filter(eachPackageFilter => eachPackageFilter !== eachPackage.id)

                                                } else {
                                                    newPackagesSelected = [...newPackagesSelected, eachPackage.id]
                                                }
                                                return newPackagesSelected
                                            })
                                        }}
                                    />
                                </td>

                                {tableHeadings.map(eachTableHeading => {
                                    const packgeData = eachPackage[eachTableHeading]

                                    let invoiceArr: dbInvoiceType[] | undefined = undefined
                                    let imageArr: dbImageType[] | undefined = undefined
                                    let seenDateCreated: Date | undefined = undefined

                                    if (typeof packgeData === "object") {
                                        if (Array.isArray(packgeData)) {
                                            //invoice array check
                                            const dbInvoiceTest = dbInvoiceSchema.array().safeParse(packgeData)
                                            if (dbInvoiceTest.data !== undefined && dbInvoiceTest.data.length > 0) {
                                                invoiceArr = dbInvoiceTest.data
                                            }

                                            //image array check
                                            const dbImageTest = dbImageSchema.array().safeParse(packgeData)
                                            if (dbImageTest.data !== undefined && dbImageTest.data.length > 0) {
                                                imageArr = dbImageTest.data
                                            }
                                        }

                                        const dateTest = dateSchma.safeParse(packgeData)
                                        if (dateTest.data !== undefined) {
                                            seenDateCreated = dateTest.data
                                        }
                                    }

                                    return (
                                        <td key={eachTableHeading} className={`${styles.heading} ${returnSizeClass(eachTableHeading)} resetTextMargin`}>
                                            {typeof packgeData === "string" && (
                                                <>
                                                    {eachTableHeading === "weight" ? (
                                                        <p>{formatWeight(packgeData)}</p>

                                                    ) : ((eachTableHeading === "price") || (eachTableHeading === "payment")) ? (
                                                        <p>{formatAsMoney(packgeData)}</p>

                                                    ) : (
                                                        <p>{packgeData}</p>
                                                    )}
                                                </>
                                            )}

                                            {typeof packgeData === "number" && (
                                                <>
                                                    {eachTableHeading === "id" ? (
                                                        <Link href={`/customer/packages/view/${generateTrackingNumber(packgeData)}`}>
                                                            <button className='button3'>
                                                                {generateTrackingNumber(packgeData)}

                                                                <span className="material-symbols-outlined">
                                                                    link
                                                                </span>
                                                            </button>
                                                        </Link>

                                                    ) : (
                                                        <p>{packgeData}</p>
                                                    )}
                                                </>
                                            )}

                                            {typeof packgeData === "object" && (
                                                <>
                                                    {invoiceArr !== undefined && eachTableHeading === "invoices" && (
                                                        <p>has invoices</p>
                                                    )}

                                                    {imageArr !== undefined && eachTableHeading === "images" && (
                                                        <p>has images</p>
                                                    )}

                                                    {seenDateCreated !== undefined && (
                                                        <p>{seenDateCreated.toLocaleDateString()}</p>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export function ViewPackage({ seenPackage }: { seenPackage: packageType }) {
    return (
        <div>
            {seenPackage.id}
        </div>
    )
}