/* This file contains a list of users on the site
 */

import "../../styles/App.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const PersonnelList = () => {

	const [markup, setMarkup] = useState(<></>)
	const navigate = useNavigate();

	useEffect(() => {
		const getUsers = async () => {
			const res = await (await fetch(`/api/users`)).json();
			return res;
		};

		const genMarkup = async () => {
			let certs = await getUsers();
			try {
				certs = certs.filter(e => e.id != 1);
				const markupGen = certs.map(e => (
					<div className="users-entry" id={`${e.username}bar`} key={e.id}>
						<img
							src={`${ e.icon }`}
							style={{
								width: 50, height: 50, borderRadius: 50,
								marginTop: 12, marginLeft: 12
							}}
						/>
						<h2 className="users-name">{`${e.first} ${e.last}`}</h2>
						<button
							className="users-viewbtn"
							onClick={() => { navigate(`/personnel/${e.id}`); }}
						>View</button>
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
				<h1 className="cert-boxheader">Personnel</h1>
			</div>
			<div className="cert-listcontainer">
				{markup}
			</div>
		</div>
	</>);
}