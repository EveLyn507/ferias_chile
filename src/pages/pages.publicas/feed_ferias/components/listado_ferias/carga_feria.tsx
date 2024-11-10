import { useEffect, useState } from 'react';
import { CardFerias } from './card_feria';
import { Feria } from '../../../../models/interfaces';
import { traerFerias } from '../../services/traer_ferias';

const Feed_d_ferias = ({ selectedComuna }: { selectedComuna: string }) => {
  const [ferias, setFerias] = useState<Feria[]>([]);
  const [filteredFerias, setFilteredFerias] = useState<Feria[]>([]);

  useEffect(() => {
    traerFerias()
      .then((res: Feria[]) => {
        setFerias(res);
        setFilteredFerias(res); // Inicializa el filtro con todas las ferias
      })
      .catch((error) => {
        console.error('Error al cargar ferias:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedComuna) {
      setFilteredFerias(ferias.filter((feria) => feria.comuna === selectedComuna));
    } else {
      setFilteredFerias(ferias);
    }
  }, [selectedComuna, ferias]);

  return <CardFerias ferias={filteredFerias} />;
};

export default Feed_d_ferias;