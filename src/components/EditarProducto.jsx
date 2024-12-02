import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditarProducto = ({ onGoBack }) => {
    const { id_producto } = useParams(); // Aquí recibimos el id_producto de la URL
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducto = async () => {
            if (id_producto) {
                try {
                    const response = await axios.get(`http://localhost:3000/api/productos/${id_producto}`);
                    setProducto(response.data);
                } catch (error) {
                    console.error('Error al obtener el producto:', error.response?.data || error.message);
                } finally {
                    setLoading(false);
                }
            } else {
                console.error('No se proporcionó un ID de producto');
            }
        };

        fetchProducto();
    }, [id_producto]);


    const handleSave = async () => {
        if (!id_producto) {
            alert("ID de producto no válido");
            return;
        }

        try {
            console.log("ID Producto:", id_producto); // Añade esto antes de la solicitud PUT
            await axios.put(
                `http://localhost:3000/api/productos/${id_producto}`,
                producto
            );
            alert("Producto actualizado con éxito");
            if (onGoBack) onGoBack(); // Llamar al callback para actualizar la lista
            navigate(`/productos/${producto.id_categoria}/${producto.nombre}`); // Regresa a la lista de productos con los parámetros necesarios
        } catch (error) {
            console.error(
                "Error al actualizar el producto:",
                error.response?.data || error.message
            );
            alert("Hubo un error al actualizar el producto");
        }
    };

    if (loading) {
        return (
            <div style={styles.loader}>
                <p style={styles.loaderText}>Cargando...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Editar Producto</h1>
            <input
                style={styles.input}
                placeholder="Nombre"
                value={producto.nombre}
                onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
            />
            <input
                style={styles.input}
                placeholder="Quilates"
                value={producto.quilates?.toString()}
                type="number"
                onChange={(e) => setProducto({ ...producto, quilates: e.target.value })}
            />
            <input
                style={styles.input}
                placeholder="Precio"
                value={producto.precio?.toString()}
                type="number"
                onChange={(e) => setProducto({ ...producto, precio: e.target.value })}
            />
            <input
                style={styles.input}
                placeholder="Cantidad"
                value={producto.cantidad?.toString()}
                type="number"
                onChange={(e) => setProducto({ ...producto, cantidad: e.target.value })}
            />
            <button style={styles.saveButton} onClick={handleSave}>
                Guardar
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: '#1e1e1e',
        minHeight: '100vh',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#f5c469',
        marginBottom: '16px',
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#3e3e3e',
        borderRadius: '8px',
        color: '#fff',
        padding: '12px',
        fontSize: '16px',
        marginBottom: '12px',
        width: '100%',
        maxWidth: '400px',
    },
    saveButton: {
        backgroundColor: '#f5c469',
        padding: '16px',
        borderRadius: '8px',
        color: '#1e1e1e',
        fontWeight: 'bold',
        fontSize: '16px',
        border: 'none',
        cursor: 'pointer',
    },
    loader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    loaderText: {
        color: '#fff',
        fontSize: '18px',
    },
};

export default EditarProducto;
