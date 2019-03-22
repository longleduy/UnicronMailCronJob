import mongoose from 'mongoose'
require('dotenv').config();
const connectMongDB = async () => {
    try {
        mongoose.set('useCreateIndex', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useNewUrlParser', true);
        await mongoose.connect(process.env.MONGODB_PATH, { useNewUrlParser: true });
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
    }
};
connectMongDB();



