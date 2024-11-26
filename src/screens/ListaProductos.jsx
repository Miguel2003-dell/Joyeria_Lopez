import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListaProductos = ({ id_categoria, nombre }) => {
    const [productos, setProductos] = useState([]);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/productos/productoCategoria?id_categoria=${id_categoria}`
                );
                setProductos(response.data);
                setFilteredProductos(response.data);
            } catch (error) {
                console.error('Error al obtener productos:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, [id_categoria]);

    const handleSearch = (query) => {
        setSearchQuery(query);

        if (query.trim() === '') {
            setFilteredProductos(productos);
        } else {
            const filtered = productos.filter((item) =>
                item.nombre.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredProductos(filtered);
        }
    };

    const renderProducto = (producto) => (
        <div className="product-card" key={producto.id_producto}>
            <h3 className="product-name">{producto.nombre}</h3>
            <div className="details-container">
                <p className="product-detail">Quilates: {producto.quilates}</p>
                <p className="product-detail">Precio: ${producto.precio}</p>
                <p className="product-detail">Cantidad: {producto.cantidad}</p>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="loader">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container">
            <h1 className="title">Lista de {nombre}</h1>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            <div className="list-container">
                {filteredProductos.map(renderProducto)}
            </div>
        </div>
    );
};

// Estilos en CSS
const styles = {
    container: {
        backgroundColor: '#1e1e1e',
        padding: '16px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
        borderColor: '#707070',
        borderWidth: '1px',
        borderRadius: '8px',
        marginBottom: '20px',
        backgroundColor: '#2a2a2a',
        padding: '8px',
    },
    searchInput: {
        flex: '1',
        color: '#d1a980',
        fontSize: '16px',
        padding: '8px',
        background: 'none',
        border: 'none',
        outline: 'none',
    },
    listContainer: {
        width: '100%',
        maxWidth: '1200px',
        paddingBottom: '16px',
    },
    productCard: {
        backgroundColor: '#3e3e3e',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.3)',
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
    loader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #ffd700',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
};

export default ListaProductos;
