import * as nodemailer from 'nodemailer';
import templateHTML from "./template-html.helper";
import { HeaderData } from './email-verif.dto';
require('dotenv').config();

class EmailVerification {
    private transporter: any;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_KEY_PASSWORD
            }
        });
    }

    public sendEmailVerification = async (headerData: HeaderData, template: string): Promise<{ message: string}> => {
        const mailOptions = {
            from: headerData.from_email,
            to: headerData.to_email,
            subject: headerData.subject,
            html: template
        };

        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, (err: any, info: any) => {
                if (err) reject({ message: "Kesalahan saat mengirimkan email: " + err.message });
                if (!info || !info.accepted || info.accepted.length === 0) reject({ message: "Email tidak terkirim ke " + headerData.to_email });
                resolve({ message: `Email terkirim ke ${headerData.to_email}` });
            });
        });
    }
}

export default new EmailVerification();