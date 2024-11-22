import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Para navegación web
import ClienteCard from "../components/ClienteCard";
import { IoExitOutline, IoChevronDown } from "react-icons/io5"; // Usando react-icons

const WorkerDashboard = () => {
    const [clientes, setClientes] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);

    const navigate = useNavigate(); // Para navegación web

    const fadeAnim = useRef(0);
    const rotateAnim = useRef(0);
    const scaleAnim = useRef(1);

    // Fetch clientes when component mounts
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Token:', token);
                if (!token) {
                    navigate('/'); // Redirigir al login si no hay token
                    return;
                }

                const response = await axios.get('http://localhost:3000/api/clientes', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response && response.data) {
                    const clientesPendientes = response.data
                        .filter(cliente => cliente.monto_actual > 0)
                        .sort((a, b) => new Date(a.fecha_proximo_pago) - new Date(b.fecha_proximo_pago));

                    setClientes(clientesPendientes);
                    setFilteredClientes(clientesPendientes);
                    setLoading(false);
                    fadeAnim.current = 1;
                } else {
                    console.error("La respuesta no tiene la propiedad 'data'");
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error al obtener los clientes:', error);  // Mostrar el error en consola
                setLoading(false);
            }
        };

        fetchClientes();
    }, []);

    // Filter clientes based on search text
    useEffect(() => {
        const filtered = clientes.filter((cliente) =>
            cliente.nombre.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredClientes(filtered);
    }, [searchText, clientes]);

    // Handle logout action
    const handleLogout = async () => {
        scaleAnim.current = 1.2;
        setTimeout(() => {
            scaleAnim.current = 1;
            localStorage.removeItem("token"); // Usar localStorage en lugar de AsyncStorage
            navigate("/login");
        }, 200);
    };

    // Toggle accordion for clients with no payment today
    const toggleAccordion = () => {
        setIsAccordionOpen(!isAccordionOpen);
        rotateAnim.current = isAccordionOpen ? 0 : 1;
    };

    // Rotate icon for accordion
    const rotateIcon = rotateAnim.current === 1 ? "rotate(180deg)" : "rotate(0deg)";

    const today = new Date().toLocaleDateString("es-ES");

    // Filter clients with payment today and those without payment
    const clientesConPagoHoy = filteredClientes.filter((cliente) => {
        const proximoPago = new Date(cliente.fecha_proximo_pago).toLocaleDateString("es-ES");
        return proximoPago === today || new Date(cliente.fecha_proximo_pago) < new Date();
    });

    const clientesSinPagoHoy = filteredClientes.filter((cliente) => {
        const proximoPago = new Date(cliente.fecha_proximo_pago).toLocaleDateString("es-ES");
        return proximoPago !== today && new Date(cliente.fecha_proximo_pago) >= new Date();
    });

    return (
        <div className="worker-dashboard-container" style={styles.container}>
            <div className="worker-header-container" style={styles.header}>
                <h1 className="worker-title" style={styles.title}>Clientes</h1>
                <div
                    className="worker-logout-icon"
                    style={{ ...styles.logoutIcon, transform: `scale(${scaleAnim.current})` }}
                >
                    <IoExitOutline size={32} color="#ff6347" onClick={handleLogout} />
                </div>
            </div>

            <div
                className="worker-search-input-container"
                style={{ opacity: fadeAnim.current }}
            >
                <input
                    className="worker-search-input"
                    style={styles.searchInput}
                    placeholder="Buscar cliente"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>

            <div className="worker-scroll-content" style={styles.listContent}>
                {clientesConPagoHoy.length === 0 ? (
                    <p className="worker-empty-message" style={styles.emptyMessage}>
                        No hay clientes con pago hoy
                    </p>
                ) : (
                    <div style={{ opacity: fadeAnim.current }}>
                        {clientesConPagoHoy.map((item) => (
                            <ClienteCard
                                key={item.id_cliente}
                                cliente={item}
                                onClick={() => navigate(`/cliente-details/${item.id_cliente}`)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <button
                className="worker-accordion-header"
                style={styles.accordionHeader}
                onClick={toggleAccordion}
            >
                <span className="worker-accordion-title" style={styles.accordionTitle}>
                    Clientes sin pago hoy
                </span>
                <IoChevronDown style={{ transform: rotateIcon }} />
            </button>

            {isAccordionOpen && (
                <div className="worker-accordion-content" style={styles.accordionContent}>
                    {clientesSinPagoHoy.length === 0 ? (
                        <p className="worker-empty-message" style={styles.emptyMessage}>
                            No hay clientes sin pago hoy
                        </p>
                    ) : (
                        clientesSinPagoHoy.map((item) => (
                            <ClienteCard
                                key={item.id_cliente}
                                cliente={item}
                                onClick={() => navigate(`/cliente-details/${item.id_cliente}`)}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
const styles = {
    container: { flex: 1, backgroundColor: '#121212' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginVertical: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#f5c469',
        letterSpacing: 0.8,
    },
    logoutIcon: {
        padding: 5,
        borderRadius: 12,
        backgroundColor: '#282828',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 7,
    },
    searchInput: {
        height: 45,
        margin: 15,
        borderColor: '#707070',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        color: '#d1a980',
        backgroundColor: '#1e1e1e',
        fontSize: 16,
    },
    listContent: { paddingBottom: 20 },
    tabBar: { backgroundColor: '#1c1c1e' },
    tabIndicator: { backgroundColor: '#FFD700' },
    tabLabel: { color: '#fff', fontWeight: 'bold' },
    emptyMessage: {
        textAlign: 'center',
        color: '#fff',
        marginTop: 20,
        fontSize: 16,
    },
    accordionHeader: {
        backgroundColor: '#1e1e1e',
        padding: 15,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    accordionTitle: {
        color: '#f5c469',
        fontSize: 18,
        fontWeight: 'bold',
    },
    accordionContent: {
        backgroundColor: '#2c2c2c',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    }
};

export default WorkerDashboard;
