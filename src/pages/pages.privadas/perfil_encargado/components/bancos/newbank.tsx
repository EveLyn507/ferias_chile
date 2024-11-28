import { useState } from "react";
import { DatosBank } from "../../../../models/interfaces";
import { saveDatosBank } from "../../services/admin_feria_fuctions";
import { useSelector } from "react-redux";
import { AppStore } from "../../../../../redux/store";

export const NuevoBanco = () => {
  const id_user = useSelector((store: AppStore) => store.user.id_user);

  const [newbank, setNewBank] = useState<DatosBank>({
    mail_banco: '',
    nombre_asociado: '', 
    numero_cuenta: '',
    id_user_enf: id_user,
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateFields = () => {
    const errors: string[] = [];

    if (!newbank.mail_banco || !/\S+@\S+\.\S+/.test(newbank.mail_banco)) {
      errors.push("El correo del banco debe ser válido.");
    }

    if (!newbank.nombre_asociado || newbank.nombre_asociado.trim().length === 0) {
      errors.push("El nombre asociado no puede estar vacío.");
    } else if (newbank.nombre_asociado.length > 50) {
      errors.push("El nombre asociado no puede superar los 50 caracteres.");
    }

    if (!newbank.numero_cuenta || !/^\d+$/.test(newbank.numero_cuenta)) {
      errors.push("El número de cuenta debe ser un número válido.");
    } else if (newbank.numero_cuenta.length < 5) {
      errors.push("El número de cuenta debe tener al menos 5 caracteres.");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleAdd = async () => {
    if (!validateFields()) return;

    try {
      const ok = await saveDatosBank(newbank);
      console.log(ok);

      setNewBank({
        mail_banco: '',
        nombre_asociado: '',
        numero_cuenta: '',
        id_user_enf: id_user,
      });

      setValidationErrors([]);
      setSuccessMessage("El banco se ha agregado exitosamente.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error al agregar el banco:", error);
    }
  };

  return (
      <>
      <label> Ingresar Nuevo Banco</label>
      <div className="inputs">
        <div className="input-field">
        <label> Correo</label>
        <input
          type="text"
          placeholder="Correo del banco"
          value={newbank.mail_banco}
          onChange={(e) => setNewBank({ ...newbank, mail_banco: e.target.value })}
        />        
      </div>
        <div className="input-field">
        <label> Nombre </label>
        <input
          type="text"
          placeholder="Nombre asociado"
          value={newbank.nombre_asociado}
          onChange={(e) => setNewBank({ ...newbank, nombre_asociado: e.target.value })}
        />   
         </div>
  
    <div className="input-field">
    <label> Numero de cuenta</label>
        <input
          type="text"
          placeholder="Número de cuenta"
          value={newbank.numero_cuenta}
          onChange={(e) => setNewBank({ ...newbank, numero_cuenta: e.target.value })}
        />
          </div>

          <div className="input-field">
             <button  onClick={handleAdd}>Agregar </button>
           </div>
          </div>
  


      {validationErrors.length > 0 && (
        <div className="nuevo-banco-errors">
          {validationErrors.map((error, index) => (
            <p key={index} className="nuevo-banco-error-item">{error}</p>
          ))}
        </div>
      )}

      {successMessage && (
        <div className="nuevo-banco-success">
          <p>{successMessage}</p>
        </div>
      )}
   </>
  );
};
