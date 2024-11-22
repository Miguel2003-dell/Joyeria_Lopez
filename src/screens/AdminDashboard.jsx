import React, { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TrabajadorCard from '../components/TrabajadorCard';

const AdminDashboard = () => {
    const [trabajadores, setTrabajadores] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredTrabajadores, setFilteredTrabajadores] = useState([]);
    const navigate  = useNavigate(); // Hook de navegación

    const fetchTrabajadores = async () => {
        try {
            const token = localStorage.getItem('token'); // Usamos localStorage para la web
            if (!token) {
                throw new Error('Token no encontrado');
            }

            const response = await axios.get('http://localhost:3000/trabajadores', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTrabajadores(response.data);
            setFilteredTrabajadores(response.data);
        } catch (error) {
            console.error('Error al obtener trabajadores:', error);
        }
    };

    useEffect(() => {
        fetchTrabajadores();
        const interval = setInterval(fetchTrabajadores, 5000); // Polling cada 5 segundos
        return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/ruta'); // Redirigir a la página de login
    };

    const handleSearch = (text) => {
        setSearchText(text);
        if (text === '') {
            setFilteredTrabajadores(trabajadores);
        } else {
            const filtered = trabajadores.filter(trabajador =>
                trabajador.nombre.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredTrabajadores(filtered);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Lista de trabajadores</h1>
            <input
                type="text"
                style={styles.searchInput}
                placeholder="Buscar por nombre"
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
            />
            <ul style={styles.list}>
                {filteredTrabajadores.map((item) => (
                    <TrabajadorCard key={item.id} trabajador={item} />
                ))}
            </ul>
            <button style={styles.logoutButton} onClick={handleLogout}>
                Cerrar sesión
            </button>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#1c1c1e', // Fondo oscuro
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: '20px',
    },
    searchInput: {
        height: '40px',
        borderColor: '#ccc',
        borderWidth: '1px',
        borderRadius: '5px',
        marginBottom: '20px',
        padding: '0 10px',
        backgroundColor: '#fff', // Fondo de entrada
        color: '#000', // Color de texto
        width: '300px',
    },
    logoutButton: {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#2e5c74', // Color de fondo
        borderRadius: '5px',
        color: '#fff',
        fontWeight: 'bold',
        border: 'none',
        cursor: 'pointer',
    },
    list: {
        listStyleType: 'none',
        padding: 0,
    },
};

export default AdminDashboard;
