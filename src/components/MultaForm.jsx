import React from 'react';
import axios from 'axios';

const MultaForm = ({ clienteId, onMultaAdded }) => {
    const handleAddMulta = async () => {
        try {
            const token = localStorage.getItem('token'); // Usar localStorage en la web
            if (!token) {
                console.error('No token found');
                return;
            }

            if (!clienteId) {
                console.error('clienteId is not defined');
                return;
            }

            const fechaActual = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD

            const response = await axios.post(`http://localhost:3000/clientes/${clienteId}/multas`, { fecha: fechaActual }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                console.log('Multa added successfully:', response.data);
                onMultaAdded();
            } else {
                console.error('Error al agregar multa:', response.data);
            }
        } catch (error) {
            console.error('Error en la solicitud de agregar multa:', error);
        }
    };

    return (
        <div style={styles.container}>
            <button style={styles.button} onClick={handleAddMulta}>Agregar Multa</button>
        </div>
    );
};

const styles = {
    container: {
        marginBottom: '20px',
    },
    button: {
        backgroundColor: '#007BFF', // Estilo del botón
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    }
};

export default MultaForm;
