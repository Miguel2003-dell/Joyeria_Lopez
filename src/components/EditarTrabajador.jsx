import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';

const EditarTrabajador = ({ worker, onSave, onClose }) => {
    const [name, setName] = useState(worker.nombre);
    const [role, setRole] = useState(worker.role);
    const [email, setEmail] = useState(worker.email);

    const roleOptions = [
        { label: 'Admin', value: 'admin' },
        { label: 'Trabajador', value: 'trabajador' },
    ];

    const handleSave = () => {
        const updatedWorker = {
            ...worker,
            nombre: name,
            role,
            email,
        };
        onSave(updatedWorker);
        onClose();
    };

    return (
        <Modal show={true} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar Trabajador</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formName">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formRole">
                        <Form.Label>Rol</Form.Label>
                        <Select
                            options={roleOptions}
                            value={roleOptions.find(option => option.value === role)}
                            onChange={(selectedOption) => setRole(selectedOption.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cerrar</Button>
                <Button variant="primary" onClick={handleSave}>Guardar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditarTrabajador;
