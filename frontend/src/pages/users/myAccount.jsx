/* This file contains the code for the My Account page
 */

import "../../styles/App.css";

export const MyAccount = () => {

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

	const EMSStyle = {
		backgroundColor: "#248F2EFF",
		color: "#86E673FF"
	}
	const HMRStyle = {
		backgroundColor: "#24448FFF",
		color: "#738CE6FF"
	}

	return (<>
		<div className="myaccount-iconcontainer">
			<img src={"/profile/purple.png"} className="myaccount-profileimg" />
		</div>
		<div className="myaccount-centerbox">
			<div id="namebox" style={nameStyle}>
				<p style={{marginTop: 10, marginBottom: 10}}>Aliotta Haynes-Jeremiah</p>
			</div>
			<div id="titlebox" style={titleStyle}>
				<p style={{ marginTop: 5, marginBottom: 5 }}>Fire Chief</p>
			</div>
			<div id="badgebox" style={badgeBoxStyle}>
				<div className="badge" id="badge-ems" style={EMSStyle}>
					<p style={{ margin: 0 }}>EMS</p>
				</div>

				<div className="badge" id="badge-hmr" style={HMRStyle}>
					<p style={{ margin: 0 }}>HMR</p>
				</div>
			</div>
		</div>
	</>);
}