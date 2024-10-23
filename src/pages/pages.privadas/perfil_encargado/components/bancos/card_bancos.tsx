import { useEffect, useState } from "react";
import { DatosBank } from "../../../../models/interfaces";
import { bancoService } from "./rxjs/sharingbankslist";
import { deleteBank, saveDatosBank } from "../../services/admin_feria_fuctions";
import { useSelector } from "react-redux";
import { AppStore } from "../../../../../redux/store";

export const CardDatosBank = () => {
  const mail = useSelector((store: AppStore) => store.user.email);
  const [formDataList, setFormDataList] = useState<DatosBank[]>([]);
  const [editStates, setEditStates] = useState<boolean[]>([]);

  useEffect(() => {
    // Suscribirse a los cambios en la lista de bancos
    const subscription = bancoService.bancos$.subscribe((bancos) => {
      setFormDataList(bancos);
      setEditStates(bancos.map(() => false)); // Inicializa los estados de edición
    });

    // Cargar los bancos iniciales desde el backend
    bancoService.loadInitialBancos(mail);

    // Cleanup: cancelar la suscripción cuando el componente se desmonte
    return () => subscription.unsubscribe();
  }, [mail]); // Ejecuta el efecto nuevamente si cambia el mail

  const handleEdit = (index: number) => {
    setEditStates((prev) => prev.map((editState, i) => (i === index ? true : editState)));
  };

  const handleSave = (index: number) => {
    setEditStates((prev) => prev.map((editState, i) => (i === index ? false : editState)));
    saveDatosBank(formDataList[index]);
  };

  const handleChange = (index: number, field: keyof DatosBank, value: string) => {
    setFormDataList((prevDataList) =>
      prevDataList.map((formData, i) =>
        i === index ? { ...formData, [field]: value } : formData
      )
    );
  };

  const borrarBank = async (mail_banco: string) => {
    try {
      await deleteBank(mail_banco);
      bancoService.removeBanco(mail_banco); // Actualiza la lista usando RxJS
    } catch (error) {
      console.error("Error al eliminar el banco:", error);
    }
  };

  return (
    <div className="ferias">
      {formDataList.map((formData, index) => (
        <div className="card" key={formData.mail_banco}> {/* Usar mail_banco como key */}
          <ul>
            <li>
              <input
                type="text"
                value={formData.nombre_asociado}
                readOnly={!editStates[index]}
                onChange={(e) => handleChange(index, "nombre_asociado", e.target.value)}
              />
            </li>
            <li>
              <input
                type="text"
                value={formData.numero_cuenta}
                readOnly={!editStates[index]}
                onChange={(e) => handleChange(index, "numero_cuenta", e.target.value)}
              />
            </li>
            <li>
              <label>{formData.mail_banco}</label> {/* Mostrar como label */}
            </li>
          </ul>
          {!editStates[index] ? (
            <button onClick={() => handleEdit(index)}>Actualizar</button>
          ) : (
            <button onClick={() => handleSave(index)}>Guardar Cambios</button>
          )}
          <button onClick={() => borrarBank(formData.mail_banco)}>Borrar Banco</button>
        </div>
      ))}
    </div>
  );
};
