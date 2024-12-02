import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import axios from 'axios';

const TrabajadorCard = ({ trabajador, onDelete, onEdit, onViewClientes }) => {
  const [showClientes, setShowClientes] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const navigate = useNavigate(); // Inicializar navigate


  const handlePress = () => {
    setShowClientes(!showClientes);
    if (!showClientes && onViewClientes) {
      onViewClientes(trabajador.id_usuario);
    }
  };

  const handleEdit = () => {
    console.log('ID del trabajador a editar:', trabajador.id_usuario);
    navigate(`/editar-trabajador/${trabajador.id_usuario}`);
  };


  const handleDeleteModalOpen = () => {
    setDeleteModalVisible(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalVisible(false);
  };

  const confirmDelete = () => {
    axios
      .delete(`http://localhost:3000/api/trabajadores/eliminar/${trabajador.id_usuario}`)
      .then(() => {
        handleDeleteModalClose();
        if (onDelete) onDelete(trabajador.id_usuario);
      })
      .catch((error) => {
        console.error('Error al eliminar el trabajador:', error.message);
      });
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/trabajadores/clientes/${trabajador.id_usuario}`);
      const clientes = response.data.clientes || [];
      const csvContent = clientes
        .map(
          (cliente) =>
            `${cliente.id_cliente},${cliente.nombre},${cliente.telefono},${cliente.direccion},${cliente.email},${cliente.monto_actual}`
        )
        .join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `clientes_trabajador_${trabajador.nombre}_${trabajador.apellidos}.csv`;
      link.click();
    } catch (error) {
      console.error('Error al exportar clientes:', error.message);
    }
  };

  return (
      <div style={styles.card}>
          <div style={styles.header}>
              <h3 style={styles.cardName}>
                  {trabajador.nombre} {trabajador.apellidos}
              </h3>
              <div style={styles.iconContainer}>
                  <button
                      style={styles.iconButton}
                      onClick= {handleEdit}
                  >
                      ✏️
                  </button>

                  <button
                      style={styles.iconButton}
                      onClick={handleDeleteModalOpen}
                  >
                      🗑️
                  </button>
                  <button style={styles.iconButton} onClick={handleExport}>
                      📥
                  </button>
              </div>
          </div>
          <div style={styles.row}>
              <span>👜</span>
              <p style={styles.cardText}>{trabajador.rol}</p>
          </div>
          <div style={styles.row}>
              <span>👥</span>
              <p style={styles.cardText}>{trabajador.cliente_count} Clientes</p>
          </div>
          <button onClick={handlePress} style={styles.detailsButton}>
              Ver clientes
          </button>

          {isDeleteModalVisible && (
              <div style={styles.modalContainer}>
                  <div style={styles.modalContent}>
                      <h4 style={styles.modalTitle}>Eliminar Trabajador</h4>
                      <p style={styles.modalText}>
                          ¿Estás seguro de que deseas eliminar a este
                          trabajador?
                      </p>
                      <div style={styles.modalButtons}>
                          <button
                              style={styles.modalButtonCancel}
                              onClick={handleDeleteModalClose}
                          >
                              Cancelar
                          </button>
                          <button
                              style={styles.modalButtonDelete}
                              onClick={confirmDelete}
                          >
                              Eliminar
                          </button>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '20px',
    margin: '10px 0',
    color: '#fff',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    display: 'flex',
    gap: '10px',
  },
  iconButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#4a90e2',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    margin: '10px 0',
  },
  cardName: {
    color: '#f5c469',
  },
  cardText: {
    marginLeft: '8px',
  },
  detailsButton: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#d4af37',
    borderRadius: '8px',
    border: 'none',
    color: '#000',
    cursor: 'pointer',
  },
  modalContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#333',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center',
    color: '#fff',
  },
  modalTitle: {
    color: '#f5c469',
  },
  modalButtons: {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'space-around',
  },
  modalButtonCancel: {
    backgroundColor: '#888',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  modalButtonDelete: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default TrabajadorCard;
