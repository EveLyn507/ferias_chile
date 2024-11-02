// components/FeriaForm.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface Feria {
    id_user_enf: number;
    nombre: string;
    id_comuna: number;
    id_estado: number;
    mail_banco: string | null; // Permitir null
}

const FeriaForm: React.FC = () => {
    const [feria, setFeria] = useState<Feria>({
        id_user_enf: 0,
        nombre: '',
        id_comuna: 0,
        id_estado: 0,
        mail_banco: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFeria({ ...feria, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Enviar mail_banco como null si está vacío
        const feriaData = {
            ...feria,
            mail_banco: feria.mail_banco === '' ? null : feria.mail_banco,
        };

        try {
            const response = await axios.post('http://localhost:5000/createFeria', feriaData);
            console.log('Feria insertada:', response.data);
            alert('Feria insertada correctamente');
            setFeria({
                id_user_enf: 0,
                nombre: '',
                id_comuna: 0,
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
            <div>
                <label>ID Encargado:</label>
                <input type="number" name="id_user_enf" value={feria.id_user_enf} onChange={handleChange} required />
            </div>
            <div>
                <label>Nombre:</label>
                <input type="text" name="nombre" value={feria.nombre} onChange={handleChange} required />
            </div>
            <div>
                <label>ID Comuna:</label>
                <input type="number" name="id_comuna" value={feria.id_comuna} onChange={handleChange} required />
            </div>
            <div>
                <label>ID Estado:</label>
                <input type="number" name="id_estado" value={feria.id_estado} onChange={handleChange} required />
            </div>
            <div>
                <label>Email Banco:</label>
                <input type="email" name="mail_banco" value={feria.mail_banco || ''} onChange={handleChange} />
            </div>
            <button type="submit">Insertar Feria</button>
        </form>
    );
};

export default FeriaForm;
