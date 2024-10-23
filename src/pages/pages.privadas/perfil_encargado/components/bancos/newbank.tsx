import { useState } from "react";
import { DatosBank } from "../../../../models/interfaces";
import { saveDatosBank } from "../../services/admin_feria_fuctions";
import { bancoService } from "./rxjs/sharingbankslist";
import { useSelector } from "react-redux";
import { AppStore } from "../../../../../redux/store";

export const NuevoBanco = () => {
  const mail = useSelector((store: AppStore) => store.user.email);
  
  const [newbank, setNewBank] = useState<DatosBank>({
    mail_banco: '',
    nombre_asociado: '',
    numero_cuenta: '',
    encargado_mail: mail, 
  });

  const handleAdd = async () => {
    try {
      await saveDatosBank(newbank); // Enviar datos al backend
      bancoService.addBanco(newbank); // Actualizar la lista en el servicio
      // Limpiar el formulario después de añadir el banco
      setNewBank({ mail_banco: '', nombre_asociado: '', numero_cuenta: '', encargado_mail: mail });
    } catch (error) {
      console.error("Error al agregar el banco:", error);
      // Aquí puedes mostrar un mensaje de error al usuario si lo deseas
    }
  };

  return (
    <div>
      <div>
        <label>Correo del Banco</label>
        <input
          type="text"
          placeholder="Correo del banco"
          value={newbank.mail_banco}
          onChange={(e) => setNewBank({ ...newbank, mail_banco: e.target.value })}
        />
      </div>

      <div>
        <label>Nombre Asociado</label>
        <input
          type="text"
          placeholder="Nombre asociado"
          value={newbank.nombre_asociado}
          onChange={(e) => setNewBank({ ...newbank, nombre_asociado: e.target.value })}
        />
      </div>

      <div>
        <label>Número de Cuenta</label>
        <input
          type="text"
          placeholder="Número de cuenta"
          value={newbank.numero_cuenta}
          onChange={(e) => setNewBank({ ...newbank, numero_cuenta: e.target.value })}
        />
      </div>

      <button onClick={handleAdd}>Agregar Banco</button>
    </div>
  );
};
