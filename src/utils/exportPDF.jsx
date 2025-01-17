import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

export const exportToPDF = (data, filename) => {
	const formattedData = data.map((item) => ({
		...item,
		nama_aset: item.nama_aset.nama_aset,
		username: item.username.username,
	}));

	// Create a landscape-oriented document
	const doc = new jsPDF("landscape");

	// Add a title
	doc.setFont("helvetica", "bold");
	doc.setFontSize(16);
	doc.text("Laporan Transaksi Aset", 14, 20);

	// Add a line under the title
	doc.setLineWidth(0.5);
	doc.line(14, 22, 277, 22); // Adjust the line to match landscape width

	// Set table styles
	doc.setFont("helvetica", "normal");
	doc.setFontSize(10);

	doc.autoTable({
		startY: 30, // Start the table below the title
		head: [["Nama Aset", "Jenis Transaksi", "Jumlah", "Tanggal", "Pemasok", "Diberikan Kepada", "Lokasi Asal", "Lokasi Tujuan", "Catatan", "Status"]],
		body: formattedData.map((item) => [item.nama_aset, item.jenis_transaksi, item.jumlah, format(new Date(item.tanggal), "dd/MM/yyyy"), item.pemasok, item.username, item.lokasi_asal, item.lokasi_tujuan, item.catatan, item.status]),
		headStyles: {
			fillColor: [22, 160, 133], // Green color for the header
			textColor: 255, // White text color for the header
			fontSize: 11,
			fontStyle: "bold",
		},
		bodyStyles: {
			textColor: 50,
			fontSize: 9,
		},
		tableWidth: "wrap",
		margin: { top: 30, left: 14, right: 14 },
	});

	// Save the PDF with the given filename
	doc.save(`${filename}.pdf`);
};
