"use client"
import { allFilters, dateSchema, dbImageSchema, dbImageType, dbInvoiceSchema, dbInvoiceType, decimalStringSchema, filterSearchType, searchObjType, tableFilterTypes, userSchema, userType, withId } from '@/types'
import React, { useRef, useState } from 'react'
import styles from "./style.module.css"
import { formatAsMoney, formatWeight, generateTrackingNumber, makeDateTimeLocalInput, spaceCamelCase } from '@/utility/utility'
import { consoleAndToastError } from '@/useful/consoleErrorWithToast'
import CheckBox from '@/components/inputs/checkBox/CheckBox'
import Select from '../inputs/select/Select'
import Link from 'next/link'

type replaceDataType<T> = {
    [key in keyof T]?: {
        link?: string,
        transformLink?: boolean,
        text?: string,
        materialIconClass?: string,
        hideTableData?: true
    }
}

export default function ViewTable<T extends withId>(
    { wantedItems, hideColumns, sizeClass, searchFunc, renameTableHeadings, headingOrder, tableProvider, searchDebounceTime = 500, replaceData }:
        { wantedItems: T[], hideColumns?: (keyof T)[], sizeClass?: { large: (keyof T)[], small: (keyof T)[] }, searchFunc: (tableFilters: tableFilterTypes<T>, wantedItemsSearchObj: searchObjType<T>) => Promise<T[]>, renameTableHeadings?: { [key in keyof T]?: string }, headingOrder?: (keyof T)[], tableProvider: { filters: allFilters<T>, columns: (keyof T)[] }, searchDebounceTime?: number, replaceData?: replaceDataType<T> }
) {
    const [wantedItemsSearchObj, wantedItemsSearchObjSet] = useState<searchObjType<T>>({
        searchItems: wantedItems,
    })
    const [itemsSelected, itemsSelectedSet] = useState<T["id"][]>([])

    const allPackageFilters = useRef<allFilters<T>>({ ...tableProvider.filters })

    const [tableHeadings] = useState(() => {
        const wantedColumns = tableProvider.columns

        //if record there, ensure all heading available
        if (wantedItemsSearchObj.searchItems[0] !== undefined) {
            const itemHeadings = Object.keys(wantedItemsSearchObj.searchItems[0])
            const headingsThatAreNotThere: (keyof T)[] = []

            itemHeadings.map(eachPackageHeading => {
                if (!wantedColumns.includes(eachPackageHeading)) {
                    headingsThatAreNotThere.push(eachPackageHeading)
                }
            })

            headingsThatAreNotThere.forEach(eachHeading => {
                wantedColumns.push(eachHeading)
            })
        }

        return [
            ...wantedColumns
                // filter hidden columns - always hide enableRLS column
                .filter(eachHeading => ![...(hideColumns !== undefined ? hideColumns : []), "enableRLS"].includes(eachHeading as keyof T))
                // sort by headingOrder if provided
                .sort((a, b) => {
                    if (headingOrder === undefined) return 0

                    const aIndex = headingOrder.indexOf(a as string);
                    const bIndex = headingOrder.indexOf(b as string);

                    const aFound = aIndex !== -1;
                    const bFound = bIndex !== -1;

                    // if both are in the order array, use the array's order
                    if (aFound && bFound) return aIndex - bIndex;

                    // if only a is in the order array, it comes first
                    if (aFound) return -1;

                    // if only b is in the order array, it comes first
                    if (bFound) return 1;

                    // neither found, keep original order
                    return 0;
                })
        ]
    })

    const searchTriggerDebounce = useRef<NodeJS.Timeout | undefined>(undefined)
    const [, refresherSet] = useState(false)

    function returnSizeClass(tableHeading: keyof T) {
        const largeTableHeadings: (keyof T)[] = sizeClass !== undefined ? sizeClass.large : []
        const smallTableHeadings: (keyof T)[] = sizeClass !== undefined ? sizeClass.small : []

        if (largeTableHeadings.includes(tableHeading)) {
            return "larger"

        } else if (smallTableHeadings.includes(tableHeading)) {
            return "smaller"

        } else {
            return ""
        }
    }

    function resetFilters(eachTableHeading?: keyof T) {
        const seenTableHeadings: (keyof T)[] = eachTableHeading === undefined ? tableHeadings : [eachTableHeading]

        allPackageFilters.current = { ...allPackageFilters.current }
        seenTableHeadings.forEach(eachTableHeading => {
            if (allPackageFilters.current[eachTableHeading] === undefined) return

            //react reset
            allPackageFilters.current[eachTableHeading] = { ...allPackageFilters.current[eachTableHeading] }
            allPackageFilters.current[eachTableHeading].base = { ...allPackageFilters.current[eachTableHeading].base }

            //react refresh
            allPackageFilters.current[eachTableHeading].value = undefined
            allPackageFilters.current[eachTableHeading].base.using = undefined
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
                [key in keyof T]: filterSearchType["value"]
            }
            const activeFilters: activeFilterType = Object.fromEntries(
                Object.entries(allPackageFilters.current).map(eachEntry => {
                    const eachKey = eachEntry[0]
                    const eachValue = eachEntry[1]

                    if (eachValue === undefined || eachValue.base.using !== true) return null

                    return [eachKey, eachValue.value]
                }).filter(eachEntryArr => eachEntryArr !== null)
            )

            const items = await searchFunc(activeFilters as tableFilterTypes<T>, wantedItemsSearchObj)

            wantedItemsSearchObjSet(prevwantedSearchObj => {
                const newwantedSearchObj = { ...prevwantedSearchObj }

                newwantedSearchObj.searchItems = items

                return newwantedSearchObj
            })

        } catch (error) {
            consoleAndToastError(error)
        }
    }

    function triggerSearch() {
        if (searchTriggerDebounce.current) clearTimeout(searchTriggerDebounce.current)
        searchTriggerDebounce.current = setTimeout(() => {
            handleSearch()
        }, searchDebounceTime);
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
                            <CheckBox
                                checked={itemsSelected.length >= wantedItemsSearchObj.searchItems.length}
                                name='checkedAll'
                                onChange={() => {
                                    const checked = itemsSelected.length >= wantedItemsSearchObj.searchItems.length
                                    if (checked) {
                                        itemsSelectedSet([])

                                    } else {
                                        itemsSelectedSet(wantedItemsSearchObj.searchItems.map(eachP => eachP.id))
                                    }
                                }}
                            />
                        </th>

                        {tableHeadings.map(eachTableHeading => {
                            const eachTableHeadingAsString = renameTableHeadings !== undefined && renameTableHeadings[eachTableHeading] !== undefined ? renameTableHeadings[eachTableHeading] : eachTableHeading as string

                            const filterSearchType: filterSearchType | undefined = allPackageFilters.current[eachTableHeading]

                            return (
                                <th key={eachTableHeadingAsString} className={`${styles.heading} ${returnSizeClass(eachTableHeading)} ${eachTableHeading === "id" ? "noBorder" : ""} resetTextMargin`}>
                                    <p>{spaceCamelCase(eachTableHeadingAsString)}</p>

                                    {filterSearchType !== undefined && (
                                        <span style={{ width: "100%", display: "flex", position: "relative", gap: "var(--spacingS)", alignItems: "center", justifyContent: "space-between" }} className='resetTextMargin'>
                                            {filterSearchType.type === "string" && (
                                                <input type='text' value={filterSearchType.value !== undefined ? filterSearchType.value : ""}
                                                    onChange={(e) => {
                                                        if (allPackageFilters.current[eachTableHeading] === undefined) return

                                                        //react refresh
                                                        allPackageFilters.current[eachTableHeading] = { ...allPackageFilters.current[eachTableHeading] }

                                                        if (allPackageFilters.current[eachTableHeading].type === "string") {
                                                            const seenText = e.target.value

                                                            allPackageFilters.current[eachTableHeading].value = seenText

                                                            if (seenText === "") {
                                                                allPackageFilters.current[eachTableHeading].base.using = undefined
                                                            } else {
                                                                allPackageFilters.current[eachTableHeading].base.using = true
                                                            }
                                                        }

                                                        runSameOnAll()
                                                    }}
                                                />
                                            )}

                                            {filterSearchType.type === "stringNumber" && (
                                                <input type='text' value={filterSearchType.value !== undefined ? filterSearchType.value : ""}
                                                    onChange={(e) => {
                                                        console.log(`$string number`);
                                                        if (allPackageFilters.current[eachTableHeading] === undefined) return

                                                        //react refresh
                                                        allPackageFilters.current[eachTableHeading] = { ...allPackageFilters.current[eachTableHeading] }

                                                        if (allPackageFilters.current[eachTableHeading].type === "stringNumber") {
                                                            const seenText = e.target.value

                                                            if (seenText === "") {
                                                                allPackageFilters.current[eachTableHeading].value = undefined
                                                                allPackageFilters.current[eachTableHeading].base.using = undefined

                                                            } else {
                                                                const textTest = decimalStringSchema.safeParse(seenText)
                                                                if (textTest.success) {
                                                                    allPackageFilters.current[eachTableHeading].value = textTest.data
                                                                    allPackageFilters.current[eachTableHeading].base.using = true

                                                                } else {
                                                                    allPackageFilters.current[eachTableHeading].base.using = undefined
                                                                }
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
                                                                allPackageFilters.current[eachTableHeading].base.using = undefined

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
                                                            if (allPackageFilters.current[eachTableHeading].value === undefined) allPackageFilters.current[eachTableHeading].value = false

                                                            allPackageFilters.current[eachTableHeading].value = !allPackageFilters.current[eachTableHeading].value
                                                            allPackageFilters.current[eachTableHeading].base.using = true
                                                        }

                                                        runSameOnAll()
                                                    }}
                                                >{filterSearchType.value !== undefined ? filterSearchType.value.toString() : "use"}</button>
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
                                                                allPackageFilters.current[eachTableHeading].base.using = undefined

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
                                                                allPackageFilters.current[eachTableHeading].base.using = undefined
                                                            }
                                                        }

                                                        runSameOnAll()
                                                    }}
                                                >{filterSearchType.value !== undefined ? `has ${eachTableHeadingAsString}` : "no preference"}</button>
                                            )}

                                            <label htmlFor={`${eachTableHeadingAsString}checkbox`} style={{ marginLeft: "auto", cursor: "pointer" }}>
                                                <span className="material-symbols-outlined">
                                                    dehaze
                                                </span>
                                            </label>

                                            <input id={`${eachTableHeadingAsString}checkbox`} className="visibilityCheckbox" type="checkbox" />
                                            <span className={`${styles.moreCont} container`}
                                            >
                                                {filterSearchType.type === "options" && (//additional options
                                                    <Select
                                                        label={`select ${eachTableHeadingAsString}`}
                                                        name={`${eachTableHeadingAsString}select`}
                                                        value={filterSearchType.value !== undefined ? filterSearchType.value : ""}
                                                        valueOptions={[...filterSearchType.options]}
                                                        onChange={value => {
                                                            if (allPackageFilters.current[eachTableHeading] === undefined) return

                                                            //react refresh
                                                            allPackageFilters.current[eachTableHeading] = { ...allPackageFilters.current[eachTableHeading] }

                                                            if (allPackageFilters.current[eachTableHeading].type === "options") {
                                                                allPackageFilters.current[eachTableHeading].value = value

                                                                allPackageFilters.current[eachTableHeading].base.using = true
                                                            }

                                                            runSameOnAll()
                                                        }}
                                                    />
                                                )}

                                                <label className='resetTextMargin' style={{ color: filterSearchType.base.using ? "var(--c4)" : "var(--textC4)", }}
                                                    onClick={() => {
                                                        if (allPackageFilters.current[eachTableHeading] === undefined) return

                                                        //react refresh
                                                        allPackageFilters.current[eachTableHeading] = { ...allPackageFilters.current[eachTableHeading] }
                                                        allPackageFilters.current[eachTableHeading].base = { ...allPackageFilters.current[eachTableHeading].base }

                                                        //flip
                                                        let seenUsing = allPackageFilters.current[eachTableHeading].base.using
                                                        if (seenUsing === undefined) {
                                                            //ensure value there
                                                            if (allPackageFilters.current[eachTableHeading].value === "" || allPackageFilters.current[eachTableHeading].value === undefined) return

                                                            allPackageFilters.current[eachTableHeading].base.using = true

                                                        } else {
                                                            allPackageFilters.current[eachTableHeading].base.using = undefined
                                                        }

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
                    {wantedItemsSearchObj.searchItems.map(eachWantedItem => {
                        const checked = itemsSelected.includes(eachWantedItem.id)

                        return (
                            <tr key={eachWantedItem.id} className={`${styles.row} ${checked ? "selected" : ""}`}>
                                <td className='smaller center'>
                                    <CheckBox
                                        checked={itemsSelected.includes(eachWantedItem.id)}
                                        name='checked'
                                        onChange={() => {
                                            itemsSelectedSet(prevPackagesSelected => {
                                                let newPackagesSelected = [...prevPackagesSelected]

                                                if (checked) {
                                                    newPackagesSelected = newPackagesSelected.filter(eachPackageFilter => eachPackageFilter !== eachWantedItem.id)

                                                } else {
                                                    newPackagesSelected = [...newPackagesSelected, eachWantedItem.id]
                                                }
                                                return newPackagesSelected
                                            })
                                        }}
                                    />
                                </td>

                                {tableHeadings.map(eachTableHeading => {
                                    const seenHeading = eachTableHeading as string
                                    const tableData = eachWantedItem[eachTableHeading]

                                    let invoiceArr: dbInvoiceType[] | undefined = undefined
                                    let imageArr: dbImageType[] | undefined = undefined
                                    let seenDateCreated: Date | undefined = undefined
                                    let seenUser: userType | undefined = undefined

                                    if (typeof tableData === "object") {
                                        if (Array.isArray(tableData)) {
                                            //invoice array check
                                            const dbInvoiceTest = dbInvoiceSchema.array().safeParse(tableData)
                                            if (dbInvoiceTest.data !== undefined && dbInvoiceTest.data.length > 0) {
                                                invoiceArr = dbInvoiceTest.data
                                            }

                                            //image array check
                                            const dbImageTest = dbImageSchema.array().safeParse(tableData)
                                            if (dbImageTest.data !== undefined && dbImageTest.data.length > 0) {
                                                imageArr = dbImageTest.data
                                            }
                                        }

                                        //user obj check
                                        const userTest = userSchema.safeParse(tableData)
                                        console.log(`$tableData`, tableData);
                                        if (userTest.data !== undefined) {
                                            seenUser = userTest.data
                                            console.log(`$seenUser`, seenUser);
                                        }

                                        const dateTest = dateSchema.safeParse(tableData)
                                        if (dateTest.data !== undefined) {
                                            seenDateCreated = dateTest.data
                                        }
                                    }

                                    let replaceDataObj: replaceDataType<T>["key"] | undefined = undefined
                                    if (replaceData !== undefined && replaceData[eachTableHeading] !== undefined) {
                                        replaceDataObj = replaceData[eachTableHeading]
                                    }

                                    return (
                                        <td key={seenHeading} className={`${styles.heading} ${returnSizeClass(eachTableHeading)} resetTextMargin`}
                                        >
                                            {replaceDataObj === undefined ? (
                                                <>
                                                    {typeof tableData === "string" && (
                                                        <>
                                                            {eachTableHeading === "weight" ? (
                                                                <p>{formatWeight(tableData)}</p>

                                                            ) : ((eachTableHeading === "price") || (eachTableHeading === "payment")) ? (
                                                                <p>{formatAsMoney(tableData)}</p>

                                                            ) : (
                                                                <p>{tableData}</p>
                                                            )}
                                                        </>
                                                    )}

                                                    {typeof tableData === "number" && (
                                                        <>
                                                            <p>{tableData}</p>
                                                        </>
                                                    )}

                                                    {typeof tableData === "boolean" && (
                                                        <>
                                                            <p>{tableData.toString()}</p>
                                                        </>
                                                    )}

                                                    {typeof tableData === "object" && (
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

                                                            {seenUser !== undefined && (
                                                                <div className='resetTextMargin' style={{ fontSize: "var(--fontSizeS)" }}>
                                                                    <li>{seenUser.name}</li>
                                                                    <li>{seenUser.email}</li>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {((typeof tableData === "string") || (typeof tableData === "number")) && (
                                                        <>
                                                            <Link href={replaceDataObj.link === undefined ? "" : `${replaceDataObj.link}/${replaceDataObj.transformLink && typeof tableData === "number" ? generateTrackingNumber(tableData) : tableData}`}>
                                                                <button className='button3'>
                                                                    {replaceDataObj.text !== undefined ? replaceDataObj.text : ""}{replaceDataObj.hideTableData !== undefined ? "" : replaceDataObj.transformLink && typeof tableData === "number" ? generateTrackingNumber(tableData) : tableData}

                                                                    {replaceDataObj.materialIconClass !== undefined && (
                                                                        <span className="material-symbols-outlined">
                                                                            {replaceDataObj.materialIconClass}
                                                                        </span>
                                                                    )}
                                                                </button>
                                                            </Link>
                                                        </>
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