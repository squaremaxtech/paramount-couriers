"use client"
import { userType } from '@/types'
import React from 'react'
import styles from "./styles.module.css"

export default function ShowAccount({ user }: { user: userType }) {
    return (
        <div className={`container ${styles.cont}`}>
            <div className="titleBox">
                <p>{user.name}</p>
                <p>ID: {user.id}</p>

                <ul className="titleBoxMenu">
                    <li>
                        <p>Email</p>

                        <p>{user.email}</p>
                    </li>
                </ul>
            </div>

            <div className="titleBox">
                <p>{user.name}</p>
                <p>ID: {user.id}</p>

                <ul className="titleBoxMenu">
                    <li>
                        <p>Email</p>

                        <p>{user.email}</p>
                    </li>
                </ul>
            </div>

            <div className="titleBox">
                <p>{user.name}</p>
                <p>ID: {user.id}</p>

                <ul className="titleBoxMenu">
                    <li>
                        <p>Email</p>

                        <p>{user.email}</p>
                    </li>
                </ul>
            </div>
        </div>
    )
}
