import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FloatingLabelInput from '../components/FloatingLabelInput'; // Importa el componente reutilizable

const NuevoTrabajador = () => {
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const token = localStorage.getItem('token');

    const handleAddTrabajador = async () => {
        if (!nombre || !apellidos || !email || !password) {
            alert("Por favor, complete todos los campos");
            return;
        }
        setIsLoading(true);

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const data = { nombre, apellidos, email, password, role };
            const response = await axios.post('http://localhost:3000/api/trabajadores/agregar', data, config);

            if (response.status === 201) {
                alert('Trabajador agregado exitosamente');
                // Redireccionar a la página anterior
                window.history.back();
            } else {
                alert('Error al agregar el trabajador');
            }
        } catch (error) {
            const errorMessage = error.response?.status === 400 ? 'Correo ya registrado' : 'Ocurrió un error';
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Agregar Nuevo Trabajador</h1>

            <FloatingLabelInput
                label="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
            />
            <FloatingLabelInput
                label="Apellidos"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
            />
            <FloatingLabelInput
                label="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <FloatingLabelInput
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <div style={styles.pickerContainer}>
                <label htmlFor="role" style={styles.pickerLabel}>Rol</label>
                <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={styles.picker}
                >
                    <option value="">Seleccionar</option>
                    <option value="trabajador">Trabajador</option>
                    <option value="Administrador">Administrador</option>
                </select>
            </div>

            <div style={styles.buttonContainer}>
                {isLoading ? (
                    <div style={styles.loader}>Cargando...</div>
                ) : (
                    <button style={styles.button} onClick={handleAddTrabajador}>
                        Agregar Trabajador
                    </button>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#101010',
        borderRadius: '8px',
        color: '#fff',
    },
    header: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#f5c469',
        textAlign: 'center',
        marginBottom: '20px',
    },
    pickerContainer: {
        marginBottom: '15px',
    },
    pickerLabel: {
        display: 'block',
        marginBottom: '5px',
    },
    picker: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    buttonContainer: {
        marginTop: '20px',
    },
    button: {
        backgroundColor: '#d4af37',
        color: '#000',
        fontWeight: 'bold',
        fontSize: '16px',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    loader: {
        color: '#d4af37',
        textAlign: 'center',
    },
};

export default NuevoTrabajador;
