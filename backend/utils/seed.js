import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";
import { logger } from "./logger.js";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DB_URI);
		logger.info("MongoDB connected for seeding");
	} catch (error) {
		logger.error("Database connection error:", error);
		process.exit(1);
	}
};

// Clear existing data
const clearDatabase = async () => {
	try {
		await User.deleteMany({});
		await Ticket.deleteMany({});
		logger.info("Database cleared successfully");
	} catch (error) {
		logger.error("Error clearing database:", error);
		process.exit(1);
	}
};

// Create sample users
const seedUsers = async () => {
	try {
		// Generate password hash - same for all users
		const password = "1234";
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Sample admin user
		const adminUser = new User({
			employeeNumber: "EMP001",
			name: "Admin User",
			email: "admin@example.com",
			phone: "123-456-7890",
			password: hashedPassword,
			role: "Admin",
			department: "Management",
		});

		// Sample HR users with specialized departments
		const hrUsers = [
			{
				employeeNumber: "EMP002",
				name: "Sarah Johnson",
				email: "sarah@example.com",
				phone: "234-567-8901",
				password: hashedPassword,
				role: "HR",
				department: "Benefits & Compensation",
			},
			{
				employeeNumber: "EMP003",
				name: "Michael Brown",
				email: "michael@example.com",
				phone: "345-678-9012",
				password: hashedPassword,
				role: "HR",
				department: "Recruitment",
			},
			{
				employeeNumber: "EMP007",
				name: "Jessica Lee",
				email: "jessica@example.com",
				phone: "789-012-3456",
				password: hashedPassword,
				role: "HR",
				department: "Employee Relations",
			},
			{
				employeeNumber: "EMP008",
				name: "Daniel Harris",
				email: "daniel@example.com",
				phone: "890-123-4567",
				password: hashedPassword,
				role: "HR",
				department: "Payroll",
			},
			{
				employeeNumber: "EMP009",
				name: "Emily Clark",
				email: "emily@example.com",
				phone: "901-234-5678",
				password: hashedPassword,
				role: "HR",
				department: "Training & Development",
			},
		];

		// Sample regular employees
		const employees = [
			{
				employeeNumber: "EMP004",
				name: "John Smith",
				email: "john@example.com",
				phone: "456-789-0123",
				password: hashedPassword,
				role: "Employee",
				department: "IT",
			},
			{
				employeeNumber: "EMP005",
				name: "Lisa Garcia",
				email: "lisa@example.com",
				phone: "567-890-1234",
				password: hashedPassword,
				role: "Employee",
				department: "Marketing",
			},
			{
				employeeNumber: "EMP006",
				name: "Robert Wilson",
				email: "robert@example.com",
				phone: "678-901-2345",
				password: hashedPassword,
				role: "Employee",
				department: "Finance",
			},
			{
				employeeNumber: "EMP010",
				name: "Olivia Martin",
				email: "olivia@example.com",
				phone: "012-345-6789",
				password: hashedPassword,
				role: "Employee",
				department: "Sales",
			},
			{
				employeeNumber: "EMP011",
				name: "William Taylor",
				email: "william@example.com",
				phone: "123-456-7890",
				password: hashedPassword,
				role: "Employee",
				department: "Research",
			},
			{
				employeeNumber: "EMP012",
				name: "Sophia Anderson",
				email: "sophia@example.com",
				phone: "234-567-8901",
				password: hashedPassword,
				role: "Employee",
				department: "Operations",
			},
		];

		// Save all users
		const savedAdmin = await adminUser.save();

		// Save HR users and keep references
		const savedHrUsers = [];
		for (const hrUser of hrUsers) {
			const saved = await new User(hrUser).save();
			savedHrUsers.push(saved);
		}

		// Save regular employees and keep references
		const savedEmployees = [];
		for (const employee of employees) {
			const saved = await new User(employee).save();
			savedEmployees.push(saved);
		}

		logger.info(
			`Database seeded with 1 admin, ${hrUsers.length} HR users, and ${employees.length} employees`
		);

		return {
			admin: savedAdmin,
			hrUsers: savedHrUsers,
			employees: savedEmployees,
		};
	} catch (error) {
		logger.error("Error seeding users:", error);
		process.exit(1);
	}
};

// Create sample tickets with different statuses, priorities, and categories
const seedTickets = async (users) => {
	try {
		const { admin, hrUsers, employees } = users;

		// Find HR users by department for easier assignment
		const benefitsHR = hrUsers.find(
			(user) => user.department === "Benefits & Compensation"
		);
		const payrollHR = hrUsers.find((user) => user.department === "Payroll");
		const trainingHR = hrUsers.find(
			(user) => user.department === "Training & Development"
		);
		const relationsHR = hrUsers.find(
			(user) => user.department === "Employee Relations"
		);
		const recruitmentHR = hrUsers.find(
			(user) => user.department === "Recruitment"
		);

		// Sample tickets
		const tickets = [
			// Open tickets
			{
				title: "Benefit Plan Enrollment Issue",
				description:
					"I'm unable to enroll in the dental plan through the benefits portal. The system shows an error when I try to submit my selection.",
				employeeNumber: employees[0].employeeNumber,
				status: "Open",
				priority: "Medium",
				category: "Benefits",
				sentiment: "neutral",
				assignedTo: benefitsHR._id, // Assigned to Benefits HR
				createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
			},
			{
				title: "Missing Tax Document",
				description:
					"I haven't received my W-2 form for the last fiscal year. I need it urgently for tax filing.",
				employeeNumber: employees[1].employeeNumber,
				status: "Open",
				priority: "High",
				category: "Payroll",
				sentiment: "negative",
				assignedTo: payrollHR._id, // Assigned to Payroll HR
				createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
			},
			{
				title: "Office Equipment Request",
				description:
					"I need a second monitor for my workstation to improve productivity.",
				employeeNumber: employees[2].employeeNumber,
				status: "Open",
				priority: "Low",
				category: "Facilities",
				sentiment: "neutral",
				createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
			},

			// In Progress tickets
			{
				title: "Training Module Access",
				description:
					"I cannot access the required compliance training modules. The system says I don't have permission.",
				employeeNumber: employees[3].employeeNumber,
				status: "In Progress",
				priority: "Medium",
				category: "Technical",
				sentiment: "neutral",
				assignedTo: trainingHR._id, // Assigned to Training HR
				createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
				comments: [
					{
						user: trainingHR._id,
						message: "I'm looking into this issue. Will update you shortly.",
						timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
					},
				],
			},
			{
				title: "Salary Discrepancy",
				description:
					"There seems to be an error in my last paycheck. The amount is less than expected.",
				employeeNumber: employees[4].employeeNumber,
				status: "In Progress",
				priority: "High",
				category: "Payroll",
				sentiment: "negative",
				assignedTo: payrollHR._id, // Assigned to Payroll HR
				createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
				comments: [
					{
						user: payrollHR._id,
						message:
							"I've identified the issue and am working on correcting it.",
						timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
					},
				],
			},

			// Resolved tickets
			{
				title: "Vacation Request Issue",
				description:
					"The system rejected my vacation request without giving a reason.",
				employeeNumber: employees[5].employeeNumber,
				status: "Resolved",
				priority: "Medium",
				category: "General",
				sentiment: "positive",
				assignedTo: relationsHR._id, // Assigned to Employee Relations HR
				createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
				comments: [
					{
						user: relationsHR._id,
						message:
							"The issue was due to a system glitch. I've approved your request manually.",
						timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
					},
					{
						user: employees[5]._id,
						message: "Thank you for resolving this so quickly!",
						timestamp: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
					},
				],
			},

			// Closed tickets
			{
				title: "Health Insurance Card",
				description:
					"I need a replacement health insurance card as mine is damaged.",
				employeeNumber: employees[0].employeeNumber,
				status: "Closed",
				priority: "Low",
				category: "Benefits",
				sentiment: "positive",
				assignedTo: benefitsHR._id, // Assigned to Benefits HR
				createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
				comments: [
					{
						user: benefitsHR._id,
						message:
							"I've ordered a replacement card. It should arrive within 5-7 business days.",
						timestamp: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
					},
					{
						user: employees[0]._id,
						message: "I received the card today. Thank you!",
						timestamp: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000),
					},
				],
			},
			{
				title: "Onboarding Documentation",
				description:
					"I'm missing some of the onboarding documents for my new team member.",
				employeeNumber: employees[1].employeeNumber,
				status: "Closed",
				priority: "Medium",
				category: "General",
				sentiment: "neutral",
				assignedTo: recruitmentHR._id, // Assigned to Recruitment HR
				createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
				comments: [
					{
						user: recruitmentHR._id,
						message: "I've sent the missing documents to your email.",
						timestamp: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000),
					},
				],
			},

			// Unassigned tickets
			{
				title: "Parking Pass Request",
				description: "I need a parking pass for the company lot.",
				employeeNumber: employees[2].employeeNumber,
				status: "Open",
				priority: "Low",
				category: "Facilities",
				sentiment: "neutral",
				createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
			},
			{
				title: "401k Contribution Change",
				description:
					"I would like to increase my 401k contribution percentage.",
				employeeNumber: employees[3].employeeNumber,
				status: "Open",
				priority: "Medium",
				category: "Benefits",
				sentiment: "positive",
				createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
			},
		];

		// Save all tickets
		for (const ticket of tickets) {
			await new Ticket(ticket).save();
		}

		logger.info(`Database seeded with ${tickets.length} sample tickets`);
	} catch (error) {
		logger.error("Error seeding tickets:", error);
		process.exit(1);
	}
};

// Main function to run the seed process
const seedDatabase = async () => {
	await connectDB();
	await clearDatabase();
	const users = await seedUsers();
	await seedTickets(users);

	// Print login credentials for testing
	logger.info("All users created with password: 1234");
	logger.info("Sample logins:");
	logger.info("Admin: admin@example.com / 1234");
	logger.info("HR: sarah@example.com / 1234");
	logger.info("Employee: john@example.com / 1234");

	logger.info("Seeding completed successfully!");
	process.exit(0);
};

// Run the seed process
seedDatabase();
