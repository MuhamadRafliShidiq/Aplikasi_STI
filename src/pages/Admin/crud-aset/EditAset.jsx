import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const EditAset = () => {
	const { id } = useParams();
	const [formData, setFormData] = useState({
		nama_aset: "",
		kode_aset: "",
		kategori: "",
		kondisi: "",
		lokasi_detail: {
			gedung: "",
			lantai: "",
			ruangan: "",
		},
		tanggal_pembelian: "",
		garansi: "",
		status: "",
	});

	useEffect(() => {
		const fetchAssetDetails = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get(`http://localhost:9000/asets/${id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				const assetData = response.data;

				// Normalize date format
				assetData.tanggal_pembelian = assetData.tanggal_pembelian?.slice(0, 10);
				assetData.garansi = assetData.garansi?.slice(0, 10);

				setFormData(assetData);
			} catch (error) {
				console.error("Error fetching asset details:", error);
			}
		};
		fetchAssetDetails();
	}, [id]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name.includes("lokasi_detail")) {
			const key = name.split(".")[1];
			setFormData((prev) => ({
				...prev,
				lokasi_detail: {
					...prev.lokasi_detail,
					[key]: value,
				},
			}));
		} else if (name.includes("garansi")) {
			const key = name.split(".")[1];
			setFormData((prev) => ({
				...prev,
				garansi: {
					...prev.garansi,
					[key]: value,
				},
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem("token");
			await axios.put(`http://localhost:9000/asets/${id}`, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			alert("Aset berhasil diperbarui!");
			window.location.href = "/admin/aset";
		} catch (error) {
			console.error("Error updating asset:", error);
			alert("Gagal memperbarui aset.");
		}
	};

	return (
		<div className="p-6 min-h-screen flex justify-center items-center">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-4xl p-8 rounded-lg shadow-lg"
				style={{
					backgroundColor: "#fff",
					color: "#333",
				}}
			>
				<h1 className="text-3xl font-bold mb-6 text-center">Edit Aset</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block font-medium">Nama Aset</label>
						<input
							type="text"
							name="nama_aset"
							value={formData.nama_aset}
							onChange={handleChange}
							className="w-full p-2 border rounded"
						/>
					</div>
					<div>
						<label className="block font-medium">Kode Aset</label>
						<input
							type="text"
							name="kode_aset"
							value={formData.kode_aset}
							onChange={handleChange}
							className="w-full p-2 border rounded"
						/>
					</div>
					<div>
						<label className="block font-medium">Kategori</label>
						<input
							type="text"
							name="kategori"
							value={formData.kategori}
							onChange={handleChange}
							className="w-full p-2 border rounded"
						/>
					</div>
					<div>
						<label className="block font-medium">Kondisi</label>
						<select
							name="kondisi"
							value={formData.kondisi}
							onChange={handleChange}
							className="w-full p-2 border rounded"
						>
							<option
								value=""
								disabled
							>
								Pilih Kondisi
							</option>
							<option value="Baik">Baik</option>
							<option value="Rusak">Rusak</option>
							<option value="Perlu Perbaikan">Perlu Perbaikan</option>
						</select>
					</div>

					<div>
						<label className="block font-medium">Lokasi Detail</label>
						<input
							type="text"
							name="lokasi_detail"
							placeholder="Lantai"
							value={formData.lokasi_detail}
							onChange={handleChange}
							className="w-full p-2 border rounded"
						/>
					</div>

					<div>
						<label className="block font-medium">Tanggal Pembelian</label>
						<input
							type="date"
							name="tanggal_pembelian"
							value={formData.tanggal_pembelian?.slice(0, 10) || ""}
							onChange={handleChange}
							className="w-full p-2 border rounded"
						/>
					</div>
					<div>
						<label className="block font-medium">Garansi Akhir</label>
						<input
							type="date"
							name="garansi"
							value={formData.garansi?.slice(0, 10) || ""}
							onChange={handleChange}
							className="w-full p-2 border rounded"
						/>
					</div>
					<div>
						<label className="block font-medium">Status</label>
						<select
							name="status"
							value={formData.status}
							onChange={handleChange}
							className="w-full p-2 border rounded"
						>
							<option
								value=""
								disabled
							>
								Pilih Status
							</option>
							<option value="Aktif">Aktif</option>
							<option value="Nonaktif">Nonaktif</option>
							<option value="Diperbaiki">Diperbaiki</option>
							<option value="Dihapus">Dihapus</option>
						</select>
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
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
					>
						Simpan
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditAset;
