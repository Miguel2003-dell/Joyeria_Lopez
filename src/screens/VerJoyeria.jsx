import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useHistory para navegación
import axios from 'axios';

const VerJoyeria = () => {
    const [categorias, setCategorias] = useState([]);
    const [filteredCategorias, setFilteredCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate(); // Use useNavigate

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/categorias');
                setCategorias(response.data);
                setFilteredCategorias(response.data);
            } catch (error) {
                console.error('Error al obtener categorías:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategorias();
    }, []);

    const handleSearch = (text) => {
        setSearchText(text);
        if (text) {
            const filteredData = categorias.filter((item) =>
                item.nombre.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredCategorias(filteredData);
        } else {
            setFilteredCategorias(categorias);
        }
    };

    const renderCategoria = (item) => (
        <button
            style={styles.categoryButton}
            onClick={() =>
                navigate(`/productos/${item.id_categoria}/${item.nombre}`, {
                    state: {
                        id_categoria: item.id_categoria,
                        nombre: item.nombre,
                    },
                })
            }
            aria-label={`Ver productos de la categoría ${item.nombre}`}
        >
            <span style={styles.categoryButtonText}>{item.nombre}</span>
        </button>
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
            <h1 style={styles.title}>Categorías de Joyería</h1>
            <div style={styles.searchContainer}>
                <span style={styles.searchIcon}>🔍</span>
                <input
                    style={styles.searchInput}
                    placeholder="Buscar categoría..."
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            <div style={styles.listContainer}>
                {filteredCategorias.map(renderCategoria)}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
        padding: '16px',
    },
    title: {
        fontSize: '26px',
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: '16px',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    searchContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#707070',
        borderWidth: '1px',
        borderRadius: '10px',
        marginBottom: '20px',
        backgroundColor: '#1e1e1e',
        padding: '5px',
    },
    searchIcon: {
        marginRight: '10px',
    },
    searchInput: {
        flex: 1,
        color: '#d1a980',
        fontSize: '16px',
        padding: '10px',
        border: 'none',
        background: 'transparent',
        outline: 'none',
    },
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        paddingBottom: '16px',
    },
    categoryButton: {
        backgroundColor: '#d4af37',
        borderRadius: '6px',
        padding: '15px',
        marginBottom: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        cursor: 'pointer',
        textAlign: 'center',
        width: '100%',
    },
    categoryButtonText: {
        color: '#1e1e1e',
        fontSize: '16px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    loader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '24px',
    },
};

export default VerJoyeria;
