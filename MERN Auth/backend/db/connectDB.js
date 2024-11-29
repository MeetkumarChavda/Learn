import mongoose from 'mongoose';

export const connection = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDb Connected ${conn.connection.host}`)
        
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1); //  1 is failure , o starus code is success
    }
};