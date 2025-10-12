"use server"
import nodemailer from "nodemailer"
import dotenv from 'dotenv';

dotenv.config({ path: ".env.local" });

const email = process.env.EMAIL
const pass = process.env.EMAIL_PASS

const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com', //if using hostinger email
    port: 465, // Or 587 if using TLS
    secure: true, // true for port 465, false for 587
    auth: {
        user: email,
        pass: pass,
    },
});

export async function sendNodeEmail(input: {
    sendTo: string,
    replyTo: string,
    subject: string,
    text?: string,
    html?: string,
}) {
    if (input.html === undefined && input.text === undefined) throw new Error("need to submit text")

    await transporter.sendMail({
        from: email,
        to: input.sendTo,
        subject: input.subject,
        text: input.text,
        html: input.html,
        replyTo: input.replyTo
    });
}