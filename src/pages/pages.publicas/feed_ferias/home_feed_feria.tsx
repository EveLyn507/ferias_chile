/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import Feed_d_ferias from './components/listado_ferias/carga_feria';
import { Filtros_base } from '../../../components/filtros';
import userWebSocketService from '../../models/webSoket';
import Carrusel from './components/listado_ferias/carrusel';
import styles from './css/feed.module.css';
import './css/carrusel.css';
import './css/cards_feed.css'
import feedStyle from './css/filtros.module.css'
const View_feed = () => {
  const [selectedComuna, setSelectedComuna] = useState<number | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);

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
    <>
    <div>
      <Carrusel />
    </div>

    <div className={styles['feed-container']}>
  <div className={styles['filtros']}>
    <Filtros_base
      onFilterC={(comuna) => setSelectedComuna(comuna)}
      onFilterR={(region) => setSelectedRegion(region)}
      style={feedStyle}
    />
  </div>

  <div className={styles['feed']}>
    <Feed_d_ferias comuna={selectedComuna} region={selectedRegion} />
  </div>
</div>

    </>
  );
};

export default View_feed;