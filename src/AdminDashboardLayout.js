// AdminDashboardLayout.js
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AdminDashboard from './screens/AdminDashboard';
import NuevoTrabajador from './screens/NuevoTrabajador';
import EstadisticasScreen from './screens/EstadisticasScreen';

function AdminDashboardLayout() {
  const location = useLocation();

  return (
    <div>
      <nav className="bottom-tab-nav">
        <Link to="/admin/home" className={location.pathname === '/admin/home' ? 'active' : ''}>Inicio</Link>
        <Link to="/admin/add-worker" className={location.pathname === '/admin/add-worker' ? 'active' : ''}>Nuevo Trabajador</Link>
        <Link to="/admin/statistics" className={location.pathname === '/admin/statistics' ? 'active' : ''}>Estadísticas</Link>
      </nav>

      <Routes>
        <Route path="/home" element={<AdminDashboard />} />
        <Route path="/add-worker" element={<NuevoTrabajador />} />
        <Route path="/statistics" element={<EstadisticasScreen />} />
      </Routes>
    </div>
  );
}

export default AdminDashboardLayout;
