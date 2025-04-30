/*This is the code that registers events in the database
 */

import '../../styles/App.css';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const CreateEvent = () => {
	const navigate = useNavigate();

	const [chipColor, setChipColor] = useState("#56267A");
	const [reqlist, setReqlist] = useState(<div style={{ marginLeft: "auto", marginRight: "auto" }}>No requirements set...</div>);
	const [reqmenuShown, setReqmenuShown] = useState(false);
	const [reqOptList, setReqOptList] = useState(<option value="-1">Loading...</option>)

	const storeColor = (e) => { setChipColor(e.target.value) }
	const getCertName = async (id) => {
		let response = await fetch(`/api/certifications/${id}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});

		if (!response.ok) {
			console.log("Bruh");
		}

		response = await response.json();
		return response["title"];
	}

	const publishEvent = async (form) => {
		form.preventDefault();
		const formData = new FormData(form.target);
		const formJson = Object.fromEntries(formData.entries());

		const response = await fetch(`/api/events`, {
			method: 'POST',
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
		setReqmenuShown(true);
	}
	const addreq = async (form) => {
		form.preventDefault();
		const formdata = new FormData(form.target);
		const formJson = Object.fromEntries(formdata.entries());

		const newrequirement = { cert: formJson["reqname"], count: formJson["quantity"] };
		console.log(newrequirement);

		let response = await fetch(`/api/events`, {
			method: "GET",
			headers: { 'Content-Type': 'application/json' }
		});

		if (!response.ok) alert("Whoops oops oh no help");

		response = await response.json();

		var eventid = response[response.length - 1]["id"];

		response = await fetch(`/api/events/${eventid}`, {
			method: "PATCH",
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				requirements: newrequirement
			})
		});

		if (!response.ok) alert("Yeah i kind of expected this part to fail");

		generateReqList();
	}

	const setOptList = async () => {
		let certlist = await fetch(`/api/certifications`, {
			method: "GET",
			headers: { 'Content-Type': 'application/json' }
		});

		if (!certlist.ok) alert("Oh no");
		certlist = await certlist.json();
		console.log(certlist);

		const markup = certlist.map(e => (
			<option value={e.id} key={e.id}>{e.title}</option>
		));

		setReqOptList(markup);
	}
	const generateReqList = async () => {
		let response = await fetch(`/api/events`, {
			method: "GET",
			headers: { 'Content-Type': 'application/json' }
		});

		if (!response.ok) alert("Whoops oops oh no help");

		response = await response.json();

		var eventreqs = response[response.length - 1]["requirements"];
		for (let x in eventreqs) {
			eventreqs[x] = {
				cert: eventreqs[x]["cert"],
				count: eventreqs[x]["count"],
				certname: await getCertName(eventreqs[x]["cert"])
			}
		}

		const markup = eventreqs.map(e => (
			<div key={e.id} style={{
				marginLeft: "auto", marginRight: "auto"
			}}>{`${e.certname} (${e.count} required)`}</div>
		));

		setReqlist(markup);
	}

	useEffect(() => { setOptList(); }, []);

	useEffect(() => {
		setOptList();
	}, [reqmenuShown]);

	const menushowStyle = {
		backgroundColor: "#48050588", width: "100vw",
		height: "100vh", position: "fixed", marginLeft: -10,
		marginTop: -25, zIndex: 10,
	}

	const menuhideStyle = { display: "none" }

	return (<>
		<form
			onSubmit={addreq}
			method="POST"
			style={ reqmenuShown ? menushowStyle : menuhideStyle }
		>
			<div
				style={{
					backgroundColor: "#E5B0B0FF", width: 400, height: 200,
					borderRadius: 10, marginLeft: "auto", marginRight: "auto",
					marginTop: 50, padding: 10, display: "flex",
					flexDirection: "column"
				}}
			>
				<div style={{
					marginLeft: "auto", marginRight: "auto", marginBottom: 20, fontWeight: "bold"
				}}>Add Personnel Requirements?</div>

				{reqlist}

				<div style={{
					backgroundColor: "#00000000", width: 340, height: 40,
					display: "relative", marginLeft: "auto", marginRight: "auto",
					marginTop: "auto"
				}}>
					<label style={{
						}}>
						<select className="template-nameinput" name="reqname">
							{reqOptList}
						</select>
					</label>

					<input
						name="quantity"
						className="inventory-dropdown"
						id="inventory-quantity"
						type="number"
						placeholder="0"
						required
					/>

					<input
						type="submit"
						className="inventory-dropdown-addbtn"
						style={{height: 22}}
						onClick={() => { console.log("Adding Requirement") }}
						value="Add"
					/>
				</div>

				<input
					type="button"
					className="inventory-dropdown-addbtn"
					style={{
						width: 100, height: 30, marginTop: 10,
						marginLeft: "auto", marginRight: "auto"
					}}
					onClick={() => { navigate('/calendar'); }}
					value="Publish Event"
				/>
			</div>
			
		</form>

		<form
			className="cert-container" onSubmit={publishEvent} method="POST"
			style={{height: 425, marginTop: 50}}
		>
			<div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
				<h1 className="cert-boxheader">Add an Event</h1>
			</div>

			<div className="cert-listcontainer" style={{height: 300}}>
				<label className="cert-labeltext" id="cert-name">Event Name:&nbsp;
					<em style={{
						fontStyle: "normal", position: "absolute",
						marginLeft: 460, color: "#C74E4EFF"
					}}>(required)</em>
					<input name="eventname" type="text" className="cert-textinput" required />
				</label>

				<label className="cert-labeltext" id="cert-name">Location:&nbsp;
					<em style={{
						fontStyle: "normal", position: "absolute",
						marginLeft: 460, color: "#C74E4EFF"
					}}>(required)</em>
					<input name="eventloc" type="text" className="cert-textinput" required />
				</label>

				<div className="cert-labeltext" style={{
					display: "flex", flexDirection: "row", justifyContent: "space-between"
				}}>
					<label className="event-sidelabel" id="cert-start">Start:&nbsp;
						<em style={{
							fontStyle: "normal", position: "absolute",
							marginLeft: 20, color: "#C74E4EFF"
						}}>(Required)</em><br />
						<input name="eventstart" type="datetime-local"
							className="cert-textinput" required />
					</label>

					<label className="event-sidelabel" id="cert-end">End:&nbsp;
						<em style={{
							fontStyle: "normal", position: "absolute",
							marginLeft: 20, color: "#C74E4EFF"
						}}>(Required)</em><br />
						<input name="eventend" type="datetime-local"
							className="cert-textinput" required />
					</label>
				</div>

				<label className="cert-labeltext" id="cert-color" style={{marginTop: 25, width: 200}}>
					<div style={{ marginLeft: "auto", marginRight: "auto" }}>
						Badge Preview
					</div>
					<em style={{
						marginLeft: "auto", marginRight: "auto",
						fontStyle: "normal", color: "#C74E4EFF",
					}}>(Click to adjust color)</em>

					<div
						className="chip-preview"
						id="chip-preview"
						style={{
							width: 100, height: 50, backgroundColor: chipColor,
							display: "absolute", marginLeft: "auto", marginRight: "auto",
							marginTop: 5, zIndex: 5, borderRadius: 10,
							boxShadow: "inset 0 0 0 2px #000000FF",
						}}
					/>
					<input
						name="certcolor" type="color"
						className="cert-colorinput" required
						onInput={storeColor} value={chipColor}
					/>
				</label>
			</div>

			<div style={{ display: "flex", justifyContent: "space-around", marginTop: 25}}>
				<input
					type="submit" value="Create"
					className="cert-addbtn"
				/>
			</div>
		</form>
	</>);
}