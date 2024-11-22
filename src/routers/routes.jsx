import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "../screens/LoginScreen";
import AdminDashboard from "../screens/AdminDashboard";
import WorkerDashboard from "../screens/WorkerDashboard";
import ClienteDetails from "../screens/ClienteDetails";
import NuevoCliente from "../screens/NuevoCliente";

export const MyRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/worker-dashboard" element={<WorkerDashboard />} />
            <Route path="/cliente-details/:id" element={<ClienteDetails />} />
            <Route path="/nuevo-cliente" element={<NuevoCliente />} />
            {/* 
        <Route path="/estadisticas" element={<EstadisticasScreen />} />
        <Route path="/trabajadores-details" element={<TrabajadoresDetails />} />
        <Route path="/nuevo-trabajador" element={<NuevoTrabajador />} /> */}
        </Routes>
    );
};


