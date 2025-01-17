import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // import useNavigate
// import { isValidObjectId } from "mongoose";

const EditUser = () => {
	const { id } = useParams(); // Get userId from URL params
	const navigate = useNavigate(); // useNavigate for redirecting after submission

	const [formData, setFormData] = useState({
		username: "",
		phone: "",
		jabatan: "",
		role: "",
		password: "",
	});
	const [errors, setErrors] = useState({});

	// Fetch user data when the component mounts
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const token = localStorage.getItem("token", "username");
				const response = await axios.get(`http://localhost:9000/users/${id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setFormData({
					username: response.data.username || "", // fallback to empty string if undefined
					phone: response.data.phone || "", // fallback to empty string if undefined
					jabatan: response.data.jabatan || "", // fallback to empty string if undefined
					role: response.data.role || "", // fallback to empty string if undefined
					password: "", // password should remain empty unless the user chooses to change it
				});
			} catch (error) {
				console.error("Error fetching user data:", error.response?.data || error.message);
				alert("Terjadi kesalahan saat mengambil data pengguna.");
			}
		};

		fetchUserData();
	}, [id]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({ ...prevState, [name]: value }));
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.username) newErrors.username = "Nama pengguna wajib diisi.";
		if (!formData.phone) newErrors.phone = "Nomor telepon wajib diisi.";
		if (!formData.jabatan) newErrors.jabatan = "Jabatan wajib diisi.";
		if (!formData.role) newErrors.role = "Level akses wajib diisi.";
		if (formData.password && formData.password.length < 6) {
			newErrors.password = "Password harus lebih dari 6 karakter.";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		try {
			const token = localStorage.getItem("token");
			console.log("Token being sent:", token);

			const response = await axios.put(`http://localhost:9000/users/${id}`, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			console.log("Server response:", response.data);
			alert("Pengguna berhasil diperbarui.");
			navigate("/admin/user"); // Redirect to user list after success
		} catch (error) {
			console.error("Error updating user:", error.response || error.message);
			alert(error.response?.data?.message || "Terjadi kesalahan saat memperbarui pengguna.");
		}
	};

	return (
		<div className="p-6 min-h-screen flex justify-center items-center">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-2xl p-8 rounded-lg shadow-lg"
				style={{
					backgroundColor: "#fff",
					color: "#333",
				}}
			>
				<h1 className="text-3xl font-bold mb-6 text-center">Edit Pengguna</h1>
				{/* Similar form fields as AddUser */}
				<div className="mb-4">
					<label className="block font-medium mb-2">Nama Pengguna</label>
					<input
						type="text"
						name="username"
						value={formData.username || ""} // Ensure it's not undefined
						onChange={handleChange}
						className={`w-full p-3 border rounded ${errors.username ? "border-red-500" : "border-gray-300"}`}
					/>
					{errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
				</div>
				<div className="mb-4">
					<label className="block font-medium mb-2">Nomor Telepon</label>
					<input
						type="text"
						name="phone"
						value={formData.phone || ""} // Ensure it's not undefined
						onChange={handleChange}
						className={`w-full p-3 border rounded ${errors.phone ? "border-red-500" : "border-gray-300"}`}
					/>
					{errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
				</div>
				<div className="mb-4">
					<label className="block font-medium mb-2">Jabatan</label>
					<input
						type="text"
						name="jabatan"
						value={formData.jabatan || ""} // Ensure it's not undefined
						onChange={handleChange}
						className={`w-full p-3 border rounded ${errors.jabatan ? "border-red-500" : "border-gray-300"}`}
					/>
					{errors.jabatan && <p className="text-red-500 text-sm">{errors.jabatan}</p>}
				</div>
				<div className="mb-4">
					<label className="block font-medium mb-2">Level Akses</label>
					<select
						name="role"
						value={formData.role || ""} // Ensure it's not undefined
						onChange={handleChange}
						className={`w-full p-3 border rounded ${errors.role ? "border-red-500" : "border-gray-300"}`}
					>
						<option value="">Pilih Level Akses</option>
						<option value="admin">Admin</option>
						<option value="teknisi">Teknisi</option>
						<option value="manajemen">Manajemen</option>
					</select>
					{errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
				</div>
				<div className="mb-4">
					<label className="block font-medium mb-2">Password</label>
					<input
						type="password"
						name="password"
						placeholder="Biarkan Jika tidak ingin diubah"
						value={formData.password || ""} // Ensure it's not undefined
						onChange={handleChange}
						className={`w-full p-3 border rounded ${errors.password ? "border-red-500" : "border-gray-300"}`}
					/>
					{errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
				</div>
				<div className="flex justify-end gap-4">
					<button
						type="button"
						className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
						onClick={() => navigate("/admin/user")}
					>
						Kembali
					</button>
					<button
						type="submit"
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						Update
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditUser;
