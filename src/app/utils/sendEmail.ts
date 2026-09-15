/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import { envConfig } from "../config/env";
import path from "path";
import ejs from "ejs"
import AppError from "../errorHelpers/appError";

const transporter = nodemailer.createTransport({
    secure: true,
    auth: {
        user: envConfig.EMAIL_SENDER_SMTP_USER,
        pass: envConfig.EMAIL_SENDER_SMTP_PASS
    },
    port: Number(envConfig.EMAIL_SENDER_SMTP_PORT),
    host: envConfig.EMAIL_SENDER_SMTP_HOST
})

interface SendEmailOptions {
    to: string;
    subject: string;
    templateName: string;
    templateData: Record<string, string>,
    attachments?: {
        filename: string,
        content: Buffer | string,
        contentType: string
    }[] 
}

export const sendEmail = async({
    to,
    subject,
    templateName,
    templateData,
    attachments
}: SendEmailOptions) => {
    try {
        const templatePath = path.join(__dirname, `templates/${templateName}.ejs`)
        const html = await ejs.renderFile(templatePath, templateData)
        const info = await transporter.sendMail({
            from: envConfig.EMAIL_SENDER_SMTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map(attachment => ({
            filename: attachment.filename,
            content: attachment.content,
            contentType: attachment.contentType
        }))
        })
        console.log(`✉️ Email sent to ${to}: ${info.messageId}`);
    } catch (error:any) {
        console.log(error)
        throw new AppError(401, "Email error")
    }
}