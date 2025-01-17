/* eslint-disable no-unused-vars */
import { useState } from "react";
import axios from "axios";

const AddAset = () => {
	const [formData, setFormData] = useState({
		nama_aset: "",
		kode_aset: "",
		kategori: "",
		kondisi: "",
		lokasi_detail: "",
		tanggal_pembelian: "",
		garansi: "",
		status: "",
	});
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		// Memeriksa jika name mengandung titik
		if (name.includes(".")) {
			const [parentKey, childKey] = name.split(".");
			setFormData((prevState) => ({
				...prevState,
				[parentKey]: {
					...prevState[parentKey],
					[childKey]: value, // Mengupdate nilai field yang sesuai
				},
			}));
		} else {
			setFormData((prevState) => ({
				...prevState,
				[name]: value,
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.nama_aset) newErrors.nama_aset = "Nama aset wajib diisi.";
		if (!formData.kode_aset) newErrors.kode_aset = "Kode aset wajib diisi.";
		if (!formData.kategori) newErrors.kategori = "Kategori wajib diisi.";
		if (!formData.kondisi) newErrors.kondisi = "Kondisi wajib diisi.";
		if (!formData.lokasi_detail) newErrors.lokasi_detail = "Lokasi detail wajib diisi.";
		if (!formData.tanggal_pembelian) newErrors.tanggal_pembelian = "Tanggal pembelian wajib diisi.";
		if (!formData.garansi) newErrors["garansi"] = "Tanggal akhir garansi wajib diisi.";
		if (!formData.status) newErrors.status = "Status wajib diisi.";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		try {
			const token = localStorage.getItem("token");

			// Kirim data aset ke backend
			const response = await axios.post("http://localhost:9000/asets", formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			alert("Aset berhasil ditambahkan.");
			window.location.href = "/admin/aset";
		} catch (error) {
			alert(error.response?.data?.message || "Terjadi kesalahan saat menambahkan aset.");
		}
	};

	return (
		<div className="p-6 min-h-screen flex justify-center items-center">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-2xl p-8 rounded-lg shadow-lg bg-white text-gray-800"
			>
				<h1 className="text-3xl font-bold mb-6 text-center">Tambah Aset</h1>
				<div className="grid grid-cols-2 gap-6">
					{/* Kolom 1 */}
					<div>
						<label className="block font-medium mb-2">Nama Aset</label>
						<input
							type="text"
							name="nama_aset"
							value={formData.nama_aset}
							onChange={handleChange}
							className={`w-full p-3 border rounded ${errors.nama_aset ? "border-red-500" : "border-gray-300"}`}
						/>
						{errors.nama_aset && <p className="text-red-500 text-sm">{errors.nama_aset}</p>}
					</div>
					<div>
						<label className="block font-medium mb-2">Kode Aset</label>
						<input
							type="text"
							name="kode_aset"
							value={formData.kode_aset}
							onChange={handleChange}
							className={`w-full p-3 border rounded ${errors.kode_aset ? "border-red-500" : "border-gray-300"}`}
						/>
						{errors.kode_aset && <p className="text-red-500 text-sm">{errors.kode_aset}</p>}
					</div>
					<div>
						<label className="block font-medium mb-2">Kategori</label>
						<input
							type="text"
							name="kategori"
							value={formData.kategori}
							onChange={handleChange}
							className={`w-full p-3 border rounded ${errors.kategori ? "border-red-500" : "border-gray-300"}`}
						/>
						{errors.kategori && <p className="text-red-500 text-sm">{errors.kategori}</p>}
					</div>
					<div>
						<label className="block font-medium mb-2">Kondisi</label>
						<select
							name="kondisi"
							value={formData.kondisi}
							onChange={handleChange}
							className={`w-full p-3 border rounded ${errors.kondisi ? "border-red-500" : "border-gray-300"}`}
						>
							<option value="">Pilih Kondisi</option>
							<option value="Baik">Baik</option>
							<option value="Rusak">Rusak</option>
							<option value="Perlu Perbaikan">Perlu Perbaikan</option>
						</select>
						{errors.kondisi && <p className="text-red-500 text-sm">{errors.kondisi}</p>}
					</div>
					<div>
						<label className="block font-medium mb-2">Lokasi</label>
						<input
							type="text"
							name="lokasi_detail"
							value={formData.lokasi_detail}
							onChange={handleChange}
							className={`w-full p-3 border rounded ${errors.lokasi_detail ? "border-red-500" : "border-gray-300"}`}
						/>
						{errors.lokasi_detail && <p className="text-red-500 text-sm">{errors.lokasi_detail}</p>}
					</div>
					<div>
						<label className="block font-medium mb-2">Tanggal Pembelian</label>
						<input
							type="date"
							name="tanggal_pembelian"
							value={formData.tanggal_pembelian}
							onChange={handleChange}
							className={`w-full p-3 border rounded ${errors.tanggal_pembelian ? "border-red-500" : "border-gray-300"}`}
						/>
						{errors.tanggal_pembelian && <p className="text-red-500 text-sm">{errors.tanggal_pembelian}</p>}
					</div>
					<div>
						<label className="block font-medium mb-2">Garansi Akhir</label>
						<input
							type="date"
							name="garansi"
							value={formData.garansi}
							onChange={handleChange}
							className={`w-full p-3 border rounded ${errors["garansi"] ? "border-red-500" : "border-gray-300"}`}
						/>
						{errors["garansi"] && <p className="text-red-500 text-sm">{errors["garansi"]}</p>}
					</div>
					<div>
						<label className="block font-medium mb-2">Status</label>
						<select
							name="status"
							value={formData.status}
							onChange={handleChange}
							className={`w-full p-3 border rounded ${errors.status ? "border-red-500" : "border-gray-300"}`}
						>
							<option value="">Pilih Status</option>
							<option value="Aktif">Baik</option>
							<option value="Nonaktif">Nonaktif</option>
							<option value="Diperbaiki">Diperbaiki</option>
							<option value="Dihapus">Dihapus</option>
						</select>
						{errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
					</div>
				</div>
				{/* Tombol Aksi */}
				<div className="flex justify-end gap-4 mt-6">
					<button
						type="button"
						className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
						onClick={() => (window.location.href = "/admin/aset")}
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
			</form>
		</div>
	);
};

export default AddAset;
