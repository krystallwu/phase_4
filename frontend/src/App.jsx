import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import AddAirplane from './Actions/AddAirplane';
import FlightsInAir from './Views/FlightsInAir';
import FlightsOnGround from './Views/FlightsOnGround';
import PeopleInAir from './Views/PeopleInAir';
import PeopleOnGround from './Views/PeopleOnGround';
import RouteSummary from './Views/RouteSummary';
import AddAirport from './Actions/AddAirport';
import AddPerson from './Actions/AddPerson';
import FlightLanding from './Actions/FlightLanding';
import FlightTakeOff from './Actions/FlightTakeOff';
import './App.css';
import OfferFlight from './Actions/OfferFlight';
import LicenseUpdate from './Actions/LicenseUpdate';
import PassengersBoard from './Actions/PassengersBoard';
import PassengersDisembark from './Actions/PassengersDisembark';
import AssignPilot from './Actions/AssignPilot';
import Home from './Home';

export default function App() {
  return (
    <Router>
    <nav>
      <Link to="/add-airplane">Add Airplane</Link> 
      <Link to="/flights-in-air">Flights in Air</Link>
      <Link to="/people-in-air">People in Air</Link>
      <Link to="/flights-on-ground">Flights on Ground</Link>
      <Link to="/people-on-ground">People on Ground</Link>
      <Link to="/route-summary">Route Summary</Link>
      <Link to="/add-airport">Add Airport</Link>
      <Link to="/add-person">Add Person</Link>
      <Link to="/flight-landing">Flight Landing</Link>
      <Link to="/flight-takeoff">Flight Takeoff</Link>
      <Link to="/offer-flight">Offer Flight</Link>
      <Link to="/license-update">License Update</Link>
      <Link to="/passengers-board">Passengers Board</Link>
      <Link to="/passengers-disembark">Passengers Disembark</Link>
      <Link to="/assign-pilot">Assign Pilot</Link>
      <Link to="/">Home</Link>
    </nav>
    <Routes>
      <Route path="/add-airplane" element={<AddAirplane />} />
      <Route path="/flights-in-air" element={<FlightsInAir />} />
      <Route path="/flights-on-ground" element={<FlightsOnGround />} />
      <Route path="/people-in-air" element={<PeopleInAir />} />
      <Route path="/people-on-ground" element={<PeopleOnGround />} />
      <Route path="/route-summary" element={<RouteSummary />} />
      <Route path="/add-airport" element={<AddAirport />} />
      <Route path="/add-person" element={<AddPerson />} />
      <Route path="/flight-landing" element={<FlightLanding />} />
      <Route path="/flight-takeoff" element={<FlightTakeOff />} />
      <Route path="/offer-flight" element={<OfferFlight />} />
      <Route path="/license-update" element={<LicenseUpdate />} />
      <Route path="/passengers-board" element={<PassengersBoard />} />
      <Route path="/passengers-disembark" element={<PassengersDisembark />} />
      <Route path="/assign-pilot" element={<AssignPilot />} />
      <Route path="/" element={<Home />} />
    </Routes>
  </Router>
  );
}
