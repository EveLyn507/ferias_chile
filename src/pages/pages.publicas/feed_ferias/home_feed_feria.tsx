/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import Feed_d_ferias from './components/listado_ferias/carga_feria';
import { Filtros_base } from './components/listado_ferias/filtros';
import '../../../css/base.css';
import userWebSocketService from '../../models/webSoket';

const View_feed = () => {
  const [selectedComuna, setSelectedComuna] = useState<number | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
    console.log('idcomuna',selectedComuna, 'idregion',selectedRegion );
    const WebSocketService = userWebSocketService.getInstance();

      // Conexión WebSocket solo si no está conectado y no se ha realizado previamente
  useEffect(() => {
    const isSocketConnected = sessionStorage.getItem('socketConnected');

    if (!isSocketConnected || WebSocketService.socket === null) {
      WebSocketService.connect();
      sessionStorage.setItem('socketConnected', 'true');  // Marca como conectado
    }
  }, []); // Este effect solo se ejecuta una vez cuando el componente se monta

  return (
    <div className="container">
      <Filtros_base onFilterC={(comuna) => setSelectedComuna(comuna)} onFilterR={(region) => setSelectedRegion(region)} />
      <Feed_d_ferias comuna={selectedComuna}  region={selectedRegion} />
    </div>
  );
};

export default View_feed;