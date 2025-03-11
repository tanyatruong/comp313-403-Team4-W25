export const logger = {
	info: (message) => {
		const timestamp = new Date().toISOString();
		const logMessage = `[INFO] ${timestamp}: ${message}\n`;
		console.log(logMessage);
	},

	error: (message, error) => {
		const timestamp = new Date().toISOString();
		const errorStack = error?.stack ? `\n${error.stack}` : "";
		const logMessage = `[ERROR] ${timestamp}: ${message}${errorStack}\n`;
		console.error(logMessage);
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

		if (reqInfo.body.password) {
			reqInfo.body.password = "[REDACTED]";
		}

		const logMessage = `[REQUEST] ${timestamp}: ${JSON.stringify(reqInfo)}\n`;
		console.log(logMessage);
	},

	response: (statusCode, data, duration) => {
		const timestamp = new Date().toISOString();
		let responseData = { ...data };

		if (responseData.token) {
			responseData.token = "[REDACTED]";
		}

		const logMessage = `[RESPONSE] ${timestamp}: Status ${statusCode}, Duration: ${duration}ms, Data: ${JSON.stringify(
			responseData
		)}\n`;
		console.log(logMessage);
	},
};
