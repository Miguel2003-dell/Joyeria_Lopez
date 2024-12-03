import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; 
import { IoCreateOutline, IoTrashOutline } from 'react-icons/io5'; // Iconos de Ionicons

const ListaProductos = () => {
    const { id_categoria, nombre } = useParams(); 
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productoToDelete, setProductoToDelete] = useState(null); // Producto a eliminar
    const navigate = useNavigate();

    const fetchProductos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `https://8oj4qmf2y4.execute-api.us-east-1.amazonaws.com/productos/productoCategoria?id_categoria=${id_categoria}`
            );
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener productos:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    }, [id_categoria]);

    useEffect(() => {
        if (id_categoria) {
            fetchProductos();
        }
    }, [fetchProductos, id_categoria]);

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const filteredProductos = productos.filter((item) =>
        item.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (productoId) => {
        navigate(`/editarProducto/${productoId}`);
    };

    // Muestra el modal de confirmación de eliminación
    const handleDeleteConfirmation = (productoId) => {
        setProductoToDelete(productoId);
        setShowDeleteModal(true);
    };

    // Elimina el producto
    const handleDelete = async (productoId) => {
        if (!productoToDelete) return;
        try {
            await axios.delete(`https://8oj4qmf2y4.execute-api.us-east-1.amazonaws.com/productos/eliminar?id_producto=${productoId}`);
            fetchProductos();  // Actualiza la lista después de eliminar
            setShowDeleteModal(false); // Cierra el modal
            setProductoToDelete(null);  // Limpia el producto seleccionado
        } catch (error) {
            console.error('Error al eliminar producto:', error.response?.data || error.message);
        }
    };

    const renderProducto = (item) => (
        <div style={styles.productCard} key={item.id_producto}>
            <h3 style={styles.productName}>{item.nombre}</h3>
            <div style={styles.detailsContainer}>
                <p style={styles.productDetail}>Quilates: {item.quilates}</p>
                <p style={styles.productDetail}>Precio: ${item.precio}</p>
                <p style={styles.productDetail}>Cantidad: {item.cantidad}</p>
            </div>
            <div style={styles.iconContainer}>
                <button onClick={() => handleEdit(item.id_producto)} style={styles.iconButton}>
                    <IoCreateOutline size={24} color="#f5c469" />
                </button>
                <button onClick={() => handleDeleteConfirmation(item.id_producto)} style={styles.iconButton}>
                    <IoTrashOutline size={24} color="#f54848" />
                </button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div style={styles.loader}>
                <span>Loading...</span>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Lista de {nombre}</h1>
    
            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    style={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
    
            <div style={styles.listContainer}>
                {productos.length > 0 ? (
                    filteredProductos.map(renderProducto)
                ) : (
                    <p>No se encontraron productos</p>
                )}
            </div>

            {/* Modal de confirmación */}
            {showDeleteModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3 style={styles.modalTitle}>¿Estás seguro de que deseas eliminar este producto?</h3>
                        <div style={styles.modalButtons}>
                            <button onClick={() => setShowDeleteModal(false)} style={styles.modalButtonNo}>Cancelar</button>
                            <button onClick={handleDelete} style={styles.modalButtonSi}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1e1e1e',
        padding: '16px',
        minHeight: '100vh',
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#f5c469',
        marginBottom: '16px',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '2px',
    },
    searchContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2a2a2a',
        padding: '8px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    },
    searchInput: {
        flex: 1,
        padding: '8px',
        fontSize: '16px',
        color: '#d1a980',
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
    },
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: '16px',
    },
    productCard: {
        backgroundColor: '#3e3e3e',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    },
    productName: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#f5c469',
        marginBottom: '2px',
    },
    detailsContainer: {
        marginTop: '8px',
    },
    productDetail: {
        fontSize: '16px',
        color: '#fff',
    },
    iconContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '12px',
    },
    iconButton: {
        marginLeft: '16px',
        padding: '16px', // Aumenta el padding para mayor espacio alrededor del ícono
        backgroundColor: 'transparent',
        color: '#f5c469', // Color del ícono
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '32px', // Ajusta el tamaño de la fuente para íconos más grandes
    },
    loader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
    },

    // Estilos del modal
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#2a2a2a',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
        width: '300px',
    },
    modalTitle: {
        fontSize: '18px',
        color: '#fff',
        marginBottom: '16px',
    },
    modalButtons: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    modalButtonSi: {
        padding: '8px 16px',
        backgroundColor: '#FF0000',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    modalButtonNo: {
        padding: '8px 16px',
        backgroundColor: '#00FF00',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default ListaProductos;
