/* eslint-disable no-unused-vars */
import axios from "axios";
import jwt_decode from "jwt-decode";
const API_URL = "http://localhost:8000/"; // Ganti dengan URL backend kamu

// Fungsi untuk login dan menyimpan token di localStorage
const login = async (username, password) => {
	const response = await axios.post(`${API_URL}/login`, { username, password });
	if (response.data.token) {
		// Simpan token di localStorage
		localStorage.setItem("token", response.data.token);
	}
	return response.data;
};

// Fungsi untuk logout dan menghapus token dari localStorage
const logout = () => {
	localStorage.removeItem("token");
};

// Fungsi untuk mendapatkan token dari localStorage
const getToken = () => {
	return localStorage.getItem("token");
};

// Fungsi untuk memeriksa apakah token ada dan masih valid
const isAuthenticated = () => {
	const token = getToken();
	if (!token) return false;
	try {
		// Verifikasi jika token valid dengan mendekode (optional)
		const decoded = jwt_decode(token); // Jika menggunakan jwt-decode library
		return decoded.exp > Date.now() / 1000;
	} catch (error) {
		return false;
	}
};

// Fungsi untuk mendapatkan data pengguna berdasarkan token
const getUser = async () => {
	const token = getToken();
	if (!token) return null;

	const response = await axios.get(`${API_URL}/users`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	return response.data;
};

export default {
	login,
	logout,
	getToken,
	isAuthenticated,
	getUser,
};
