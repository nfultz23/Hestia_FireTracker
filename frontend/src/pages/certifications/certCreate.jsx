/* This file contains the page to create a certification
 */

import "../../styles/App.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CertInfo = () => {
	const navigate = useNavigate();

	const [badgeColor, setBadgeColor] = useState("#880088");
	const [badgeTextColor, setBadgeTextColor] = useState("#FFFFFF");
	const [badgeText, setBadgeText] = useState("...");

	const EMSStyle = {
		backgroundColor: badgeColor,
		color: badgeTextColor
	}

	const updateText = (e) => {
		setBadgeText(e.target.value);
	}

	const updateColor = (e) => {
		setBadgeColor(e.target.value);

		const R = parseInt(e.target.value.substring(1, 3), 16);
		const G = parseInt(e.target.value.substring(3, 5), 16);
		const B = parseInt(e.target.value.substring(5, 7), 16);

		const value = ((0.299 * R) + (0.587 * G) + (0.144 * B)) / 255;

		if (value < 0.5) {
			setBadgeTextColor("#FFFFFF");
		} else {
			setBadgeTextColor("#000000");
		}
	}

	const publishCert = async (form) => {
		form.preventDefault();
		const formData = new FormData(form.target);
		const formJson = Object.fromEntries(formData.entries());

		const response = await fetch(`/api/certifications`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				"title": formJson["certname"],
				"abbreviation": formJson["certabbr"],
				"badgeColor": badgeColor,
				"badgeTextColor": badgeTextColor
			})
		});

		if (!response.ok) {
			alert("Unable to publish certification");
			return;
		}

		navigate(`/certifications`, { replace: true });
	}

	return (<>
		<form className="cert-container" onSubmit={publishCert} method="POST">
			<div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
				<h1 className="cert-boxheader">Add a Certification</h1>
			</div>

			<div className="cert-listcontainer">
				<label className="cert-labeltext" id="cert-name">Certification Name:&nbsp;
					<em style={{
							fontStyle: "normal", position: "absolute",
							marginLeft: 460, color: "#C74E4EFF"
						}}>(required)</em>
					<input name="certname" type="text" className="cert-textinput" required />
				</label>

				<label className="cert-labeltext" id="cert-abbr">Abbreviation:&nbsp;
					<em style={{
						fontStyle: "normal", position: "absolute",
						marginLeft: 460, color: "#C74E4EFF"
					}}>(required)</em>
					<input
						name="certabbr" type="text"
						className="cert-textinput" required
						onInput={updateText}
					/>
				</label>

				<label className="cert-labeltext" id="cert-color">
					<div style={{ marginLeft: "auto", marginRight: "auto" }}>
						Badge Preview
					</div>
					<em style={{
						marginLeft: "auto", marginRight: "auto",
						fontStyle: "normal",color: "#C74E4EFF"
					}}>(Click to adjust color)</em>

					<div className="badge-preview" id="badge-ems" style={EMSStyle}>
						<p style={{ margin: 0 }}>{badgeText}</p>
					</div>
					<input
						name="certcolor" type="color"
						className="cert-colorinput" required
						onInput={updateColor} value={badgeColor}
					/>
				</label>
			</div>

			<div style={{display: "flex", justifyContent: "space-around"}}>
				<input
					type="submit" value="Add"
					className="cert-addbtn"
				/>
			</div>
		</form>
	</>);
}