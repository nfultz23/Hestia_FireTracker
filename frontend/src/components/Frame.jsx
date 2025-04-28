/* This file makes up the topbar of the file and contains the sidebar
 *  that comes into view when clicking on the profile icon
 */

import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

import "../styles/App.css";

export default function PageFrame() {
	const navigate = useNavigate();

	const [sidebarShown, setSidebarShown] = useState(false);
	const sidebarRef = useRef(null);

	useEffect(() => {
		const clickOutside = (event) => {
			if (sidebarRef.current && !sidebarRef.current.contains(event.target))
				setSidebarShown(false);
		}

		if (sidebarShown) document.addEventListener("mousedown", clickOutside);

		return () => { document.removeEventListener("mousedown", clickOutside); };
	}, [sidebarShown]);

	return (
		<div className="frame-topbar">
			<img
				src={"/profile/purple.png"}
				className="frame-icon"
				onClick={() => { setSidebarShown(!sidebarShown); }}
			/>

			<div
				style={sidebarShown ? { left: 0 } : { left: -250 }}
				className="frame-sidebar"
				ref={sidebarRef}>
				<div style={{
					backgroundColor: "#FF00FF00",
					width: 50, height: 50,
					marginTop: -50, cursor: "pointer"
				}} />
				<div
					className={"sidebar-navbtn"}
					id={"myaccount"}
					onClick={() => {
						navigate("/");
						setSidebarShown(false);
					}}
				>
					<p className={"sidebar-navbtn-text"}>Home</p>
				</div>

				<div
					className={"sidebar-navbtn"}
					id={"myaccount"}
					onClick={() => {
						navigate("/myAccount");
						setSidebarShown(false);
					}}
				>
					<p className={"sidebar-navbtn-text"}>My Account</p>
				</div>

				<div
					className={"sidebar-navbtn"}
					id={"minventory"}
					onClick={() => {
						navigate("/inventory");
						setSidebarShown(false);
					}}
				>
					<p className={"sidebar-navbtn-text"}>Inventory</p>
				</div>

				<div
					className={"sidebar-navbtn"}
					id={"events"}
					onClick={() => {
						navigate("/calendar");
						setSidebarShown(false);
					}}
				>
					<p className={"sidebar-navbtn-text"}>Events</p>
				</div>

				<div
					className={"sidebar-navbtn"}
					id={"personnel"}
					onClick={async () => {
						navigate("/personnel");
						setSidebarShown(false);
					}}
				>
					<p className={"sidebar-navbtn-text"}>Personnel</p>
				</div>

				<div
					className={"sidebar-navbtn"}
					id={"certifications"}
					onClick={() => {
						navigate("/certifications");
						setSidebarShown(false);
					}}
				>
					<p className={"sidebar-navbtn-text"}>Certifications</p>
				</div>
			</div>
		</div>
	);
}