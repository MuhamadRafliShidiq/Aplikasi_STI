/* eslint-disable react/prop-types */
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
// import { useState } from "react";

// Komponen
import Login from "./components/Login";
import Topbar from "./components/Topbar";

// Sidebar berdasarkan Role
import SidebarAdmin from "./components/SidebarAdmin";
import SidebarManager from "./components/SidebarManager";
import SidebarTeknisi from "./components/SidebarTeknisi";

// Halaman
import Dashboard from "./pages/Admin/Dashboard";
import Aset from "./pages/Admin/Aset";
import AddAset from "./pages/Admin/crud-aset/AddAset";
import LaporanAset from "./pages/Admin/LaporanAset";
import Addlaporan from "./pages/Admin/crud-laporanaset/AddLaporan";
import EditLaporan from "./pages/Admin/crud-laporanaset/EditLaporan";
import RiwayatPersediaan from "./pages/Admin/Riwayat";
import StokAset from "./pages/Admin/Stok";
import AddStok from "./pages/Admin/crud-stok/AddStok";
import EditStok from "./pages/Admin/crud-stok/EditStok";

import Calendar from "./pages/Admin/Calendar";
import UserManagement from "./pages/Admin/User";
import AddUser from "./pages/Admin/crud-user/AddUser";
import EditUser from "./pages/Admin/crud-user/EditUser";
import EditAset from "./pages/Admin/crud-aset/EditAset";
import AddRiwayat from "./pages/Admin/crud-riwayat/AddRiwayat";
import EditRiwayat from "./pages/Admin/crud-riwayat/EditRiwayat";

function ProtectedLayout({ children }) {
	const userRole = localStorage.getItem("userRole");
	// Tentukan sidebar berdasarkan role pengguna
	let Sidebar;
	switch (userRole) {
		case "admin":
			Sidebar = SidebarAdmin;
			break;
		case "manajemen":
			Sidebar = SidebarManager;
			break;
		case "teknisi":
			Sidebar = SidebarTeknisi;
			break;
		default:
			Sidebar = SidebarTeknisi; // Default jika role tidak ditemukan
	}

	return (
		<div className="app">
			<Sidebar />
			<main className="content">
				<Topbar />
				{children}
			</main>
		</div>
	);
}

export default function App() {
	const [theme, colorMode] = useMode();
	// const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Router>
					<Routes>
						{/* Rute Login */}
						<Route
							path="/"
							element={<Login />}
						/>

						{/* Rute Dashboard Admin */}
						<Route
							path="/admin/*"
							element={
								<ProtectedLayout>
									<Routes>
										<Route
											path="dashboard"
											element={<Dashboard />}
										/>
										{/* Rute Aset Management */}
										<Route
											path="aset"
											element={<Aset />}
										/>
										<Route
											path="add-aset"
											element={<AddAset />}
										/>
										<Route
											path="edit-aset/:id"
											element={<EditAset />}
										/>
										{/* Rute Laporan Aset */}
										<Route
											path="laporan"
											element={<LaporanAset />}
										/>
										<Route
											path="add-laporan"
											element={<Addlaporan />}
										/>
										<Route
											path="edit-laporan/:id"
											element={<EditLaporan />}
										/>

										{/* Rute Riwayat Persediaan Aset */}
										<Route
											path="riwayat"
											element={<RiwayatPersediaan />}
										/>
										<Route
											path="add-riwayat"
											element={<AddRiwayat />}
										/>
										<Route
											path="edit-riwayat/:id"
											element={<EditRiwayat />}
										/>

										{/* STOK Persediaan Aset */}
										<Route
											path="stok"
											element={<StokAset />}
										/>
										<Route
											path="add-stok"
											element={<AddStok />}
										/>
										<Route
											path="edit-stok/:id"
											element={<EditStok />}
										/>
										<Route
											path="calendar"
											element={<Calendar />}
										/>

										{/* Rute User Management */}
										<Route
											path="user"
											element={<UserManagement />}
										/>
										<Route
											path="/add-user"
											element={<AddUser />}
										/>
										<Route
											path="/edit-user/:id"
											element={<EditUser />}
										/>
									</Routes>
								</ProtectedLayout>
							}
						/>

						{/* Rute Dashboard Manager */}
						{/* {isLoggedIn && (
							<Route
								path="/manager/*"
								element={
									<ProtectedLayout>
										<Routes>
											<Route
												path="dashboard"
												element={<Dashboard />}
											/>
											<Route
												path="aset"
												element={<Aset />}
											/>
											<Route
												path="laporan"
												element={<LaporanAset />}
											/>
											<Route
												path="riwayat"
												element={<RiwayatPersediaan />}
											/>
											<Route
												path="stok"
												element={<StokAset />}
											/>
											<Route
												path="calendar"
												element={<Calendar />}
											/>
											<Route
												path="user"
												element={<UserManagement />}
											/>
										</Routes>
									</ProtectedLayout>
								}
							/>
						)} */}

						{/* Rute Dashboard Teknisi */}
						{/* {isLoggedIn && (
							<Route
								path="/teknisi/*"
								element={
									<ProtectedLayout>
										<Routes>
											<Route
												path="dashboard"
												element={<Dashboard />}
											/>
											<Route
												path="aset"
												element={<Aset />}
											/>
											<Route
												path="laporan"
												element={<LaporanAset />}
											/>
											<Route
												path="riwayat"
												element={<RiwayatPersediaan />}
											/>
											<Route
												path="stok"
												element={<StokAset />}
											/>
											<Route
												path="calendar"
												element={<Calendar />}
											/>
											<Route
												path="user"
												element={<UserManagement />}
											/>
										</Routes>
									</ProtectedLayout>
								}
							/>
						)} */}

						{/* Fallback untuk rute tidak dikenal */}
						<Route
							path="*"
							element={
								<Navigate
									to="/"
									replace
								/>
							}
						/>
					</Routes>
				</Router>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}
