/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import { getDatosBank } from "../../services/admin_feria_fuctions";
import { AppStore } from "../../../../../redux/store";
import { useEffect, useState } from "react";
import { DatosBank } from "../../../../models/interfaces";


export const DatosBanco = () => {


  const id_user = useSelector((store: AppStore) => store.user.id_user);

  const [encargadoBank, setEncargadoBank] = useState<DatosBank>({
    mail_banco: '',
    nombre_asociado: '',
    numero_cuenta: '',
    id_user_enf: null,
  });

  // Cargar los datos del banco en el useEffect
  useEffect(() => {
    getDatosBank(id_user)
      .then((res: DatosBank) => {
        setEncargadoBank(res);
      })
      .catch((error) => {
        console.error("Error al cargar los datos de los bancos del encargado:", error);
      });
  }, []);

  return (
   <>
     

   </>
  );
};
