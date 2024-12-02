import { useEffect, useState } from "react";
import { DatosBank } from "../../../../models/interfaces";
import { bancoService } from "../../rxjs/sharingbankslist";
import { deleteBank, updateDatosBank } from "../../services/admin_feria_fuctions";
import { useToast } from "@components/ToastService"; // Importación del servicio de toast

export const CardDatosBank = () => {
  const [formDataList, setFormDataList] = useState<DatosBank[]>([]);
  const [editStates, setEditStates] = useState<boolean[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { addToast } = useToast(); // Hook para mostrar mensajes con ToastService

  useEffect(() => {
    try {
      const subscription = bancoService.bancos$.subscribe((bancos) => {
        setFormDataList(bancos);
        setEditStates(bancos.map(() => false));
      });
      return () => subscription.unsubscribe();
    } catch (error) {
      console.error("Error al cargar los bancos:", error);
      addToast({ type: "error", message: "Error al cargar los bancos." });
    }
  }, []);

  const handleEdit = (index: number) => {
    setEditStates((prev) =>
      prev.map((editState, i) => (i === index ? true : editState))
    );
    setValidationErrors([]);
  };

  const handleUpdate = (index: number) => {
    const currentData = formDataList[index];

    const errors: string[] = [];
    if (!currentData.nombre_asociado || currentData.nombre_asociado.trim() === "") {
      errors.push("El nombre del asociado no puede estar vacío.");
    }
    if (
      !/^\d+$/.test(currentData.numero_cuenta) ||
      currentData.numero_cuenta.length < 5
    ) {
      errors.push("El número de cuenta debe ser un número válido de al menos 5 dígitos.");
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      addToast({ type: "error", message: "Existen errores en los campos del formulario." });
      return;
    }

    try {
      setEditStates((prev) =>
        prev.map((editState, i) => (i === index ? false : editState))
      );
      updateDatosBank(currentData);
      setValidationErrors([]);
      addToast({ type: "success", message: "Banco actualizado correctamente." });
    } catch (error) {
      console.error("Error al actualizar el banco:", error);
      addToast({ type: "error", message: "Error al actualizar el banco." });
    }
  };

  const handleChange = (index: number, field: keyof DatosBank, value: string) => {
    setFormDataList((prevDataList) =>
      prevDataList.map((formData, i) =>
        i === index ? { ...formData, [field]: value } : formData
      )
    );
  };

  const borrarBank = async (mail_banco: string) => {
    const confirmDelete = window.confirm(
      "¿Está seguro de que desea eliminar este banco?"
    );
    if (confirmDelete) {
      try {
        await deleteBank(mail_banco);
        bancoService.removeBanco(mail_banco);
        addToast({ type: "success", message: "Banco eliminado correctamente." });
      } catch (error) {
        console.error("Error al eliminar el banco:", error);
        addToast({ type: "error", message: "Error al eliminar el banco." });
      }
    }
  };

  return (
    <>
      {formDataList.map((formData, index) => (
        <div className="banco-card" key={formData.mail_banco}>
          <div className="card-body">
            <label> Correo : {formData.mail_banco}</label>
            <div className="input-field">
              <label>Nombre asociado</label>
              <input
                type="text"
                value={formData.nombre_asociado}
                readOnly={!editStates[index]}
                onChange={(e) => handleChange(index, "nombre_asociado", e.target.value)}
              />
            </div>
            <div className="input-field">
              <label>Numero de Cuenta</label>
              <input
                type="text"
                value={formData.numero_cuenta}
                readOnly={!editStates[index]}
                onChange={(e) => handleChange(index, "numero_cuenta", e.target.value)}
              />
            </div>
            <div className="card-buttons">
              {!editStates[index] ? (
                <button onClick={() => handleEdit(index)}>Act</button>
              ) : (
                <button onClick={() => handleUpdate(index)}>Sav</button>
              )}
              <button onClick={() => borrarBank(formData.mail_banco)}>Eli</button>
            </div>
          </div>
        </div>
      ))}
      {validationErrors.length > 0 && (
        <div className="banco-errors">
          {validationErrors.map((error, index) => (
            <p key={index} className="banco-error-item">
              {error}
            </p>
          ))}
        </div>
      )}
    </>
  );
};
