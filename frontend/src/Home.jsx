import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

export default function Home() {
  const routes = [
    { path: '/add-airplane', label: 'Add Airplane' },
    { path: '/add-airport', label: 'Add Airport' },
    { path: '/add-person', label: 'Add Person' },
    { path: '/assign-pilot', label: 'Assign Pilot' },
    { path: '/flight-landing', label: 'Flight Landing' },
    { path: '/flight-takeoff', label: 'Flight Takeoff' },
    { path: '/offer-flight', label: 'Offer Flight' },
    { path: '/license-update', label: 'License Update' },
    { path: '/passengers-board', label: 'Passengers Board' },
    { path: '/passengers-disembark', label: 'Passengers Disembark' },
    { path: '/flights-in-air', label: 'Flights In Air' },
    { path: '/flights-on-ground', label: 'Flights On Ground' },
    { path: '/people-in-air', label: 'People In Air' },
    { path: '/people-on-ground', label: 'People On Ground' },
    { path: '/route-summary', label: 'Route Summary' },
    { path: '/alternative-airports', label: 'Alternative Airports' }
  ];

  return (
    <div className="home-container">
      <h1>Welcome to the Airline Management System</h1>
      <p>Select a function to get started:</p>
      <div className="link-grid">
        {routes.map((route, i) => (
          <Link key={i} to={route.path} className="nav-button">
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
