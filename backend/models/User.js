import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    employeeNumber: { type: String, required: true, unique: true }, // Example: "EMP001"
    employeeId: { type: mongoose.Schema.Types.ObjectId }, // Holds MongoDB _id reference
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['Employee', 'HR', 'Admin'],
        required: true
    },
    department: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
