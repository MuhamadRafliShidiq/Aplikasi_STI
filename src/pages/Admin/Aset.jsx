/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from "react";
import { useTable, usePagination } from "react-table";
import { useTheme } from "@mui/material/styles";
import axios from "axios";

const Aset = () => {
	const theme = useTheme(); // Access current theme
	const [data, setData] = useState([]);

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
	const columns = React.useMemo(
		() => [
			{ Header: "Nama Aset", accessor: "nama_aset" },
			{ Header: "Kode Aset", accessor: "kode_aset" },
			{ Header: "Kategori", accessor: "kategori" },
			{ Header: "Kondisi", accessor: "kondisi" },
			{
				Header: "Lokasi",
				accessor: "lokasi_detail",
			},
			{ Header: "Tanggal Pembelian", accessor: "tanggal_pembelian", Cell: ({ value }) => new Date(value).toLocaleDateString() },
			{ Header: "Garansi Akhir", accessor: "garansi", Cell: ({ value }) => new Date(value).toLocaleDateString() },
			{ Header: "Status", accessor: "status" },
			{
				Header: "Aksi",
				accessor: "actions",
				Cell: ({ row }) => (
					<div className="flex justify-center gap-2">
						<button
							className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
							onClick={() => handleEdit(row.original._id)}
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
		console.log("Edit aset:", id);
		window.location.href = `/admin/edit-aset/${id}`;
	};

	const handleDelete = async (id) => {
		if (window.confirm("Apakah Anda yakin ingin menghapus aset ini?")) {
			try {
				// Tambahkan console log untuk memastikan ID yang diteruskan benar
				console.log("Deleting aset with ID:", id);

				// Kirim permintaan DELETE ke API
				const token = localStorage.getItem("token");
				const response = await axios.delete(`http://localhost:9000/asets/${id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				// Periksa apakah API mengembalikan status sukses
				if (response.status === 200) {
					setData((prevData) => prevData.filter((aset) => aset._id !== id));
					alert("Aset berhasil dihapus.");
				} else {
					alert("Gagal menghapus aset.");
				}
			} catch (error) {
				console.error("Error deleting aset:", error);
				alert("Terjadi kesalahan saat menghapus aset.");
			}
		}
	};

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		// eslint-disable-next-line no-unused-vars
		rows,
		prepareRow,
		page,
		nextPage,
		previousPage,
		canNextPage,
		canPreviousPage,
		pageOptions,
		state: { pageIndex },
	} = useTable({ columns, data, initialState: { pageSize: 5 } }, usePagination);

	return (
		<div
			className="p-6"
			style={{
				backgroundColor: theme.palette.background.default, // Set background color from theme
			}}
		>
			<h1 className="text-2xl font-bold mb-4">Data Aset Management</h1>
			<button
				className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
				onClick={() => (window.location.href = "/admin/add-aset")}
			>
				Tambah Aset
			</button>
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

export default Aset;
