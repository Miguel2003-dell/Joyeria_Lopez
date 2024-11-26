import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ClienteCard from '../components/ClienteCard';
import { useParams } from 'react-router-dom';

const TrabajadorClientes = ({ route }) => {
    const { id } = useParams();
    const [clientes, setClientes] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [trabajadorNombre, setTrabajadorNombre] = useState('');
    const [index, setIndex] = useState(0);
    const routes = [
        { key: 'pagosHoy', title: 'Con pago hoy' },
        { key: 'atrasados', title: 'Atrasados' },
        { key: 'sinPagosHoy', title: 'Sin pago hoy' },
        { key: 'montoCero', title: 'Finalizados' },
    ];

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/clientes/clientes/${id}`);
                const clientesPendientes = response.data.sort(
                    (a, b) => new Date(a.fecha_proximo_pago) - new Date(b.fecha_proximo_pago)
                );
                setClientes(clientesPendientes);
                setFilteredClientes(clientesPendientes);
    
                if (response.data.length > 0) {
                    setTrabajadorNombre(response.data[0].nombre_trabajador);
                }
            } catch (error) {
                console.error('Error al obtener los clientes:', error);
            }
        };
        fetchClientes();
    }, [id]);

    useEffect(() => {
        const filtered = clientes.filter((cliente) =>
            cliente.nombre.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredClientes(filtered);
    }, [searchText, clientes]);

    const today = new Date().toLocaleDateString('es-ES');
    const clientesConPagoHoy = filteredClientes.filter((cliente) => {
        const proximoPago = new Date(cliente.fecha_proximo_pago).toLocaleDateString('es-ES');
        return (
            proximoPago === today &&
            new Date(cliente.fecha_proximo_pago) < new Date() &&
            parseFloat(cliente.monto_actual) > 0
        );
    });

    const clientesSinPagoHoy = filteredClientes.filter((cliente) => {
        const proximoPago = new Date(cliente.fecha_proximo_pago).toLocaleDateString('es-ES');
        return (
            proximoPago !== today &&
            new Date(cliente.fecha_proximo_pago) >= new Date() &&
            parseFloat(cliente.monto_actual) > 0
        );
    });

    const clientesAtrasados = filteredClientes.filter((cliente) => {
        const proximoPago = new Date(cliente.fecha_proximo_pago).toLocaleDateString('es-ES');
        return (
            proximoPago < today &&
            parseFloat(cliente.monto_actual) > 0
        );
    });

    const clientesMontoCero = filteredClientes.filter(
        (cliente) => parseFloat(cliente.monto_actual) === 0
    );

    const renderClienteList = (clientes) => (
        <div style={{ padding: '10px' }}>
            {clientes.length === 0 ? (
                <p style={{ color: '#fff', textAlign: 'center' }}>No hay clientes disponibles.</p>
            ) : (
                clientes.map((item) => (
                    <ClienteCard
                        key={item.id_cliente}
                        cliente={item}
                        onDelete={() => {}}
                        onEdit={() => {}}
                    />
                ))
            )}
        </div>
    );

    const renderScene = () => {
        if (index === 0) return renderClienteList(clientesConPagoHoy);
        if (index === 1) return renderClienteList(clientesAtrasados);
        if (index === 2) return renderClienteList(clientesSinPagoHoy);
        if (index === 3) return renderClienteList(clientesMontoCero);
        return null;
    };

    return (
        <div style={{ backgroundColor: '#121212', color: '#fff', padding: '20px' }}>
            <h1 style={{ color: '#f5c469' }}>Clientes de {trabajadorNombre}</h1>
            <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                <input
                    type="text"
                    placeholder="Buscar clientes"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #707070',
                        backgroundColor: '#1e1e1e',
                        color: '#d1a980',
                    }}
                />
            </div>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
                    {routes.map((route, idx) => (
                        <button
                            key={route.key}
                            onClick={() => setIndex(idx)}
                            style={{
                                backgroundColor: idx === index ? '#FFD700' : '#1c1c1e',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 20px',
                                cursor: 'pointer',
                            }}
                        >
                            {route.title}
                        </button>
                    ))}
                </div>
                {renderScene()}
            </div>
        </div>
    );
};

export default TrabajadorClientes;
