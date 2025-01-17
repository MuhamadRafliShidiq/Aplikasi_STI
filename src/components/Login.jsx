import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bg.jpg";
import axios from "axios";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		// Efek fade-in untuk tampilan login card
		const timer = setTimeout(() => {
			document.getElementById("login-card").classList.add("opacity-100");
		}, 300);
		return () => clearTimeout(timer);
	}, []);

	const handleLogin = async (e) => {
		e.preventDefault();
		setError(""); // Reset error
		setLoading(true); // Tampilkan indikator loading

		try {
			// Kirim data login ke backend
			const response = await axios.post("http://localhost:9000/login", {
				username,
				password,
			});

			// Simpan data pengguna dan token ke localStorage
			const user = response.data;
			localStorage.setItem("token", user.token);
			localStorage.setItem("username", JSON.stringify(user));

			// Navigasi ke dashboard
			navigate("/admin/dashboard");

			// Tampilkan hasil penyimpanan di console
			console.log("Token:", localStorage.getItem("token"));
			console.log("User Data:", JSON.parse(localStorage.getItem("username")));

			// Redirect sesuai role (jika diperlukan)
			// if (user.role === "admin") {
			//     navigate("/admin/dashboard");
			// } else if (user.role === "manager") {
			//     navigate("/management/dashboard");
			// } else if (user.role === "teknisi") {
			//     navigate("/technician/dashboard");
			// }
		} catch (error) {
			// Tampilkan pesan error dari backend
			setError(error.response?.data?.message || "Login gagal. Silakan coba lagi.");
		} finally {
			setLoading(false); // Sembunyikan indikator loading
		}
	};

	return (
		<div className="flex min-h-screen">
			{/* Left Section (Background Illustration) */}
			<div
				className="flex-1 bg-cover bg-center"
				style={{ backgroundImage: `url(${bg})` }}
			>
				{/* Optional additional content if needed */}
			</div>

			{/* Right Section (Login Form) */}
			<div className="flex flex-col justify-center items-center w-full max-w-md p-8 bg-gray-50">
				<div
					id="login-card"
					className="w-full bg-white p-8 rounded-lg shadow-xl border border-gray-200 opacity-0 transition-opacity duration-500 ease-in-out"
				>
					<h1 className="text-gray-800 text-3xl font-bold mb-2 text-center">Welcome to STITrack</h1>
					<p className="text-gray-500 mb-8 text-center">Sign into your account</p>

					{error && <p className="text-red-500 mb-4 text-center">{error}</p>}

					<form
						onSubmit={handleLogin}
						className="w-full"
					>
						<input
							type="text"
							placeholder="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							className="border p-3 w-full mb-4 rounded-lg focus:outline-none focus:border-blue-500 cursor-text text-black"
						/>
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="border p-3 w-full mb-6 rounded-lg focus:outline-none focus:border-blue-500 cursor-text text-black"
						/>
						<button
							type="submit"
							className={`w-full bg-blue-500 text-white p-3 rounded-lg font-semibold transform transition-all duration-300 ease-in-out ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600 hover:scale-105 active:scale-95"}`}
							disabled={loading} // Disable tombol saat loading
						>
							{loading ? "Logging in..." : "Log In"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};
export default Login;
