import React, { useState, useEffect } from "react";
import FloatingLabelInput from "../components/FloatingLabelInput";

const AgregarProductoScreen = () => {
    const [categorias, setCategorias] = useState([]);
    const [nombreProducto, setNombreProducto] = useState("");
    const [quilates, setQuilates] = useState("");
    const [precio, setPrecio] = useState("");
    const [idCategoria, setIdCategoria] = useState("");
    const [nombreCategoria, setNombreCategoria] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filteredCategorias, setFilteredCategorias] = useState([]);
    const [cantidad, setCantidad] = useState("");

    useEffect(() => {
        fetch("http://localhost:3000/api/categorias/")
            .then((response) => response.json())
            .then((data) => {
                setCategorias(data);
                setFilteredCategorias(data);
            })
            .catch((error) =>
                console.error("Error al obtener las categorías:", error)
            );
    }, []);

    const handleAgregarProducto = () => {
        if (!nombreProducto.trim()) {
            alert("El nombre del producto es obligatorio.");
            return;
        }

        if (!quilates || isNaN(quilates) || quilates <= 0) {
            alert(
                "Por favor, ingresa un valor válido para los quilates (mayor a 0)."
            );
            return;
        }

        if (!precio || isNaN(precio) || precio <= 0) {
            alert("Por favor, ingresa un precio válido (mayor a 0).");
            return;
        }

        if (!cantidad || isNaN(cantidad) || cantidad < 0) {
            alert(
                "Por favor, ingresa una cantidad válida (mayor o igual a 0)."
            );
            return;
        }

        if (!idCategoria) {
            alert("Por favor, selecciona una categoría.");
            return;
        }

        // Llamada al servidor si todo está validado
        fetch("http://localhost:3000/api/productos/agregarProducto", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nombre: nombreProducto.trim(),
                quilates: parseInt(quilates, 10),
                precio: parseFloat(precio),
                id_categoria: parseInt(idCategoria, 10),
                cantidad: parseInt(cantidad, 10),
            }),
        })
            .then((response) => response.json())
            .then(() => {
                alert("Producto agregado exitosamente.");
                setNombreProducto("");
                setQuilates("");
                setPrecio("");
                setIdCategoria("");
                setCantidad("");
            })
            .catch((error) =>
                console.error("Error al agregar el producto:", error)
            );
    };

    const handleAgregarCategoria = () => {
        // Validación para la categoría
        if (!nombreCategoria.trim()) {
            alert("El nombre de la categoría es obligatorio.");
            return;
        }

        fetch("http://localhost:3000/api/categorias/agregarCategoria", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: nombreCategoria.trim() }),
        })
            .then((response) => response.json())
            .then((data) => {
                alert("Categoría agregada exitosamente.");
                setCategorias((prevCategorias) => [...prevCategorias, data]);
                setFilteredCategorias((prevCategorias) => [
                    ...prevCategorias,
                    data,
                ]);
                setNombreCategoria("");
            })
            .catch((error) =>
                console.error("Error al agregar la categoría:", error)
            );
    };

    const handleSearch = (text) => {
        setSearchText(text);
        const filtered = categorias.filter((categoria) =>
            categoria.nombre.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredCategorias(filtered);
    };

    const handleSelectCategoria = (id, nombre) => {
        setIdCategoria(id);
        setSearchText(nombre);
        setModalVisible(false);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Agregar Producto</h1>
            <FloatingLabelInput
                label="Nombre del producto"
                value={nombreProducto}
                onChangeText={(text) => {
                    const validText = text.replace(/[^a-zA-Z\s]/g, ""); // Permitir solo letras y espacios
                    setNombreProducto(validText);
                }}
            />
            <FloatingLabelInput
                label="Quilates"
                value={quilates}
                onChangeText={(text) => {
                    const validNumber = text.replace(/[^0-9]/g, ""); // Permitir solo números
                    setQuilates(validNumber);
                }}
                keyboardType="numeric"
            />
            <FloatingLabelInput
                label="Precio"
                value={precio}
                onChangeText={(text) => {
                    const validDecimal = text.replace(/[^0-9.]/g, ""); // Permitir números y punto decimal
                    // Asegurarse de que solo haya un punto decimal
                    if ((validDecimal.match(/\./g) || []).length <= 1) {
                        setPrecio(validDecimal);
                    }
                }}
                keyboardType="numeric"
            />
            <FloatingLabelInput
                label="Cantidad"
                value={cantidad}
                onChangeText={(text) => {
                    const validInteger = text.replace(/[^0-9]/g, ""); // Permitir solo números enteros
                    setCantidad(validInteger);
                }}
                keyboardType="numeric"
            />

            <button onClick={() => setModalVisible(true)} style={styles.button}>
                {searchText || "Selecciona una categoría"}
            </button>

            {modalVisible && (
                <div style={{ ...styles.modal, display: "block" }}>
                    <FloatingLabelInput
                        type="text"
                        placeholder="Buscar categoría"
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={styles.input}
                    />
                    <ul style={styles.ul}>
                        {filteredCategorias.map((categoria) => (
                            <li
                                key={categoria.id_categoria}
                                onClick={() =>
                                    handleSelectCategoria(
                                        categoria.id_categoria,
                                        categoria.nombre
                                    )
                                }
                                style={styles.li}
                            >
                                {categoria.nombre}
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={() => setModalVisible(false)}
                        style={styles.button}
                    >
                        Cerrar
                    </button>
                </div>
            )}

            <button onClick={handleAgregarProducto} style={styles.button}>
                Agregar Producto
            </button>

            <h2 style={styles.header}>Agregar Nueva Categoría</h2>
            <input
                type="text"
                placeholder="Nombre de la categoría"
                value={nombreCategoria}
                onChange={(e) => setNombreCategoria(e.target.value)}
                style={styles.input}
            />
            <button onClick={handleAgregarCategoria} style={styles.button1}>
                Agregar Categoría
            </button>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: "#121212",
        color: "#f5c469",
        padding: "20px",
        minHeight: "100vh",
    },
    header: {
        fontSize: "26px",
        fontWeight: "bold",
        color: "#FFD700",
        marginBottom: "16px",
        textAlign: "center",
        textTransform: "uppercase",
    },
    inputContainer: { marginBottom: "10px" },
    li: {
        margin: 5,
        padding: 15, // Espaciado interno
        borderBottomWidth: 1, // Línea divisoria
        borderBottomColor: "#333", // Color tenue para la línea
        backgroundColor: "#1e1e1e", // Fondo oscuro
        color: "#fff", // Color
        borderRadius: 5, // Bordes redondeados
        marginVertical: 5, // Espaciado entre elementos
    },
    input: {
        height: 45,
        borderColor: "#707070",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        color: "#d1a980",
        backgroundColor: "#1e1e1e",
        fontSize: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 3,
        width: "99.3%",
    },
    button: {
        backgroundColor: "#d4af37",
        padding: "12px",
        borderRadius: "10px",
        border: "none",
        color: "#000",
        fontWeight: "bold",
        fontSize: "18px",
        width: "100%",
        cursor: "pointer",
        marginBottom: "2%",
    },
    button1: {
        backgroundColor: "#d4af37",
        padding: "12px",
        borderRadius: "10px",
        border: "none",
        color: "#000",
        fontWeight: "bold",
        fontSize: "18px",
        width: "100%",
        cursor: "pointer",
        marginTop: "2%",
    },
    dropdownButton: {
        backgroundColor: "#fff",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        color: "#000",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "#121212", // Fondo más oscuro para el modal
        padding: 20, // Relleno interno
    },
    subtitle: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#f5c469",
        marginTop: "20px",
        textAlign: "center",
    },
};

export default AgregarProductoScreen;
