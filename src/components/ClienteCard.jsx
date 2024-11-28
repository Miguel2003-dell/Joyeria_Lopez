import React, { useState } from 'react';
import { FaLocationArrow, FaPhone, FaDollarSign, FaEdit, FaTrashAlt, FaDownload } from 'react-icons/fa';

const ClienteCard = ({ cliente, onClick, isAdmin, onEdit, onDelete, onExport }) => {
    const [scale, setScale] = useState(1);

    const calcularDiasRestantes = (fechaProximoPago) => {
        const hoy = new Date();
        const proximoPago = new Date(fechaProximoPago);
        const diferenciaTiempo = proximoPago - hoy;
        const diasRestantes = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));

        if (diasRestantes === 0) return { texto: "Hoy es el día de pago", esAtrasado: false };
        if (diasRestantes === 1) return { texto: "Mañana es el día de pago", esAtrasado: false };
        if (diasRestantes < 0) return { texto: `Atrasado ${Math.abs(diasRestantes)} día(s)`, esAtrasado: true };
        
        return { texto: `Faltan ${diasRestantes} días para el pago`, esAtrasado: false };
    };

    const handleClick = () => {
        setScale(1.02);
        setTimeout(() => setScale(1), 100);
        if (onClick) onClick(); // Usar onClick para la web
    };

    const { texto: etiquetaPago, esAtrasado } = calcularDiasRestantes(cliente.fecha_proximo_pago);

    return (
        <div
            style={{ ...styles.card, transform: `scale(${scale})` }}
        >
            {cliente.fecha_proximo_pago && (
                <div style={styles.paymentDateTagContainer}>
                    <div style={{ ...styles.paymentDateTagCut, ...(esAtrasado ? styles.atrasadoTagCut : {}) }} />
                    <div style={{ ...styles.paymentDateTag, ...(esAtrasado ? styles.atrasadoTag : {}) }}>
                        <span style={{ ...styles.paymentDateText, ...(esAtrasado ? styles.atrasadoText : {}) }}>
                            {etiquetaPago}
                        </span>
                    </div>
                </div>
            )}

            <span style={styles.cardName}>{cliente.nombre}</span>

            <div style={styles.infoContainer}>
                <FaLocationArrow size={18} color="#f5c469" />
                <span style={styles.cardText}>{cliente.direccion}</span>
            </div>
            <div style={styles.infoContainer}>
                <FaPhone size={18} color="#f5c469" />
                <span style={styles.cardText}>{cliente.telefono}</span>
            </div>
            <div style={styles.infoContainer}>
                <FaDollarSign size={18} color="#f5c469" />
                <span style={styles.cardAmountText}>Por pagar: {cliente.monto_actual}</span>
            </div>

            <button onClick={handleClick} style={styles.detailsButton}>
                Ver Detalles
            </button>

            {isAdmin && (
                <div style={styles.actionsContainer}>
                    <button onClick={onEdit} style={styles.actionButton}>
                        <FaEdit size={28} color="#8ecae6" />
                    </button>
                    <button onClick={() => onDelete(cliente)} style={styles.actionButton}>
                        <FaTrashAlt size={28} color="#e63946" />
                    </button>
                    <button onClick={() => onExport(cliente)} style={styles.actionButton}>
                        <FaDownload size={28} color="#06d6a0" />
                    </button>
                </div>
            )}
        </div>
    );
};

const styles = {
    card: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
        position: 'relative',
    },
    paymentDateTagContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentDateTagCut: {
        width: 0,
        height: 0,
        borderTopWidth: 10,
        borderTopColor: 'transparent',
        borderBottomWidth: 8,
        borderBottomColor: 'transparent',
        borderRightWidth: 8,
        borderRightColor: '#f5c469', // Color por defecto
    },
    completedText: {
        color: '#06d6a0', // Color verde
        fontWeight: 'bold',
        fontSize: 14,
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    atrasadoTagCut: {
        borderRightColor: '#ff4d4d', // Color rojo si está atrasado
    },
    paymentDateTag: {
        backgroundColor: '#f5c469',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        paddingVertical: 4,
        paddingHorizontal: 8,
        zIndex: 1,
    },
    atrasadoTag: {
        backgroundColor: '#ff4d4d',
    },
    paymentDateText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 12,
    },
    atrasadoText: {
        color: '#fff',
    },
    cardName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#f5c469',
        marginBottom: 12,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    cardText: {
        fontSize: 15,
        color: '#d1d1d1',
        marginLeft: 5,
    },
    cardAmountText: {
        fontSize: 17,
        color: '#d1d1d1',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    detailsButton: {
        backgroundColor: '#d4af37',
        borderRadius: 8,
        paddingVertical: 20, // Aumentamos el padding vertical para hacerlo más grande
        paddingHorizontal: 30, // Añadimos padding horizontal para hacerlo más ancho
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center', // Asegura que el texto esté centrado
        minWidth: 200, // Añadimos un ancho mínimo para que el botón tenga un tamaño consistente
    },
    detailsButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 20, // Aumentamos el tamaño de la fuente
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    actionButton: {
        padding: 5,
        borderRadius: 8,
        backgroundColor: '#2e2e38',
    },
};

export default ClienteCard;
