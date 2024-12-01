import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AbonoForm from '../components/AbonoForm';

const ClienteDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [abonos, setAbonos] = useState([]);
    const [isAbonosVisible, setIsAbonosVisible] = useState(false);
    const [lastIncrementDate, setLastIncrementDate] = useState(null);
    const [productos, setProductos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const scaleAnimModal = useRef(2);
    const fadeAnim = useRef(0);
    const translateYAnim = useRef(10);

    useEffect(() => {
        fetchDetails();
        fetchProductos();
    }, []);

    useEffect(() => {
        if (cliente?.estado === 'completado') {
            alert(
                "Pagos Completados: El cliente ha completado todos los pagos."
            );
            navigate('/worker-dashboard');
        }
    }, [cliente, navigate]);

    const fetchProductos = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await axios.get(`http://localhost:3000/api/clientes/${id}/productos`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setProductos(response.data);
        } catch (error) {
            console.error('Error fetching productos:', error);
        }
    };

    const fetchDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const clienteResponse = await axios.get(`http://localhost:3000/api/clientes/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCliente(clienteResponse.data);

            const abonosResponse = await axios.get(`http://localhost:3000/api/clientes/${id}/abonos`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const abonosOrdenados = abonosResponse.data.sort(
                (a, b) => new Date(b.fecha) - new Date(a.fecha)
            );

            setAbonos(abonosOrdenados);
        } catch (error) {
            console.error('Error fetching details:', error);
        }
    };

    const handleAddAbono = () => {
        fetchDetails();
        alert('Pago agregado con éxito');
    };

    const handleNoAbono = async () => {
        const today = new Date().toISOString().split('T')[0];

        if (lastIncrementDate === today) {
            alert('El incremento ya se realizó para la fecha de hoy.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await axios.put(
                `http://localhost:3000/api/clientes/${id}/incrementarMonto`,
                { incremento: 10 },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setLastIncrementDate(today);
            fetchDetails();
            alert('Monto incrementado: Se ha añadido 10 pesos al monto actual.');
        } catch (error) {
            console.error('Error incrementing monto_actual:', error);
        }
    };

    const handleToggleAbonos = () => {
        setIsAbonosVisible(!isAbonosVisible);
    };

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    return (
        <div style={styles.container}>
            <div style={styles.clientInfo}>
                <h2 style={styles.clientName}>{cliente?.nombre}</h2>
                <hr />
                <p style={styles.clientDetail}>
                    Dirección: {cliente?.direccion}
                </p>
                <p style={styles.clientDetail}>Teléfono: {cliente?.telefono}</p>
                <p style={styles.clientDetail}>
                    Monto inicial: {cliente?.precio_total}
                </p>
                <p style={styles.clientDetail}>
                    Forma de pago: {cliente?.forma_pago}
                </p>
                <p style={styles.clientDetail}>
                    Por pagar: {cliente?.monto_actual}
                </p>
                <button style={styles.button} onClick={toggleModal}>
                    Ver Productos
                </button>

                {modalVisible && (
                    <div style={styles.modalContainer}>
                        <div style={styles.modalContent}>
                            <h3>Lista de Productos</h3>
                            <ul>
                                {productos.map((producto, index) => (
                                    <li key={index}>
                                        <p>Nombre: {producto.nombre}</p>
                                        <p>Quilates: {producto.quilates}</p>
                                        <p>Precio: {producto.precio}</p>
                                        <p>Cantidad: {producto.cantidad}</p>
                                    </li>
                                ))}
                            </ul>
                            <button
                                style={styles.closeButton}
                                onClick={toggleModal}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div style={styles.clientInfo}>
                <h2>Realizar abono</h2>
                {cliente?.monto_actual > 0 ? (
                    <>
                        <AbonoForm clienteId={id} onAddAbono={handleAddAbono} />
                        <button
                            style={styles.noAbonoButton}
                            onClick={handleNoAbono}
                            disabled={cliente?.estado === 'completado'} // Deshabilitar el botón si ya completó el pago
                        >
                            No abonó
                        </button>
                    </>
                ) : (
                    <p>El cliente ha completado todos los pagos.</p>
                )}
                <button
                    style={styles.toggleButton}
                    onClick={handleToggleAbonos}
                >
                    {isAbonosVisible ? "Ocultar" : "Mostrar"} Historial de
                    Abonos
                </button>
                {isAbonosVisible &&
                    abonos.map((abono, index) => (
                        <div
                            key={index}
                            style={
                                abono.estado === "no_abono"
                                    ? styles.noAbonoBackground
                                    : styles.pagadoBackground
                            }
                        >
                            <p>Monto: {abono.monto}</p>
                            <p>
                                Fecha:{" "}
                                {new Date(abono.fecha).toLocaleDateString()}
                            </p>
                            <p>
                                Estado:{" "}
                                {abono.estado === "no_abono"
                                    ? "No Abonado"
                                    : "Pagado"}
                            </p>
                        </div>
                    ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#0d0d0d',
        padding: 20,
    },
    clientInfo: {
        backgroundColor: '#1a1a1a',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 12,
        color: '#ffffff'
    },
    clientName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#f5c469',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: 3,
    },
    clientDetail: {
        fontSize: 16,
        color: '#d9d9d9',
        marginLeft: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    divider: {
        height: 1,
        backgroundColor: '#444',
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#f5c469',
        marginBottom: 12,
        textAlign: 'center',

    },
    clientAmountText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ff6347', // Color rojo suave
        textAlign: 'center',
        textShadowColor: '#000', // Color de sombra
        textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de sombra
        textShadowRadius: 5, // Radio de desenfoque de la sombra
    },
    noAbonosText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
    toggleButton: {
        marginVertical: 15,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#2a2a2a',
        alignItems: 'center',
    },
    abonoItem: {
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
    },
    check: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginBottom: 12,
    },
    abonoText: {
        fontSize: 16,
        color: '#f9f9f9',
    },
    noAbonoBackground: {
        backgroundColor: '#8b0000',
    },
    pagadoBackground: {
        backgroundColor: '#006400',
    },
    noAbonoButton: {
        backgroundColor: '#ff6347',
        paddingVertical: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15,
        shadowColor: '#ff6347',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 2,
    },
    noAbonoButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    hiddeTitle: {
        color: '#b1b1b1'
    },
    button: {
        backgroundColor: '#d4af37',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '95.7%',
        backgroundColor: '#1a1a1a',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#f5c469',
        marginBottom: 20,
    },
    productItem: {
        marginBottom: 15,
        padding: 15,
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
    },
    noProductsText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#ff6347',
        padding: 10,
        borderRadius: 8,
        marginTop: 20,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
};

export default ClienteDetails;
