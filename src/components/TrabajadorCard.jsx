import React, { useState } from 'react';
import { Modal, Button, IconButton, Typography, List, ListItem, ListItemText } from '@mui/material'; 
import { Edit, Delete, Download, Work, Group } from '@mui/icons-material';
import axios from 'axios';

const TrabajadorCard = ({ trabajador, onDelete, onEdit }) => {
    const [showClientes, setShowClientes] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [clientes, setClientes] = useState([]); // Estado para almacenar los clientes

    // Función de edición
    const handleEdit = () => {
        // Navega a la página de edición del trabajador
        onEdit(trabajador); // Suponiendo que onEdit maneja la lógica para navegar o abrir el modal
    };

    // Función para abrir el modal de eliminación
    const handleDeleteModalOpen = () => {
        setDeleteModalVisible(true);
    };

    // Función para cerrar el modal de eliminación
    const handleDeleteModalClose = () => {
        setDeleteModalVisible(false);
    };

    // Confirmar eliminación del trabajador
    const confirmDelete = () => {
        axios.delete(`http://localhost:3000/api/trabajadores/eliminar/${trabajador.id_usuario}`)
            .then(() => {
                handleDeleteModalClose();
                onDelete(trabajador.id_usuario); // Llama a la función de eliminación
            })
            .catch(error => {
                const errorMessage = error.response?.data?.message || 'Error desconocido al eliminar el trabajador';
                console.error(errorMessage);
            });
    };

    // Función para exportar los datos de clientes
    const handleExport = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/trabajadores/clientes/${trabajador.id_usuario}`);
            const clientes = response.data.clientes || [];

            if (!Array.isArray(clientes)) {
                throw new Error('La respuesta de la API no es válida');
            }

            const conMonto = clientes.filter(cliente => parseFloat(cliente.monto_actual) > 0);
            const sinMonto = clientes.filter(cliente => parseFloat(cliente.monto_actual) === 0);

            const formatToCSV = (data, title) => {
                const rows = data.map(cliente => `${cliente.id_cliente},${cliente.nombre},${cliente.telefono},${cliente.direccion},${cliente.email},${cliente.monto_actual}`).join('\n');
                return `${title}\nNo.,Nombre completo,direccion,telefono,Correo,Por Pagar\n${rows}`;
            };

            const csvContent = [
                '\ufeff',
                formatToCSV(conMonto, 'Clientes Activos'),
                formatToCSV(sinMonto, 'Clientes Finalizados'),
            ].join('\n\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `clientes_trabajador_${trabajador.nombre}_${trabajador.apellidos}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error al exportar clientes:', error.message || error);
        }
    };

    // Función para mostrar/ocultar los clientes
    const handleShowClientes = async () => {
        if (!showClientes) {
            try {
                const response = await axios.get(`http://localhost:3000/api/trabajadores/clientes/${trabajador.id_usuario}`);
                setClientes(response.data.clientes || []); // Guardamos los clientes obtenidos
            } catch (error) {
                console.error('Error al obtener clientes:', error.message || error);
            }
        }
        setShowClientes(prev => !prev); // Alterna el estado después de hacer la llamada
    };

    return (
        <div className="card">
            <div className="header">
                <Typography variant="h6">{`${trabajador.nombre} ${trabajador.apellidos}`}</Typography>
                <div className="icon-container">
                    <IconButton onClick={handleEdit} color="primary">
                        <Edit />
                    </IconButton>
                    <IconButton onClick={handleDeleteModalOpen} color="error">
                        <Delete />
                    </IconButton>
                    <IconButton onClick={handleExport} color="success">
                        <Download />
                    </IconButton>
                </div>
            </div>
            <div className="row">
                <Work style={{ color: '#f5c469' }} />
                <Typography>{trabajador.rol}</Typography>
            </div>
            <div className="row">
                <Group style={{ color: '#f5c469' }} />
                <Typography>{trabajador.cliente_count} Clientes</Typography>
            </div>
            <Button variant="contained" color="warning" onClick={handleShowClientes}>
                {showClientes ? 'Ocultar clientes' : 'Ver clientes'}
            </Button>

            {showClientes && (
                <div>
                    <Typography variant="h6">Clientes:</Typography>
                    <List>
                        {clientes.map(cliente => (
                            <ListItem key={cliente.id_cliente}>
                                <ListItemText
                                    primary={cliente.nombre}
                                    secondary={`Monto: ${cliente.monto_actual}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </div>
            )}

            <Modal open={isDeleteModalVisible} onClose={handleDeleteModalClose}>
                <div className="modal-content">
                    <Typography variant="h6">Eliminar Trabajador</Typography>
                    <Typography>¿Estás seguro de que deseas eliminar a este trabajador?</Typography>
                    <div className="modal-buttons">
                        <Button variant="outlined" onClick={handleDeleteModalClose}>
                            Cancelar
                        </Button>
                        <Button variant="contained" color="error" onClick={confirmDelete}>
                            Eliminar
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default TrabajadorCard;
