import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { AppStore } from '../../../../../redux/store';
import regionesData from '../../../../../assets/regiones.json';
import comunasData from '../../../../../assets/comunas.json';
import { bancoService } from '../../rxjs/sharingbankslist';
import { DatosBank } from '../../../../models/interfaces';
import './FormFeria.css';

interface Feria {
    id_user_enf: number;
    nombre: string;
    id_comuna: number;
    id_region: number;
    mail_banco: string | null;
}

interface Comunas {
    id_comuna: number;
    comuna: string;
    id_region: number;
}

interface formProps {
    loadData: () => void
}
const FeriaForm = ({loadData} : formProps) => {
    const id_user_enf = useSelector((store: AppStore) => store.user.id_user);
    const [feria, setFeria] = useState<Feria>({
        id_user_enf,
        nombre: '',
        id_region: 0,
        id_comuna: 0,
        mail_banco: '',
    });

    const [bancos, setBancos] = useState<DatosBank[]>([]);
    const [filteredRegions, setFilteredRegions] = useState(regionesData);
    const [comunas, setComunas] = useState<Comunas[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        bancoService.loadInitialBancos(id_user_enf);
        const subscription = bancoService.bancos$.subscribe(setBancos);
        return () => subscription.unsubscribe();
    }, [id_user_enf]);

    useEffect(() => {
        if (feria.id_region) {
            setComunas(comunasData.filter((c) => c.id_region === feria.id_region));
        } else {
            setComunas([]);
        }
    }, [feria.id_region]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFeria((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setFilteredRegions(
            regionesData.filter((region) =>
                region.region.toLowerCase().startsWith(e.target.value.toLowerCase())
            )
        );
    };

    const handleSelectRegion = (regionId: number) => {
        setFeria({ ...feria, id_region: regionId, id_comuna: 0 });
        setIsDropdownOpen(false);
    };

    const handleDropdownToggle = () => {
        setIsDropdownOpen((prev) => !prev);
        setSearchTerm('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/createFeria', {
                ...feria,
                mail_banco: feria.mail_banco || null,
            });
            alert('Feria insertada correctamente');
            setFeria({ id_user_enf, nombre: '', id_region: 0, id_comuna: 0, mail_banco: '' });
        } catch (error) {
            console.error(error);
            alert('Error al insertar feria');
        }
        loadData()
    };



    return (
        <div className="main-container">
            <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={feria.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Región:</label>
                    <div className="dropdown">
                        <button type="button" onClick={handleDropdownToggle} className="dropdown-button">
                            {feria.id_region
                                ? regionesData.find((r) => r.id_region === feria.id_region)?.region
                                : 'Seleccione una región'}
                        </button>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <input
                                    type="text"
                                    onChange={handleSearchChange}
                                    value={searchTerm}
                                    placeholder="Buscar región..."
                                    className="search-input"
                                    autoFocus
                                />
                                <ul className="dropdown-list">
                                    {filteredRegions.map((region) => (
                                        <li
                                            key={region.id_region}
                                            onClick={() => handleSelectRegion(region.id_region)}
                                            className="dropdown-list-item"
                                        >
                                            {region.region}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                <div className="input-group">
                    <label>Comuna:</label>
                    <select
                        name="id_comuna"
                        value={feria.id_comuna}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione una comuna</option>
                        {comunas.map((comuna) => (
                            <option key={comuna.id_comuna} value={comuna.id_comuna}>
                                {comuna.comuna}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <label>Email Banco:</label>
                    <select
                        name="mail_banco"
                        value={feria.mail_banco || ''}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione un correo</option>
                        {bancos.map((banco) => (
                            <option key={banco.mail_banco} value={banco.mail_banco}>
                                {banco.mail_banco}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="submit-button">
                    Insertar Feria
                </button>
            </form>
        </div>
        </div>
        
    );
};

export default FeriaForm;
