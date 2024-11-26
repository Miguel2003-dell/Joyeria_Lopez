import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VerJoyeria = () => {
    const [categorias, setCategorias] = useState([]);
    const [filteredCategorias, setFilteredCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');

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

    const renderCategoria = (categoria) => (
        <div className="category-button" key={categoria.id_categoria}>
            <button className="category-button-text" onClick={() => window.location.href = `/productos/${categoria.id_categoria}`}>
                {categoria.nombre}
            </button>
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
            <h1 className="title">Categorías de Joyería</h1>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Buscar categoría..."
                    className="search-input"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            <div className="list-container">
                {filteredCategorias.map(renderCategoria)}
            </div>
        </div>
    );
};

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
        fontSize: '26px',
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: '16px',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    searchContainer: {
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #707070',
        borderRadius: '10px',
        marginBottom: '20px',
        backgroundColor: '#1e1e1e',
        padding: '10px',
    },
    searchInput: {
        flex: 1,
        color: '#d1a980',
        fontSize: '16px',
        padding: '10px',
        background: 'none',
        border: 'none',
        outline: 'none',
    },
    listContainer: {
        width: '100%',
        maxWidth: '1200px',
        paddingBottom: '16px',
    },
    categoryButton: {
        backgroundColor: '#d4af37',
        borderRadius: '6px',
        padding: '15px',
        marginBottom: '12px',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.3)',
    },
    categoryButtonText: {
        color: '#1e1e1e',
        fontSize: '16px',
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
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

export default VerJoyeria;
