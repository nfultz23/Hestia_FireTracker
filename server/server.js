/**************************/
/* Main server file 
 * All Endpoint are in here
 * with calls to external 
 * functions based on file
/**************************/

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());


//Get a list of users
app.get(`/api/users`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf8');
		const file = JSON.parse(jsonData);
		return res.status(200).json(file["users"]);

	} catch (err) {
		console.log("Error in /api/users");
		console.log(err);
		return res.status(500).json({ error: err });

	}
});
//Get a specifc user
app.get(`/api/users/:userID`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf8');
		const file = JSON.parse(jsonData);

		let x;
		for (x in file["users"]) {
			if (file["users"][x]["id"] == parseInt(req.params.userID, 10)) break;
		}

		return res.status(200).json(file["users"][x]);

	} catch (err) {
		console.log(`Error in /api/users/${req.params.userID} (GET)`);
		console.log(err);
		return res.status(500).json({ error: err });

	}
});

//Get a list of certifications
app.get(`/api/certifications`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf8');
		const file = JSON.parse(jsonData);
		return res.status(200).json(file["certifications"]);

	} catch (err) {
		console.log("Error in /api/certifications (GET)");
		console.log(err);
		return res.status(500).json({ error: err });

	}

	return;
});
//Get a particular certification
app.get(`/api/certifications/:certID`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf8');
		const file = JSON.parse(jsonData);

		let x;
		for (x in file["certifications"]) {
			if (file["certifications"][x]["id"] == parseInt(req.params.certID, 10)) {
				break;
			}
		}
		return res.status(200).json(file["certifications"][x]);

	} catch (err) {
		console.log(`Error in /api/certifications/${req.params.certID}`);
		console.log(err);
		return res.status(500).json({ error: err });

	}
});
//Add a certification to the site
app.post(`/api/certifications`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf-8');
		const file = JSON.parse(jsonData);

		let maxID = 0;
		for (let i in file["certifications"]) {
			if (file["certifications"][i]["id"] > maxID)
				maxID = file["certifications"][i]["id"];
		}
		const newID = maxID + 1;

		let certsArr = Array.from(file["certifications"]);
		certsArr.push({
			"id": newID,
			"title": req.body["title"],
			"abbreviation": req.body["abbreviation"],
			"color": [req.body["badgeColor"], req.body["badgeTextColor"]]
		});
		file["certifications"] = certsArr;

		const jsonstr = JSON.stringify(file);
		await fs.writeFile(
			process.env.serverEndpoint, jsonstr, 'utf8',
			() => { console.log("Cert Created"); }
		);

		return res.status(201).json({ message: "good job" });
	} catch (err) {
		console.log("Error in /api/certifications (POST)");
		console.log(err);
		return res.status(500).json({ error: err });
	}

	return;
})
//Delete a certification from the site
app.delete(`/api/certifications/:certID`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf8');
		let file = JSON.parse(jsonData);

		file["certifications"] =
			file["certifications"].filter(item => item["id"] != req.params.certID);

		const jsonstr = JSON.stringify(file);
		await fs.writeFile(
			process.env.serverEndpoint, jsonstr, 'utf8',
			() => { console.log("Cert Deleted"); }
		);

		return res.status(205).json({ error: "good job" });
	} catch (err) {
		console.log(`Error in /api/certifications/${req.params.certID} (DELETE)`);
		console.log(err);
		return res.status(500).json({ error: err });
	}

	return;
});

//Get a particular rank
app.get(`/api/ranks/:rankID`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf8');
		const file = JSON.parse(jsonData);

		let x = 0;
		for (x in file["ranks"]) {
			if (file["ranks"][x]["id"] == parseInt(req.params.rankID, 10)) break;
		}

		return res.status(200).json(file["ranks"][x]);

	} catch (err) {
		console.log(`Error in /api/users/${req.params.rankID} (GET)`);
		console.log(err);
		return res.status(500).json({ error: err });

	}
});

//Get a list of events
app.get(`/api/events`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf8');
		const file = JSON.parse(jsonData);

		return res.status(200).json(file["events"]);
	} catch (err) {
		console.log(`Error in /api/events (GET)`);
		console.log(err);
		return res.status(500).json({ error: err });
	}
});
//Get a particular event
app.get(`/api/events/:eventID`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf8');
		const file = JSON.parse(jsonData);

		let x = 0;
		for (x in file["events"]) {
			if (file["events"][x]["id"] == parseInt(req.params.eventID, 10)) break;
		}

		return res.status(200).json(file["events"][x]);
	} catch (err) {
		console.log(`Error in /api/events/${req.params.eventID} (GET)`);
		console.log(error);
		return res.status(500).json({ error: err });
	}
});
//Publish an event to the database
app.post(`/api/events`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf-8');
		const file = JSON.parse(jsonData);

		let maxID = 0;
		for (let i in file["events"]) {
			if (file["events"][i]["id"] > maxID)
				maxID = file["events"][i]["id"];
		}
		const newID = maxID + 1;

		let eventsArr = Array.from(file["events"]);
		eventsArr.push({
			"id": newID,
			"title": req.body["title"],
			"location": req.body["location"],
			"start": req.body["start"],
			"end": req.body["end"],
			"color": req.body["color"],
			"requirements": req.body["requirements"],
			"personnel":[]
		});
		file["events"] = eventsArr;

		const jsonstr = JSON.stringify(file);
		await fs.writeFile(
			process.env.serverEndpoint, jsonstr, 'utf8',
			() => { console.log("Event Created"); }
		);

		return res.status(201).json({ message: "good job" });
	} catch (err) {
		console.log("Error in /api/events (POST)");
		console.log(err);
		return res.status(500).json({ error: err });
	}

	return;
});
//Update an event in the database
app.patch(`/api/events/:eventID`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf8');
		const file = JSON.parse(jsonData);

		let x = 0;
		for (x in file["events"]) {
			if (file["events"][x]["id"] == parseInt(req.params.eventID, 10)) break;
		}

		if (req.body["title"] != undefined & req.body["title"] != "")
			file["events"][x]["title"] = req.body["title"];
		if (req.body["location"] != undefined && req.body["location"] != "")
			file["events"][x]["location"] = req.body["location"];
		if (req.body["start"] != undefined && req.body["start"] != "")
			file["events"][x]["start"] = req.body["start"];
		if (req.body["end"] != undefined && req.body["end"])
			file["events"][x]["end"] = req.body["end"];
		file["events"][x]["color"] = req.body["color"];
		if (req.body["requirements"] != undefined && req.body["requirements"].length != 0)
			file["events"][x]["requirements"].push(req.body["requirements"]);

		const jsonstr = JSON.stringify(file);
		await fs.writeFile(process.env.serverEndpoint, jsonstr, 'utf8');
		return res.status(205).json({ message: "Good job" });
	} catch (err) {
		console.log(`Error in /api/events/${req.params.eventID} (POST)`);
		console.log(err);
		return res.status(500).json({ error: err });
	}
});
//Delete an event from the database
app.delete(`/api/events/:eventID`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf8');
		const file = JSON.parse(jsonData);

		file["events"] = file["events"].filter(o => e["id"] != req.params.eventID);

		const jsonstr = JSON.stringify(file);
		await fs.writeFile(
			process.env.serverEndpoint, jsonstr, 'utf8'
		);

		return res.status(205).json({ message: "Deleted successfully" });
	} catch (err) {
		console.log(`Error in /api/events/${req.params.eventID} (DELETE)`);
		console.log(err);
		return res.status(500).json({ error: err });
	}
});

//Get a list of kits in the inventory
app.get(`/api/inventory/kits`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf8');
		const file = JSON.parse(jsonData);

		return res.status(200).json(file["inventory"]["kits"]);
	} catch (err) {
		console.log(`Error in /api/inventory/kits (GET)`);
		console.log(err);
		return res.status(500).json({ error: err });
	}
});
//Get a particular kit in the inventory
app.get(`/api/inventory/kits/:kitID`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf8');
		const file = JSON.parse(jsonData);

		let x = 0;
		for (x in file["inventory"]["kits"]) {
			if (file["inventory"]["kits"][x]["id"] == parseInt(req.params.kitID, 10)) break;
		}

		return res.status(200).json(file["inventory"]["kits"][x]);
	} catch (err) {
		console.log(`Error in /api/inventory/kits/${req.params.kitID} (GET)`);
		console.log(err);
		return res.status(500).json({ error: err });
	}
});
//Deletes a kit form the database
app.delete(`/api/inventory/kits/:kitID`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf8');
		let file = JSON.parse(jsonData);

		file["inventory"]["kits"] =
			file["inventory"]["kits"].filter(item => item["id"] != req.params.kitID);

		const jsonstr = JSON.stringify(file);
		await fs.writeFile(process.env.serverEndpoint, jsonstr, 'utf8');

		return res.status(205).json({ error: "Tempalte deleted" });
	} catch (err) {
		console.log(`Error in /api/inventory/kits/${req.params.kitID} (DELETE)`);
		console.log(err);
		return res.status(500).json({ error: err });
	}
});
//Get all equipment in the site
app.get(`/api/inventory/equipment`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf8');
		const file = JSON.parse(jsonData);

		return res.status(200).json(file["inventory"]["equipment"]);
	} catch (err) {
		console.log(`Error in /api/inventory/equipment (GET)`);
		console.log(err);
		return res.status(500).json({ error: err });
	}
});
//Get a particular piece of equipment from the site
app.get(`/api/inventory/equipment/:itemID`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf8');
		const file = JSON.parse(jsonData);

		let x = 0;
		for (x in file["inventory"]["equipment"]) {
			if (file["inventory"]["equipment"][x]["id"] === parseInt(req.params.itemID, 10))
				break;
		}

		return res.status(200).json(file["inventory"]["equipment"][x]);
	} catch (err) {
		console.log(`Error in /api/inventory/equipment/${req.params.itemID} (GET)`);
		console.log(err);
		return res.status(500).json({ error: err });
	}
});
//Gets all the equipment for a kit
app.get(`/api/inventory/kits/:kitID/equipment`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf8');
		const file = JSON.parse(jsonData);

		let x = 0;
		for (x in file["inventory"]["kits"]) {
			if (file["inventory"]["kits"][x]["id"] === parseInt(req.params.kitID, 10)) break;
		}

		const kitlist = file["inventory"]["kits"][x]["items"];
		const equipmentlist = file["inventory"]["equipment"];

		var resplist = [];

		for (let i in kitlist) {
			let currid = kitlist[i]["id"];

			for (let j in equipmentlist) {
				if (equipmentlist[j]["id"] === currid) {
					resplist.push({
						id: currid,
						name: equipmentlist[j]["name"],
						quantity: kitlist[i]["quantity"]
					});
				}
			}
		}

		return res.status(200).json(resplist);
	} catch (err) {
		console.log(`Error in /api/inventory/kits/${req.params.kitID}/equipment (GET)`);
		console.log(err);
		return res.status(500).json({ error: err });
	}
});
//Adds an item to a kit
app.post(`/api/inventory/kits/:kitID/equipment/:itemID/add`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf8');
		let file = JSON.parse(jsonData);

		let x = 0;
		for (x in file["inventory"]["kits"]) {
			if (file["inventory"]["kits"][x]["id"] === parseInt(req.params.kitID, 10)) break;
		}

		const amnt = req.body["quantity"] === undefined ? 1 : parseInt(req.body["quantity"], 10);

		const kitlist = file["inventory"]["kits"][x]["items"];
		for (let i in kitlist) {
			if (kitlist[i]["id"] === parseInt(req.params.itemID, 10)) {
				file["inventory"]["kits"][x]["items"][i]["quantity"] =
					parseInt(file["inventory"]["kits"][x]["items"][i]["quantity"], 10) + amnt;
				file["inventory"]["kits"][x]["itemcount"] =
					parseInt(file["inventory"]["kits"][x]["itemcount"], 10) + amnt;

				const jsonstr = JSON.stringify(file);
				await fs.writeFile(
					process.env.serverEndpoint, jsonstr, 'utf8'
				);
				return res.status(201).json({ message: "Quantity incremented" });
			}			
		}

		file["inventory"]["kits"][x]["items"].push(
			{ id: parseInt(req.params.itemID), quantity: amnt }
		);
		file["inventory"]["kits"][x]["itemcount"] =
			parseInt(file["inventory"]["kits"][x]["itemcount"], 10) + amnt;

		const jsonstr = JSON.stringify(file);
		await fs.writeFile(
			process.env.serverEndpoint, jsonstr, 'utf8',
			() => { console.log("items updated"); }
		);

		return res.status(201).json({ message: "Item added" });
	} catch (err) {
		console.log(`Error in /api/inventory/kits/${req.params.kitID}/equipment/${req.params.itemID}/add (POST)`);
		console.log(err);
		return res.status(500).json({ error: err });
	}
});
//Adds an item to a kit
app.post(`/api/inventory/kits/:kitID/equipment/:itemID/remove`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf8');
		let file = JSON.parse(jsonData);

		let x = 0;
		for (x in file["inventory"]["kits"]) {
			if (file["inventory"]["kits"][x]["id"] === parseInt(req.params.kitID, 10)) break;
		}

		const kitlist = file["inventory"]["kits"][x]["items"];
		for (let i in kitlist) {
			if (kitlist[i]["id"] === parseInt(req.params.itemID, 10)) {
				file["inventory"]["kits"][x]["items"][i]["quantity"] -= 1;

				if (file["inventory"]["kits"][x]["items"][i]["quantity"] <= 0) {
					file["inventory"]["kits"][x]["items"].splice(i, 1);
				}

				file["inventory"]["kits"][x]["itemcount"] -= 1;

				const jsonstr = JSON.stringify(file);
				await fs.writeFile(
					process.env.serverEndpoint, jsonstr, 'utf8',
					() => { console.log("items updated"); }
				);
				return res.status(201).json({ message: "Quantity decremented" });
			}
		}

		return res.status(204).json({ message: "No item found" });
	} catch (err) {
		console.log(`Error in /api/inventory/kits/${req.params.kitID}/equipment/${req.params.itemID}/add (POST)`);
		console.log(err);
		return res.status(500).json({ error: err });
	}
});
//Gets all templates
app.get(`/api/inventory/templates`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf8');
		const file = JSON.parse(jsonData);

		return res.status(200).json(file["inventory"]["templates"]);
	} catch (err) {
		console.log(`Error in /api/inventory/templates (GET)`);
		console.log(err);
		return res.status(500).json({ error: err });
	}
});
//Gets a particular template
app.get(`/api/inventory/templates/:tempID`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf8');
		const file = JSON.parse(jsonData);

		let x = 0;
		for (x in file["inventory"]["templates"]) {
			if (file["inventory"]["templates"][x]["id"] === parseInt(req.params.tempID, 10))
				break;
		}

		return res.status(200).json(file["inventory"]["templates"][x]);
	} catch (err) {
		console.log(`Error in /api/inventory/templates/${req.params.tempID} (GET)`);
		console.log(err);
		return res.status(500).json({ error: err });
	}
});
//Gets all the equipment for a kit
app.get(`/api/inventory/templates/:tempID/equipment`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf8');
		const file = JSON.parse(jsonData);

		let x = 0;
		for (x in file["inventory"]["templates"]) {
			if (file["inventory"]["templates"][x]["id"] === parseInt(req.params.tempID, 10))
				break;
		}

		const kitlist = file["inventory"]["templates"][x]["items"];
		const equipmentlist = file["inventory"]["equipment"];

		var resplist = [];

		for (let i in kitlist) {
			let currid = kitlist[i]["id"];

			for (let j in equipmentlist) {
				if (equipmentlist[j]["id"] === currid) {
					resplist.push({
						id: currid,
						name: equipmentlist[j]["name"],
						quantity: kitlist[i]["quantity"]
					});
				}
			}
		}

		return res.status(200).json(resplist);
	} catch (err) {
		console.log(`Error in /api/inventory/templates/${req.params.tempID}/equipment (GET)`);
		console.log(err);
		return res.status(500).json({ error: err });
	}
});
//Adds an item to a kit
app.post(`/api/inventory/templates/:tempID/equipment/:itemID/add`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf8');
		let file = JSON.parse(jsonData);

		let x = 0;
		for (x in file["inventory"]["templates"]) {
			if (file["inventory"]["templates"][x]["id"] === parseInt(req.params.tempID, 10)) break;
		}

		const amnt = req.body["quantity"] === undefined ? 1 : parseInt(req.body["quantity"], 10);

		const kitlist = file["inventory"]["templates"][x]["items"];
		for (let i in kitlist) {
			if (kitlist[i]["id"] === parseInt(req.params.itemID, 10)) {
				file["inventory"]["templates"][x]["items"][i]["quantity"] =
					parseInt(file["inventory"]["templates"][x]["items"][i]["quantity"], 10) + amnt;
				file["inventory"]["templates"][x]["itemcount"] =
					parseInt(file["inventory"]["templates"][x]["itemcount"], 10) + amnt;

				const jsonstr = JSON.stringify(file);
				await fs.writeFile(
					process.env.serverEndpoint, jsonstr, 'utf8'
				);
				return res.status(201).json({ message: "Quantity incremented" });
			}
		}

		file["inventory"]["templates"][x]["items"].push(
			{ id: parseInt(req.params.itemID), quantity: amnt }
		);
		file["inventory"]["templates"][x]["itemcount"] =
			parseInt(file["inventory"]["templates"][x]["itemcount"], 10) + amnt;

		const jsonstr = JSON.stringify(file);
		await fs.writeFile(
			process.env.serverEndpoint, jsonstr, 'utf8',
			() => { console.log("items updated"); }
		);

		return res.status(201).json({ message: "Item added" });
	} catch (err) {
		console.log(`Error in /api/inventory/templates/${req.params.tempID}/equipment/${req.params.itemID}/add (POST)`);
		console.log(err);
		return res.status(500).json({ error: err });
	}
});
//Adds an item to a kit
app.post(`/api/inventory/templates/:tempID/equipment/:itemID/remove`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf8');
		let file = JSON.parse(jsonData);

		let x = 0;
		for (x in file["inventory"]["templates"]) {
			if (file["inventory"]["templates"][x]["id"] === parseInt(req.params.tempID, 10)) break;
		}

		const kitlist = file["inventory"]["templates"][x]["items"];
		for (let i in kitlist) {
			if (kitlist[i]["id"] === parseInt(req.params.itemID, 10)) {
				file["inventory"]["templates"][x]["items"][i]["quantity"] -= 1;

				if (file["inventory"]["templates"][x]["items"][i]["quantity"] <= 0) {
					file["inventory"]["templates"][x]["items"].splice(i, 1);
				}

				file["inventory"]["templates"][x]["itemcount"] -= 1;

				const jsonstr = JSON.stringify(file);
				await fs.writeFile(
					process.env.serverEndpoint, jsonstr, 'utf8',
					() => { console.log("items updated"); }
				);
				return res.status(201).json({ message: "Quantity decremented" });
			}
		}

		return res.status(204).json({ message: "No item found" });
	} catch (err) {
		console.log(`Error in /api/inventory/templates/${req.params.tempID}/equipment/${req.params.itemID}/add (POST)`);
		console.log(err);
		return res.status(500).json({ error: err });
	}
});
//Creates a kit from a template
app.post(`/api/inventory/templates/:tempID/makeKit`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf-8');
		let file = JSON.parse(jsonData);

		let x;
		for (x in file["inventory"]["templates"]) {
			if (file["inventory"]["templates"][x]["id"] === parseInt(req.params.tempID, 10))
				break;
		}

		let maxID = 0;
		for (let i in file["inventory"]["kits"]) {
			if (file["inventory"]["kits"][i]["id"] > maxID)
				maxID = file["inventory"]["kits"][i]["id"];
		}
		const newID = maxID + 1;

		let newKit = JSON.stringify(file["inventory"]["templates"][x]);
		newkit = JSON.parse(newKit);

		newkit["id"] = newID;
		newkit["title"] = req.body["title"];

		file["inventory"]["kits"].push(newkit);

		const jsonstr = JSON.stringify(file);
		await fs.writeFile(
			process.env.serverEndpoint, jsonstr, 'utf8'
		);
		return res.status(201).json({ message: "Kit instantiated" });
	} catch (err) {
		console.log(`Error in /api/inventory/templates/${req.params.tempID}/makeKit (POST)`);
		console.log(err);
		return res.status(500).json({ error: err });
	}
});
//Deletes a template from the database
app.delete(`/api/inventory/templates/:tempID`, async (req, res) => {
	try {
		const fs = require('fs').promises;
		const jsonData = await fs.readFile(process.env.serverEndpoint, 'utf8');
		let file = JSON.parse(jsonData);

		file["inventory"]["templates"] =
			file["inventory"]["templates"].filter(item => item["id"] != req.params.tempID);

		const jsonstr = JSON.stringify(file);
		await fs.writeFile(process.env.serverEndpoint, jsonstr, 'utf8');

		return res.status(205).json({ error: "Template deleted" });
	} catch (err) {
		console.log(`Error in /api/inventory/templates/${req.params.tempID} (DELETE)`);
		console.log(err);
		return res.status(500).json({ error: err });
	}
});


if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../frontend/dist')));

	app.get('*', (req, res) => {
		return res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
	});
} else {
	app.use(cors({ origin: 'http://localhost:3000' }));
}

const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
