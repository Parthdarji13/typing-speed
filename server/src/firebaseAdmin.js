import dotenv from "dotenv";
import admin from "firebase-admin";
import fs from "fs";

dotenv.config();

let appInitialized = false;

export function getFirebaseAdmin() {
	if (!appInitialized) {
		const credsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
		if (!credsPath || !fs.existsSync(credsPath)) {
			throw new Error(
				"Missing GOOGLE_APPLICATION_CREDENTIALS env or file not found. Set it to your Firebase service account JSON path."
			);
		}
		admin.initializeApp({
			credential: admin.credential.applicationDefault(),
		});
		appInitialized = true;
	}
	return admin;
}


