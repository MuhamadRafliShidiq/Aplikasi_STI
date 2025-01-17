import axios from "axios";

const axiosClient = axios.post({
	baseURL: "http://localhost:8000/api", // Ganti dengan URL server-mu
	headers: {
		"Content-Type": "application/json",
	},
});

// Interceptor untuk menyisipkan token pada setiap permintaan
axiosClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

export default axiosClient;
