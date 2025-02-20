import { config } from 'dotenv';
import mongoose from 'mongoose';
config(); // Load environment variables 


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URI);
        console.log("Connected to MongoDB!🚀");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process on failure
    }
};

export default connectDB;
