import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ClienteCard from '../components/ClienteCard';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate

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
                const response = await axios.get('https://8oj4qmf2y4.execute-api.us-east-1.amazonaws.com/clientes', {
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
        <div style={styles.clientList}>
            {clientes.length > 0 ? (
                clientes.map(cliente => (
                    <ClienteCard
                        key={cliente.id_cliente}
                        cliente={cliente}
                        onClick={() => navigate(`/cliente-details/${cliente.id_cliente}`)} // Usamos navigate
                    />
                ))
            ) : (
                <p style={styles.emptyMessage}>No hay clientes disponibles.</p>
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
        <div style={styles.dashboardContainer}>
            <header style={styles.header}>
                <h1 style={styles.title}>Clientes</h1>
            </header>
            <div style={styles.searchContainer}>
                <input
                    type="text"
                    style={styles.searchInput}
                    placeholder="Buscar clientes"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>
            <div style={styles.tabView}>
                <button onClick={() => setActiveTab('conPagoHoy')} style={styles.tabButton}>Con pago hoy</button>
                <button onClick={() => setActiveTab('atrasados')} style={styles.tabButton}>Atrasados</button>
                <button onClick={() => setActiveTab('sinPagoHoy')} style={styles.tabButton}>Sin pago hoy</button>
                <button onClick={() => setActiveTab('filtered')} style={styles.tabButton}>Todos</button>
            </div>
            <div>{renderClienteList(getActiveClientes())}</div>
        </div>
    );
};

const styles = {
    dashboardContainer: {
        backgroundColor: '#121212',
        color: '#f5c469',
        padding: '20px',
        minHeight: '100vh',
    },
    header: {
        fontSize: '26px',
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: '16px',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        letterSpacing: '0.8px',
    },
    logoutButton: {
        backgroundColor: '#ff6347',
        color: '#fff',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    searchContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
    },
    searchInput: {
        width: '100%',
        maxWidth: '500px',
        padding: '10px',
        border: '1px solid #707070',
        borderRadius: '8px',
        backgroundColor: '#1e1e1e',
        color: '#d1a980',
    },
    tabView: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
    },
    tabButton: {
        margin: '5px',
        padding: '10px 20px',
        border: 'none',
        backgroundColor: '#1c1c1e',
        color: '#fff',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    clientList: {
        marginTop: '20px',
    },
    emptyMessage: {
        textAlign: 'center',
        marginTop: '20px',
        color: '#fff',
        fontSize: '16px',
    },
};

export default WorkerDashboard;
