import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para navegación en la web
import { Modal, Button } from 'react-bootstrap'; // Usando Bootstrap para modales
import { FaPencilAlt, FaTrash, FaDownload } from 'react-icons/fa'; // Usando react-icons para los íconos
import EditarTrabajador from './EditarTrabajador';
import * as XLSX from 'xlsx';

const TrabajadorCard = ({ trabajador, onDelete }) => {
    const [showClientes, setShowClientes] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate(); // Reemplazamos navigation por useNavigate

    const handleSave = async (updatedWorker) => {
        const token = localStorage.getItem('token'); // Usamos localStorage en lugar de AsyncStorage

        try {
            const response = await fetch(`http://192.168.1.17:3000/trabajadores/${trabajador.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedWorker),
            });

            if (response.ok) {
                setIsEditing(false);
            } else {
                console.error('Error actualizando trabajador:', response.statusText);
            }
        } catch (error) {
            console.error('Error actualizando trabajador:', error);
        }
    };

    const eliminarTrabajador = async () => {
        const token = localStorage.getItem('token'); // Usamos localStorage

        try {
            const response = await fetch(`http://192.168.1.17:3000/trabajadores/${trabajador.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                alert('Trabajador eliminado correctamente');
                setIsDeleting(false);
                if (onDelete) onDelete(trabajador.id);
            } else {
                console.error('Error eliminando trabajador:', response.statusText);
                alert('Error', 'No se pudo eliminar el trabajador');
            }
        } catch (error) {
            console.error('Error eliminando trabajador:', error);
            alert('Error', 'No se pudo eliminar el trabajador');
        }
    };

    const handleDownload = async () => {
        const token = localStorage.getItem('token'); // Usamos localStorage

        try {
            const response = await fetch(`http://192.168.1.67:3000/estadisticas/trabajador/${trabajador.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener estadísticas del trabajador');
            }

            const data = await response.json();
            const formattedData = data.map((cliente, index) => ({
                'No.': index + 1,
                'Nombre cliente': cliente.nombre,
                'Direccion': cliente.direccion,
                'Telefono': cliente.telefono,
                'Monto inicial': cliente.monto_inicial,
                'Esquema de Dias-%': `${cliente.dias_prestamo === 15 ? `15 días $85x1000 30%` : cliente.dias_prestamo === 20 ? `20 días $65x1000 30%` : cliente.esquema_dias}`,
                'Fecha de inicio del prestamo': new Date(cliente.fecha_inicio).toLocaleDateString('es-ES', {
                    day: '2-digit', month: 'long', year: 'numeric'
                }),
                'Fecha de termino': new Date(cliente.fecha_termino).toLocaleDateString('es-ES', {
                    day: '2-digit', month: 'long', year: 'numeric'
                }),
                'Observaciones': cliente.ocupacion
            }));

            const ws = XLSX.utils.json_to_sheet(formattedData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Clientes");
            const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });

            const s2ab = (s) => {
                const buf = new ArrayBuffer(s.length);
                const view = new Uint8Array(buf);
                for (let i = 0; i !== s.length; ++i) {
                    view[i] = s.charCodeAt(i) & 0xFF;
                }
                return buf;
            };

            const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Estadisticas_clientes_Trabajador_${trabajador.nombre}.xlsx`;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exportando clientes:', error);
        }
    };

    return (
        <div style={styles.card}>
            <p style={styles.cardText}>Nombre: {trabajador.nombre}</p>
            <p style={styles.cardText}>Rol: {trabajador.role}</p>
            <p style={styles.cardText}>Total de Clientes: {trabajador.clientes.length}</p>
            <Button
                variant="primary"
                onClick={() => navigate('/trabajador-clientes', { state: { id: trabajador.id } })}
            >
                Ver clientes
            </Button>
            {showClientes && (
                <div style={styles.clientesContainer}>
                    {trabajador.clientes.map(cliente => (
                        <div key={cliente.id} style={styles.clienteCard}>
                            {/* Aquí podrías usar un componente ClienteCard si lo tienes */}
                            <p>{cliente.nombre}</p>
                        </div>
                    ))}
                </div>
            )}
            <div style={styles.iconContainer}>
                <button style={styles.editButton} onClick={() => setIsEditing(true)}>
                    <FaPencilAlt size={20} color="#fff" />
                </button>
                <button style={styles.deleteButton} onClick={() => setIsDeleting(true)}>
                    <FaTrash size={20} color="#fff" />
                </button>
                <button style={styles.downloadButton} onClick={handleDownload}>
                    <FaDownload size={20} color="#fff" />
                </button>
            </div>
            <Modal show={isEditing} onHide={() => setIsEditing(false)} centered>
                <Modal.Body>
                    <EditarTrabajador worker={trabajador} onSave={handleSave} onClose={() => setIsEditing(false)} />
                </Modal.Body>
            </Modal>
            <Modal show={isDeleting} onHide={() => setIsDeleting(false)} centered>
                <Modal.Body>
                    <p style={styles.modalText}>¿Está seguro que desea eliminar este trabajador?</p>
                    <div style={styles.modalButtonContainer}>
                        <Button variant="secondary" onClick={() => setIsDeleting(false)}>Cancelar</Button>
                        <Button variant="danger" onClick={eliminarTrabajador}>Eliminar</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

const styles = {
    card: {
        padding: '20px',
        margin: '10px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        backgroundColor: '#E8E8E8',
        boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
    },
    cardText: {
        fontSize: '16px',
        marginBottom: '10px',
    },
    clientesContainer: {
        marginTop: '10px',
    },
    iconContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '10px',
    },
    editButton: {
        backgroundColor: '#2e5c74',
        padding: '10px',
        borderRadius: '5px',
        border: 'none',
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
        padding: '10px',
        borderRadius: '5px',
        border: 'none',
    },
    downloadButton: {
        backgroundColor: '#3498db',
        padding: '10px',
        borderRadius: '5px',
        border: 'none',
    },
    modalText: {
        fontSize: '16px',
        marginBottom: '10px',
    },
    modalButtonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
};

export default TrabajadorCard;
