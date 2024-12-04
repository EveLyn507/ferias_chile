/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import { AppStore } from "../../../../../redux/store";
import { useEffect, useState } from "react";
import { DatosBank, homeProps } from "../../../../models/interfaces";
import { bancoService } from "../../rxjs/sharingbankslist";
import { asociarBankFeria, getFeriaBank } from "../../services/admin_feria_fuctions";
import { useToast } from "@components/ToastService";
import { Link } from "react-router-dom";

export const BancoFeria = ({ id_feria }: homeProps) => {
  const id_user_enf = useSelector((store: AppStore) => store.user.id_user);
  const [bancos, setBancos] = useState<DatosBank[]>([]); // Lista de todos los bancos
  const [feriaBanco, setFeriaBanco] = useState<string | null>(""); // Banco asociado a la feria
  const { addToast } = useToast(); // Hook para mostrar mensajes con ToastService

  const cargaBankF = async () => {
    try {
      const b = await getFeriaBank(id_feria);
      setFeriaBanco(b ?? "seleccione un banco");
    } catch (error) {
      console.error(error);
      addToast({ type: "error", message: "Error al cargar los bancos asociados a la feria." });
    }
  };

  const asociar = async (mail_banco: string | null, id_feria: number) => {
    if (!mail_banco || mail_banco === "ninguna") {
      addToast({ type: "warning", message: "Debe seleccionar un banco antes de guardar." });
      return;
    }

    try {
      await asociarBankFeria(mail_banco, id_feria);
      addToast({ type: "success", message: "Banco asociado exitosamente a la feria." });
      await cargaBankF(); // Recargar los datos después de asociar
    } catch (error) {
      console.error(error);
      addToast({ type: "error", message: "Error al asociar el banco. Intente nuevamente." });
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
    <div className="banco-container">
      <div className="banco">
        <span>Correo asociado</span>
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

            <button onClick={() => asociar(feriaBanco, id_feria)}>Guardar Banco</button>
          </>
        ) : (
          <ul>
            <li>No hay bancos disponibles</li>
          </ul>
        )}

        <Link to={`bancos`}>Ingresa tus bancos</Link>
      </div>
    </div>
  );
};