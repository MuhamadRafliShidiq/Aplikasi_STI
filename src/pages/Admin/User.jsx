/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import { useTable, usePagination } from "react-table";

const UserManagement = () => {
	const theme = useTheme();
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get("http://localhost:9000/users", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setData(response.data);
			} catch (error) {
				console.error("Error fetching users:", error);
				if (error.response?.status === 401) {
					alert("Sesi telah berakhir. Silakan login kembali.");
					localStorage.removeItem("token");
					window.location.href = "/login";
				}
			}
		};
		fetchUsers();
	}, []);

	const columns = React.useMemo(
		() => [
			{ Header: "Nama", accessor: "username" },
			{ Header: "Telepon", accessor: "phone" },
			{ Header: "Jabatan", accessor: "jabatan" },
			{ Header: "Level Akses", accessor: "role" },
			{ Header: "Aktivitas Terakhir", accessor: "lastActivity" },
			{
				Header: "Aksi",
				accessor: "actions",
				Cell: ({ row }) => (
					<div className="flex justify-center gap-2">
						<button
							onClick={() => handleEdit(row.original._id)}
							className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
						>
							Edit
						</button>

						<button
							onClick={() => handleDelete(row.original._id)}
							className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
						>
							Delete
						</button>
					</div>
				),
			},
		],
		[],
	);

	const handleEdit = (id) => {
		console.log("Edit user:", id);
		window.location.href = `/admin/edit-user/${id}`;
	};

	const handleDelete = async (id) => {
		if (window.confirm("Apakah Anda yakin ingin menghapus user ini?")) {
			try {
				// Tambahkan console log untuk memastikan ID yang diteruskan benar
				console.log("Deleting user with ID:", id);

				// Kirim permintaan DELETE ke API
				const token = localStorage.getItem("token");
				const response = await axios.delete(`http://localhost:9000/users/${id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				// Periksa apakah API mengembalikan status sukses
				if (response.status === 200) {
					setData((prevData) => prevData.filter((user) => user._id !== id));
					alert("User berhasil dihapus.");
				} else {
					alert("Gagal menghapus user.");
				}
			} catch (error) {
				console.error("Error deleting user:", error);
				alert("Terjadi kesalahan saat menghapus user.");
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

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Manajemen Pengguna</h1>
			<div className="mb-4 flex justify-between">
				<button
					className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
					onClick={() => (window.location.href = "/admin/add-user")}
				>
					Tambah Pengguna
				</button>
			</div>
			<div className="overflow-x-auto">
				<table
					{...getTableProps()}
					className="table-auto w-full border-collapse border border-gray-200"
					style={{
						backgroundColor: theme.palette.background.paper,
					}}
				>
					<thead className={`bg-${theme.palette.mode === "dark" ? "blue-500" : "blue-700"} text-white`}>
						{headerGroups.map((headerGroup) => (
							<tr
								key={headerGroup.id}
								{...headerGroup.getHeaderGroupProps()}
							>
								{headerGroup.headers.map((column) => (
									<th
										key={column.id}
										{...column.getHeaderProps()}
										className="px-4 py-2 border border-gray-300"
										style={{ color: theme.palette.text.primary }}
									>
										{column.render("Header")}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody
						{...getTableBodyProps()}
						style={{ color: theme.palette.text.primary }}
					>
						{page.map((row) => {
							prepareRow(row);
							return (
								<tr
									key={row.id}
									{...row.getRowProps()}
									className="text-center hover:bg-gray-100"
									style={{ backgroundColor: theme.palette.background.default }}
								>
									{row.cells.map((cell) => (
										<td
											key={cell.column.id}
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

export default UserManagement;
