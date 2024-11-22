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
            className="card"
            style={{ transform: `scale(${scale})` }}
        >
            {cliente.fecha_proximo_pago && (
                <div className="payment-date-tag-container">
                    <div className={`payment-date-tag-cut ${esAtrasado ? 'atrasado' : ''}`} />
                    <div className={`payment-date-tag ${esAtrasado ? 'atrasado-tag' : ''}`}>
                        <span className={`payment-date-text ${esAtrasado ? 'atrasado-text' : ''}`}>
                            {etiquetaPago}
                        </span>
                    </div>
                </div>
            )}

            <span className="card-name">{cliente.nombre}</span>

            <div className="info-container">
                <FaLocationArrow size={18} color="#f5c469" />
                <span className="card-text">{cliente.direccion}</span>
            </div>
            <div className="info-container">
                <FaPhone size={18} color="#f5c469" />
                <span className="card-text">{cliente.telefono}</span>
            </div>
            <div className="info-container">
                <FaDollarSign size={18} color="#f5c469" />
                <span className="card-amount-text">Por pagar: {cliente.monto_actual}</span>
            </div>

            <button onClick={handleClick} className="details-button">
                Ver Detalles
            </button>

            {isAdmin && (
                <div className="actions-container">
                    <button onClick={onEdit} className="action-button">
                        <FaEdit size={28} color="#8ecae6" />
                    </button>
                    <button onClick={() => onDelete(cliente)} className="action-button">
                        <FaTrashAlt size={28} color="#e63946" />
                    </button>
                    <button onClick={() => onExport(cliente)} className="action-button">
                        <FaDownload size={28} color="#06d6a0" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ClienteCard;
