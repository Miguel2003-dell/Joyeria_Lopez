import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EstadisticasScreen = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEstadisticas = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get('http://localhost:3000/estadisticas/general', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Datos recibidos:', response.data);
      setEstadisticas(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstadisticas();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loader">Cargando...</div>
      </div>
    );
  }

  const totalClientes = estadisticas ? estadisticas.length : 0;
  const totalPrestamosActivos = estadisticas ? estadisticas.filter(item => item.estado === 'pendiente').length : 0;
  const totalPrestamosCompletados = estadisticas ? estadisticas.filter(item => item.estado === 'completado').length : 0;

  return (
    <div className="container">
      <h1 className="title">Estadísticas Generales</h1>
      <div className="card">
        <h2 className="card-title">Total Clientes</h2>
        <p className="card-value">{totalClientes}</p>
      </div>
      <div className="card">
        <h2 className="card-title">Total clientes completados</h2>
        <p className="card-value">{totalPrestamosCompletados}</p>
      </div>
      <div className="card">
        <h2 className="card-title">Total clientes pendientes</h2>
        <p className="card-value">{totalPrestamosActivos}</p>
      </div>
      <div className="button-container">
        <button className="button" onClick={() => alert('Ir a estadísticas de tablas')}>
          <img src="/assets/table_icon.png" alt="Tabla" className="icon" />
        </button>
        <button className="button" onClick={() => alert('Ir a estadísticas gráficas')}>
          <img src="/assets/chart_icon.png" alt="Gráfica" className="icon" />
        </button>
      </div>
    </div>
  );
};

export default EstadisticasScreen;
