import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { IoLocationOutline, IoCallOutline } from "react-icons/io5";
import AbonoForm from "../components/AbonoForm";
import { useSpring, animated } from "@react-spring/web";
import { toast } from "react-toastify";
import { isBefore, parseISO } from "date-fns";
import { ClipLoader } from "react-spinners"; // Asegúrate de tener esta línea en el import

const ClienteDetails = () => {
    const { id } = useParams();
    console.log(id); // Deberías ver el id de la URL (por ejemplo, 25)
    const [cliente, setCliente] = useState(null);
    const [abonos, setAbonos] = useState([]);
    const [isAbonosVisible, setIsAbonosVisible] = useState(false);
    const navigate = useNavigate();

    const scaleStyle = useSpring({ scale: isAbonosVisible ? 1 : 0.95 });
    const fadeAndTranslateStyle = useSpring({
        opacity: isAbonosVisible ? 1 : 0,
        transform: isAbonosVisible ? "translateY(0px)" : "translateY(10px)",
    });

    useEffect(() => {
        const fetchClienteDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `http://localhost:3000/api/clientes/${id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (response.data) {
                    setCliente(response.data);
                }

                const abonosResponse = await axios.get(
                    `http://localhost:3000/api/clientes/${id}/abonos`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const abonosOrdenados = abonosResponse.data.sort(
                    (a, b) => new Date(b.fecha) - new Date(a.fecha)
                );
                setAbonos(abonosOrdenados);
            } catch (error) {
                console.error(
                    "Error al obtener los detalles del cliente:",
                    error
                );
                setCliente(null);
                toast.error(
                    "Hubo un error al obtener los detalles del cliente."
                );
            }
        };

        fetchClienteDetails();
    }, [id]);

    useEffect(() => {
        if (cliente?.estado === "completado") {
            toast.success("El cliente ha completado todos los pagos.");
            window.alert(
                "Pagos Completados",
                "El cliente ha completado todos los pagos.",
                [
                    {
                        text: "Aceptar",
                        onClick: () => navigate("/worker-dashboard"),
                    },
                ]
            );
        }
    }, [cliente]);

    const handleAddAbono = () => {
        window.alert(
            "Pago agregado con éxito",
            "El pago se ha agregado correctamente."
        );
    };

    const handleNoAbono = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const today = new Date().toISOString().split("T")[0]; // Fecha en formato YYYY-MM-DD
            const fechaProximoPago = parseISO(cliente?.fecha_proximo_pago); // Asegúrate de que la fecha esté en formato ISO

            if (isBefore(today, fechaProximoPago)) {
                window.alert(
                    `No se puede realizar esta acción hasta la fecha de pago: ${fechaProximoPago.toLocaleDateString()}.`
                );
                return;
            }

            const lastNoAbonoDate = localStorage.getItem(
                `lastNoAbonoDate_${id}`
            );
            if (lastNoAbonoDate === today.toISOString().split("T")[0]) {
                window.alert(
                    'El botón de "No abonó" solo se puede presionar una vez al día.'
                );
                return;
            }

            localStorage.setItem(
                `lastNoAbonoDate_${id}`,
                today.toISOString().split("T")[0]
            );
        } catch (error) {
            console.error("Error en la lógica de 'No abonó':", error);
        }
    };

    const handleToggleAbonos = () => {
        setIsAbonosVisible(!isAbonosVisible);
    };

    return (
        <div style={styles.container}>
            <div style={styles.clientInfo}>
                <h1 style={styles.clientName}>{cliente?.nombre}</h1>
                <div style={styles.divider}></div>
                <div style={styles.infoRow}>
                    <IoLocationOutline size={18} color="#f5c469" />
                    <p style={styles.clientDetail}>{cliente?.direccion}</p>
                </div>
                <div style={styles.divider}></div>
                <div style={styles.infoRow}>
                    <IoCallOutline size={18} color="#f5c469" />
                    <p style={styles.clientDetail}>{cliente?.telefono}</p>
                </div>
                <div style={styles.divider}></div>
                <p style={styles.clientDetail}>
                    Monto inicial: {cliente?.precio_total}
                </p>
                <div style={styles.divider}></div>
                <p style={styles.clientDetail}>
                    Forma de pago: {cliente?.forma_pago}
                </p>
                <div style={styles.divider}></div>
                <p style={styles.clientAmountText}>
                    Por pagar: {cliente?.monto_actual}
                </p>
            </div>

            <div style={styles.clientInfo}>
                <h2 style={styles.sectionTitle}>Realizar abono</h2>
                {cliente?.monto_actual > 0 ? (
                    <>
                        <AbonoForm clienteId={id} onAddAbono={handleAddAbono} />
                        <animated.div
                            style={{ ...styles.noAbonoButton, ...scaleStyle }}
                        >
                            <button
                                onClick={handleNoAbono}
                                disabled={cliente?.monto_actual <= 0}
                                style={styles.noAbonoButtonText}
                            >
                                No abonó
                            </button>
                        </animated.div>
                    </>
                ) : (
                    <p style={styles.check}>
                        El cliente ha completado todos los pagos.
                    </p>
                )}

                <button
                    onClick={handleToggleAbonos}
                    style={styles.toggleButton}
                >
                    {isAbonosVisible ? "Ocultar" : "Mostrar"} Historial de
                    Abonos
                </button>

                {isAbonosVisible &&
                    (abonos.length > 0 ? (
                        abonos.map((abono, index) => (
                            <animated.div
                                key={index}
                                style={{
                                    ...styles.abonoItem,
                                    backgroundColor:
                                        abono.estado === "no_abono"
                                            ? "#8b0000"
                                            : "#006400",
                                    ...fadeAndTranslateStyle,
                                }}
                            >
                                <p style={styles.abonoText}>
                                    Monto: {abono.monto}
                                </p>
                                <p style={styles.abonoText}>
                                    Fecha:{" "}
                                    {new Date(abono.fecha).toLocaleDateString()}
                                </p>
                                <p style={styles.abonoText}>
                                    Estado:{" "}
                                    {abono.estado === "no_abono"
                                        ? "No Abonado"
                                        : "Pagado"}
                                </p>
                            </animated.div>
                        ))
                    ) : (
                        <p style={styles.noAbonosText}>
                            No hay abonos registrados.
                        </p>
                    ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0d0d0d",
        padding: "20px",
    },
    clientInfo: {
        backgroundColor: "#1a1a1a",
        borderRadius: "15px",
        padding: "20px",
        marginBottom: "20px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.6)",
    },
    clientName: {
        fontSize: "28px",
        fontWeight: "bold",
        color: "#f5c469",
        marginBottom: "12px",
        textAlign: "center",
        letterSpacing: "3px",
    },
    clientDetail: {
        fontSize: "16px",
        color: "#d9d9d9",
        marginLeft: "10px",
    },
    infoRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: "10px",
    },
    divider: {
        height: "1px",
        backgroundColor: "#444",
        marginVertical: "10px",
    },
    sectionTitle: {
        fontSize: "26px",
        fontWeight: "bold",
        color: "#f5c469",
        marginBottom: "12px",
        textAlign: "center",
    },
    clientAmountText: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#ff6347",
        textAlign: "center",
        textShadow: "1px 1px 5px rgba(0, 0, 0, 0.7)",
    },
    noAbonosText: {
        fontSize: "16px",
        color: "#888",
        textAlign: "center",
    },
    toggleButton: {
        marginVertical: "15px",
        paddingVertical: "10px",
        borderRadius: "10px",
        backgroundColor: "#2a2a2a",
        alignItems: "center",
        color: "#fff",
    },
    abonoItem: {
        padding: "15px",
        borderRadius: "12px",
        marginBottom: "12px",
    },
    abonoText: {
        fontSize: "16px",
        color: "#f9f9f9",
    },
    check: {
        fontSize: "16px",
        color: "#888",
        textAlign: "center",
        marginBottom: "12px",
    },
    noAbonoButton: {
        backgroundColor: "#ff6347",
        paddingVertical: "10px",
        borderRadius: "10px",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: "15px",
        boxShadow: "0px 5px 10px rgba(255, 99, 71, 0.5)",
    },
    noAbonoButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    toggleButtonText: {
        color: "#b1b1b1",
    },
};

export default ClienteDetails;
