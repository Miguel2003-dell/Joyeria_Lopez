import React, { useState, useEffect } from 'react';
import "../styles/AgregarProductoScreen.css"

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
        <div className="container">
            <h1>Agregar Producto</h1>
            <input
                type="text"
                placeholder="Nombre del producto"
                value={nombreProducto}
                onChange={(e) => setNombreProducto(e.target.value)}
            />
            <input
                type="number"
                placeholder="Quilates"
                value={quilates}
                onChange={(e) => setQuilates(e.target.value)}
            />
            <input
                type="number"
                placeholder="Precio"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
            />
            <input
                type="number"
                placeholder="Cantidad"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
            />

            <button onClick={() => setModalVisible(true)}>
                {searchText || 'Selecciona una categoría'}
            </button>

            {modalVisible && (
                <div className="modal">
                    <input
                        type="text"
                        placeholder="Buscar categoría"
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <ul>
                        {filteredCategorias.map((categoria) => (
                            <li
                                key={categoria.id_categoria}
                                onClick={() => handleSelectCategoria(categoria.id_categoria, categoria.nombre)}
                            >
                                {categoria.nombre}
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setModalVisible(false)}>Cerrar</button>
                </div>
            )}

            <button onClick={handleAgregarProducto}>Agregar Producto</button>

            <h2>Agregar Nueva Categoría</h2>
            <input
                type="text"
                placeholder="Nombre de la categoría"
                value={nombreCategoria}
                onChange={(e) => setNombreCategoria(e.target.value)}
            />
            <button onClick={handleAgregarCategoria}>Agregar Categoría</button>
        </div>
    );
};

export default AgregarProductoScreen;
