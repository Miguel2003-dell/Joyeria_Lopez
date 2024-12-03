import React, { useState } from 'react';
import axios from 'axios';

const AbonoForm = ({ clienteId, onAddAbono }) => {
    const [monto, setMonto] = useState('');
    const [loading, setLoading] = useState(false);
    const [fechaProximoPago, setFechaProximoPago] = useState(null);

    const handleAddAbono = async () => {
        if (loading) return;

        const parsedMonto = parseFloat(monto);
        if (isNaN(parsedMonto) || parsedMonto <= 0) {
            alert('Error: Por favor ingresa un monto válido.');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                setLoading(false);
                return;
            }

            const fecha = new Date().toISOString().split('T')[0];
            const response = await axios.post(`https://8oj4qmf2y4.execute-api.us-east-1.amazonaws.com/clientes/agregarabonos?id_cliente=${clienteId}`, 
                { monto: parsedMonto, fecha }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 201) {
                console.log('Abono added successfully:', response.data);
                setFechaProximoPago(response.data.fecha_proximo_pago);
                onAddAbono(response.data.fecha_proximo_pago);
            }
        } catch (error) {
            console.error('Error en la solicitud de agregar abono:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <label style={styles.label}>Agregar Monto</label>
            <input
                style={styles.input}
                value={monto}
                placeholder="Ingrese el monto..."
                onChange={(e) => setMonto(e.target.value.replace(/[^0-9.]/g, ''))}
                type="number"
            />
            <button
                style={{ ...styles.buttonadd, ...(loading ? styles.buttonDisabled : {}) }}
                onClick={handleAddAbono}
                disabled={loading}
            >
                {loading ? 'Cargando...' : 'Abonar'}
            </button>
            {fechaProximoPago && (
                <p style={{ marginTop: 10, color: '#d4af37' }}>Próximo pago: {fechaProximoPago}</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#0d0d0d',
        borderRadius: '15px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        marginBottom: '20px',
    },
    label: {
        fontSize: '17px',
        fontWeight: '600',
        marginBottom: '12px',
        color: '#fff',
    },
    input: {
        height: '45px',
        width: '96.3%',
        border: '1px solid #d1a980',
        borderRadius: '10px',
        backgroundColor: '#1a1a1a',
        padding: '0 15px',
        color: '#d1a980',
        marginBottom: '15px',
    },
    buttonadd: {
        backgroundColor: '#d4af37',
        borderRadius: '10px',
        padding: '10px',
        color: '#0d0d0d',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        textAlign: 'center',
        border: 'none',
        width: '100%',
    },
    buttonDisabled: {
        backgroundColor: '#b8944f',
        cursor: 'not-allowed',
    }
};

export default AbonoForm;
