/**
 * @file App.jsx is the main entry point for the frontend application.
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Style imports
import './styles/App.css';

import Frame from './components/Frame';
import { HomePage } from './pages/Home';

//Account Pages
import { MyAccount } from './pages/users/myAccount';
import { PersonnelList } from './pages/users/personnelList';
import { ViewUser } from './pages/users/viewUser';

//Certification pages
import { CertList } from './pages/certifications/certList';
import { CertInfo } from './pages/certifications/certCreate';

//Calendar pages
import { WeekCalendar } from './pages/events/calendar';
import { CreateEvent } from './pages/events/createEvent';
import { EditEvent } from './pages/events/editEvent';

//Inventory pages
import { ViewInventory } from './pages/inventory/inventoryHome';
import { ViewKit } from './pages/inventory/viewKit';
import { ListTemplates } from './pages/inventory/listTemplates';
import { ViewTemplate } from './pages/inventory/viewTemplate';


function App() {
	return (
		<Router>
			<div style={{ position:"relative", zIndex: 500}}>
				<Frame />
			</div>
			<div style={{ marginTop: 75 }}>
				<main>
					<div>
						<Routes>
							<Route path="/" element={<HomePage />} />

							<Route path="/myAccount" element={<MyAccount />} />
							<Route path="/personnel" element={<PersonnelList />} />
							<Route path="/personnel/:userID" element={<ViewUser />} />

							<Route path="/certifications" element={<CertList />} />
							<Route path="/certifications/add" element={<CertInfo />} />

							<Route path="/calendar" element={<WeekCalendar />} />
							<Route path="/calendar/addEvent" element={<CreateEvent />} />
							<Route path="/calendar/editEvent/:eventID" element={<EditEvent />} />

							<Route path="/inventory" element={<ViewInventory />} />
							<Route path="/inventory/kits/:kitID" element={<ViewKit />} />
							<Route path="/inventory/templates" element={<ListTemplates />} />
							<Route path="/inventory/templates/:tempID" element={<ViewTemplate />} />
						</Routes>
					</div>
				</main>
			</div>
		</Router>
	);
}

export default App;
