// components/FeriaForm.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface Feria {
    nombre: string;
    id_comuna: number;
    encargado_mail: string;
    id_region: number;
    id_estado: number;
    mail_banco: string;
}

const FeriaForm: React.FC = () => {
    const [feria, setFeria] = useState<Feria>({
        nombre: '',
        id_comuna: 0,
        encargado_mail: '',
        id_region: 0,
        id_estado: 0,
        mail_banco: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFeria({ ...feria, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/feria', feria);
            console.log('Feria insertada:', response.data);
            alert('Feria insertada correctamente');
            setFeria({
                nombre: '',
                id_comuna: 0,
                encargado_mail: '',
                id_region: 0,
                id_estado: 0,
                mail_banco: '',
            });
        } catch (error) {
            console.error('Error al insertar feria:', error);
            alert('Hubo un error al insertar la feria');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div><label>Nombre:</label><input type="text" name="nombre" value={feria.nombre} onChange={handleChange} required /></div>
            <div><label>ID Comuna:</label><input type="number" name="id_comuna" value={feria.id_comuna} onChange={handleChange} required /></div>
            <div><label>Encargado Email:</label><input type="email" name="encargado_mail" value={feria.encargado_mail} onChange={handleChange} required /></div>
            <div><label>ID Región:</label><input type="number" name="id_region" value={feria.id_region} onChange={handleChange} required /></div>
            <div><label>ID Estado:</label><input type="number" name="id_estado" value={feria.id_estado} onChange={handleChange} required /></div>
            <div><label>Email Banco:</label><input type="email" name="mail_banco" value={feria.mail_banco} onChange={handleChange} required /></div>
            <button type="submit">Insertar Feria</button>
        </form>
    );
};

export default FeriaForm;
