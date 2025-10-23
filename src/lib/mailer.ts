import nodemailer from 'nodemailer';

export const mailer = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASSWORD!,
    },
});

export async function sendOtpEmail(to: string, subject: string, html: string) {
    await mailer.sendMail({
        from: process.env.SMTP_FROM!,
        to,
        subject,
        html,
    });
}
