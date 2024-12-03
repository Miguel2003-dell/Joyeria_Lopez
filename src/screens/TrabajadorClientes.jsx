import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ClienteCard from '../components/ClienteCard';
import { useNavigate, useParams } from 'react-router-dom';


const TrabajadorClientes = () => {
  const { id } = useParams();
  const [clientes, setClientes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [trabajadorNombre, setTrabajadorNombre] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('conPagoHoy'); // Estado para las pestañas activas

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(`https://8oj4qmf2y4.execute-api.us-east-1.amazonaws.com/clientes/clientetrabajador?id_trabajador=${id}`);
        console.log(response.data);
        const clientesPendientes = response.data.sort(
          (a, b) => new Date(a.fecha_proximo_pago) - new Date(b.fecha_proximo_pago)
        );
        setClientes(clientesPendientes);
        setFilteredClientes(clientesPendientes);
  
        if (response.data.length > 0) {
          setTrabajadorNombre(response.data[0].nombre_trabajador);
        }
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchClientes();
  }, [id]);
  
  if (loading) {
    return <div>Cargando clientes...</div>;
  }
  

  const today = new Date().toISOString().split('T')[0];

  const handleEdit = (clienteId) => {
    navigate(`/editar-clientes/${clienteId}`);
  };
  


  const handleDelete = async (clienteId) => {
    try {
      const response = await axios.delete(`https://8oj4qmf2y4.execute-api.us-east-1.amazonaws.com/clientes/eliminar?id_cliente=${clienteId}`);
      if (response.status === 200) {
        setClientes((prevClientes) =>
          prevClientes.filter((cliente) => cliente.id_cliente !== clienteId)
        );
        alert('Cliente eliminado correctamente');
      } else {
        alert('Error al eliminar el cliente');
      }
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
      alert('Error al eliminar el cliente');
    }
  };

  const renderClienteList = (clientes) => (
    <div>
      {clientes.length > 0 ? (
        clientes.map((cliente) => {
          console.log(cliente); // Verifica que cliente tenga datos
          return (
            <ClienteCard
              key={cliente.id_cliente}
              cliente={cliente}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onExport={handleEdit}
              onClick={(e) => {
                e.preventDefault(); // Si es necesario, evita el comportamiento predeterminado
                navigate(`/detalles-cliente/${cliente.id_cliente}`);
              }}
              isAdmin={true}
            />
          );
        })
      ) : (
        <p style={{ textAlign: 'center', color: '#fff' }}>No hay clientes disponibles.</p>
      )}
    </div>
  );
  
  

  const getActiveClientes = () => {
    let clientesFiltradosPorEstado;
  
    switch (activeTab) {
        case 'atrasados':
          clientesFiltradosPorEstado = clientes.filter((cliente) => {
            const proximoPago = cliente.fecha_proximo_pago.split('T')[0];
            return proximoPago < today && parseFloat(cliente.monto_actual) > 0;
          });
          break;
        case 'conPagoHoy':
          clientesFiltradosPorEstado = clientes.filter((cliente) => {
            const proximoPago = cliente.fecha_proximo_pago.split('T')[0];
            return proximoPago === today && parseFloat(cliente.monto_actual) > 0;
          });
          break;
        case 'sinPagoHoy':
          clientesFiltradosPorEstado = clientes.filter((cliente) => {
            const proximoPago = cliente.fecha_proximo_pago.split('T')[0];
            return proximoPago !== today && parseFloat(cliente.monto_actual) > 0;
          });
          break;
        case 'finalizados':
          clientesFiltradosPorEstado = clientes.filter((cliente) => parseFloat(cliente.monto_actual) === 0);
          break;
        default:
          clientesFiltradosPorEstado = [];
    }
  
    return clientesFiltradosPorEstado.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(searchText.toLowerCase())
    );
  };
  
  

  return (
      <div
          style={{ padding: "20px", backgroundColor: "#121212", color: "#fff" }}
      >
          <h1 style={{ color: "#f5c469" }}>Clientes de {trabajadorNombre}</h1>
          <div
              style={{
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
              }}
          >
              <input
                  type="text"
                  placeholder="Buscar clientes"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #707070",
                      backgroundColor: "#1e1e1e",
                      color: "#d1a980",
                  }}
              />
          </div>
          <div
              style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginBottom: "20px",
              }}
          >
              <button
                  onClick={() => setActiveTab("atrasados")}
                  style={{
                      color: "#fff",
                      backgroundColor: "#d4a74a",
                      border: "none",
                      padding: "10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontWeight: "bold",
                  }}
              >
                  Atrasados
              </button>
              <button
                  onClick={() => setActiveTab("conPagoHoy")}
                  style={{
                      color: "#fff",
                      backgroundColor: "#d4a74a",
                      border: "none",
                      padding: "10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontWeight: "bold",
                  }}
              >
                  Con pago hoy
              </button>
              <button
                  onClick={() => setActiveTab("sinPagoHoy")}
                  style={{
                      color: "#fff",
                      backgroundColor: "#d4a74a",
                      border: "none",
                      padding: "10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontWeight: "bold",
                  }}
              >
                  Sin pago hoy
              </button>
              <button
                  onClick={() => setActiveTab("finalizados")}
                  style={{
                      color: "#fff",
                      backgroundColor: "#d4a74a",
                      border: "none",
                      padding: "10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontWeight: "bold",
                  }}
              >
                  Finalizados
              </button>
          </div>
          <div>{renderClienteList(getActiveClientes())}</div>
      </div>
  );
};

export default TrabajadorClientes;
