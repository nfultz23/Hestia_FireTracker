/* This file shows a particular user
 */

import "../../styles/App.css";

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const ViewUser = () => {
	const navigate = useNavigate();

	const [user, setUser] = useState(null);
	const [rank, setRank] = useState(null);
	const [badgelist, setBadgelist] = useState([]);
	const [markup, setMarkup] = useState(<></>);
	const { userID } = useParams();

	const nameStyle = {
		color: "#480505FF",
		width: "90%",
		marginLeft: "auto",
		marginRight: "auto",
		display: "flex",
		justifyContent: "space-around",
		fontSize: 30
	}
	const titleStyle = {
		color: "#480505FF",
		width: "90%",
		marginLeft: "auto",
		marginRight: "auto",
		display: "flex",
		justifyContent: "space-around",
		fontSize: 20
	}
	const badgeBoxStyle = {
		backgroundColor: "#FFE8E8FF",
		minHeight: 20,
		width: "90%",
		marginLeft: "auto",
		marginRight: "auto",
		marginTop: "10px",
		padding: 5,
		display: "flex",
		justifyContent: "space-around",
		borderRadius: 10
	}

	useEffect(() => {
		const storeUser = async () => {
			const response = await fetch(`/api/users/${userID}`, {
				method: "GET",
				headers: { 'Content-Type': 'application/json' }
			});

			if (!response.ok) {
				alert("Error viewing user");
				navigate('/personnel');
			}

			const userData = await response.json();
			setUser(userData);
		}

		storeUser();
	}, []);

	useEffect(() => {
		if (user === undefined || user === null) return;

		const storeRank = async () => {
			let rankID = user["rank"];

			const response = await fetch(`/api/ranks/${rankID}`, {
				method: "GET",
				headers: { 'Content-Type': 'application/json' }
			});

			if (!response.ok) {
				alert("Error viewing user");
				navigate('/personnel');
			}

			setRank(await response.json());
		}

		const storeBadges = async () => {
			var certs = [];

			for (let i in user["badges"]) {
				const badgeID = user["badges"][i];
				let currbadge = await fetch(`/api/certifications/${badgeID}`)

				if (!currbadge.ok) {
					alert("Error viewing user");
					navigate('/personnel');
				}

				currbadge = await currbadge.json();
				certs.push(currbadge);
			}

			setBadgelist(certs);
		}

		const effect = async () => {
			await storeRank();
			await storeBadges();
		}

		effect();
	}, [user]);

	useEffect(() => {
		if (user === undefined || user === null) return;
		if (rank === undefined || rank === null) return;
		if (badgelist === undefined || badgelist === null || badgelist.length === 0) return;

		const generateMarkup = async () => {
			var badgeMarkup = (badgelist.map(e => (
				<div
					className="badge" key={`${e.id}`}
					id={`badge-${e.abbreviation}`}
					style={{ backgroundColor: e.color[0], color: e.color[1] }}
				>
					<p style={{ margin: 0 }}>{e.abbreviation}</p>
				</div>
			)));

			const markGen = (<>
				<div className="myaccount-iconcontainer">
					<img src={`${user["icon"]}`} className="myaccount-profileimg" />
				</div>
				<div className="myaccount-centerbox">
					<div id="namebox" style={nameStyle}>
						<p style={{ marginTop: 10, marginBottom: 10 }}>{`${user["first"]} ${user["last"]}`}</p>
					</div>
					<div id="titlebox" style={titleStyle}>
						<p style={{ marginTop: 5, marginBottom: 5 }}>{`${rank["title"]}`}</p>
					</div>
					<div id="badgebox" style={badgeBoxStyle}>
						{badgeMarkup}
					</div>
				</div>
			</>);

			setMarkup(markGen);
		}

		generateMarkup();
	}, [user, rank, badgelist]);

	return markup;
}