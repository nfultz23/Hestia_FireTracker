/* This page creates the calendar for a given month and week
 */

import "../../styles/App.css";

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const WeekCalendar = () => {
	const navigate = useNavigate();

	const [timeCol, setTimeCol] = useState(<></>);
	const [currdate, setCurrdate] = useState(new Date());
	const [month, setMonth] = useState("Loading...");
	const [week, setWeek] = useState(0);
	const [eventList, setEventList] = useState([]);
	const [eventMarkup, setEventMarkup] = useState(<></>);
	const [menushown, setMenushown] = useState(-1);

	const molist = [
		"January", "February", "March", "April",
		"May", "June", "July", "August",
		"September", "October", "November", "December"
	];

	const timestyle = {
		height: 29,
		width: 40,
		backgroundColor: "#FFFF0000",
		marginLeft: "auto",
		marginRight: "auto",
		marginBottom: 1,
	}

	const monthcalendar_day = {
		width: 20, height: 18, borderRadius: 20,
		backgroundColor: "#FFFF0000", marginTop: 3,
		justifyContent: "space-around", display: "flex",
		paddingTop: 2
	}

	const monthname = {
		marginLeft: "auto",
		marginRight: "auto",
		marginTop: 0,
		marginBottom: 0,
		backgroundColor: "#FF00FF00"
	}

	const daynum = {
		marginLeft: "auto",
		marginRight: "auto",
		marginTop: -10,
		marginBottom: 0,
		backgroundColor: "#FFFF0000",
		fontSize: 35
	}

	const menuShown = {
		backgroundColor: "#F0CFCFFF", width: 100,
		height: 70, marginTop: 0, marginLeft: -110,
		position: "absolute", zIndex: 5,
		borderRadius: 10, border: "2px solid #480505FF"
	}

	const menuHidden = { display: "none" }


	useEffect(() => {
		const getEvents = async () => {
			let response = await fetch(`/api/events`, {
				method: "GET",
				headers: { 'ContentType': 'application/json' }
			});

			if (!response.ok) {
				alert("Error gathering events");
				return;
			}

			response = await response.json();
			setEventList(response);
		}

		const times = [];
		for (let i = 0; i < 24; i++) {
			let timestr = i.toString(10).padStart(2, '0') + ":00";
			times.push(timestr);
		}

		const timeMarkup = times.map(e => (
			<div key={e} style={timestyle}>
				<p style={{ backgroundColor: "#00FFFF00", marginTop: 7 }}>{e}</p>
			</div>
		));

		setTimeCol(timeMarkup);

		getEvents();

	}, []);

	useEffect(() => {
		setMonth(molist[currdate.getMonth()]);

		const firstDayofMonth = new Date(currdate.getFullYear(), currdate.getMonth(), 1);
		const dayofWeek = firstDayofMonth.getDay();
		const adjustedDate = currdate.getDate() + dayofWeek;
		const weeknum = Math.ceil(adjustedDate / 7);

		setWeek(weeknum);

	}, [currdate]);

	useEffect(() => {
		const getHeight = (e) => {
			const start = new Date(e.start);
			const end = new Date(e.end);

			const length = end.getTime() - start.getTime();

			return length / 3600000;
		}

		const getypos = (e) => {
			const start = new Date(e.start);
			let daystart = new Date(e.start);
			daystart.setHours(0, 0, 0, 0);

			const pos = start.getTime() - daystart.getTime();

			return pos / 3600000;
		}

		const getxpos = (e) => {
			const start = new Date(e.start);
			return start.getDay();
		}

		const eventCode = eventList.map(e => (
			<div
				key={e.id}
				className="event-chip"
				style={{
					height: getHeight(e) * 30, backgroundColor: e.color,
					textAlign: "center", marginTop: getypos(e) * 30,
					marginLeft: getxpos(e) * 77
				}}
				onClick={() => {
					if (menushown == e.id) setMenushown(-1);
					else setMenushown(e.id);
				}}
			>
				<p style={{
					backgroundColor: "#FF00FF00", marginLeft: "auto", marginRight: "auto",
					marginTop: 6, marginBottom: 0, fontSize: 13
				}}>{e.title}</p>

				<p style={{
					backgroundColor: "#FF00FF00", marginLeft: "auto", marginRight: "auto",
					marginTop: 8, fontSize: 10, maxWidth: 60,
				}}>{e.location}</p>

				<div style={menushown == e.id ? menuShown : menuHidden}>
					<button
						onClick={() => { console.log(`Editing event ${e.id}`) }}
						className="event-modbtn"
					>Edit Event</button>
					<button
						onClick={() => { console.log(`Assigning personnel to event ${e.id}`) }}
						className="event-modbtn"
					>Assign Staff</button>
				</div>
			</div>
		));

		setEventMarkup(eventCode);
	}, [eventList, menushown]);

	return (<>
		<div className="event-sidebar">
			<div style={{ width: "100%", height: 312 }}>
				<div
					className="event-addbtn"
					onClick={() => {
						navigate("/calendar/addEvent");
					}}
				>
					<p style={{ marginLeft: "auto", marginRight: "auto", marginTop: 10 }}>
						Create Event
					</p>
				</div>
			</div>

			<div className="event-monthnav">
				<div
					className="event-monthnavbtn"
					onClick={() => { console.log("Moving backward one month") }}
				>
					<p style={{ marginLeft: "auto", marginRight: "auto", marginTop: 15 }}>&lt;</p>
				</div>

				<div className="event-monthcontainer">
					<p style={{ marginTop: 8 }}>{month}</p>
				</div>

				<div
					className="event-monthnavbtn"
					onClick={() => { console.log("Moving forward one month") }}
				>
					<p style={{ marginLeft: "auto", marginRight: "auto", marginTop: 15 }}>&gt;</p>
				</div>
			</div>

			<div className="event-monthcalendar" style={{padding: 1}}>
				<div className="event-monthcalendar-bar"
					onClick={() => { console.log("Moving to week 0") }}>
					<p style={monthcalendar_day}></p>
					<p style={monthcalendar_day}></p>
					<p style={monthcalendar_day}>1</p>
					<p style={monthcalendar_day}>2</p>
					<p style={monthcalendar_day}>3</p>
					<p style={monthcalendar_day}>4</p>
					<p style={monthcalendar_day}>5</p>
				</div>

				<div className="event-monthcalendar-bar"
					onClick={() => { console.log("Moving to week 1") }}>
					<p style={monthcalendar_day}>6</p>
					<p style={monthcalendar_day}>7</p>
					<p style={monthcalendar_day}>8</p>
					<p style={monthcalendar_day}>9</p>
					<p style={monthcalendar_day}>10</p>
					<p style={monthcalendar_day}>11</p>
					<p style={monthcalendar_day}>12</p>
				</div>

				<div className="event-monthcalendar-bar"
					onClick={() => { console.log("Moving to week 2") }}>
					<p style={monthcalendar_day}>13</p>
					<p style={monthcalendar_day}>14</p>
					<p style={monthcalendar_day}>15</p>
					<p style={monthcalendar_day}>16</p>
					<p style={monthcalendar_day}>17</p>
					<p style={monthcalendar_day}>18</p>
					<p style={monthcalendar_day}>19</p>
				</div>

				<div className="event-monthcalendar-bar"
					style={{ backgroundColor: "#C74E4EFF" }}
					onClick={() => { console.log("Moving to week 3") }}>
					<p style={monthcalendar_day}>20</p>
					<p style={monthcalendar_day}>21</p>
					<p style={monthcalendar_day}>22</p>
					<p style={monthcalendar_day}>23</p>
					<p style={monthcalendar_day}>24</p>
					<p style={monthcalendar_day}>25</p>
					<p style={monthcalendar_day}>26</p>
				</div>

				<div className="event-monthcalendar-bar"
					onClick={() => { console.log("Moving to week 4") }}>
					<p style={monthcalendar_day}>27</p>
					<p style={monthcalendar_day}>28</p>
					<p style={monthcalendar_day}>29</p>
					<p style={monthcalendar_day}>30</p>
					<p style={monthcalendar_day}></p>
					<p style={monthcalendar_day}></p>
					<p style={monthcalendar_day}></p>
				</div>
			</div>
		</div>

		<div className="event-pagebody">
			<div className="event-calendar-container">
				<div className="event-calendarhdr">
					<div className="event-calendarhdr-entry">
						<p style={monthname}>Sun</p><p style={daynum}>20</p>
					</div>
					<div className="event-calendarhdr-entry">
						<p style={monthname}>Mon</p><p style={daynum}>21</p>
					</div>
					<div className="event-calendarhdr-entry">
						<p style={monthname}>Tue</p><p style={daynum}>22</p>
					</div>
					<div className="event-calendarhdr-entry">
						<p style={monthname}>Wed</p><p style={daynum}>23</p>
					</div>
					<div className="event-calendarhdr-entry">
						<p style={monthname}>Thu</p><p style={daynum}>24</p>
					</div>
					<div className="event-calendarhdr-entry">
						<p style={monthname}>Fri</p><p style={daynum}>25</p>
					</div>
					<div className="event-calendarhdr-entry">
						<p style={monthname}>Sat</p><p style={daynum}>26</p>
					</div>
				</div>

				<div>
					<div className="event-weekcalendar">
						<div className="event-timebar">{timeCol}</div>

						<div className="event-weekcolumn">
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
						</div>

						<div className="event-weekcolumn">
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
						</div>

						<div className="event-weekcolumn">
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
						</div>

						<div className="event-weekcolumn">
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
						</div>

						<div className="event-weekcolumn">
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
						</div>

						<div className="event-weekcolumn">
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
						</div>

						<div className="event-weekcolumn">
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
							<div className="event-hourblock"></div>
						</div>

					</div>
				</div>

				<div style={{
					width: 538, height: 717, marginTop: -721, marginLeft: 84,
					padding: 0.1, borderRadius: "0px 0px 5px 5px", position: "relative"
				}}>
					{eventMarkup}
				</div>
			</div>
		</div>
	</>);
}