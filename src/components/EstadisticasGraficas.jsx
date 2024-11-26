import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Para habilitar la configuración automática de Chart.js
import '../styles/EstadisticasGraficas.css'; // Puedes definir estilos adicionales aquí

const EstadisticasGraficas = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [trabajadorEstadisticas, setTrabajadorEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:3000/estadisticas/general', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const trabajadorResponse = await axios.get('http://localhost:3000/estadisticas/trabajadores', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setEstadisticas(response.data);
        setTrabajadorEstadisticas(trabajadorResponse.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchEstadisticas();
  }, []);

  if (loading) {
    return <div className="loading">Cargando estadísticas...</div>;
  }

  if (error) {
    return <div className="error">Error al cargar las estadísticas: {error.message}</div>;
  }

  if (!estadisticas || !trabajadorEstadisticas) {
    return <div>No se pudieron cargar las estadísticas</div>;
  }

  const totalPrestamosActivos = estadisticas.filter(item => item.estado === 'pendiente').length;
  const totalPrestamosCompletados = estadisticas.filter(item => item.estado === 'completado').length;

  const barData = {
    labels: estadisticas.map(item =>
      new Date(item.fecha_inicio).toLocaleDateString('es-ES', { month: 'short' })
    ),
    datasets: [
      {
        label: 'Monto Inicial',
        data: estadisticas.map(item => Number(item.monto_inicial) || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  const pieData = {
    labels: ['Pendiente', 'Completado'],
    datasets: [
      {
        data: [totalPrestamosActivos, totalPrestamosCompletados],
        backgroundColor: ['rgba(131, 167, 234, 1)', '#F00']
      }
    ]
  };

  const lineData = {
    labels: estadisticas.map(item =>
      new Date(item.fecha_inicio).toLocaleDateString('es-ES', { month: 'short' })
    ),
    datasets: [
      {
        label: 'Monto Inicial',
        data: estadisticas.map(item => Number(item.monto_inicial) || 0),
        borderColor: 'rgba(134, 65, 244, 1)',
        fill: false,
        tension: 0.1
      }
    ]
  };

  return (
    <div className="estadisticas-container">
      <h2 className="chart-title">Gráfico de Barras</h2>
      <div className="chart">
        <Bar data={barData} />
      </div>

      <h2 className="chart-title">Gráfico de Pastel</h2>
      <div className="chart">
        <Pie data={pieData} />
      </div>

      <h2 className="chart-title">Gráfico de Tendencia</h2>
      <div className="chart">
        <Line data={lineData} />
      </div>
    </div>
  );
};

export default EstadisticasGraficas;
