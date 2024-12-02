import React, { useState, useLayoutEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TrabajadorCard from '../components/TrabajadorCard';

const AdminDashboard = () => {
    const [trabajadores, setTrabajadores] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredTrabajadores, setFilteredTrabajadores] = useState([]);
    const navigate = useNavigate();

    const fetchTrabajadores = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await axios.get('http://localhost:3000/api/trabajadores/conteo', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (Array.isArray(response.data)) {
                    setTrabajadores(response.data);
                    setFilteredTrabajadores(response.data);
                } else {
                    console.error("Los datos devueltos no son un array:", response.data);
                    setTrabajadores([]);
                    setFilteredTrabajadores([]);
                }
            }
        } catch (error) {
            console.error('Error al obtener trabajadores:', error);
        }
    };

    useLayoutEffect(() => {
        fetchTrabajadores();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
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

    const handleEditTrabajador = (updatedTrabajador) => {
        setTrabajadores((prevTrabajadores) =>
            prevTrabajadores.map((trabajador) =>
                trabajador.id_usuario === updatedTrabajador.id_usuario ? updatedTrabajador : trabajador
            )
        );
    };

    const handleDeleteTrabajador = (id) => {
        setTrabajadores(trabajadores.filter(trabajador => trabajador.id_usuario !== id));
        setFilteredTrabajadores(filteredTrabajadores.filter(trabajador => trabajador.id_usuario !== id));
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Lista de trabajadores</h1>
            </div>
            <div style={styles.searchContainer}>
                <i className="fas fa-search" style={styles.searchIcon}></i>
                <input
                    style={styles.searchInput}
                    type="text"
                    placeholder="Buscar por nombre"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            <div style={styles.listContent}>
                {filteredTrabajadores.map((trabajador) => (
                    <TrabajadorCard
                        key={trabajador.id_usuario}
                        trabajador={trabajador}
                        onDelete={handleDeleteTrabajador}
                        onEdit={handleEditTrabajador}
                    />
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        backgroundColor: '#121212',
        minHeight: '100vh',
    },
    header: {
        fontSize: '26px',
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: '16px',
        textAlign: 'center',
        textTransform: 'uppercase',
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
        backgroundColor: '#1e1e1e',
        borderColor: '#707070',
        borderWidth: '1px',
        borderRadius: '10px',
        marginBottom: '20px',
        padding: '12px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
    },
    searchIcon: {
        marginRight: '8px',
        color: '#d1a980',
    },
    searchInput: {
        flex: 1,
        height: '45px',
        color: '#d1a980',
        fontSize: '16px',
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none',
    },
    listContent: {
        paddingBottom: '20px',
    },
    logoutButton: {
        padding: '5px 10px',
        backgroundColor: '#2e2e2e',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
        border: 'none',
        cursor: 'pointer',
    },
};

export default AdminDashboard;
