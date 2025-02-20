import app from './express.js';
import connectDB from './database/mongoose.js';


// Connect to MongoDB
connectDB();



const PORT = 3000;
app.listen(PORT, () => {
    console.log('Server is running on port 3000');
});