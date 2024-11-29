import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import FloatingLabelInput from '../components/FloatingLabelInput'; // Ensure this component is compatible with web

const NuevoCliente = () => {
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [producto, setProducto] = useState(null);
    const [categoria, setCategoria] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [productos, setProductos] = useState([]);
    const [precioTotal, setPrecioTotal] = useState('');
    const [formaPago, setFormaPago] = useState('');
    const [abonoInicial, setAbonoInicial] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredCategorias, setFilteredCategorias] = useState([]);
    const [searchProductText, setSearchProductText] = useState(''); 
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [modalProductosVisible, setModalProductosVisible] = useState(false);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/categorias');
                setCategorias(response.data);
                setFilteredCategorias(response.data);
            } catch (error) {
                console.error('Error al cargar categorías:', error);
                alert('Error al cargar categorías');
            }
        };

        fetchCategorias();
    }, []);

    const fetchProductosPorCategoria = async (categoriaId) => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/productos?categoria=${categoriaId}`
            );
            setProductos(response.data);
        } catch {
            alert('Error al cargar productos');
        }
    };

    const handleSelectCategoria = (id, nombre) => {
        setCategoria(id);
        setSearchText(nombre);
        setModalVisible(false);
        fetchProductosPorCategoria(id);
    };

    const handleSelectProducto = (id, nombre) => {
        setProducto(id);
        setSearchProductText(nombre);
        setModalProductosVisible(false);
    };

    const handleSearch = (text) => {
        setSearchText(text);
        const filtered = categorias.filter((cat) =>
            cat.nombre.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredCategorias(filtered);
    };

    const handleSearchProduct = (text) => {
        setSearchProductText(text);
        const filtered = productos.filter((prod) =>
            prod.nombre.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredProductos(filtered);
    };

    useEffect(() => {
        setFilteredProductos(productos);
    }, [productos]);

    const handleAddCliente = async () => {
        setIsLoading(true);

        if (!nombre || !direccion || !telefono || !producto || !precioTotal || !formaPago) {
            alert('Por favor, complete todos los campos');
            setIsLoading(false);
            return;
        }

        const montoActual = abonoInicial
            ? Math.max(0, parseFloat(precioTotal) - parseFloat(abonoInicial))
            : parseFloat(precioTotal);

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No se encontró un token de autenticación');

            await axios.post(
                'http://:3000/api/clientes',
                {
                    nombre,
                    direccion,
                    telefono,
                    producto_id: producto,
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
            setPrecioTotal('');
            setFormaPago('');
            setAbonoInicial('');
            setProductos([]);
        } catch (error) {
            console.error('Error al agregar cliente:', error);
            alert('Hubo un problema al agregar el cliente');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#101010' }}>
            <h2 style={{ textAlign: 'center', color: '#f5c469' }}>Agregar Cliente</h2>

            <FloatingLabelInput label="Nombre" value={nombre} onChangeText={setNombre} />
            <FloatingLabelInput label="Dirección" value={direccion} onChangeText={setDireccion} />
            <FloatingLabelInput label="Teléfono" value={telefono} onChangeText={setTelefono} type="tel" />

            <button onClick={() => setModalVisible(true)} style={styles.inputPicker}>
                {searchText || 'Selecciona una categoría'}
            </button>
            {modalVisible && (
                <div style={styles.modalContainer}>
                    <input
                        style={styles.inputBuscador}
                        type="text"
                        placeholder="Buscar categoría"
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <ul>
                        {filteredCategorias.map((item) => (
                            <li key={item.id_categoria} onClick={() => handleSelectCategoria(item.id_categoria, item.nombre)}>
                                {item.nombre}
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setModalVisible(false)} style={styles.closeButton}>
                        Cerrar
                    </button>
                </div>
            )}

            <button
                onClick={() => {
                    if (!categoria) {
                        alert('Por favor, selecciona una categoría primero.');
                        return;
                    }
                    setModalProductosVisible(true);
                }}
                style={styles.inputPicker}
            >
                {producto ? productos.find((p) => p.id_producto === producto)?.nombre : 'Selecciona un producto'}
            </button>

            {modalProductosVisible && (
                <div style={styles.modalContainer}>
                    <input
                        style={styles.inputBuscador}
                        type="text"
                        placeholder="Buscar producto"
                        value={searchProductText}
                        onChange={(e) => handleSearchProduct(e.target.value)}
                    />
                    <ul>
                        {filteredProductos.map((item) => (
                            <li key={item.id_producto} onClick={() => handleSelectProducto(item.id_producto, item.nombre)}>
                                {item.nombre}
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setModalProductosVisible(false)} style={styles.closeButton}>
                        Cerrar
                    </button>
                </div>
            )}

            <FloatingLabelInput label="Precio Total" value={precioTotal} onChangeText={setPrecioTotal} type="number" />
            <FloatingLabelInput label="Abono Inicial (Opcional)" value={abonoInicial} onChangeText={setAbonoInicial} type="number" />

            <select onChange={(e) => setFormaPago(e.target.value)} value={formaPago} style={styles.dropdown}>
                <option value="">Forma de Pago</option>
                <option value="diario">Diario</option>
                <option value="semanal">Semanal</option>
            </select>

            <div style={styles.buttonContainer}>
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <button style={styles.button} onClick={handleAddCliente}>
                        Agregar Cliente
                    </button>
                )}
            </div>
        </div>
    );
};

const styles = {
    inputPicker: {
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '12px',
        marginBottom: '15px',
        color: '#000',
        cursor: 'pointer',
    },
    modalContainer: {
        padding: '20px',
        backgroundColor: '#101010',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        overflowY: 'scroll',
        zIndex: '100',
    },
    inputBuscador: {
        height: '45px',
        borderColor: '#707070',
        borderWidth: '1px',
        borderRadius: '10px',
        padding: '12px',
        color: '#d1a980',
        backgroundColor: '#1e1e1e',
        fontSize: '16px',
    },
    closeButton: {
        marginTop: '20px',
        backgroundColor: '#f5c469',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    dropdown: {
        backgroundColor: '#1e1e1e',
        color: '#f5c469',
        borderRadius: '10px',
        padding: '12px',
        width: '100%',
        marginBottom: '15px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#f5c469',
        color: '#101010',
        border: 'none',
        borderRadius: '10px',
        padding: '12px 20px',
        fontSize: '16px',
        cursor: 'pointer',
    },
};

export default NuevoCliente;
