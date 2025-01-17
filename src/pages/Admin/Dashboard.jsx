/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { FaBoxes, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// Komponen untuk Card Statistik
const StatisticCard = ({ title, value, description, icon: Icon, bgColor }) => {
	return (
		<div
			className={`p-6 rounded-lg shadow-md relative overflow-hidden transform transition-all hover:scale-105 hover:shadow-lg`}
			style={{ backgroundColor: bgColor }}
		>
			<div className="absolute top-4 right-4 text-4xl opacity-10">
				<Icon />
			</div>
			<h2 className="text-lg font-semibold text-white">{title}</h2>
			<p className="text-4xl font-bold my-2 text-white">{value}</p>
			<span className="text-white">{description}</span>
		</div>
	);
};
const Dashboard = () => {
	const theme = useTheme();
	const [data, setData] = useState([]);
	const [totalAset, setTotalAset] = useState(0);
	const [totalAsetAktif, setTotalAsetAktif] = useState(0);
	const [totalAsetRusak, setTotalAsetRusak] = useState(0);
	useEffect(() => {
		const fetchAsets = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get("http://localhost:9000/asets", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				setData(response.data);

				// Hitung total aset, aset aktif, dan aset rusak
				const total = response.data.length;
				const aktif = response.data.filter((aset) => aset.status === "Aktif").length;
				const rusak = response.data.filter((aset) => aset.status === "Rusak").length;

				setTotalAset(total);
				setTotalAsetAktif(aktif);
				setTotalAsetRusak(rusak);
			} catch (error) {
				console.error("Error fetching asets:", error);
				if (error.response?.status === 401) {
					alert("Sesi telah berakhir. Silakan login kembali.");
					localStorage.removeItem("token");
					window.location.href = "/login";
				}
			}
		};
		fetchAsets();
	}, []);

	return (
		<div
			className="p-6"
			style={{
				backgroundColor: theme.palette.background.default, // Set background color from theme
			}}
		>
			<h1 className="text-2xl font-bold mb-4">Dashboard Aset TI</h1>

			{/* Statistik Card */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<StatisticCard
					title="Total Aset"
					value={totalAset}
					description="Jumlah total aset"
					icon={FaBoxes}
					bgColor="#1E3A8A" // Warna biru
				/>
				<StatisticCard
					title="Total Aset Aktif"
					value={totalAsetAktif}
					description="Aset dalam status aktif"
					icon={FaCheckCircle}
					bgColor="#16A34A" // Warna hijau
				/>
				<StatisticCard
					title="Aset Rusak"
					value={totalAsetRusak}
					description="Jumlah aset rusak"
					icon={FaTimesCircle}
					bgColor="#DC2626" // Warna merah
				/>
			</div>

			{/* Konten lainnya */}
			<div>{/* Tabel atau konten lain di sini */}</div>
		</div>
	);
};

export default Dashboard;
