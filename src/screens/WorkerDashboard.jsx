import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ClienteCard from '../components/ClienteCard';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import '../styles/WorkerDashboard.css';

const WorkerDashboard = () => {
    const [clientes, setClientes] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('filtered'); // Nueva variable para controlar las pestañas
    const scaleAnim = useRef(1); // Placeholder para animación (si es necesario más adelante).
    const navigate = useNavigate(); // Usamos useNavigate para navegación

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/api/clientes/', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const clientesPendientes = response.data
                    .filter(cliente => cliente.monto_actual > 0)
                    .sort((a, b) => new Date(a.fecha_proximo_pago) - new Date(b.fecha_proximo_pago));

                setClientes(clientesPendientes);
                setFilteredClientes(clientesPendientes);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchClientes();
    }, []);

    useEffect(() => {
        const filtered = clientes.filter(cliente =>
            cliente.nombre.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredClientes(filtered);
    }, [searchText, clientes]);

    const today = new Date().toLocaleDateString('es-ES');
    const clientesConPagoHoy = filteredClientes.filter((cliente) => {
        const proximoPago = new Date(cliente.fecha_proximo_pago).toLocaleDateString('es-ES');
        return proximoPago === today && parseFloat(cliente.monto_actual) > 0;
    });

    const clientesAtrasados = filteredClientes.filter((cliente) => {
        const proximoPago = new Date(cliente.fecha_proximo_pago).toLocaleDateString('es-ES');
        return proximoPago < today && parseFloat(cliente.monto_actual) > 0;
    });

    const clientesSinPagoHoy = filteredClientes.filter(cliente => {
        const proximoPago = new Date(cliente.fecha_proximo_pago).toLocaleDateString('es-ES');
        return proximoPago !== today && new Date(cliente.fecha_proximo_pago) >= new Date();
    });

    const renderClienteList = (clientes) => (
        <div className="client-list">
            {clientes.length > 0 ? (
                clientes.map(cliente => (
                    <ClienteCard
                        key={cliente.id_cliente}
                        cliente={cliente}
                        onClick={() => navigate(`/cliente-details/${cliente.id_cliente}`)} // Usamos navigate
                    />
                ))
            ) : (
                <p className="empty-message">No hay clientes disponibles.</p>
            )}
        </div>
    );

    const getActiveClientes = () => {
        switch (activeTab) {
            case 'conPagoHoy':
                return clientesConPagoHoy;
            case 'atrasados':
                return clientesAtrasados;
            case 'sinPagoHoy':
                return clientesSinPagoHoy;
            default:
                return filteredClientes;
        }
    };

    return (
        <div className="dashboard-container">
            <header className="header">
                <h1 className="title">Clientes</h1>
            </header>
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar clientes"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>
            <div className="tab-view">
                <button onClick={() => setActiveTab('conPagoHoy')}>Con pago hoy</button>
                <button onClick={() => setActiveTab('atrasados')}>Atrasados</button>
                <button onClick={() => setActiveTab('sinPagoHoy')}>Sin pago hoy</button>
                <button onClick={() => setActiveTab('filtered')}>Todos</button>
            </div>
            <div>{renderClienteList(getActiveClientes())}</div>
        </div>
    );
};

export default WorkerDashboard;
