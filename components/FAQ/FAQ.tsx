"use client"
import React, { useState } from 'react'
import styles from "./styles.module.css"
import { faqData } from '@/lib/data'


export default function Faq({ question, answer }: { question: string, answer: string }) {
    const [showing, showingSet] = useState(false)

    return (
        <div style={{ color: "#000" }}>
            <div style={{ display: "flex", gap: "var(--spacingS)", alignItems: "center", cursor: "pointer", padding: "var(--spacingR)", borderBottom: '1px solid var(--lightFadedColor)' }} onClick={() => showingSet(prev => !prev)}>
                <div style={{ rotate: showing ? "90deg" : "", transition: "rotate 400ms" }}>
                    <svg style={{ fill: "var(--textC4)" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" /></svg>
                </div>

                <p>{question}</p>
            </div>

            <div style={{ padding: 'var(--spacingR)', display: !showing ? "none" : "", overflow: "hidden" }}>
                <p className={`${showing ? styles.animateIn : ""}`}>{answer}</p>
            </div>
        </div>
    )
}

export function ShowFAQ() {
    return (
        <div className="container" style={{ maxWidth: "75ch", margin: "var(--spacingR) auto", boxShadow: "0px 0px 40px 20px var(--shade2)" }}>
            {faqData.map((eachFaq, eachFaqIndex) => {
                return (
                    <Faq key={eachFaqIndex}
                        question={eachFaq.question}
                        answer={eachFaq.answer}
                    />
                )
            })}
        </div>
    )
}