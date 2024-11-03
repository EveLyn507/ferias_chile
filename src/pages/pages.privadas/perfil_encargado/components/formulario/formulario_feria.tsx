// components/FeriaForm.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { AppStore } from '../../../../../redux/store';
import regionesData from './regiones.json';
import comunasData from './comunas.json';
import { bancoService } from '../../rxjs/sharingbankslist';
import { DatosBank } from '../../../../models/interfaces';


interface Feria {
    id_user_enf: number;
    nombre: string;
    id_comuna: number;
    id_region: number;
    id_estado: number;
    mail_banco: string | null; 
}

interface Comunas {
    id_comuna: number;
    comuna: string;
    id_region: number;
}

const FeriaForm: React.FC = () => {
    const id_user_enf = useSelector ((store : AppStore)=> store.user.id_user)
    const [feria, setFeria] = useState<Feria>({
        id_user_enf: id_user_enf,
        nombre: '',
        id_region: 0,
        id_comuna: 0,
        id_estado: 0,
        mail_banco: '',
    });

    const [bancos, setBancos] =  useState<DatosBank[]>([]);;
    const [filteredRegions, setFilteredRegions] = useState(regionesData);
    const [comunas, setComunas] = useState<Comunas[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFeria({ ...feria, [name]: value });
    };

    useEffect(() => {
        bancoService.loadInitialBancos(id_user_enf)
        const subscribe = bancoService.bancos$.subscribe((bancos) => {
            setBancos(bancos)
        })
        return () => subscribe.unsubscribe();
    })

    useEffect(() => {
        if (feria.id_region) {
            setComunas(comunasData.filter(comuna => comuna.id_region === Number(feria.id_region)));
        } else {
            setComunas([]);
        }
    }, [feria.id_region]);

    const handleRegionFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        const filtered = regionesData.filter(region => region.region.toLowerCase().startsWith(query));
        setFilteredRegions(filtered);
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
                id_user_enf: id_user_enf,
                nombre: '',
                id_region: 0,
                id_comuna: 0,
                id_estado: 0,
                mail_banco: '',
            });
        } catch (error) {
            console.error('Error al insertar feria:', error);
            alert('Hubo un error al insertar la feria');
        }
    };
    console.log(bancos)
    return (
        <form onSubmit={handleSubmit}>

            <div>
                <label>Nombre:</label>
                <input type="text" name="nombre" value={feria.nombre} onChange={handleChange} required />
            </div>
            <div>
                <label>Buscar Región:</label>
                <input type="text" onChange={handleRegionFilter} placeholder="Ingrese letra inicial de la región" />
            </div>
            <div>
                <label>Región:</label>
                <select name="id_region" value={feria.id_region} onChange={handleChange} required>
                    <option value="">Seleccione una región</option>
                    {filteredRegions.map(region => (
                        <option key={region.id_region} value={region.id_region}>
                            {region.region}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Comuna:</label>
                <select name="id_comuna" value={feria.id_comuna} onChange={handleChange} required>
                    <option value="">Seleccione una comuna</option>
                    {comunas.map(comuna => (
                        <option key={comuna.id_comuna} value={comuna.id_comuna}>
                            {comuna.comuna}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>ID Estado:</label>
                <input type="number" name="id_estado" value={feria.id_estado} onChange={handleChange} required />
            </div>
            <div>
                <label>Email Banco:</label>
                <select name="mail_banco" value={feria.mail_banco || ''} onChange={handleChange}>
                    <option value=''>Seleccione un correo</option>
                    {bancos.map(bancos => (
                        
                        <option value={bancos.mail_banco} key={bancos.mail_banco}>
                            {bancos.mail_banco}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit">Insertar Feria</button>
        </form>
    );
};

export default FeriaForm;