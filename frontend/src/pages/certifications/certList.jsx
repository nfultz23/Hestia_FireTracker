/* This file contains the list of certifications on the site
 */

import "../../styles/App.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const CertList = () => {

	const [markup, setMarkup] = useState(<></>)
	const navigate = useNavigate();

	useEffect(() => {
		const getCerts = async () => {
			const res = await (await fetch(`/api/certifications`)).json();
			return res;
		};

		const delCert = async (ID) => {
			const res = await fetch(`/api/certifications/${ID}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' }
			});

			if (!res.ok) {
				alert("Failed to delete certification");
			}

			return;
		}

		const genMarkup = async () => {
			const certs = await getCerts();
			try {
				const markupGen = certs.map(e => (
					<div className="cert-entry" id={`${e.abbreviation}bar`} key={e.abbreviation}>
						<div className="cert-colortile" style={{ backgroundColor: e.color[0] }} />
						<h2 className="cert-title">{`${e.title} (${e.abbreviation})`}</h2>
						<button
							onClick={() => { delCert(e.id); }}
							className="cert-delbtn"
						>Remove</button>
					</div>
				));

				setMarkup(markupGen);
			} catch (err) {
				setMarkup(<div>Error loading certifications...</div>)
				console.log(err);
			}

			return;
		}

		genMarkup();
	});

	return (<>
		<div className="cert-container">
			<div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
				<h1 className="cert-boxheader">Certifications</h1>
			</div>
			<div className="cert-listcontainer">
				{markup}
			</div>

			<div style={{ display: "flex", justifyContent: "space-around" }}>
			<button
				onClick={() => { navigate(`/certifications/add`); }}
				className="cert-addbtn"
				>Add</button>
			</div>
		</div>
	</>);
}