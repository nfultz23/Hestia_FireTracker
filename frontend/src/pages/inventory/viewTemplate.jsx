/* This page shows what's stored in a template
 */

import '../../styles/App.css';

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';

export const ViewTemplate = () => {
	const navigate = useNavigate();
	const { tempID } = useParams();

	const [kit, setKit] = useState({});
	const [markup, setMarkup] = useState(
		<div style={{
			display: "flex", justifyContent: "space-around", marginLeft: 15, marginTop: 10
		}}>Loading...</div>
	);
	const [titlemarkup, setTitlemarkup] = useState(<div style={{
		display: "flex", justifyContent: "space-around", marginLeft: 15, marginTop: 10
	}}>Loading...</div>)
	const [optionlist, setOptionlist] = useState(<></>);
	const [nameboxshown, setNameboxshown] = useState(false);

	const storeTemplate = async () => {
		const kitData = await fetch(`/api/inventory/templates/${tempID}`, {
			"method": "GET",
			"headers": { 'Content-Type': "application/json" }
		});

		setKit(await kitData.json());
	}

	const addItem = async (form) => {
		form.preventDefault();
		const formData = new FormData(form.target);
		const formJson = Object.fromEntries(formData.entries());

		const itemID = formJson["item"];
		const amnt = formJson["quantity"];

		const response = await fetch(`/api/inventory/templates/${tempID}/equipment/${itemID}/add`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ quantity: amnt })
		});

		if (!response.ok) {
			alert("Unable to add item");
			return;
		}

		storeTemplate();
	}

	const makeInstance = async (form) => {
		form.preventDefault();
		let formJson;
		try {
			const formData = new FormData(form.target);
			formJson = Object.fromEntries(formData.entries());
		} catch {
			console.log("Escaping the loop");
			return;
		}

		const kitname = formJson["kitname"]

		const response = await fetch(`/api/inventory/templates/${tempID}/makeKit`, {
			method: "POST",
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				title: kitname
			})
		});

		if (!response.ok) {
			alert(`Could not create kit "${kitname}" from template`);
			setNameboxshown(false);
			return;
		}

		navigate("/inventory");
	}

	useEffect(() => {
		const generateItemlist = async () => {
			let resp = await fetch(`/api/inventory/equipment`);

			if (!resp.ok) {
				alert("Failed to gather inventory options...");
				return;
			}

			resp = await resp.json();

			const listmarkup = resp.map(e => (
				<option value={e.id} key={e.id}>{e.name}</option>
			));

			setOptionlist(listmarkup);
		}

		storeTemplate();
		generateItemlist();
	}, []);

	useEffect(() => {
		const getEquipmentDetails = async () => {
			let resp = await fetch(`/api/inventory/templates/${kit.id}/equipment`, {
				"method": "GET",
				"headers": { 'Content-Type': "application/json" }
			});

			if (!resp.ok) {
				alert("Error gathering kit equipment...");
				return;
			}

			resp = await resp.json();

			const kitmarkup = resp.map(e => (
				<div className="inventory-kitentry" key={e.id}>
					<p className="inventory-equipname">{e.name}</p>
					<div className="inventory-quantitybox">
						<button
							className="inventory-subbtn"
							onClick={async () => {
								await fetch(`/api/inventory/templates/${kit.id}/equipment/${e.id}/remove`, {
									"method": "POST",
									"headers": { "Content-Type": "application/json" }
								});
								storeTemplate();
							}}
						>-</button>
						<p className="inventory-quantitynum">{e.quantity}</p>
						<button
							className="inventory-addbtn"
							onClick={async () => {
								await fetch(`/api/inventory/templates/${kit.id}/equipment/${e.id}/add`, {
									"method": "POST",
									"headers": { "Content-Type": "application/json" }
								});
								storeTemplate();
							}}
						>+</button>
					</div>
				</div>
			));

			setMarkup(kitmarkup);

			setTitlemarkup(<div id="titlebox" style={titleStyle}>
				<p style={{ marginTop: 5, marginBottom: 5 }}>{`${kit["itemcount"]} Items`}</p>
			</div>);
		}

		getEquipmentDetails();
	}, [kit]);

	const nameStyle = {
		color: "#480505FF", width: "90%", marginLeft: "auto", marginRight: "auto",
		display: "flex", justifyContent: "space-around", fontSize: 30
	}
	const titleStyle = {
		color: "#480505FF", width: "90%", marginLeft: "auto", marginRight: "auto",
		display: "flex", justifyContent: "space-around", fontSize: 20
	}

	const inputShown = {
		position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
		backgroundColor: "#48050588", zIndex: 10, display: "flex",
		justifyContent: "space-around", marginTop: 50, padding: 1
	};
	const inputHidden = { display: "none" };

	return (<>
		<div style={nameboxshown ? inputShown : inputHidden}>
			<form
				style={{
					width: 300, height: 150, backgroundColor: "#E5B0B0FF",
					marginTop: 100, borderRadius: 15, display: "flex",
					flexDirection: "column"
				}}
				method="POST"
				onSubmit={makeInstance}>

				<label
					style={{
						display: "flex", flexDirection: "column", textAlign: "center",
						width: "80%", marginLeft: "auto", marginRight: "auto",
						marginTop: 20
					}}
				>Enter a kit name:

					<input
						type="text"
						className="template-nameinput"
						placeholder={kit["title"]}
						name="kitname"
						required />
				</label>

				<div style={{
					display: "flex", justifyContent: "space-around", width: 200,
					marginTop: 30, marginLeft: "auto", marginRight: "auto"
				}}>
					<input
						type="button"
						onClick={() => { setNameboxshown(false) }}
						className="template-makebtn"
						value="Return"
					/>

					<input
						type="submit"
						className="template-makebtn"
						value="Create"
					/>
				</div>
			</form>
		</div>

		<div className="inventory-centerbox">
			<button id="inventory-backbtn" onClick={() => { navigate("/inventory/templates") }}
			>Back</button>
			<button
				id="inventory-createfromtemplate"
				onClick={() => { setNameboxshown(true) }}
			>Make Instance</button>
			<div id="namebox" style={nameStyle}>
				<p style={{ marginTop: 10, marginBottom: 10 }}>{kit["title"]}</p>
			</div>
			<>{titlemarkup}</>

			<div className="cert-listcontainer">
				{markup}
			</div>

			<form
				style={{
					width: 400, height: 25, marginLeft: "auto", marginRight: "auto",
					marginTop: 20, display: "flex"
				}}
				onSubmit={addItem}
				method="POST"
			>
				<label
					style={{ fontSize: 14 }}
				>Add item:

					<select
						name="item"
						className="inventory-dropdown"
						id="inventory-itemname"
						required
					>
						{optionlist}
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
					onClick={() => { console.log("Bulk adding item") }}
					value="Add"
				/>
			</form>
		</div>
	</>);
}