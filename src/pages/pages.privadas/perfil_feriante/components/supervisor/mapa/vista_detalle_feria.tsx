/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { arriendo, PlanoItemElement , plano, todayArriendos } from "./mapaModel";
import userWebSocketService from "../../../../../models/webSoket";
import Mapa from "./mapa_feria";


export const MapaSupervisor = () => { 
  const WebSocketService = userWebSocketService.getInstance();
  const { id_feria } = useParams<{ id_feria: string }>();
  const idFeria = id_feria ? parseInt(id_feria) : 0;

  const [puestos, setPuestos] = useState<PlanoItemElement[]>([]);
  const [calles, setCalles] = useState<PlanoItemElement[]>([]);
  const [arriendos, setArriendos] = useState<arriendo[]>([]);
  const [plano, setPlano] = useState<plano>({
    id_feria: idFeria,
    id_plano: null,
    width: 500,
    height: 500,
  });

  const { nombre_feria } = useParams<{ nombre_feria: string }>() as { nombre_feria: string };
  const { fecha } = useParams<{ fecha: string }>() as { fecha: string };
console.log(arriendos);

  // Estado para controlar qué componente se muestra

  // Conexión WebSocket solo si no está conectado y no se ha realizado previamente
  useEffect(() => {
    const isSocketConnected = sessionStorage.getItem("socketConnected");

    if (!isSocketConnected || WebSocketService.socket === null) {
      WebSocketService.connect();
      sessionStorage.setItem("socketConnected", "true"); // Marca como conectado
    }
  }, []); // Este effect solo se ejecuta una vez cuando el componente se monta

  const carga = async () => {
    WebSocketService.sendMessage("join_room", { id_feria });
    WebSocketService.sendMessage("TodayFeriaElements", { idFeria, nombre_feria, fecha });
    
    WebSocketService.RecibeData("nuevo_puesto", (data) => {
      setPuestos((prevPuestos) => [...prevPuestos, data.puesto]);
    });

    await WebSocketService.RecibeData("ResponceTodayFeriaElements", (data: todayArriendos) => {
      console.log(data);
      
      if (!data || !data.todayArriendos) {
        console.error("Datos recibidos son inválidos:", data);
        return;
      }
  
      const puestosday = data.planoData.elements.filter((item) => item.id_tipo_elemento === 1);
      const callesday = data.planoData.elements.filter((item) => item.id_tipo_elemento === 2);
  
      // Mapear estados a los puestos
      const puestosConEstado = puestosday.map((puesto) => {
        const arriendo = data.todayArriendos.find((arriendo) => arriendo.id_puesto === puesto.dataPuesto?.id_puesto);
        return {
          ...puesto,
          dataPuesto: {
            ...puesto.dataPuesto,
            id_estado_puesto: arriendo ? arriendo.id_estado_arriendo : 0, // Estado predeterminado si no hay arriendo
          },
        };
      });
  
      setPlano(data.planoData.plano);
      setPuestos(puestosConEstado);
      setCalles(callesday);
      setArriendos(data.todayArriendos);
    });
  };

  useEffect(() => {
    const espera = async () => {
      await carga();
    };
    espera();
  }, []);

  const udapt = async () => {
    await WebSocketService.RecibeData("room_message", (updated) => {
      setArriendos((prevArriendos) => {
        if (!prevArriendos.some((arriendo) => arriendo.id_arriendo_puesto === updated.id_arriendo_puesto)) {
          console.warn("Actualización ignorada para arriendo desconocido:", updated);
          return prevArriendos; // No actualices si el arriendo no existe
        }
  
        return prevArriendos.map((arriendo) =>
          arriendo.id_arriendo_puesto === updated.id_arriendo_puesto
            ? { ...arriendo, id_estado_arriendo: updated.id_estado_arriendo }
            : arriendo
        );
      });
    });
  };

  useEffect(() => {
  const actualizarEstados = async () => {
    await WebSocketService.RecibeData("estado_puesto_actualizado", (updatedPuesto) => {
      setArriendos((prevArriendos) => {
        const nuevosArriendos = prevArriendos.map((arriendo) =>
          arriendo.id_puesto === updatedPuesto.id_puesto
            ? { ...arriendo, id_estado_arriendo: updatedPuesto.id_estado_arriendo }
            : arriendo
        );
        return nuevosArriendos;
      });
    });
  };

  actualizarEstados();

  return () => {
    WebSocketService.sendMessage("leave_room", { id_feria });
  };
}, []);

  return ( 
    <>
 
        <Mapa puestos={puestos} calles={calles} plano={plano} isStatic={true} arriendos={arriendos || []} />
        </>
  );  
};

export default MapaSupervisor;
