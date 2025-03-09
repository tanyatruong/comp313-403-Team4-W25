// import User from '../models/User.js';
// import bcrypt from 'bcrypt';

// export const createUser = async (req, res) => {
//     try {
//         const { employeeNumber, name, email, phone, password, role, department } = req.body;

//         if (!password) {
//             return res.status(400).json({ message: 'Password is required' });
//         }

//         // Check if user already exists
//         const userExists = await User.findOne({ $or: [{ email }, { employeeNumber }] });

//         if (userExists) {
//             return res.status(400).json({
//                 message: 'User already exists with this email or employee ID'
//             });
//         }

//         // Hash password
//         const salt = await bcrypt.genSalt(10);

//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Create new user
//         const user = await User.create({
//             employeeNumber,
//             name,
//             email,
//             phone,
//             password: hashedPassword,
//             role,
//             department
//         });

//         res.status(201).json({
//             message: 'User created successfully',
//             user
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: 'Error creating user',
//             error: error.message
//         });
//     }
// };
