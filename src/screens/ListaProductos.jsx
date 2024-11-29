import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Asegúrate de importar useParams aquí

const ListaProductos = () => {
    const { id_categoria, nombre } = useParams(); // Captura el parámetro id_categoria de la URL
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // Función para obtener productos
    const fetchProductos = useCallback(async () => {
        console.log('Buscando productos para la categoría:', id_categoria); // Imprimir id_categoria
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:3000/api/productos/productoCategoria?id_categoria=${id_categoria}`
            );
            console.log('Respuesta de la API:', response.data); // Verifica la respuesta de la API
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener productos:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    }, [id_categoria]);

    useEffect(() => {
        console.log('id_categoria en useEffect:', id_categoria); // Verificar id_categoria cuando cambia
        if (id_categoria) {
            console.log('Buscando productos para la categoría:', id_categoria); // Solo realiza la búsqueda si id_categoria es válido
            fetchProductos();
        } else {
            console.log('id_categoria no está definido');
        }
    }, [fetchProductos, id_categoria]);

    console.log('Productos:', productos);  // Asegúrate de que `productos` contiene datos

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const filteredProductos = productos.filter((item) =>
        item.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (productoId) => {
        navigate(`/editarProducto/${productoId}`);
    };

    const handleDelete = async (productoId) => {
        try {
            await axios.delete(`http://localhost:3000/api/productos/${productoId}/eliminarProducto`);
            fetchProductos();
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
                    Editar
                </button>
                <button onClick={() => handleDelete(item.id_producto)} style={styles.iconButton}>
                    Eliminar
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
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1e1e1e',
        padding: '16px',
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#f5c469',
        marginBottom: '16px',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    searchContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2a2a2a',
        padding: '8px',
        borderRadius: '8px',
        marginBottom: '20px',
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
        marginBottom: '10px',
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
        justifyContent: 'space-between',
        marginTop: '12px',
    },
    iconButton: {
        backgroundColor: '#f5c469',
        border: 'none',
        padding: '8px 12px',
        fontSize: '16px',
        color: '#1e1e1e',
        cursor: 'pointer',
        borderRadius: '4px',
    },
    loader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '24px',
    },
};

export default ListaProductos;
