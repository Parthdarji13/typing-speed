const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// AUTH
export async function registerUser(data) {
	const res = await fetch(`${API_BASE_URL}/auth/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	return res.json();
}

export async function loginUser(data) {
	const res = await fetch(`${API_BASE_URL}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	return res.json();
}

// TYPING TEST
export async function saveTestResult(data) {
	const token = localStorage.getItem("token");

	const res = await fetch(`${API_BASE_URL}/test/save`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	});
	return res.json();
}

export async function getTestHistory() {
	const token = localStorage.getItem("token");

	const res = await fetch(`${API_BASE_URL}/test/history`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return res.json();
}
