import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EditStok = () => {
	const { id } = useParams();
	const [namaAsetOptions, setNamaAsetOptions] = useState([]);
	const [userOptions, setUserOptions] = useState([]);
	const [formData, setFormData] = useState({
		username: "",
		nama_aset: "",
		jumlah: "",
		lokasi: "",
		status: "",
		tanggal_pembaruan: "",
		catatan: "",
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

				// Fetch the existing riwayat data to populate the form
				const riwayatResponse = await axios.get(`http://localhost:9000/stok/${id}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setFormData(riwayatResponse.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [id]);

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
			const response = await axios.put(`http://localhost:9000/stok/${id}`, formData, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (response.status === 200) {
				alert("Stok berhasil diperbarui");
				window.location.href = "/admin/stok";
			}
		} catch (error) {
			console.error("Error updating stok:", error);
			alert("Gagal memperbarui Stok.");
		}
	};

	return (
		<div className="p-6 min-h-screen flex justify-center items-center">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-2xl p-8 rounded-lg shadow-lg bg-white text-gray-800"
			>
				<h1 className="text-3xl font-bold mb-6 text-center">Edit Stok Aset</h1>
				<div className="grid grid-cols-2 gap-6">
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
									key={user.id}
									value={user.id}
								>
									{user.username}
								</option>
							))}
						</select>
					</div>

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
									key={aset.id}
									value={aset.id}
								>
									{aset.nama_aset}
								</option>
							))}
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

					{/* Lokasi */}
					<div>
						<label
							htmlFor="lokasi"
							className="block font-medium mb-2"
						>
							Lokasi
						</label>
						<input
							id="lokasi"
							name="lokasi"
							type="text"
							value={formData.lokasi}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black"
						/>
					</div>

					{/* Status */}
					<div>
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
							<option value="">Pilih Jenis Transaksi</option>
							<option value="Tersedia">Tersedia</option>
							<option value="Tidak Tersedia">Tidak Tersedia</option>
							<option value="Habis">Habis</option>
							<option value="Dalam Pemesanan">Dalam Pemesanan</option>
						</select>
					</div>

					{/* Tanggal Pembaruan */}
					<div>
						<label
							htmlFor="tanggal_pembaruan"
							className="block font-medium mb-2"
						>
							Tanggal Pembaruan
						</label>
						<input
							id="tanggal_pembaruan"
							name="tanggal_pembaruan"
							type="date"
							placeholder="Masukkan Tanggal Pembaruan"
							value={formData.tanggal_pembaruan}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black"
						/>
					</div>

					{/* Catatan */}
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

					{/* Submit Button */}
					<div className="flex justify-end gap-4 mt-6 col-span-2">
						<button
							type="button"
							className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
							onClick={() => (window.location.href = "/admin/stok")}
						>
							Kembali
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
						>
							Perbarui
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default EditStok;
