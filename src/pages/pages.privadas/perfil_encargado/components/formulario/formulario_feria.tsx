// components/FeriaForm.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { AppStore } from '../../../../../redux/store';
import regionesData from '../../../../../assets/regiones.json';
import comunasData from '../../../../../assets/comunas.json';
import { bancoService } from '../../rxjs/sharingbankslist';
import { DatosBank } from '../../../../models/interfaces';

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

const FeriaForm: React.FC = () => {
    const id_user_enf = useSelector((store: AppStore) => store.user.id_user);
    const [feria, setFeria] = useState<Feria>({
        id_user_enf: id_user_enf,
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFeria({ ...feria, [name]: value });
    };

    useEffect(() => {
        bancoService.loadInitialBancos(id_user_enf);
        const subscribe = bancoService.bancos$.subscribe((bancos) => {
            setBancos(bancos);
        });
        return () => subscribe.unsubscribe();
    }, [id_user_enf]);

    useEffect(() => {
        if (feria.id_region) {
            setComunas(comunasData.filter((comuna) => comuna.id_region === Number(feria.id_region)));
        } else {
            setComunas([]);
        }
    }, [feria.id_region]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        const filtered = regionesData.filter((region) =>
            region.region.toLowerCase().startsWith(e.target.value.toLowerCase())
        );
        setFilteredRegions(filtered);
    };

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
        setSearchTerm(''); // Reset search term when toggling dropdown
    };

    const handleSelectRegion = (regionId: number) => {
        setFeria({ ...feria, id_region: regionId });
        setIsDropdownOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
                mail_banco: '',
            });
        } catch (error) {
            console.error('Error al insertar feria:', error);
            alert('Hubo un error al insertar la feria');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
                <label>Nombre:</label>
                <input
                    type="text"
                    name="nombre"
                    value={feria.nombre}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
            </div>
            <div style={styles.inputGroup}>
                <label>Región:</label>
                <div style={styles.dropdown}>
                    <button type="button" onClick={handleDropdownToggle} style={styles.dropdownButton}>
                        {feria.id_region
                            ? regionesData.find((region) => region.id_region === feria.id_region)?.region
                            : 'Seleccione una región'}
                    </button>
                    {isDropdownOpen && (
                        <div style={styles.dropdownMenu}>
                            <input
                                type="text"
                                onChange={handleSearchChange}
                                value={searchTerm}
                                placeholder="Buscar región..."
                                style={styles.searchInput}
                                autoFocus
                            />
                            <ul style={styles.dropdownList}>
                                {filteredRegions.map((region) => (
                                    <li
                                        key={region.id_region}
                                        onClick={() => handleSelectRegion(region.id_region)}
                                        style={styles.dropdownListItem}
                                    >
                                        {region.region}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <div style={styles.inputGroup}>
                <label>Comuna:</label>
                <select
                    name="id_comuna"
                    value={feria.id_comuna}
                    onChange={handleChange}
                    required
                    style={styles.select}
                >
                    <option value="">Seleccione una comuna</option>
                    {comunas.map((comuna) => (
                        <option key={comuna.id_comuna} value={comuna.id_comuna}>
                            {comuna.comuna}
                        </option>
                    ))}
                </select>
            </div>
            <div style={styles.inputGroup}>
                <label>Email Banco:</label>
                <select
                    name="mail_banco"
                    value={feria.mail_banco || ''}
                    onChange={handleChange}
                    style={styles.select}
                >
                    <option value="">Seleccione un correo</option>
                    {bancos.map((banco) => (
                        <option key={banco.mail_banco} value={banco.mail_banco}>
                            {banco.mail_banco}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit" style={styles.submitButton}>Insertar Feria</button>
        </form>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    form: {
        width: '300px',
        margin: 'auto',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    select: {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    dropdown: {
        position: 'relative' as 'relative',  // Indica un valor específico
    },
    dropdownButton: {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        cursor: 'pointer',
        textAlign: 'left',
    },
    dropdownMenu: {
        position: 'absolute' as 'absolute',  // Indica un valor específico
        top: '100%',
        left: '0',
        right: '0',
        borderRadius: '4px',
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        zIndex: 1,
    },
    searchInput: {
        width: '100%',
        padding: '8px',
        border: 'none',
        borderBottom: '1px solid #ddd',
        borderRadius: '4px 4px 0 0',
    },
    dropdownList: {
        listStyleType: 'none',
        padding: '0',
        margin: '0',
        maxHeight: '150px',
        overflowY: 'auto',
    },
    dropdownListItem: {
        padding: '8px',
        cursor: 'pointer',
    },
    submitButton: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#4CAF50',
        color: '#fff',
        cursor: 'pointer',
    },
};


export default FeriaForm;
