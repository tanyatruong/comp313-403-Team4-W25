import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDir = path.join(__dirname, "../logs");

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir, { recursive: true });
}

const logFilePath = path.join(
	logDir,
	`app-${new Date().toISOString().split("T")[0]}.log`
);

export const logger = {
	info: (message) => {
		const timestamp = new Date().toISOString();
		const logMessage = `[INFO] ${timestamp}: ${message}\n`;
		console.log(logMessage);
		fs.appendFileSync(logFilePath, logMessage);
	},

	error: (message, error) => {
		const timestamp = new Date().toISOString();
		const errorStack = error?.stack ? `\n${error.stack}` : "";
		const logMessage = `[ERROR] ${timestamp}: ${message}${errorStack}\n`;
		console.error(logMessage);
		fs.appendFileSync(logFilePath, logMessage);
	},

	request: (req) => {
		const timestamp = new Date().toISOString();
		const { method, originalUrl, params, query, body } = req;
		const reqInfo = {
			method,
			path: originalUrl,
			params,
			query,
			body: { ...body },
		};

		// Don't log sensitive info
		if (reqInfo.body.password) {
			reqInfo.body.password = "[REDACTED]";
		}

		const logMessage = `[REQUEST] ${timestamp}: ${JSON.stringify(reqInfo)}\n`;
		console.log(logMessage);
		fs.appendFileSync(logFilePath, logMessage);
	},

	response: (statusCode, data, duration) => {
		const timestamp = new Date().toISOString();
		let responseData = { ...data };

		// Don't log sensitive info in responses
		if (responseData.token) {
			responseData.token = "[REDACTED]";
		}

		const logMessage = `[RESPONSE] ${timestamp}: Status ${statusCode}, Duration: ${duration}ms, Data: ${JSON.stringify(
			responseData
		)}\n`;
		console.log(logMessage);
		fs.appendFileSync(logFilePath, logMessage);
	},
};
