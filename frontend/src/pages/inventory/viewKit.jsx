/* This page displays info about a particular kit
 */

import '../../styles/App.css';

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';

export const ViewKit = () => {
	const navigate = useNavigate();
	const { kitID } = useParams();

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

	const storeKit = async () => {
		const kitData = await fetch(`/api/inventory/kits/${kitID}`, {
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

		const response = await fetch(`/api/inventory/kits/${kitID}/equipment/${itemID}/add`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({quantity: amnt})
		});

		if (!response.ok) {
			alert("Unable to add item");
			return;
		}

		storeKit();
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

		storeKit();
		generateItemlist();
	}, []);

	useEffect(() => {
		const getEquipmentDetails = async () => {
			let resp = await fetch(`/api/inventory/kits/${kit.id}/equipment`, {
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
								await fetch(`/api/inventory/kits/${kit.id}/equipment/${e.id}/remove`,{
									"method": "POST",
									"headers": { "Content-Type": "application/json" }
									});
								storeKit();
							}}
						>-</button>
						<p className="inventory-quantitynum">{e.quantity}</p>
						<button
							className="inventory-addbtn"
							onClick={async () => {
								await fetch(`/api/inventory/kits/${kit.id}/equipment/${e.id}/add`, {
									"method": "POST",
									"headers": { "Content-Type": "application/json" }
								});
								storeKit();
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

	return (<>
		<div className="inventory-centerbox">
			<button id="inventory-backbtn" onClick={() => { navigate("/inventory") }}
			>Back</button>
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
					style={{fontSize: 14}}
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