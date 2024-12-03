import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';

const EditarClientes = ({ cliente, refreshClientes }) => {
    const [nombre, setNombre] = useState(cliente?.nombre || '');
    const [direccion, setDireccion] = useState(cliente?.direccion || '');
    const [telefono, setTelefono] = useState(cliente?.telefono || '');
    const [quilates, setQuilates] = useState(cliente?.quilates?.toString() || '0');
    const [precioTotal, setPrecioTotal] = useState(cliente?.precio_total?.toString() || '0');
    const [formaPago, setFormaPago] = useState(cliente?.forma_pago || '');
    const [montoActual, setMontoActual] = useState(cliente?.monto_actual?.toString() || '0');
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateCliente = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Error: no se encontró el token de autenticación');
                return;
            }

            const response = await axios.put(`https://8oj4qmf2y4.execute-api.us-east-1.amazonaws.com/clientes/editar?id_cliente=${cliente.id_cliente}`, {
                nombre,
                direccion,
                telefono,
                quilates: parseFloat(quilates),
                precio_total: parseFloat(precioTotal),
                forma_pago: formaPago,
                monto_actual: parseFloat(montoActual)
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                alert('Cliente actualizado con éxito');
                if (refreshClientes) refreshClientes();
            } else {
                alert(response.data.error || 'Error al actualizar el cliente');
            }
        } catch (error) {
            console.error('Error al actualizar el cliente:', error);
            alert(`Error al actualizar el cliente: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const formaPagoOptions = [
        { label: 'Diario', value: 'Diario' },
        { label: 'Semanal', value: 'Semanal' },
    ];

    return cliente ? (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <label style={styles.label}>Nombre del Cliente:</label>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    style={styles.input}
                    placeholder="Nombre"
                />

                <label style={styles.label}>Dirección del Cliente:</label>
                <input
                    type="text"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    style={styles.input}
                    placeholder="Dirección"
                />

                <label style={styles.label}>Teléfono del Cliente:</label>
                <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    style={styles.input}
                    placeholder="Teléfono"
                />

                <label style={styles.label}>Precio Total del Producto:</label>
                <input
                    type="number"
                    value={precioTotal}
                    onChange={(e) => setPrecioTotal(e.target.value)}
                    style={styles.input}
                    placeholder="Precio Total"
                />

                <label style={styles.label}>Forma de Pago:</label>
                <Select
                    value={formaPagoOptions.find(option => option.value === formaPago)}
                    onChange={(selectedOption) => setFormaPago(selectedOption.value)}
                    options={formaPagoOptions}
                    placeholder="Selecciona una opción"
                    styles={dropdownStyles}
                />

                <label style={styles.label}>Monto Actual a Pagar:</label>
                <input
                    type="number"
                    value={montoActual}
                    onChange={(e) => setMontoActual(e.target.value)}
                    style={styles.input}
                    placeholder="Monto Actual"
                />

                <button
                    onClick={handleUpdateCliente}
                    style={styles.saveButton}
                    disabled={isLoading}
                >
                    {isLoading ? 'Actualizando...' : 'Actualizar Cliente'}
                </button>
            </div>
        </div>
    ) : (
        <p style={styles.loadingText}>Cargando cliente...</p>
    );
};

// Estilos en formato JavaScript para la web
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#101010',
    },
    formContainer: {
        backgroundColor: '#1c1c1e',
        borderRadius: '12px',
        padding: '20px',
        width: '100%',
        maxWidth: '500px',
    },
    label: {
        fontSize: '16px',
        color: '#f5c469',
        marginBottom: '8px',
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#2e2e2e',
        borderRadius: '12px',
        padding: '12px',
        marginBottom: '20px',
        color: '#fff',
        fontSize: '14px',
        width: '100%',
    },
    saveButton: {
        backgroundColor: '#d4af37',
        padding: '14px',
        borderRadius: '12px',
        color: '#000',
        fontWeight: 'bold',
        fontSize: '18px',
        width: '100%',
        cursor: 'pointer',
    },
    loadingText: {
        fontSize: '18px',
        color: '#f5c469',
        textAlign: 'center',
        marginTop: '20px',
    },
};

const dropdownStyles = {
    control: (base) => ({
        ...base,
        backgroundColor: '#2e2e2e',
        borderRadius: '12px',
        color: '#fff',
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: '#2e2e2e',
        borderRadius: '12px',
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected ? '#d4af37' : base.backgroundColor,
        color: '#fff',
    }),
};

export default EditarClientes;
