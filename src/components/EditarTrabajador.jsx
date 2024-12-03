import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditarTrabajador = () => {
    const { id } = useParams(); // Usamos useParams para obtener el id de la URL
    const navigate = useNavigate(); // Usamos useNavigate para redirigir
    const [trabajador, setTrabajador] = useState(null);
    const [editedTrabajador, setEditedTrabajador] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        rol: ''
    });
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(true);

    // Cargar trabajador al montar el componente
    useEffect(() => {
        const fetchTrabajador = async () => {
            if (id) {
                console.log('ID del trabajador:', id); // Verifica el id aquí
                try {
                    const response = await axios.get(`https://8oj4qmf2y4.execute-api.us-east-1.amazonaws.com/trabajadores/editar?id=${trabajador.id_usuario}`);
                    setTrabajador(response.data);
                    setEditedTrabajador({
                        nombre: response.data.nombre || '',
                        apellidos: response.data.apellidos || '',
                        email: response.data.email || '',
                        password: '', // Mantén el campo password vacío por seguridad
                        rol: response.data.rol || '',
                    });
                    setRole(response.data.rol || '');
                } catch (error) {
                    console.error('Error al obtener el trabajador:', error.response?.data || error.message);
                } finally {
                    setLoading(false);
                }
            } else {
                console.error('No se proporcionó un ID de trabajador');
            }
        };
    
        fetchTrabajador();
    }, [id]);
    

    const handleSaveChanges = () => {
        if (!editedTrabajador.nombre || !editedTrabajador.apellidos || !editedTrabajador.email || !editedTrabajador.password) {
            alert("Por favor, completa todos los campos.");
            return;
        }


        axios.put(`http://localhost:3000/api/trabajadores/editar/${id}`, {
            ...editedTrabajador,
            rol: role
        })
            .then(response => {
                if (response.status === 200) {
                    alert("Éxito", "Trabajador actualizado correctamente");
                    navigate("/admin-dashboard"); // Redirigimos a la lista de trabajadores
                }
            })
            .catch(error => {
                const errorMessage = error.response?.data?.message || 'Error desconocido al actualizar el trabajador';
                alert("Error", errorMessage);
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <input
                type="text"
                style={styles.input}
                placeholder="Nombre"
                value={editedTrabajador?.nombre || ``}
                onChange={(e) => setEditedTrabajador({ ...editedTrabajador, nombre: e.target.value })}
            />
            <input
                type="text"
                style={styles.input}
                placeholder="Apellidos"
                value={editedTrabajador?.apellidos}
                onChange={(e) => setEditedTrabajador({ ...editedTrabajador, apellidos: e.target.value })}
            />
            <input
                type="email"
                style={styles.input}
                placeholder="Correo Electrónico"
                value={editedTrabajador?.email}
                onChange={(e) => setEditedTrabajador({ ...editedTrabajador, email: e.target.value })}
            />
            <input
                type="password"
                style={styles.input}
                placeholder="Contraseña"
                value={editedTrabajador?.password}
                onChange={(e) => setEditedTrabajador({ ...editedTrabajador, password: e.target.value })}
            />
            
            <select
                style={styles.select}
                value={role}
                onChange={(e) => setRole(e.target.value)}
            >
                <option value="Administrador">Administrador</option>
                <option value="Trabajador">Trabajador</option>
            </select>

            <button style={styles.saveButton} onClick={handleSaveChanges}>
                Guardar Cambios
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
        backgroundColor: '#101010',
        minHeight: '100vh',
    },
    input: {
        backgroundColor: '#1c1c1e',
        borderRadius: '10px',
        padding: '12px',
        marginBottom: '15px',
        color: '#fff',
        width: '100%',
        maxWidth: '400px',
    },
    select: {
        backgroundColor: '#1c1c1e',
        borderRadius: '10px',
        padding: '12px',
        marginBottom: '15px',
        color: '#fff',
        width: '100%',
        maxWidth: '400px',
    },
    saveButton: {
        backgroundColor: '#d4af37',
        padding: '12px',
        borderRadius: '10px',
        color: '#000',
        fontWeight: 'bold',
        fontSize: '18px',
        cursor: 'pointer',
    },
};

export default EditarTrabajador;

