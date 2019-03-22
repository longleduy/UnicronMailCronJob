import nodemailer from 'nodemailer'
//Todo: Utils
import * as EmailHTML from './email_content'
import {convertBufferToString} from './common'

export const emailSender = async (to, data, fn) => {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.USER_NAME,
            pass: process.env.PASS_WORD
        }
    });
    let html;
    let subject;
    if (fn == 'SIGN_UP_VERIFY') {
        subject = 'Verify email address'
        html = convertBufferToString(data);
    }
    else if (fn == 'CHANGE_PASSWORD_CONFIRM') {
        html = htmlChangePasswordConfirm(data)
        subject = 'Reset password confirm'
    }
    else if (fn = 'RESET_PASSWORD_CONFIRM') {
        html = htmlResetPasswordKey(data)
        subject = 'Reset password key'
    }
    let mailOptions = {
        from: process.env.EMAIL_FROM,
        to: to,
        subject,
        html
    };

   await transporter.sendMail(mailOptions);
}
const htmlSignUpVerify = (to,data) => {
    return EmailHTML.htmlSignUpVerify(to,data)
}
const htmlChangePasswordConfirm = (data) => {
    return EmailHTML.htmlChangePassWordConfirm(data)
}
const htmlResetPasswordKey = (data) => {
    return EmailHTML.htmlResetPasswordKey(data)
}