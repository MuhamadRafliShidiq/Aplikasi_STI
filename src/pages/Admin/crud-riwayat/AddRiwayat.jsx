import { useState, useEffect } from "react";
import axios from "axios";

const AddRiwayat = () => {
	const [namaAsetOptions, setNamaAsetOptions] = useState([]);
	const [userOptions, setUserOptions] = useState([]);
	const [formData, setFormData] = useState({
		nama_aset: "",
		jenis_transaksi: "",
		jumlah: "",
		tanggal: "",
		pemasok: "",
		username: "",
		lokasi_asal: "",
		lokasi_tujuan: "",
		catatan: "",
		status: "",
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = localStorage.getItem("token");

				// Fetch data for asset names
				const asetResponse = await axios.get("http://localhost:9000/asets", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setNamaAsetOptions(asetResponse.data);

				// Fetch data for users
				const userResponse = await axios.get("http://localhost:9000/users", {
					headers: { Authorization: `Bearer ${token}` },
				});
				setUserOptions(userResponse.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem("token");
			const response = await axios.post("http://localhost:9000/riwayat", formData, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (response.status === 200) {
				alert("Riwayat berhasil ditambahkan");
				// Reset form after submit
				setFormData({
					nama_aset: "",
					jenis_transaksi: "",
					jumlah: "",
					tanggal: "",
					pemasok: "",
					username: "",
					lokasi_asal: "",
					lokasi_tujuan: "",
					catatan: "",
					status: "",
				});
			}
		} catch (error) {
			console.error("Error submitting form:", error);
			alert("Gagal menambahkan riwayat.");
		} finally {
			window.location.href = "/admin/riwayat";
		}
	};

	return (
		<div className="p-6 min-h-screen flex justify-center items-center">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-2xl p-8 rounded-lg shadow-lg bg-white text-gray-800"
			>
				<h1 className="text-3xl font-bold mb-6 text-center">Tambah Riwayat Aset</h1>
				<div className="grid grid-cols-2 gap-6">
					{/* Asset Name */}
					<div>
						<label
							htmlFor="nama_aset"
							className="block font-medium mb-2"
						>
							Nama Aset
						</label>
						<select
							id="nama_aset"
							name="nama_aset"
							value={formData.nama_aset}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black"
						>
							<option value="">Pilih Nama Aset</option>
							{namaAsetOptions.map((aset) => (
								<option
									key={aset._id}
									value={aset._id}
								>
									{aset.nama_aset}
								</option>
							))}
						</select>
					</div>

					{/* Username */}
					<div>
						<label
							htmlFor="username"
							className="block font-medium mb-2"
						>
							Username
						</label>
						<select
							id="username"
							name="username"
							value={formData.username}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black"
						>
							<option value="">Pilih Username</option>
							{userOptions.map((user) => (
								<option
									key={user._id}
									value={user._id}
								>
									{user.username}
								</option>
							))}
						</select>
					</div>

					{/* Transaction Type */}
					<div>
						<label
							htmlFor="jenis_transaksi"
							className="block font-medium mb-2"
						>
							Jenis Transaksi
						</label>
						<select
							id="jenis_transaksi"
							name="jenis_transaksi"
							value={formData.jenis_transaksi}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black"
						>
							<option value="">Pilih Jenis Transaksi</option>
							<option value="Masuk">Masuk</option>
							<option value="Keluar">Keluar</option>
							<option value="Pindah">Pindah</option>
							<option value="Perbaikan">Perbaikan</option>
							<option value="Penyewaan">Penyewaan</option>
						</select>
					</div>

					{/* Quantity */}
					<div>
						<label
							htmlFor="jumlah"
							className="block font-medium mb-2"
						>
							Jumlah
						</label>
						<input
							id="jumlah"
							name="jumlah"
							type="number"
							placeholder="Masukkan Jumlah"
							value={formData.jumlah}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black"
						/>
					</div>

					{/* Date */}
					<div>
						<label
							htmlFor="tanggal"
							className="block font-medium mb-2"
						>
							Tanggal
						</label>
						<input
							id="tanggal"
							name="tanggal"
							type="date"
							value={formData.tanggal}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black"
						/>
					</div>

					{/* Supplier */}
					<div>
						<label
							htmlFor="pemasok"
							className="block font-medium mb-2"
						>
							Pemasok
						</label>
						<input
							id="pemasok"
							name="pemasok"
							type="text"
							placeholder="Masukkan Pemasok"
							value={formData.pemasok}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black"
						/>
					</div>

					{/* Origin Location */}
					<div>
						<label
							htmlFor="lokasi_asal"
							className="block font-medium mb-2"
						>
							Lokasi Asal
						</label>
						<input
							id="lokasi_asal"
							name="lokasi_asal"
							type="text"
							placeholder="Masukkan Lokasi Asal"
							value={formData.lokasi_asal}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black"
						/>
					</div>

					{/* Destination Location */}
					<div>
						<label
							htmlFor="lokasi_tujuan"
							className="block font-medium mb-2"
						>
							Lokasi Tujuan
						</label>
						<input
							id="lokasi_tujuan"
							name="lokasi_tujuan"
							type="text"
							placeholder="Masukkan Lokasi Tujuan"
							value={formData.lokasi_tujuan}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black"
						/>
					</div>

					{/* Notes */}
					<div className="col-span-2">
						<label
							htmlFor="catatan"
							className="block font-medium mb-2"
						>
							Catatan
						</label>
						<textarea
							id="catatan"
							name="catatan"
							placeholder="Masukkan Catatan"
							value={formData.catatan}
							onChange={handleChange}
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black"
							rows="4"
						/>
					</div>

					{/* Status */}
					<div className="col-span-2">
						<label
							htmlFor="status"
							className="block font-medium mb-2"
						>
							Status
						</label>
						<select
							id="status"
							name="status"
							value={formData.status}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black"
						>
							<option value="">Pilih Status</option>
							<option value="Diproses">Diproses</option>
							<option value="Selesai">Selesai</option>
							<option value="Dibatalkan">Dibatalkan</option>
						</select>
					</div>

					{/* Submit Button */}
					<div className="flex justify-end gap-4 mt-6 col-span-2">
						<button
							type="button"
							className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
							onClick={() => (window.location.href = "/admin/riwayat")}
						>
							Kembali
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
						>
							Simpan
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default AddRiwayat;
