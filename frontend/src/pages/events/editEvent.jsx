/*This is the code that registers events in the database
 */

import '../../styles/App.css';

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const EditEvent = () => {
	const navigate = useNavigate();
	const { eventID } = useParams();

	const [chipColor, setChipColor] = useState("#56267A");
	const [event, setEvent] = useState({
		id: -1, title: "Loading...", location: "Loading...",
		start: "0000-01-01 00:00", end: "0000-01-01 00:00",
		color: "#56267A"
	});

	const storeColor = (e) => { setChipColor(e.target.value) }

	const updateEvent = async (form) => {
		form.preventDefault();
		const formData = new FormData(form.target);
		const formJson = Object.fromEntries(formData.entries());

		const response = await fetch(`/api/events/${eventID}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				"title": formJson["eventname"],
				"location": formJson["eventloc"],
				"start": formJson["eventstart"],
				"end": formJson["eventend"],
				"color": chipColor,
				"requirements": []
			})
		});

		if (!response.ok) {
			alert("Unable to publish event");
			return;
		}

		navigate(`/calendar`, { replace: true });
	}

	useEffect(() => {
		const getEvent = async () => {
			let response = await fetch(`/api/events/${eventID}`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' }
			});

			if (!response.ok) {
				alert("Error editing event...");
				navigate('/calendar');
				return;
			}

			response = await response.json();

			setEvent(response);
		}

		getEvent();
	}, []);

	useEffect(() => {
		setChipColor(event.color);
	}, [event]);

	return (<>
		<form
			className="cert-container" onSubmit={updateEvent} method="POST"
			style={{ height: 425, marginTop: 50 }}
		>
			<div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
				<h1 className="cert-boxheader">Add an Event</h1>
			</div>

			<div className="cert-listcontainer" style={{ height: 300 }}>
				<label className="cert-labeltext" id="cert-name">Event Name:&nbsp;
					<em style={{
						fontStyle: "normal", position: "absolute",
						marginLeft: 460, color: "#C74E4EFF"
					}}>(required)</em>
					<input
						name="eventname"
						type="text"
						className="cert-textinput"
						placeholder={event.title} />
				</label>

				<label className="cert-labeltext" id="cert-name">Location:&nbsp;
					<em style={{
						fontStyle: "normal", position: "absolute",
						marginLeft: 460, color: "#C74E4EFF"
					}}>(required)</em>
					<input
						name="eventloc"
						type="text"
						className="cert-textinput"
						placeholder={event.location} />
				</label>

				<div className="cert-labeltext" style={{
					display: "flex", flexDirection: "row", justifyContent: "space-between"
				}}>
					<label className="event-sidelabel" id="cert-start">Start:&nbsp;
						<em style={{
							fontStyle: "normal", position: "absolute",
							marginLeft: 20, color: "#C74E4EFF"
						}}>(Required)</em><br />
						<input name="eventstart"
							type="datetime-local"
							className="cert-textinput" />
					</label>

					<label className="event-sidelabel" id="cert-end">End:&nbsp;
						<em style={{
							fontStyle: "normal", position: "absolute",
							marginLeft: 20, color: "#C74E4EFF"
						}}>(Required)</em><br />
						<input name="eventend"
							type="datetime-local"
							className="cert-textinput" />
					</label>
				</div>

				<label className="cert-labeltext" id="cert-color" style={{ marginTop: 25 }}>
					<div style={{ marginLeft: "auto", marginRight: "auto" }}>
						Badge Preview
					</div>
					<em style={{
						marginLeft: "auto", marginRight: "auto",
						fontStyle: "normal", color: "#C74E4EFF"
					}}>(Click to adjust color)</em>

					<div
						className="chip-preview"
						id="chip-preview"
						style={{
							width: 100, height: 50, backgroundColor: chipColor,
							display: "absolute", marginLeft: 215, marginTop: 5,
							zIndex: 5, borderRadius: 10,
							boxShadow: "inset 0 0 0 2px #000000FF"
						}}
					/>
					<input
						name="certcolor" type="color"
						className="cert-colorinput"
						onInput={storeColor} value={chipColor}
					/>
				</label>
			</div>

			<div style={{ display: "flex", justifyContent: "space-around", marginTop: 25 }}>
				<input
					type="submit" value="Create"
					className="cert-addbtn"
				/>
			</div>
		</form>
	</>);
}