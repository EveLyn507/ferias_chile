/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { DatosBank, listBanks } from "../../../../models/interfaces";

export const CardDatosBank = ({ bancos }: listBanks) => {
    return (
        <>
            <div className="ferias">
                {bancos.map((banco, index) => {
                    const [isEditing, setIsEditing] = useState(false); // Controla si los inputs están habilitados para cada card
                    const [formData, setFormData] = useState({ ...banco }); // Estado local para los datos editables

                    // Función para habilitar los inputs de esta card
                    const handleEdit = () => {
                        setIsEditing(true);
                    };

                    // Función para guardar los cambios y deshabilitar los inputs
                    const handleSave = () => {
                        setIsEditing(false);
                        // Aquí puedes añadir la lógica para enviar los datos actualizados al backend
                        console.log("Datos actualizados: ", formData);
                    };

                    // Función para manejar los cambios en los inputs
                    const handleChange = (field: keyof DatosBank, value: string) => {
                        setFormData((prevData) => ({ ...prevData, [field]: value }));
                    };

                    return (
                        <div className="card" key={index}>
                            <ul>
                                <li>
                                    <input
                                        type="text"
                                        value={formData.nombre_asociado}
                                        disabled={!isEditing}
                                        onChange={(e) => handleChange("nombre_asociado", e.target.value)}
                                    />
                                </li>
                                <li>
                                    <input
                                        type="text"
                                        value={formData.numero_cuenta}
                                        disabled={!isEditing}
                                        onChange={(e) => handleChange("numero_cuenta", e.target.value)}
                                    />
                                </li>
                                <li>
                                    <input
                                        type="text"
                                        value={formData.mail_banco}
                                        disabled={!isEditing}
                                        onChange={(e) => handleChange("mail_banco", e.target.value)}
                                    />
                                </li>
                            </ul>
                            {/* Botón para habilitar los inputs */}
                            {!isEditing ? (
                                <button onClick={handleEdit}>Actualizar</button>
                            ) : (
                                <button onClick={handleSave}>Guardar Cambios</button>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
};
