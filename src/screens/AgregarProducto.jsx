import React, { useState, useEffect } from 'react';



const AgregarProductoScreen = () => {
    const [categorias, setCategorias] = useState([]);
    const [nombreProducto, setNombreProducto] = useState('');
    const [quilates, setQuilates] = useState('');
    const [precio, setPrecio] = useState('');
    const [idCategoria, setIdCategoria] = useState('');
    const [nombreCategoria, setNombreCategoria] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredCategorias, setFilteredCategorias] = useState([]);
    const [cantidad, setCantidad] = useState('');

    useEffect(() => {
        fetch('http://localhost:3000/api/categorias/')
            .then((response) => response.json())
            .then((data) => {
                setCategorias(data);
                setFilteredCategorias(data);
            })
            .catch((error) => console.error('Error al obtener las categorías:', error));
    }, []);

    const handleAgregarProducto = () => {
        if (!nombreProducto || !quilates || !precio || !idCategoria) {
            alert('Por favor, completa todos los campos del producto.');
            return;
        }

        fetch('http://localhost:3000/api/productos/agregarProducto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: nombreProducto,
                quilates: parseInt(quilates),
                precio: parseFloat(precio),
                id_categoria: parseInt(idCategoria),
                cantidad: parseInt(cantidad),
            }),
        })
            .then((response) => response.json())
            .then(() => {
                alert('Producto agregado exitosamente.');
                setNombreProducto('');
                setQuilates('');
                setPrecio('');
                setIdCategoria('');
                setCantidad('');
            })
            .catch((error) => console.error('Error al agregar el producto:', error));
    };

    const handleAgregarCategoria = () => {
        if (!nombreCategoria) {
            alert('Por favor, ingresa un nombre para la categoría.');
            return;
        }

        fetch('http://localhost:3000/api/categorias/agregarCategoria', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: nombreCategoria }),
        })
            .then((response) => response.json())
            .then((data) => {
                alert('Categoría agregada exitosamente.');
                setCategorias((prevCategorias) => [...prevCategorias, data]);
                setFilteredCategorias((prevCategorias) => [...prevCategorias, data]);
                setNombreCategoria('');
            })
            .catch((error) => console.error('Error al agregar la categoría:', error));
    };

    const handleSearch = (text) => {
        setSearchText(text);
        const filtered = categorias.filter((categoria) =>
            categoria.nombre.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredCategorias(filtered);
    };

    const handleSelectCategoria = (id, nombre) => {
        setIdCategoria(id);
        setSearchText(nombre);
        setModalVisible(false);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Agregar Producto</h1>
            <input
                type="text"
                placeholder="Nombre del producto"
                value={nombreProducto}
                onChange={(e) => setNombreProducto(e.target.value)}
                style={styles.input}
            />
            <input
                type="number"
                placeholder="Quilates"
                value={quilates}
                onChange={(e) => setQuilates(e.target.value)}
                style={styles.input}
            />
            <input
                type="number"
                placeholder="Precio"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                style={styles.input}
            />
            <input
                type="number"
                placeholder="Cantidad"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                style={styles.input}
            />

            <button onClick={() => setModalVisible(true)} style={styles.button}>
                {searchText || 'Selecciona una categoría'}
            </button>

            {modalVisible && (
                <div style={styles.modal}>
                    <input
                        type="text"
                        placeholder="Buscar categoría"
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={styles.input}
                    />
                    <ul style={styles.ul}>
                        {filteredCategorias.map((categoria) => (
                            <li
                                key={categoria.id_categoria}
                                onClick={() => handleSelectCategoria(categoria.id_categoria, categoria.nombre)}
                                style={styles.li}
                            >
                                {categoria.nombre}
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setModalVisible(false)} style={styles.button}>
                        Cerrar
                    </button>
                </div>
            )}

            <button onClick={handleAgregarProducto} style={styles.button}>
                Agregar Producto
            </button>

            <h2 style={styles.header}>Agregar Nueva Categoría</h2>
            <input
                type="text"
                placeholder="Nombre de la categoría"
                value={nombreCategoria}
                onChange={(e) => setNombreCategoria(e.target.value)}
                style={styles.input}
            />
            <button onClick={handleAgregarCategoria} style={styles.button}>
                Agregar Categoría
            </button>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#101010',
        color: '#f5c469',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        textAlign: 'center',
    },
    input: {
        display: 'block',
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#d4af37',
        color: '#000',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        margin: '10px 0',
    },
    buttonHover: {
        backgroundColor: '#b89430',
    },
    modal: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#101010',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px',
    },
    ul: {
        listStyle: 'none',
        padding: '0',
    },
    li: {
        padding: '10px',
        borderBottom: '1px solid #303030',
        cursor: 'pointer',
        color: '#fff',
    },
    liHover: {
        background: '#404040',
    },
};

export default AgregarProductoScreen;
