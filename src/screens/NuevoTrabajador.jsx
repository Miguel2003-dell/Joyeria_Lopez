import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NuevoTrabajador = () => {
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const getToken = async () => {
            const token = localStorage.getItem('token');
            setToken(token);
        };
        getToken();
    }, []);

    const handleAddTrabajador = async () => {
        if (!nombre || !apellidos || !email || !password) {
            alert("Por favor, complete todos los campos");
            return;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Por favor, ingrese un correo electrónico válido");
            return;
        }

        // Validar contraseña (mínimo 6 caracteres)
        if (password.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setIsLoading(true);

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const data = { nombre, apellidos, email, password, role };
            const response = await axios.post(
                "http://localhost:3000/api/trabajadores/agregar",
                data,
                config
            );

            if (response.status === 201) {
                alert("Éxito: Trabajador agregado exitosamente");
                navigate("/admin-dashboard");
            } else {
                alert("Error: Error al agregar el trabajador");
            }
        } catch (error) {
            console.error(
                "Error:",
                error.response ? error.response.data : error.message
            ); // Muestra más detalles en consola
            const errorMessage =
                error.response?.data?.message || "Ocurrió un error desconocido";
            alert("Error: " + errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={{ paddingBottom: 20 }}>
                <h2 style={styles.header}>Agregar Nuevo Trabajador</h2>

                <div style={styles.inputContainer}>
                    <label style={styles.label}>Nombre</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputContainer}>
                    <label style={styles.label}>Apellidos</label>
                    <input
                        type="text"
                        value={apellidos}
                        onChange={(e) => setApellidos(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputContainer}>
                    <label style={styles.label}>Correo Electrónico</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputContainer}>
                    <label style={styles.label}>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputContainer}>
                    <label style={styles.label}>Rol</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={styles.select}
                    >
                        <option value="">Selecciona un rol</option>{" "}
                        {/* Opción vacía para obligar a elegir */}
                        <option value="trabajador">Trabajador</option>
                        <option value="Administrador">Administrador</option>
                    </select>
                </div>

                <div style={styles.buttonContainer}>
                    {isLoading ? (
                        <div style={styles.loader}>Cargando...</div>
                    ) : (
                        <button
                            style={styles.button}
                            onClick={handleAddTrabajador}
                            disabled={isLoading}
                        >
                            {isLoading ? "Cargando..." : "Agregar Trabajador"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#101010',
    },
    header: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#f5c469',
        textAlign: 'center',
        marginBottom: '20px',
    },
    inputContainer: {
        marginBottom: '15px',
    },
    label: {
        color: '#fff',
        marginBottom: '5px',
        display: 'block',
    },
    input: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        borderRadius: '5px',
        border: 'none',
        marginBottom: '10px',
    },
    select: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        borderRadius: '5px',
        border: 'none',
    },
    buttonContainer: {
        marginTop: '20px',
    },
    button: {
        backgroundColor: '#d4af37',
        padding: '12px 30px',
        borderRadius: '10px',
        color: '#000',
        fontWeight: 'bold',
        fontSize: '18px',
        border: 'none',
        cursor: 'pointer',
    },
    loader: {
        textAlign: 'center',
        color: '#fff',
    },
};

export default NuevoTrabajador;
