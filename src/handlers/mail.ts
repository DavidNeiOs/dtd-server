import nodemailer from 'nodemailer'
import pug from 'pug'
import juice from 'juice'
import htmlToText from 'html-to-text'
import { UserDoc } from '../models/User';


const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});


const generateHTML = (filename: string, options = {}) => {
  const html = pug.renderFile(`${__dirname}/../emails/${filename}.pug`, options);
  const inlined = juice(html);
  return inlined;
}

export interface EmailOptions {
  subject: string;
  user: UserDoc;
  resetUrl: string;
  filename: string;
}

export const send = async (options: EmailOptions) => {
  const html = generateHTML(options.filename, options)
  const text = htmlToText.fromString(html)
  
  const mailOptions = {
    from: `David Neira <hello@davidneios.dev>`,
    to: options.user.email,
    subject: options.subject,
    html,
    text
  }

  return transport.sendMail(mailOptions);
}