/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import { AppStore } from "../../../../../redux/store";
import { useEffect, useState } from "react";
import { DatosBank, homeProps } from "../../../../models/interfaces";
import { bancoService } from "../../rxjs/sharingbankslist";
import { asociarBankFeria, getFeriaBank } from "../../services/admin_feria_fuctions";
import { Link } from "react-router-dom";

export const BancoFeria = ({ idFeria }: homeProps) => {
  const id_user_enf = useSelector((store: AppStore) => store.user.id_user);
  const [bancos, setBancos] = useState<DatosBank[]>([]); // Lista de todos los bancos
  const [feriaBanco, setFeriaBanco] = useState<string | null>(""); // Banco asociado a la feria
  const [warnings, setWarnings] = useState<string[]>([]); // Mensajes de advertencia
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Mensaje de éxito

  const cargaBankF = async () => {
    try {
      const b = await getFeriaBank(idFeria);
      setFeriaBanco(b ?? "seleccione un banco");
    } catch (error) {
      setWarnings(["Error al cargar los bancos asociados a la feria."]);
    }
  };

  const asociar = async (mail_banco: string | null, id_feria: number) => {
    if (!mail_banco || mail_banco === "ninguna") {
      setWarnings(["Debe seleccionar un banco antes de guardar."]);
      setSuccessMessage(null); // Limpiar mensaje de éxito si hay advertencias
      return;
    }

    try {
      await asociarBankFeria(mail_banco, id_feria);
      setWarnings([]);
      setSuccessMessage("Banco asociado exitosamente a la feria."); // Mostrar mensaje de éxito
      await cargaBankF(); // Recargar los datos después de asociar
    } catch (error) {
      setWarnings(["Error al asociar el banco. Intente nuevamente."]);
      setSuccessMessage(null); // Limpiar mensaje de éxito si hay errores
    }
  };

  useEffect(() => {
    bancoService.loadInitialBancos(id_user_enf);

    const subscription = bancoService.bancos$.subscribe((bancos) => {
      setBancos(bancos);
    });

    cargaBankF();

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <div>
        {/* Otros elementos */}
      </div>
      {bancos.length > 0 ? (
        <>
          <select
            name="feriaBanco"
            id="feriaBanco"
            value={feriaBanco || ""}
            onChange={(e) => setFeriaBanco(e.target.value || null)}
          >
            <option value="ninguna">Ninguna</option>
            <option value={feriaBanco || ""}>{feriaBanco}</option>
            {bancos.map((banco, index) => (
              <option key={index} value={banco.mail_banco}>
                {banco.mail_banco}
              </option>
            ))}
          </select>

          <button onClick={() => asociar(feriaBanco, idFeria)}>Guardar Banco</button>

          {warnings.length > 0 && (
            <div style={{ color: "red", marginTop: "10px" }}>
              {warnings.map((warning, index) => (
                <p key={index}>{warning}</p>
              ))}
            </div>
          )}
          {successMessage && (
            <div style={{ color: "green", marginTop: "10px" }}>
              <p>{successMessage}</p>
            </div>
          )}
        </>
      ) : (
        <ul>
          <li>No hay bancos disponibles</li>
        </ul>
      )}
      <li>
        <Link to={`bancos`}>Ingresa tus bancos</Link>
      </li>
    </>
  );
};
