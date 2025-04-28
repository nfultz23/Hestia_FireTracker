/*This is the inventory page for the site
 */

import "../../styles/App.css"

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ViewInventory = () => {
	const navigate = useNavigate();

	const [markup, setMarkup] = useState(<></>);
	const [kitlist, setKitlist] = useState([]);


	const getKits = async () => {
		let res = await fetch(`/api/inventory/kits`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});

		if (!res.ok) {
			alert("Failed to gather inventory kits");
			return;
		}

		res = await res.json();
		setKitlist(res);
	}

	useEffect(() => {
		getKits();
	}, []);

	useEffect(() => {
		let sortlist = Array.from(kitlist);
		sortlist.sort((a, b) => a["title"].localeCompare(b["title"]));

		const kitMarkup = sortlist.map(e => (
			<div className="cert-entry" id={`${e.id}`} key={e.id}>
				<div
					className="cert-title"
					style={{
						display: "flex", flexDirection: "column", justifyContent: "space-around",
						marginBottom: 5, marginLeft: 25
					}}
				>{`${e.title} (${e.itemcount} Items)`}</div>

				<div style={{marginLeft: "auto", display: "flex", padding: 1}}>
					<button
						onClick={async () => {
							const response = await fetch(
								`/api/inventory/kits/${e.id}`,
								{method: "DELETE",
								headers: { 'Content-Type': 'application/json' }}
							);

							if (!response.ok) { alert(`Error deleting kit ${e.title}`); }

							getKits();
						}}
						className="inventory-modbtn"
					>Delete Kit</button>

					<button
						onClick={() => { navigate(`/inventory/kits/${e.id}`); }}
						className="inventory-modbtn"
						>View Kit</button>
				</div>
			</div>
		));

		setMarkup(kitMarkup);
	}, [kitlist]);


	return (<>
		<div className="cert-container">
			<div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
				<h1 className="cert-boxheader">Inventory</h1>
				<button
					className="inventory-templatebtn"
					onClick={() => { navigate("/inventory/templates") }}
				>Templates</button>
			</div>
			<div className="cert-listcontainer">
				{ markup }
			</div>

			{/*<div style={{ display: "flex", justifyContent: "space-around" }}>
				<button
					onClick={() => { navigate(`/certifications/add`); }}
					className="cert-addbtn"
				>Add</button>
			</div>*/}
		</div>
	</>);
}