import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
	.connect(process.env.DB_URI)
	.then(() => console.log("MongoDB connected for seeding"))
	.catch((err) => {
		console.error("MongoDB connection error:", err);
		process.exit(1);
	});

// Function to hash passwords
const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
};

// Function to seed users
const seedUsers = async () => {
	try {
		// Clear existing users
		await User.deleteMany({});
		console.log("Cleared existing users");

		// Create admin user
		const adminPassword = await hashPassword("admin123");
		const admin = new User({
			employeeNumber: "EMP001",
			name: "Admin User",
			email: "admin@example.com",
			phone: "123-456-7890",
			password: adminPassword,
			role: "Admin",
			department: "Management",
		});
		await admin.save();

		// Create HR users
		const hrPassword = await hashPassword("hr123");
		const hr1 = new User({
			employeeNumber: "EMP002",
			name: "Sarah Johnson",
			email: "sarah@example.com",
			phone: "234-567-8901",
			password: hrPassword,
			role: "HR",
			department: "Human Resources",
		});
		await hr1.save();

		const hr2 = new User({
			employeeNumber: "EMP003",
			name: "Michael Chen",
			email: "michael@example.com",
			phone: "345-678-9012",
			password: hrPassword,
			role: "HR",
			department: "Human Resources",
		});
		await hr2.save();

		// Create regular employees
		const employeePassword = await hashPassword("employee123");

		const emp1 = new User({
			employeeNumber: "EMP004",
			name: "John Smith",
			email: "john@example.com",
			phone: "456-789-0123",
			password: employeePassword,
			role: "Employee",
			department: "IT",
		});
		await emp1.save();

		const emp2 = new User({
			employeeNumber: "EMP005",
			name: "Emily Davis",
			email: "emily@example.com",
			phone: "567-890-1234",
			password: employeePassword,
			role: "Employee",
			department: "Marketing",
		});
		await emp2.save();

		const emp3 = new User({
			employeeNumber: "EMP006",
			name: "Robert Wilson",
			email: "robert@example.com",
			phone: "678-901-2345",
			password: employeePassword,
			role: "Employee",
			department: "Finance",
		});
		await emp3.save();

		const emp4 = new User({
			employeeNumber: "EMP007",
			name: "Jessica Brown",
			email: "jessica@example.com",
			phone: "789-012-3456",
			password: employeePassword,
			role: "Employee",
			department: "Operations",
		});
		await emp4.save();

		console.log("Users seeded successfully");
		return [admin, hr1, hr2, emp1, emp2, emp3, emp4];
	} catch (error) {
		console.error("Error seeding users:", error);
		process.exit(1);
	}
};

// Function to seed tickets
const seedTickets = async (users) => {
	try {
		// Clear existing tickets
		await Ticket.deleteMany({});
		console.log("Cleared existing tickets");

		// Extract user IDs by role
		const admins = users.filter((user) => user.role === "Admin");
		const hrUsers = users.filter((user) => user.role === "HR");
		const employees = users.filter((user) => user.role === "Employee");

		// Create tickets
		const tickets = [
			// IT Tickets
			{
				title: "System Login Issue",
				description:
					'Unable to log into the employee portal despite multiple attempts with correct credentials. The system shows an error message: "Authentication failed".',
				employeeNumber: employees[0].employeeNumber,
				assignedTo: hrUsers[0]._id,
				status: "Open",
				priority: "High",
				category: "IT Support",
				sentiment: "negative",
				comments: [
					{
						user: hrUsers[0]._id,
						message:
							"I'll look into this right away. When did this issue start?",
						timestamp: new Date(Date.now() - 86400000), // 1 day ago
					},
					{
						user: employees[0]._id,
						message:
							"It started yesterday afternoon. I've tried clearing cache and cookies.",
						timestamp: new Date(Date.now() - 43200000), // 12 hours ago
					},
				],
			},
			{
				title: "Request for Second Monitor",
				description:
					"I would like to request a second monitor for my workstation to improve productivity when working with multiple applications.",
				employeeNumber: employees[1].employeeNumber,
				assignedTo: hrUsers[1]._id,
				status: "In Progress",
				priority: "Medium",
				category: "Equipment Request",
				sentiment: "neutral",
			},
			{
				title: "Software Installation Request",
				description:
					"Need Adobe Creative Suite installed on my workstation for the upcoming marketing project.",
				employeeNumber: employees[1].employeeNumber,
				assignedTo: null,
				status: "Open",
				priority: "Medium",
				category: "Software",
				sentiment: "neutral",
			},

			// HR Tickets
			{
				title: "Benefits Enrollment Question",
				description:
					"I have questions about the dental coverage in our new benefits package. The documentation is unclear about coverage limits.",
				employeeNumber: employees[2].employeeNumber,
				assignedTo: hrUsers[0]._id,
				status: "In Progress",
				priority: "Medium",
				category: "Benefits",
				sentiment: "neutral",
				comments: [
					{
						user: hrUsers[0]._id,
						message:
							"I'll schedule a meeting to go through the details with you.",
						timestamp: new Date(Date.now() - 172800000), // 2 days ago
					},
				],
			},
			{
				title: "Vacation Request",
				description: "Requesting approval for vacation from July 15-26.",
				employeeNumber: employees[3].employeeNumber,
				assignedTo: hrUsers[1]._id,
				status: "Resolved",
				priority: "Low",
				category: "Time Off",
				sentiment: "positive",
				comments: [
					{
						user: hrUsers[1]._id,
						message: "Your vacation request has been approved.",
						timestamp: new Date(Date.now() - 259200000), // 3 days ago
					},
					{
						user: employees[3]._id,
						message: "Thank you for the quick approval!",
						timestamp: new Date(Date.now() - 172800000), // 2 days ago
					},
				],
			},

			// Facilities Tickets
			{
				title: "Broken Chair",
				description:
					"The chair at my workstation (desk 42B) has a broken wheel and needs to be replaced.",
				employeeNumber: employees[0].employeeNumber,
				assignedTo: hrUsers[0]._id,
				status: "Closed",
				priority: "Low",
				category: "Facilities",
				sentiment: "negative",
				comments: [
					{
						user: hrUsers[0]._id,
						message: "Maintenance will bring you a replacement chair today.",
						timestamp: new Date(Date.now() - 432000000), // 5 days ago
					},
					{
						user: employees[0]._id,
						message: "Received the new chair. Thank you!",
						timestamp: new Date(Date.now() - 345600000), // 4 days ago
					},
				],
			},
			{
				title: "Temperature in Meeting Room C",
				description:
					"Meeting Room C is consistently too cold. Can we adjust the thermostat?",
				employeeNumber: employees[2].employeeNumber,
				assignedTo: null,
				status: "Open",
				priority: "Medium",
				category: "Facilities",
				sentiment: "negative",
			},

			// IT Security Tickets
			{
				title: "Suspicious Email Report",
				description:
					"I received an email asking for my login credentials that appears to be from IT but seems suspicious.",
				employeeNumber: employees[3].employeeNumber,
				assignedTo: admins[0]._id,
				status: "In Progress",
				priority: "High",
				category: "Security",
				sentiment: "negative",
				comments: [
					{
						user: admins[0]._id,
						message:
							"Good catch! This is a phishing attempt. Please forward the email to security@example.com.",
						timestamp: new Date(Date.now() - 43200000), // 12 hours ago
					},
				],
			},

			// Training Tickets
			{
				title: "New Hire Training Schedule",
				description:
					"When will the onboarding training for new team members be scheduled?",
				employeeNumber: employees[1].employeeNumber,
				assignedTo: hrUsers[1]._id,
				status: "Open",
				priority: "Medium",
				category: "Training",
				sentiment: "neutral",
			},
			{
				title: "Request for Project Management Training",
				description:
					"I would like to enroll in the upcoming Project Management certification course offered next month.",
				employeeNumber: employees[2].employeeNumber,
				assignedTo: hrUsers[0]._id,
				status: "Resolved",
				priority: "Low",
				category: "Training",
				sentiment: "positive",
				comments: [
					{
						user: hrUsers[0]._id,
						message:
							"Your request has been approved. I'll send enrollment details shortly.",
						timestamp: new Date(Date.now() - 259200000), // 3 days ago
					},
				],
			},
		];

		// Save tickets to database
		for (const ticketData of tickets) {
			const ticket = new Ticket(ticketData);
			await ticket.save();
		}

		console.log("Tickets seeded successfully");
	} catch (error) {
		console.error("Error seeding tickets:", error);
		process.exit(1);
	}
};

// Main function to run the seeding
const seedDatabase = async () => {
	try {
		const users = await seedUsers();
		await seedTickets(users);

		console.log("Database seeded successfully!");
		process.exit(0);
	} catch (error) {
		console.error("Error seeding database:", error);
		process.exit(1);
	}
};

// Run the seeding process
seedDatabase();
