"use client"
import { maxBodyToServerSize } from '@/types/uploadTypes'
import { convertBtyes } from '@/useful/usefulFunctions'
import { maxDocumentUploadSize } from '@/types/uploadTypes'
import React from 'react'
import toast from 'react-hot-toast'
import { dbFileUploadType } from '@/types'
import { v4 as uuidV4 } from "uuid"
import { makeValidFilename } from '@/utility/utility'

export default function UploadFiles({ multiple = true, accept, allowedFileTypes, maxUploadSize = maxDocumentUploadSize, formDataSet, dbUploadedFiles, dbUploadedFilesSetter, newDbRecordSetter }: {
    multiple?: boolean, accept: string, allowedFileTypes: string[], maxUploadSize?: number, formDataSet: React.Dispatch<React.SetStateAction<FormData | null>>, dbUploadedFiles: dbFileUploadType[], dbUploadedFilesSetter: (dbUpdatedFile: dbFileUploadType, index: number) => void, newDbRecordSetter: (dbFile: dbFileUploadType) => void
}) {
    //handle formData set...
    //handle states dbUploadedFiles..
    //handle dbUploadedFiles set - upload, delete

    return (
        <div className='container'>
            <button className='button1'>
                <label htmlFor='fileUpload' style={{ cursor: "pointer" }}>
                    upload
                </label>
            </button>

            <input id='fileUpload' type="file" placeholder='Upload invoices' multiple={multiple} accept={accept} style={{ display: "none" }}
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

                        const fileId = makeValidFilename(`${uuidV4()}__${newDate.toLocaleDateString()}__${newDate.toLocaleTimeString()}`, { replacement: "-" })

                        //add to formData
                        formData.append(fileId, file);

                        const newDbUploadFile: dbFileUploadType = {
                            src: fileId,
                            createdAt: new Date(),
                            fileName: file.name,
                            status: "to-upload",
                            uploaded: false
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
                    {dbUploadedFiles.map((eachDbUploadedFile, eachDbUploadedFileIndex) => {
                        if (eachDbUploadedFile.status === "to-delete") return null
                        return (
                            <li key={eachDbUploadedFile.src} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--spacingS)" }} className='textResetMargin'>
                                <p>{eachDbUploadedFile.fileName}</p>

                                <button
                                    onClick={() => {
                                        //change status
                                        const updatedDbUploadFile = { ...eachDbUploadedFile }
                                        updatedDbUploadFile.status = "to-delete"

                                        dbUploadedFilesSetter(updatedDbUploadFile, eachDbUploadedFileIndex)
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
