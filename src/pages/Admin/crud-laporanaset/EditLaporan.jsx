import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const EditLaporan = () => {
	const { id } = useParams();

	const [namaAsetOptions, setNamaAsetOptions] = useState([]);
	const [formData, setFormData] = useState({
		nama_aset: "",
		kondisi: "",
		tanggal_perawatan: "",
		nilai_depresiasi: "",
		analisis_penggunaan: "",
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

				// Fetch the existing Laporan data to populate the form
				const LaporanResponse = await axios.get(`http://localhost:9000/laporan/${id}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setFormData(LaporanResponse.data);
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
			const response = await axios.put(`http://localhost:9000/laporan/${id}`, formData, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (response.status === 200) {
				alert("Laporan berhasil diperbarui");
				// Redirect to the Laporan list page after submitting
				window.location.href = "/admin/laporan";
			}
		} catch (error) {
			console.error("Error submitting form:", error);
			alert("Gagal memperbarui Laporan.");
		}
	};

	return (
		<div className="p-6 min-h-screen flex justify-center items-center">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-2xl p-8 rounded-lg shadow-lg bg-white text-gray-800"
			>
				<h1 className="text-3xl font-bold mb-6 text-center">Edit Laporan Aset</h1>
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

					{/* Transaction Type */}
					<div>
						<label
							htmlFor="kondisi"
							className="block font-medium mb-2"
						>
							Kondisi
						</label>
						<select
							id="kondisi"
							name="kondisi"
							value={formData.kondisi}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black"
						>
							<option value="">Pilih Kondisi</option>
							<option value="Baik">Baik</option>
							<option value="Rusak">Rusak</option>
							<option value="Perlu Perbaikan">Perlu Perbaikan</option>
						</select>
					</div>

					{/* Date */}
					<div>
						<label
							htmlFor="tanggal"
							className="block font-medium mb-2"
						>
							Histori Perawatan
						</label>
						<input
							id="tanggal_perawatan"
							name="tanggal_perawatan"
							type="date"
							value={formData.tanggal_perawatan}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black"
						/>
					</div>

					{/* Nilai Depresiasi */}
					<div>
						<label
							htmlFor="lokasi_tujuan"
							className="block font-medium mb-2"
						>
							Nilai Depresiasi
						</label>
						<input
							id="nilai_depresiasi"
							name="nilai_depresiasi"
							type="text"
							placeholder="Masukkan Nilai Depresiasi"
							value={formData.nilai_depresiasi}
							onChange={handleChange}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-black"
						/>
					</div>

					{/* Analisis Penggunaan */}
					<div className="col-span-2">
						<label
							htmlFor="analisis_penggunaan"
							className="block font-medium mb-2"
						>
							Analisis Penggunaan
						</label>
						<textarea
							id="analisis_penggunaan"
							name="analisis_penggunaan"
							placeholder="Masukkan Analisis Penggunaan"
							value={formData.analisis_penggunaan}
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
							onClick={() => (window.location.href = "/admin/laporan")}
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

export default EditLaporan;
