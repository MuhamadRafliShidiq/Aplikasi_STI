/* eslint-disable no-unused-vars */
import { useState, useCallback } from "react";
import FullCalendar from "@fullcalendar/react"; // Default import
import { formatDate } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Box, List, ListItem, ListItemText, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Calendar = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [currentEvents, setCurrentEvents] = useState([]);
	const [maintenanceHistory, setMaintenanceHistory] = useState([]);

	// Handler untuk menambahkan jadwal pemeliharaan
	const handleDateClick = (selected) => {
		const title = prompt("Masukkan judul untuk jadwal pemeliharaan");
		const description = prompt("Masukkan deskripsi pemeliharaan (opsional)");
		const calendarApi = selected.view.calendar;
		calendarApi.unselect();

		if (title) {
			const newEvent = {
				id: `${selected.dateStr}-${title}`,
				title,
				description: description || "Pemeliharaan rutin",
				start: selected.startStr,
				end: selected.endStr,
				allDay: selected.allDay,
			};
			calendarApi.addEvent(newEvent);
			setMaintenanceHistory((prev) => [...prev, newEvent]);
		}
	};

	// Handler untuk menghapus jadwal pemeliharaan
	const handleEventClick = (selected) => {
		if (window.confirm(`Yakin ingin menghapus jadwal '${selected.event.title}'?`)) {
			const { id } = selected.event;
			selected.event.remove();
			setMaintenanceHistory((prev) => prev.filter((event) => event.id !== id));
		}
	};

	// Memoized function untuk set current events
	const handleEventsSet = useCallback((events) => {
		console.log("Updating events:", events);
		setCurrentEvents(events);
	}, []);

	return (
		<Box m="20px">
			<Header
				title="Jadwal Pemeliharaan"
				subtitle="Mengelola jadwal dan riwayat pemeliharaan aset"
			/>

			<Box
				display="flex"
				justifyContent="space-between"
			>
				{/* CALENDAR SIDEBAR */}
				<Box
					flex="1 1 20%"
					backgroundColor={colors.primary[400]}
					p="15px"
					borderRadius="4px"
				>
					<Typography variant="h5">Riwayat Pemeliharaan</Typography>
					<List>
						{maintenanceHistory.map((event) => (
							<ListItem
								key={event.id}
								sx={{
									backgroundColor: colors.greenAccent[500],
									margin: "10px 0",
									borderRadius: "2px",
								}}
							>
								<ListItemText
									primary={event.title}
									secondary={
										<Typography>
											{`${formatDate(event.start, {
												year: "numeric",
												month: "short",
												day: "numeric",
											})} - ${event.description}`}
										</Typography>
									}
								/>
							</ListItem>
						))}
					</List>
				</Box>

				{/* CALENDAR */}
				<Box
					flex="1 1 100%"
					ml="15px"
				>
					<FullCalendar
						height="75vh"
						plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
						headerToolbar={{
							left: "prev,next today",
							center: "title",
							right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
						}}
						initialView="dayGridMonth"
						editable={true}
						selectable={true}
						selectMirror={true}
						dayMaxEvents={true}
						select={handleDateClick}
						eventClick={handleEventClick}
						eventsSet={handleEventsSet} // Using memoized callback
						initialEvents={[
							{
								id: "1",
								title: "Pemeliharaan Laptop IT",
								description: "Pembersihan rutin dan pembaruan software",
								date: "2025-01-10",
							},
							{
								id: "2",
								title: "Penggantian kabel jaringan",
								description: "Penggantian kabel LAN di ruang server",
								date: "2025-01-15",
							},
						]}
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default Calendar;
