import React from 'react';
import { useNavigate } from 'react-router-dom';

const EliminarTrabajador = () => {
    const history = useNavigate();

    // Función para manejar la eliminación del trabajador
    const eliminarTrabajador = () => {
        // Lógica para eliminar el trabajador (esto es solo un ejemplo)
        alert('Trabajador eliminado correctamente');
        // Navegar de vuelta a la pantalla anterior después de la eliminación
        history.goBack();
    };

    return (
        <div style={styles.container}>
            <p style={styles.message}>
                ¿Está seguro que desea eliminar este trabajador?
            </p>
            <button style={styles.deleteButton} onClick={eliminarTrabajador}>
                Eliminar Trabajador
            </button>
            <button style={styles.cancelButton} onClick={() => history.goBack()}>
                Cancelar
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#1c1c1e', // Fondo oscuro
        height: '100vh', // Full height
    },
    message: {
        fontSize: '18px',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#fff', // Color de texto
    },
    deleteButton: {
        backgroundColor: '#ff4757', // Color del botón eliminar
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '10px',
        width: '100%', // Full width
        textAlign: 'center', // Center button text
        cursor: 'pointer', // Add a pointer cursor
    },
    deleteButtonText: {
        color: '#fff', // Color del texto del botón
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#ccc', // Color del botón cancelar
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '10px',
        width: '100%', // Full width
        textAlign: 'center', // Center button text
        cursor: 'pointer', // Add a pointer cursor
    },
    cancelButtonText: {
        color: '#000', // Color del texto del botón cancelar
        fontWeight: 'bold',
    },
};


export default EliminarTrabajador;
