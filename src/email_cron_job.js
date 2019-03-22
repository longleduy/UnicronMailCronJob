import Agenda from 'agenda'
import './utils/mongoose'
import { emailBufferModel } from './models/email_buffer_model'
import { emailSender } from './utils/email_sender'
try {
    let agenda = new Agenda({ db: { address: process.env.MONGODB_PATH } });
    //Todo: Email sender
    agenda.define('email sender', async (job, done) => {
        const emailBufferList = await emailBufferModel.find({ status: { $ne: 'pending' } }).limit(25);
        if (emailBufferList.length > 0) console.log(emailBufferList.length + " email pending...");
        var arrAsyncFunc = [];
        emailBufferList.forEach((emailBuffer, idx) => {
            arrAsyncFunc.push(emailBufferModel.findByIdAndUpdate({ _id: emailBuffer._id }, { $set: { status: 'pending' } }))
        })
        await Promise.all(arrAsyncFunc);
        if (emailBufferList.length > 0) {
            emailBufferList.forEach(async (emailBuffer, index) => {
                const { content } = emailBuffer;
                const { email } = emailBuffer;
                try {
                    await emailSender(email, content, 'SIGN_UP_VERIFY')
                    await emailBufferModel.findByIdAndDelete({ _id: emailBuffer._id });
                    console.log(`Success: Email sended to - ${email}`);
                } catch (error) {
                    await emailBufferModel.findByIdAndUpdate({ _id: emailBuffer._id }, { $set: { status: 'failed' } })
                    console.log(`Error: Failed to send message to - ${email}`);
                    console.log(error);
                }
            })
        }
        done();
    });
    agenda.on('ready', async function () {
        await agenda.every('5 seconds', 'email sender');
        await agenda.start();
        console.log("Mail cronjob was started!");

    });
    function graceful() {
        console.log('Something is gonna blow up.');
        agenda.stop(() => process.exit(0));
    }
    process.on('SIGTERM', graceful);
    process.on('SIGINT', graceful);
} catch (error) {
    throw error;
}
