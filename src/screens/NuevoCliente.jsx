import React, { useState, useEffect, useRef } from 'react';
import { Text, TextInput, StyleSheet, Alert, ScrollView, ActivityIndicator, Button, Modal, FlatList, TouchableOpacity } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FloatingLabelInput from '../components/FloatingLabelInput'; // Ensure this component is compatible with web

const NuevoCliente = () => {
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [producto, setProducto] = useState(null);
    const [categoria, setCategoria] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [productos, setProductos] = useState([]);
    const [precioTotal, setPrecioTotal] = useState(0);
    const [formaPago, setFormaPago] = useState("");
    const [abonoInicial, setAbonoInicial] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filteredCategorias, setFilteredCategorias] = useState([]);
    const [searchProductText, setSearchProductText] = useState("");
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [modalProductosVisible, setModalProductosVisible] = useState(false);
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);

    const [scale, setScale] = useState(1);
    const [opacity, setOpacity] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get(
                    "https://8oj4qmf2y4.execute-api.us-east-1.amazonaws.com/categorias"
                );
                setCategorias(response.data);
                setFilteredCategorias(response.data); // Inicializar con todas las categorías
            } catch (error) {
                console.error("Error al cargar categorías:", error);
                alert("Error", "No se pudieron cargar las categorías");
            }
        };

        fetchCategorias();
    }, []);

    useEffect(() => {
        const total = productosSeleccionados.reduce(
            (sum, prod) => sum + (parseFloat(prod.precio) || 0) * prod.cantidad,
            0
        );
        setPrecioTotal(total.toFixed(2)); // Asegurar dos decimales
    }, [productosSeleccionados]);

    const fetchProductosPorCategoria = async (categoriaId) => {
        try {
            const response = await axios.get(
                `https://8oj4qmf2y4.execute-api.us-east-1.amazonaws.com/productos/productoCategoria?id_categoria=${categoriaId}`
            );
            setProductos(response.data);
        } catch {
            alert("Error", "No se pudieron cargar los productos");
        }
    };

    const handleSelectCategoria = (id, nombre) => {
        setCategoria({ id, nombre }); // Actualizar el estado con el objeto seleccionado
        if (!categoriasSeleccionadas.some((cat) => cat.id === id)) {
            setCategoriasSeleccionadas([
                ...categoriasSeleccionadas,
                { id, nombre },
            ]);
        }
        fetchProductosPorCategoria(id); // Cargar productos de la categoría seleccionada
        setModalVisible(false);
    };

    const handleSelectProducto = (id, nombre, precio) => {
        if (!precio) {
            alert(
                "Error",
                "El producto seleccionado no tiene un precio válido."
            );
            return;
        }

        const productoExistente = productosSeleccionados.find(
            (prod) => prod.id === id
        );

        if (productoExistente) {
            // Incrementar cantidad si el producto ya está seleccionado
            setProductosSeleccionados(
                productosSeleccionados.map((prod) =>
                    prod.id === id
                        ? { ...prod, cantidad: prod.cantidad + 1 }
                        : prod
                )
            );
        } else {
            // Agregar nuevo producto con cantidad inicial de 1
            setProductosSeleccionados([
                ...productosSeleccionados,
                { id, nombre, precio, cantidad: 1 },
            ]);
        }
        setModalProductosVisible(false);
    };

    const handleChangeCantidadProducto = (id, cambio) => {
        setProductosSeleccionados(
            (prev) =>
                prev
                    .map((prod) =>
                        prod.id === id
                            ? {
                                  ...prod,
                                  cantidad: Math.max(1, prod.cantidad + cambio),
                              } // Asegurar que la cantidad no sea menor a 1
                            : prod
                    )
                    .filter((prod) => prod.cantidad > 0) // Filtrar productos con cantidad cero (si se permitiera eliminar)
        );
    };

    const handleRemoveProducto = (id) => {
        setProductosSeleccionados(
            productosSeleccionados.filter((prod) => prod.id !== id)
        );
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
        setFilteredProductos(productos); // Inicializar productos filtrados cuando se carguen
    }, [productos]);

    const handleAddCliente = async () => {
        setIsLoading(true);
        if (
            !nombre ||
            !direccion ||
            !telefono ||
            productosSeleccionados.length === 0 ||
            !precioTotal ||
            !formaPago
        ) {
            alert(
                "Error",
                "Por favor, complete todos los campos y seleccione al menos un producto"
            );
            setIsLoading(false);
            return;
        }

        const montoActual = Math.max(
            0,
            parseFloat(precioTotal) - (parseFloat(abonoInicial) || 0)
        );

        try {
            const token = await localStorage.getItem("token");
            if (!token)
                throw new Error("No se encontró un token de autenticación");

            await axios.post(
                "https://8oj4qmf2y4.execute-api.us-east-1.amazonaws.com/clientes/agregar",
                {
                    nombre,
                    direccion,
                    telefono,
                    productos: productosSeleccionados.map((prod) => prod.id), // Enviar IDs de productos seleccionados
                    precio_total: parseFloat(precioTotal),
                    forma_pago: formaPago,
                    monto_actual: montoActual,
                    abono_inicial: parseFloat(abonoInicial) || 0, // Envía el abono inicial
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Éxito", "Cliente agregado exitosamente");
            setNombre("");
            setDireccion("");
            setTelefono("");
            setProductosSeleccionados([]);
            setCategoriasSeleccionadas([]);
            setPrecioTotal("");
            setFormaPago("");
            setAbonoInicial("");
            setProductos([]);
            navigate("/worker-dashboard");
        } catch (error) {
            console.error("Error al agregar cliente:", error);
            alert("Error", "Hubo un problema al agregar el cliente");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePressIn = () => {
        setScale(0.95);
        setOpacity(0.8);
    };

    const handlePressOut = () => {
        setScale(1);
        setOpacity(1);
        handleAddCliente(); // Llamar a tu función después de la animación
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Agregar Cliente</h2>

            <FloatingLabelInput
                label="Nombre"
                value={nombre}
                onChangeText={setNombre}
            />
            <FloatingLabelInput
                label="Dirección"
                value={direccion}
                onChangeText={setDireccion}
            />
            <FloatingLabelInput
                label="Teléfono"
                value={telefono}
                onChangeText={setTelefono}
                type="tel"
            />

            <button
                onClick={() => setModalVisible(true)}
                style={styles.inputPicker}
            >
                {categoria ? categoria.nombre : "Selecciona una categoría"}
            </button>

            {modalVisible && (
                <div style={{ ...styles.modalContainer, display: "block" }}>
                    <input
                        style={styles.inputBuscador}
                        type="text"
                        placeholder="Buscar categoría"
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <ul>
                        {categorias
                            .filter((item) =>
                                item.nombre
                                    .toLowerCase()
                                    .includes(searchText.toLowerCase())
                            )
                            .map((item) => (
                                <li
                                    key={item.id_categoria}
                                    onClick={() =>
                                        handleSelectCategoria(
                                            item.id_categoria,
                                            item.nombre
                                        )
                                    }
                                    style={styles.item}
                                >
                                    {item.nombre}
                                </li>
                            ))}
                    </ul>
                    <button
                        onClick={() => setModalVisible(false)}
                        style={styles.closeButton}
                    >
                        Cerrar
                    </button>
                </div>
            )}

            <button
                onClick={() => {
                    if (!categoria) {
                        alert("Por favor, selecciona una categoría primero.");
                        return;
                    }
                    setModalProductosVisible(true);
                }}
                style={styles.inputPicker}
            >
                {producto ? producto.nombre : "Selecciona un producto"}
            </button>

            {modalProductosVisible && (
                <div style={{ ...styles.modalContainer, display: "block" }}>
                    <input
                        style={styles.inputBuscador}
                        type="text"
                        placeholder="Buscar producto"
                        value={searchProductText}
                        onChange={(e) => handleSearchProduct(e.target.value)}
                        placeholderTextColor="#d1a980"
                    />
                    <ul style={styles.productList}>
                        {filteredProductos.map((item) => (
                            <li
                                key={item.id_producto}
                                onClick={() =>
                                    handleSelectProducto(
                                        item.id_producto,
                                        item.nombre,
                                        item.precio
                                    )
                                }
                                style={styles.item}
                            >
                                <span>
                                    {item.nombre} - ${item.precio}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={() => setModalProductosVisible(false)}
                        style={styles.closeButton}
                    >
                        Cerrar
                    </button>
                </div>
            )}

            <div style={styles.priceContainer}>
                <p style={styles.priceTotal}>Precio Total: ${precioTotal}</p>
            </div>
            <FloatingLabelInput
                label="Abono Inicial (Opcional)"
                value={abonoInicial}
                onChangeText={setAbonoInicial}
                type="number"
            />

            <div style={styles.inputContainer}>
                <label style={styles.label}>Forma de pago</label>
                <select
                    onChange={(e) => setFormaPago(e.target.value)}
                    value={formaPago}
                    style={styles.dropdown}
                >
                    <option value="">Selecciona la Forma de pago</option>
                    <option value="diario">Diario</option>
                    <option value="semanal">Semanal</option>
                </select>
            </div>

            {/* Productos seleccionados fuera del TouchableOpacity */}
            <div style={styles.selectedContainer}>
                {productosSeleccionados.length > 0 ? (
                    productosSeleccionados.map((item) => (
                        <div key={item.id} style={styles.selectedItem}>
                            <span style={styles.selectedItemText}>
                                {item.nombre} - ${item.precio}
                            </span>
                            <div style={styles.quantityControls}>
                                <span style={styles.quantity}>
                                    {item.cantidad}
                                </span>
                                <button
                                    style={styles.quantityButton}
                                    onClick={() =>
                                        handleChangeCantidadProducto(
                                            item.id,
                                            -1
                                        )
                                    }
                                >
                                    -
                                </button>
                                <button
                                    style={styles.quantityButton}
                                    onClick={() =>
                                        handleChangeCantidadProducto(item.id, 1)
                                    }
                                >
                                    +
                                </button>
                            </div>
                            <button
                                style={styles.removeButton}
                                onClick={() => handleRemoveProducto(item.id)}
                            >
                                X
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No hay productos seleccionados</p>
                )}
            </div>

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
    container: {
        backgroundColor: '#121212',
        color: '#f5c469',
        padding: '20px',
        minHeight: '100vh',
    },
    inputContainer: {
        marginBottom: 15,
        backgroundColor: '#1a1a1a',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    label: {
        marginLeft: '5px',
        color: '#fff',
        marginBottom: '5px',
        display: 'block',
    },
    title: {
        fontSize: '26px',
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: '16px',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: '#1c1c1e',
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        color: '#fff',
    },
    inputPicker: {
        backgroundColor: '#1c1c1e',
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        color: '#fff',
    },
    inputBuscador: {
        height: 45,
        borderColor: '#707070',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        color: '#d1a980',
        backgroundColor: '#1e1e1e',
        fontSize: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 3,
    },
    selectedContainer: {
        backgroundColor: '#1c1c1e', // Fondo oscuro para los productos seleccionados
        borderRadius: 10, // Bordes redondeados
        padding: 10, // Relleno para el contenido interno
        marginTop: 10, // Espacio superior
    },
    selectedItem: {
        flexDirection: 'row', // Los elementos del producto en fila
        alignItems: 'center', // Alineación vertical
        justifyContent: 'space-between', // Espacio entre texto y botones
        backgroundColor: '#2a2a2a', // Fondo oscuro para los productos seleccionados
        borderRadius: 8, // Bordes redondeados
        padding: 10, // Relleno interno
        marginBottom: 8, // Espacio entre los elementos seleccionados
    },
    selectedItemText: {
        flex: 1, // Ocupa todo el espacio disponible
        color: '#fff', // Texto blanco
        fontSize: 13, // Tamaño de fuente adecuado
        fontWeight: '500', // Peso moderado
        marginRight: 10, // Espacio entre texto y botones
    },
    removeButton: {
        backgroundColor: '#e53935', // Rojo brillante para el botón de eliminar
        borderRadius: 5, // Bordes redondeados
        padding: 6, // Relleno interno
    },
    removeText: {
        color: '#fff', // Texto blanco
        fontWeight: 'bold', // Negrita para destacar
        fontSize: 10, // Tamaño adecuado
    },
    quantity:{
        color: '#fff',
        fontSize: 16,
        marginRight: 3
    },
    quantityControls: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between", // Espaciado entre los botones
        backgroundColor: "#1c1c1e", // Fondo oscuro para contraste
        borderRadius: 10,
        paddingHorizontal: 10, // Margen interno
        width: 80, // Ajustar ancho para mantener alineación
    },
    quantityButton: {
        backgroundColor: "#d4af37", // Dorado para los botones
        padding: 6, // Tamaño del botón
        borderRadius: '100%',
        alignItems: "center",
        justifyContent: "center",
    },
    quantityButtonText: {
        color: "#000", // Texto oscuro para contraste
        fontSize: 16,
        fontWeight: "bold",
    },
    priceContainer: {
        backgroundColor: '#1c1c1e', // Fondo oscuro
        borderRadius: 10, // Bordes redondeados
        padding: 10, // Relleno interno
        alignItems: 'center', // Centrar el texto
        marginVertical: 10, // Espacio vertical
        marginBottom: 18, //
    },
    priceTotal: {
        color: '#d4af37', // Dorado para destacar
        fontSize: 18, // Tamaño de fuente más grande
        fontWeight: 'bold', // Negrita para énfasis
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#121212', // Fondo más oscuro para el modal
        padding: 20, // Relleno interno
    },
    item: {
        padding: 15, // Espaciado interno
        borderBottomWidth: 1, // Línea divisoria
        borderBottomColor: '#333', // Color tenue para la línea
        backgroundColor: '#1e1e1e', // Fondo oscuro
        color: '#fff', // Color
        borderRadius: 5, // Bordes redondeados
        marginVertical: 5, // Espaciado entre elementos
    },
    itemText: {
        color: '#f5c469', // Dorado claro
        fontSize: 16, // Tamaño adecuado
        fontWeight: '500', // Peso moderado
    },
    inputBuscador: {
        backgroundColor: '#292929', // Fondo oscuro
        borderRadius: 8, // Bordes redondeados
        paddingHorizontal: 10, // Relleno horizontal
        height: 40, // Altura del input
        color: '#fff', // Texto blanco
        marginBottom: 10, // Espaciado inferior
    },
    closeButton: {
        backgroundColor: '#e53935', // Rojo intenso
        borderRadius: 8, // Bordes redondeados
        paddingVertical: 10, // Espaciado vertical
        alignItems: 'center', // Centrar texto
        marginTop: 20, // Espaciado superior
    },
    closeButtonText: {
        color: '#fff', // Texto blanco
        fontWeight: 'bold', // Negrita para énfasis
        fontSize: 16, // Tamaño adecuado
    },
    dropdown: {
        backgroundColor: '#1c1c1e',
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        color: '#fff',
        width: '100%',
    },
    dropdownContainer: {
        borderRadius: 10,
        backgroundColor: '#292929',
    },
    buttonContainer: {
        marginTop: 20,
    },
    button: {
        backgroundColor: '#d4af37',
        padding: '12px 30px',
        borderRadius: '10px',
        color: '#000',
        fontWeight: 'bold',
        fontSize: '18px',
        border: 'none',
        cursor: 'pointer',
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 18,
    },
};

export default NuevoCliente;
