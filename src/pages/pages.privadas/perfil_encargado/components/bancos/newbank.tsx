import { useState } from "react";
import { DatosBank } from "../../../../models/interfaces";
import { saveDatosBank } from "../../services/admin_feria_fuctions";
import { useSelector } from "react-redux";
import { AppStore } from "../../../../../redux/store";
import { useToast } from "@components/ToastService"; // Importación del servicio de toast

export const NuevoBanco = () => {
  const id_user = useSelector((store: AppStore) => store.user.id_user);

  const [newbank, setNewBank] = useState<DatosBank>({
    mail_banco: "",
    nombre_asociado: "",
    numero_cuenta: "",
    id_user_enf: id_user,
  });

  const { addToast } = useToast(); // Hook para mostrar mensajes con ToastService

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

    if (errors.length > 0) {
      addToast({ type: "error", message: "Existen errores en los campos del formulario." });
    }

    return errors.length === 0;
  };

  const handleAdd = async () => {
    if (!validateFields()) return;

    try {
      await saveDatosBank(newbank);

      setNewBank({
        mail_banco: "",
        nombre_asociado: "",
        numero_cuenta: "",
        id_user_enf: id_user,
      });

      addToast({ type: "success", message: "Banco agregado exitosamente." });
    } catch (error) {
      console.error("Error al agregar el banco:", error);
      addToast({ type: "error", message: "Error al agregar el banco." });
    }
  };

  return (
    <>
      <label>Ingresar Nuevo Banco</label>
      <div className="inputs">
        <div className="input-field">
          <label>Correo</label>
          <input
            type="text"
            placeholder="Correo del banco"
            value={newbank.mail_banco}
            onChange={(e) => setNewBank({ ...newbank, mail_banco: e.target.value })}
          />
        </div>
        <div className="input-field">
          <label>Nombre</label>
          <input
            type="text"
            placeholder="Nombre asociado"
            value={newbank.nombre_asociado}
            onChange={(e) => setNewBank({ ...newbank, nombre_asociado: e.target.value })}
          />
        </div>
        <div className="input-field">
          <label>Número de cuenta</label>
          <input
            type="text"
            placeholder="Número de cuenta"
            value={newbank.numero_cuenta}
            onChange={(e) => setNewBank({ ...newbank, numero_cuenta: e.target.value })}
          />
        </div>
        <div className="input-field">
          <button onClick={handleAdd}>Agregar</button>
        </div>
      </div>
    </>
  );
};
