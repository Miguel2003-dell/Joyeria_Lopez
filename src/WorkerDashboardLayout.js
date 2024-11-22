// WorkerDashboardLayout.js
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import WorkerDashboard from './screens/WorkerDashboard';
import NuevoCliente from './screens/NuevoCliente';

function WorkerDashboardLayout() {
  const location = useLocation();

  return (
    <div>
      <nav className="bottom-tab-nav">
        <Link to="/worker/home" className={location.pathname === '/worker/home' ? 'active' : ''}>Inicio</Link>
        <Link to="/worker/add-client" className={location.pathname === '/worker/add-client' ? 'active' : ''}>Nuevo Cliente</Link>
      </nav>

      <Routes>
        <Route path="/home" element={<WorkerDashboard />} />
        <Route path="/add-client" element={<NuevoCliente />} />
      </Routes>
    </div>
  );
}

export default WorkerDashboardLayout;
