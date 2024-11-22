import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Usar React Router para la navegación

// Importamos el paquete react-select para un select avanzado
import Select from 'react-select';

// Estilo en CSS en lugar de StyleSheet
import '../styles/NuevoCliente.css';

const NuevoCliente = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [producto, setProducto] = useState(null);
  const [categoria, setCategoria] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [quilates, setQuilates] = useState('');
  const [precioTotal, setPrecioTotal] = useState('');
  const [formaPago, setFormaPago] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [abonoInicial, setAbonoInicial] = useState('');

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/categorias');
        const categorias = response.data.map((cat) => ({
          label: cat.nombre,
          value: cat.id_categoria,
        }));
        setCategorias(categorias);
      } catch (error) {
        alert('Error', 'No se pudieron cargar las categorías');
      }
    };

    fetchCategorias();
  }, []);

  const fetchProductosPorCategoria = async (categoriaId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/productos?categoria=${categoriaId}`);
      const productos = response.data.map((prod) => ({
        label: prod.nombre,
        value: prod.id_producto,
      }));
      setProductos(productos);
    } catch {
      alert('Error', 'No se pudieron cargar los productos');
    }
  };

const handleAddCliente = async () => {
    setIsLoading(true);
    if (!nombre || !direccion || !telefono || !producto || !quilates || !precioTotal || !formaPago) {
      alert('Error', 'Por favor, complete todos los campos');
      setIsLoading(false);
      return;
    }

    const montoActual = abonoInicial
      ? Math.max(0, parseFloat(precioTotal) - parseFloat(abonoInicial))
      : parseFloat(precioTotal);

    try {
      // Usar localStorage para obtener el token
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No se encontró un token de autenticación');

      await axios.post(
        'http://localhost:3000/api/clientes',
        {
          nombre,
          direccion,
          telefono,
          producto_id: producto,
          quilates: parseFloat(quilates),
          precio_total: parseFloat(precioTotal),
          forma_pago: formaPago,
          monto_actual: montoActual,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Éxito', 'Cliente agregado exitosamente');

      setNombre('');
      setDireccion('');
      setTelefono('');
      setProducto(null);
      setCategoria(null);
      setQuilates('');
      setPrecioTotal('');
      setFormaPago('');
      setAbonoInicial('');
      setProductos([]);

      navigate(-1);  // Volver a la pantalla anterior
    } catch (error) {
      alert('Error', 'Hubo un problema al agregar el cliente');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="form-container">
      <h1 className="title">Agregar Cliente</h1>

      <input
        type="text"
        className="input"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre"
      />
      <input
        type="text"
        className="input"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        placeholder="Dirección"
      />
      <input
        type="text"
        className="input"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        placeholder="Teléfono"
        pattern="[0-9]*"
      />

      <Select
        options={categorias}
        value={categoria}
        onChange={(value) => {
          setCategoria(value);
          fetchProductosPorCategoria(value.value);
        }}
        placeholder="Categoría"
      />

      <Select
        options={productos}
        value={producto}
        onChange={(value) => setProducto(value)}
        placeholder="Producto"
      />

      <input
        type="number"
        className="input"
        value={quilates}
        onChange={(e) => setQuilates(e.target.value)}
        placeholder="Quilates"
      />
      <input
        type="number"
        className="input"
        value={precioTotal}
        onChange={(e) => setPrecioTotal(e.target.value)}
        placeholder="Precio Total"
      />
      <input
        type="number"
        className="input"
        value={abonoInicial}
        onChange={(e) => setAbonoInicial(e.target.value)}
        placeholder="Abono Inicial (Opcional)"
      />

      <Select
        options={[
          { label: 'Diario', value: 'diario' },
          { label: 'Semanal', value: 'semanal' },
        ]}
        value={formaPago}
        onChange={(value) => setFormaPago(value)} // Directamente actualizamos el objeto
        placeholder="Forma de Pago"
      />

      <div className="button-container">
        {isLoading ? (
          <div className="loading">Cargando...</div>
        ) : (
          <button className="button" onClick={handleAddCliente}>
            Agregar Cliente
          </button>
        )}
      </div>
    </div>
  );
};

export default NuevoCliente;
