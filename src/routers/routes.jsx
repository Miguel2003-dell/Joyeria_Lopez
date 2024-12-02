import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "../screens/LoginScreen";
import WorkerDashboard from "../screens/WorkerDashboard";
import NuevoCliente from "../screens/NuevoCliente";
import ClienteDetails from "../screens/ClienteDetails";
import AdminDashboard from "../screens/AdminDashboard";
import TrabajadoresDetails from '../screens/TrabajadorClientes';
import NuevoTrabajador from '../screens/NuevoTrabajador';
import EditarTrabajador from '../components/EditarTrabajador';
import EditarClientes from '../components/EditarClientes';
import AgregarProducto from '../screens/AgregarProducto';
import VerJoyeria from '../screens/VerJoyeria';
import ListaProductos from '../screens/ListaProductos';
import EditarProducto from '../components/EditarProducto';


export const MyRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/worker-dashboard" element={<WorkerDashboard />} />
            <Route path="/nuevo-cliente" element={<NuevoCliente />} />
            <Route path="/cliente-details/:id" element={<ClienteDetails />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/trabajador-clientes/:id" element={<TrabajadoresDetails />} />
            <Route path="/nuevo-trabajador" element={<NuevoTrabajador />} /> 
            <Route path="/editar-trabajador/:id" element={<EditarTrabajador />} /> 
            <Route path="/editar-clientes" element={<EditarClientes />} /> 
            <Route path="/agregar-producto" element={<AgregarProducto />} /> 
            <Route path="/ver-joyeria" element={<VerJoyeria />} /> 
            <Route path="/productos/:id_categoria/:nombre" element={<ListaProductos />} />
            <Route path="/editarProducto/:id_producto" element={<EditarProducto />} />
        </Routes>
    );
};


