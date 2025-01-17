/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { useTable, usePagination } from "react-table";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import { exportToPDF } from "../../utils/exportPDF";
import axios from "axios";
import { format } from "date-fns";

const LaporanAset = () => {
	const [isDropdownOpen, setDropdownOpen] = useState(false);
	const [data, setData] = useState([]);
	const dropdownRef = useRef(null);
	const theme = useTheme();

	// Fetch data from the backend
	useEffect(() => {
		const fetchLaporans = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get("http://localhost:9000/laporan", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setData(response.data);
			} catch (error) {
				console.error("Error fetching Laporan Aset:", error);
			}
		};

		fetchLaporans();
	}, []);

	// Handle dropdown outside click
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleEdit = (id) => {
		console.log("Edit laporan:", id);
		window.location.href = `/admin/edit-laporan/${id}`;
	};

	const handleDelete = async (id) => {
		if (window.confirm("Apakah Anda yakin ingin menghapus laporan ini?")) {
			try {
				// Tambahkan console log untuk memastikan ID yang diteruskan benar
				console.log("Deleting laporan with ID:", id);

				// Kirim permintaan DELETE ke API
				const token = localStorage.getItem("token");
				const response = await axios.delete(`http://localhost:9000/laporan/${id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				// Periksa apakah API mengembalikan status sukses
				if (response.status === 200) {
					setData((prevData) => prevData.filter((laporan) => laporan._id !== id));
					alert("Laporan berhasil dihapus.");
				} else {
					alert("Gagal menghapus laporan.");
				}
			} catch (error) {
				console.error("Error deleting laporan:", error);
				alert("Terjadi kesalahan saat menghapus laporan.");
			}
		}
	};

	// Define table columns
	const columns = React.useMemo(
		() => [
			{ Header: "Nama Aset", accessor: "nama_aset.nama_aset" },
			{ Header: "Kondisi", accessor: "kondisi" },
			{
				Header: "Histori Perawatan",
				accessor: "tanggal_perawatan.tanggal_perawatan",
				Cell: ({ value }) => (value ? format(new Date(value), "dd/MM/yyyy") : "-"),
			},
			{ Header: "Nilai Depresiasi", accessor: "nilai_depresiasi" },
			{ Header: "Analisis Penggunaan", accessor: "analisis_penggunaan" },
			{
				Header: "Aksi",
				accessor: "actions",
				Cell: ({ row }) => (
					<div className="flex justify-center gap-2">
						<button
							onClick={() => handleEdit(row.original._id)} // Pass the correct ID
							className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
						>
							Edit
						</button>
						<button
							className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
							onClick={() => handleDelete(row.original._id)}
						>
							Hapus
						</button>
					</div>
				),
			},
		],
		[],
	);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		page,
		prepareRow,
		nextPage,
		previousPage,
		canNextPage,
		canPreviousPage,
		pageOptions,
		state: { pageIndex },
	} = useTable({ columns, data, initialState: { pageSize: 5 } }, usePagination);

	// Export data to Excel
	const exportToExcel = () => {
		const formattedData = data.map((item) => ({
			NamaAset: item.nama_aset?.nama_aset || "-",
			Kondisi: item.kondisi || "-",
			HistoriPerawatan: item.tanggal_perawatan?.tanggal_perawatan ? format(new Date(item.tanggal_perawatan.tanggal_perawatan), "dd/MM/yyyy") : "-",
			NilaiDepresiasi: item.nilai_depresiasi || "-",
			AnalisisPenggunaan: item.analisis_penggunaan || "-",
		}));

		const ws = XLSX.utils.json_to_sheet(formattedData);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Laporan Aset");
		XLSX.writeFile(wb, "laporan_aset.xlsx");
	};

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Laporan Aset</h1>
			<div className="mb-4 flex justify-between">
				<button
					className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
					onClick={() => (window.location.href = "/admin/add-laporan")}
				>
					Tambah Laporan Baru
				</button>
				<div
					ref={dropdownRef}
					className="relative inline-block text-left"
				>
					<button
						className="inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
						onClick={() => setDropdownOpen(!isDropdownOpen)}
					>
						Export
						<svg
							className="ml-2 h-5 w-5"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
					{isDropdownOpen && (
						<div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white">
							<div className="py-1">
								<CSVLink
									data={data.map((item) => ({
										NamaAset: item.nama_aset?.nama_aset || "-",
										Kondisi: item.kondisi || "-",
										HistoriPerawatan: item.tanggal_perawatan?.tanggal_perawatan ? format(new Date(item.tanggal_perawatan.tanggal_perawatan), "dd/MM/yyyy") : "-",
										NilaiDepresiasi: item.nilai_depresiasi || "-",
										AnalisisPenggunaan: item.analisis_penggunaan || "-",
									}))}
									filename="laporan_aset.csv"
									className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								>
									Export ke CSV
								</CSVLink>
								<button
									onClick={exportToExcel}
									className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								>
									Export ke Excel
								</button>
								<button
									onClick={() => exportToPDF(data, "laporan_aset")}
									className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								>
									Export ke PDF
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="overflow-x-auto">
				<table
					{...getTableProps()}
					className="table-auto w-full border-collapse border border-gray-200"
				>
					<thead className={`bg-${theme.palette.mode === "dark" ? "blue-500" : "blue-700"} text-white`}>
						{headerGroups.map((headerGroup) => (
							<tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map((column) => (
									<th
										{...column.getHeaderProps()}
										className="px-4 py-2 border border-gray-300"
									>
										{column.render("Header")}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody {...getTableBodyProps()}>
						{page.map((row) => {
							prepareRow(row);
							return (
								<tr
									{...row.getRowProps()}
									className="text-center"
								>
									{row.cells.map((cell) => (
										<td
											{...cell.getCellProps()}
											className="px-4 py-2 border border-gray-300"
										>
											{cell.render("Cell")}
										</td>
									))}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<div className="flex justify-between items-center mt-4">
				<button
					className={`px-4 py-2 bg-gray-300 rounded ${canPreviousPage ? "hover:bg-gray-400" : "opacity-50 cursor-not-allowed"}`}
					onClick={previousPage}
					disabled={!canPreviousPage}
				>
					Previous
				</button>
				<span>
					Page{" "}
					<strong>
						{pageIndex + 1} of {pageOptions.length}
					</strong>
				</span>
				<button
					className={`px-4 py-2 bg-gray-300 rounded ${canNextPage ? "hover:bg-gray-400" : "opacity-50 cursor-not-allowed"}`}
					onClick={nextPage}
					disabled={!canNextPage}
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default LaporanAset;
