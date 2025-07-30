"use client"
import { maxBodyToServerSize } from '@/types/uploadTypes'
import { convertBtyes } from '@/useful/usefulFunctions'
import { maxDocumentUploadSize } from '@/types/uploadTypes'
import React from 'react'
import toast from 'react-hot-toast'
import { dbFileType, dbWithFileType } from '@/types'
import { v4 as uuidV4 } from "uuid"
import { makeValidFilename } from '@/utility/utility'

export default function UploadFiles<T extends dbWithFileType>({ id, multiple = true, accept, allowedFileTypes, maxUploadSize = maxDocumentUploadSize, formDataSet, dbWithFileObjs, dbWithFileObjsSetter, newDbRecordSetter }: { id: string, multiple?: boolean, accept: string, allowedFileTypes: string[], maxUploadSize?: number, formDataSet: React.Dispatch<React.SetStateAction<FormData | null>>, dbWithFileObjs: T[], dbWithFileObjsSetter: (dbWithFileObjs: T[]) => void, newDbRecordSetter: (dbFile: dbFileType) => void }) {
    return (
        <div className='container'>
            <button className='button1'>
                <label htmlFor={id} style={{ cursor: "pointer" }}>
                    upload
                </label>
            </button>

            <input id={id} type="file" placeholder='Upload invoices' multiple={multiple} accept={accept}
                onChange={(e) => {
                    if (!e.target.files) return

                    let totalUploadSize = 0
                    const uploadedFiles = e.target.files
                    const formData = new FormData();

                    for (let index = 0; index < uploadedFiles.length; index++) {
                        const file = uploadedFiles[index];

                        //validation
                        if (!allowedFileTypes.includes(file.type)) {
                            toast.error(`File ${file.name} is not a valid file type to upload.`);
                            continue;
                        }

                        // Check the file size
                        if (file.size > maxUploadSize) {
                            toast.error(`File ${file.name} is too large. Maximum size is ${convertBtyes(maxUploadSize, "mb")} MB`);
                            continue;
                        }

                        //add file size to totalUploadSize
                        totalUploadSize += file.size

                        const newDate = new Date()

                        const fileSrc = makeValidFilename(`${uuidV4()}__${newDate.toLocaleDateString()}__${newDate.toLocaleTimeString()}__${file.name}`, { replacement: "-" })

                        //add to formData
                        formData.append(fileSrc, file);

                        const newDbUploadFile: dbFileType = {
                            src: fileSrc,
                            createdAt: newDate,
                            fileName: file.name,
                            status: "to-upload",
                            uploadedAlready: false
                        }

                        //add onto dbUploadedFiles
                        newDbRecordSetter(newDbUploadFile)
                    }

                    if (totalUploadSize > maxBodyToServerSize) {
                        toast.error(`Please upload less than ${convertBtyes(maxBodyToServerSize, "mb")} MB at a time`);
                        return
                    }

                    formDataSet(formData)
                }}
            />

            <div style={{ display: "flex", alignItems: "center" }}>
                <ul style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacingS)" }}>
                    {dbWithFileObjs.map((eachDbWithFileObj, eachDbWithFileObjIndex) => {
                        if (eachDbWithFileObj.file.status === "to-delete") return null

                        return (
                            <li key={eachDbWithFileObj.file.src} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--spacingS)" }} className='resetTextMargin'>
                                <p>{eachDbWithFileObj.file.fileName}</p>

                                <button
                                    onClick={() => {
                                        //change status
                                        const newDbWithFileObjs = [...dbWithFileObjs]
                                        newDbWithFileObjs[eachDbWithFileObjIndex] = { ...newDbWithFileObjs[eachDbWithFileObjIndex] }
                                        newDbWithFileObjs[eachDbWithFileObjIndex].file = { ...newDbWithFileObjs[eachDbWithFileObjIndex].file }
                                        newDbWithFileObjs[eachDbWithFileObjIndex].file.status = "to-delete"

                                        dbWithFileObjsSetter(newDbWithFileObjs)
                                    }}
                                >
                                    <span className="material-symbols-outlined">
                                        delete
                                    </span>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}