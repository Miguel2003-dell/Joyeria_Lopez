import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AbonoForm from '../components/AbonoForm';
import { useParams } from 'react-router-dom';

const ClienteDetails = () => {
    const { id } = useParams(); // Extract ID from route
    console.log('Client ID:', id); // Debug to ensure ID is correct
    const [cliente, setCliente] = useState(null);
    const [abonos, setAbonos] = useState([]);
    const [productos, setProductos] = useState([]);
    const [isAbonosVisible, setIsAbonosVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const fadeAnim = useRef(0); // For animations (can use CSS)

    useEffect(() => {
        if (id) {
            fetchDetails();
            fetchProductos();
        } else {
            console.error("ID no definido. Asegúrate de que el ID del cliente se pase correctamente.");
        }
    }, [id]);
    

    const fetchProductos = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/clientes/${id}/productos`);
            setProductos(response.data);
        } catch (error) {
            console.error('Error fetching productos:', error);
            alert('Hubo un problema al cargar los productos. Por favor, inténtalo de nuevo.');
        }
    };
    

    const fetchDetails = async () => {
        try {
            const clienteResponse = await axios.get(`http://localhost:3000/api/clientes/${id}`);
            setCliente(clienteResponse.data);

            const abonosResponse = await axios.get(`http://localhost:3000/api/clientes/${id}/abonos`);
            setAbonos(
                abonosResponse.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
            );
        } catch (error) {
            console.error('Error fetching details:', error);
        }
    };

    const handleAddAbono = () => {
        fetchDetails();
        alert('Pago agregado con éxito');
    };

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    return (
        <div style={styles.container}>
            <div style={styles.clientInfo}>
                <h1 style={styles.clientName}>{cliente?.nombre}</h1>
                <hr style={styles.divider} />
                <p style={styles.clientDetail}>Dirección: {cliente?.direccion}</p>
                <p style={styles.clientDetail}>Teléfono: {cliente?.telefono}</p>
                <p style={styles.clientDetail}>Monto inicial: {cliente?.precio_total}</p>
                <p style={styles.clientDetail}>Forma de pago: {cliente?.forma_pago}</p>
                <button style={styles.button} onClick={toggleModal}>
                    Ver Productos
                </button>
                {modalVisible && (
                    <div style={styles.modal}>
                        <h2>Lista de Productos</h2>
                        {productos.length > 0 ? (
                            productos.map((producto, index) => (
                                <div key={index} style={styles.productItem}>
                                    <p>Nombre: {producto.nombre}</p>
                                    <p>Quilates: {producto.quilates}</p>
                                    <p>Precio: {producto.precio}</p>
                                    <p>Cantidad: {producto.cantidad}</p>
                                </div>
                            ))
                        ) : (
                            <p>No hay productos asociados.</p>
                        )}
                        <button onClick={toggleModal} style={styles.closeButton}>
                            Cerrar
                        </button>
                    </div>
                )}
            </div>

            <div style={styles.clientInfo}>
                <h2>Realizar Abono</h2>
                <AbonoForm clienteId={id} onAddAbono={handleAddAbono} />
                <button
                    style={styles.toggleButton}
                    onClick={() => setIsAbonosVisible(!isAbonosVisible)}
                >
                    {isAbonosVisible ? 'Ocultar' : 'Mostrar'} Historial de Abonos
                </button>
                {isAbonosVisible && (
                    <div>
                        {abonos.length > 0 ? (
                            abonos.map((abono, index) => (
                                <div key={index} style={styles.abonoItem}>
                                    <p>Monto: {abono.monto}</p>
                                    <p>Fecha: {new Date(abono.fecha).toLocaleDateString()}</p>
                                    <p>Estado: {abono.estado === 'no_abono' ? 'No Abonado' : 'Pagado'}</p>
                                </div>
                            ))
                        ) : (
                            <p>No hay abonos registrados.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#0d0d0d',
        color: '#f5c469',
    },
    clientInfo: {
        marginBottom: '20px',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#1a1a1a',
    },
    clientName: {
        fontSize: '24px',
        fontWeight: 'bold',
    },
    clientDetail: {
        margin: '5px 0',
    },
    divider: {
        margin: '10px 0',
        border: '1px solid #444',
    },
    button: {
        padding: '10px',
        backgroundColor: '#f5c469',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    toggleButton: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#444',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    modal: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        backgroundColor: '#1a1a1a',
        borderRadius: '10px',
    },
    productItem: {
        marginBottom: '10px',
    },
    closeButton: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#f5c469',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default ClienteDetails;
