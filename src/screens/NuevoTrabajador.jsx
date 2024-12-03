import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FloatingLabelInput from '../components/FloatingLabelInput';

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
                "https://8oj4qmf2y4.execute-api.us-east-1.amazonaws.com/trabajadores/agregar",
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
                <FloatingLabelInput
                    label="Nombre"
                    value={nombre}
                    onChangeText={setNombre}
                />
                <FloatingLabelInput
                    label="Apellidos"
                    value={apellidos}
                    onChangeText={setApellidos}
                />
                <FloatingLabelInput
                    label="Correo Electrónico"
                    value={email}
                    onChangeText={setEmail}
                />
                <FloatingLabelInput
                    label="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
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
        backgroundColor: '#121212',
        color: '#f5c469',
        padding: '20px',
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
    inputContainer: {
        marginBottom: 15,
        backgroundColor: '#1a1a1a',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    label: {
        color: '#fff',
        marginLeft: '5px',
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
        backgroundColor: '#1c1c1e',
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        color: '#fff',
        width: '100%',
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
