/* This displays the list of templates within the site
 */

import "../../styles/App.css"

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ListTemplates = () => {
	const navigate = useNavigate();

	const [markup, setMarkup] = useState(<></>);
	const [templates, setTemplates] = useState([]);


	const getTemplates = async () => {
		let res = await fetch(`/api/inventory/templates`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});

		if (!res.ok) {
			alert("Failed to gather inventory templates");
			return;
		}

		res = await res.json();
		setTemplates(res);
	}

	useEffect(() => {
		getTemplates();
	}, []);

	useEffect(() => {
		let sortlist = Array.from(templates);
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

				<div style={{ marginLeft: "auto", display: "flex", padding: 1 }}>
					<button
						onClick={async () => {
							const response = await fetch(
								`/api/inventory/templates/${e.id}`,
								{
									method: "DELETE",
									headers: { 'Content-Type': 'application/json' }
								}
							);

							if (!response.ok) { alert(`Error deleting Template ${e.title}`); }

							getTemplates();
						}}
						className="inventory-modbtn"
					>Delete Template</button>

					<button
						onClick={() => { navigate(`/inventory/templates/${e.id}`); }}
						className="inventory-modbtn"
					>View Template</button>
				</div>
			</div>
		));

		setMarkup(kitMarkup);
	}, [templates]);


	return (<>
		<div className="cert-container">
			<button id="template-backbtn" onClick={() => { navigate("/inventory") }}
			>Back</button>
			<div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
				<h1 className="cert-boxheader">Templates</h1>
			</div>
			<div className="cert-listcontainer">
				{markup}
			</div>

			<div style={{ display: "flex", justifyContent: "space-around" }}>
				<button
					onClick={() => { navigate(`/certifications/add`); }}
					className="cert-addbtn"
				>Add Template</button>
			</div>
		</div>
	</>);
}