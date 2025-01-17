/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { useTable, usePagination } from "react-table";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import { exportToPDF } from "../../utils/exportPDF"; // Import fungsi exportToPDF
import axios from "axios";
import { format } from "date-fns";

const RiwayatPersediaan = () => {
	const dropdownRef = useRef(null);
	const theme = useTheme();
	const [isDropdownOpen, setDropdownOpen] = useState(false);
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchRiwayats = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get("http://localhost:9000/riwayat", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				// Cek data yang diterima dari backend
				console.log("Data Riwayat:", response.data);

				setData(response.data);
			} catch (error) {
				console.error("Error fetching riwayat:", error);
			}
		};

		fetchRiwayats();
	}, []);

	const columns = React.useMemo(
		() => [
			{ Header: "Nama Aset", accessor: "nama_aset.nama_aset" },
			{ Header: "Jenis Transaksi", accessor: "jenis_transaksi" },
			{ Header: "Jumlah", accessor: "jumlah" },
			{
				Header: "Tanggal",
				accessor: "tanggal",
				Cell: ({ value }) => {
					// Format the date using date-fns (or JavaScript's Date object)
					const formattedDate = value ? format(new Date(value), "dd/MM/yyyy") : "N/A";
					return <span>{formattedDate}</span>;
				},
			},
			{ Header: "Pemasok", accessor: "pemasok" },
			{ Header: "Diberikan Kepada", accessor: "username.username" },
			{ Header: "Lokasi Asal", accessor: "lokasi_asal" },
			{ Header: "Lokasi Tujuan", accessor: "lokasi_tujuan" },
			{ Header: "Catatan", accessor: "catatan" },
			{ Header: "Status", accessor: "status" },
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

	const handleEdit = (id) => {
		console.log("Edit riwayat:", id);
		window.location.href = `/admin/edit-riwayat/${id}`; // Adjust the URL for the edit page
	};

	const handleDelete = async (id) => {
		if (window.confirm("Apakah Anda yakin ingin menghapus riwayat ini?")) {
			try {
				console.log("Deleting riwayat with ID:", id);
				const token = localStorage.getItem("token");
				const response = await axios.delete(`http://localhost:9000/riwayat/${id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				if (response.status === 200) {
					setData((prevData) => prevData.filter((riwayat) => riwayat._id !== id));
					alert("Riwayat berhasil dihapus.");
				} else {
					alert("Gagal menghapus Riwayat.");
				}
			} catch (error) {
				console.error("Error deleting riwayat:", error);
				alert("Terjadi kesalahan saat menghapus Riwayat.");
			}
		}
	};

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

	const exportToExcel = () => {
		const formattedData = data.map((item) => ({
			...item,
			nama_aset: item.nama_aset.nama_aset,
			username: item.username.username,
		}));

		const ws = XLSX.utils.json_to_sheet(formattedData); // Menggunakan data yang sudah diformat
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Riwayat Persediaan");
		XLSX.writeFile(wb, "riwayat_persediaan.xlsx");
	};

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

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Riwayat Persediaan</h1>
			<div className="mb-4 flex justify-between">
				<button
					className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
					onClick={() => (window.location.href = "/admin/add-riwayat")}
				>
					Tambah Riwayat
				</button>
				<div
					className="relative inline-block text-left"
					ref={dropdownRef}
				>
					<button
						className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-blue-500 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none"
						onClick={() => setDropdownOpen(!isDropdownOpen)}
					>
						Export
						<svg
							className="ml-2 -mr-1 h-5 w-5"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fillRule="evenodd"
								d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</button>

					{isDropdownOpen && (
						<div
							className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
							role="menu"
							aria-orientation="vertical"
							aria-labelledby="menu-button"
						>
							<div
								className="py-1"
								role="none"
							>
								<CSVLink
									data={data.map((item) => ({
										...item, // Salin semua properti dari item
										nama_aset: item.nama_aset.nama_aset, // Pastikan nama_aset digabung dengan nilai yang sesuai
										username: item.username.username, // Sama halnya dengan username
									}))}
									filename={"riwayat_persediaan_aset.csv"}
									className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									role="menuitem"
								>
									Export ke CSV
								</CSVLink>

								<button
									onClick={exportToExcel}
									className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									role="menuitem"
								>
									Export ke Excel
								</button>
								<button
									onClick={() => exportToPDF(data, "riwayat_persediaan_aset")}
									className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									role="menuitem"
								>
									Export ke PDF
								</button>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Tabel tetap sama */}
			<div className="overflow-x-auto">
				<table
					{...getTableProps()}
					className="table-auto w-full border-collapse border border-gray-200"
					style={{
						backgroundColor: theme.palette.background.paper, // Set table background color from theme
					}}
				>
					<thead className={`bg-${theme.palette.mode === "dark" ? "blue-500" : "blue-700"} text-white`}>
						{headerGroups.map((headerGroup) => (
							<tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map((column) => (
									<th
										{...column.getHeaderProps()}
										className="px-4 py-2 border border-gray-300"
										style={{
											color: theme.palette.text.primary, // Adjust text color based on theme
										}}
									>
										{column.render("Header")}
									</th>
								))}
							</tr>
						))}
					</thead>

					<tbody
						{...getTableBodyProps()}
						style={{
							color: theme.palette.text.primary, // Adjust text color based on theme
						}}
					>
						{page.map((row) => {
							prepareRow(row);
							return (
								<tr
									{...row.getRowProps()}
									className="text-center hover:bg-gray-100"
									style={{
										backgroundColor: theme.palette.background.default, // Adjust row background color
									}}
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

			{/* Pagination */}
			<div className="flex justify-between items-center mt-4">
				<button
					className={`px-4 py-2 bg-gray-500 text-white rounded ${!canPreviousPage && "opacity-50 cursor-not-allowed"}`}
					onClick={previousPage}
					disabled={!canPreviousPage}
				>
					Previous
				</button>
				<div>
					Page{" "}
					<strong>
						{pageIndex + 1} of {pageOptions.length}
					</strong>{" "}
				</div>
				<button
					className={`px-4 py-2 bg-gray-500 text-white rounded ${!canNextPage && "opacity-50 cursor-not-allowed"}`}
					onClick={nextPage}
					disabled={!canNextPage}
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default RiwayatPersediaan;
