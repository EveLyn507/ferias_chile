import { useState, useEffect } from 'react';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import MenuDerecha from './MenuDerecha';
import { setIdFeria } from '../../../../../redux/states/user';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

export interface Rectangle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  descripcion?: string;
  tipoPuesto?: string;
  estadoPuesto?: string;
  numero?: number;
}

interface Area {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Street {
  id: number;
  points: number[];
  width: number;
  height: number;
  x: number;
  y: number;
}

interface FeriaData {
  puestos: Rectangle[];
  areas: Area[];
  calles: Street[];
  planWidth: number;
  planHeight: number;
}

  const API_URL = 'http://localhost:5000';

  const Vista = () => {
    const [puestos, setPuestos] = useState<Rectangle[]>([]); //lista de los puestos
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [calles, setCalles] = useState<Street[]>([]);
    const { id_feria } = useParams<{ id_feria: string }>();
    const idFeria = id_feria ? parseInt(id_feria) : 0
    const [selectedRectangleId, setSelectedRectangleId] = useState<number | null>(null);
    const [togleMenuD, setTogleMenuD] = useState<boolean>(false); // controla si menu derecha esta abierto o cerrado
    const [selectedPuesto, setSelectedPuesto] = useState<Rectangle | null>(null); // detecta el puesto clikeado
    const [totalPuestos, setTotalPuestos] = useState<number>(0);
  // tamaño del canvas
    const [planWidth, setPlanWidth] = useState<number>(600); 
    const [planHeight, setPlanHeight] = useState<number>(400);

    //carga de los puestos de la feria y su json
    

    useEffect(() => {
      const fetchFeriaData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await axios.get(`${API_URL}/api/feria/${id_feria}`);
          const data: FeriaData = response.data;
          await setPuestos(data.puestos);
          await setCalles(data.calles);
          await setPlanWidth(data.planWidth);
          await setPlanHeight(data.planHeight);
        } catch (error) {
          console.error('Error al obtener los datos de la feria:', error);
          setError('Error al obtener los datos de la feria');
        } finally {
          setIsLoading(false);
        }
      };

      fetchFeriaData()
    
    }, []);

    useEffect(() => {
      const fetchTotalPuestos = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/puestos/${id_feria}`);
          setTotalPuestos(response.data);
        } catch (error) {
          console.error('Error al obtener el total de puestos:', error);
        }
      };

      fetchTotalPuestos();
    }, []);
    


  //ACTUALIZA EL JSON


  const updateFeriajson = async (
    updatedPuestos?: Rectangle[],
    updatedCalles?: Street[],  // Ajusta el tipo según el tipo de 'calles'
    updatedIdFeria?: number,
    updatedPlanWidth?: number,
    updatedPlanHeight?: number
  ) => {
    // Usamos los valores pasados como parámetros o los valores por defecto
    const feriaData: FeriaData = {
      puestos: updatedPuestos || puestos,  // Usa 'updatedPuestos' si se pasa, o 'puestos' como predeterminado
      calles: updatedCalles || calles,  // Usa 'updatedCalles' si se pasa, o 'calles' como predeterminado
      id_feria: updatedIdFeria || idFeria,  // Usa 'updatedIdFeria' si se pasa, o 'id_feria' como predeterminado
      planWidth: updatedPlanWidth || planWidth,  // Usa 'updatedPlanWidth' si se pasa, o 'planWidth' como predeterminado
      planHeight: updatedPlanHeight || planHeight,  // Usa 'updatedPlanHeight' si se pasa, o 'planHeight' como predeterminado
    };
  
    await UpdateJsonFeria(feriaData);
    console.log(feriaData);
  };
  

    const AddPuesto = async (totalPuestos: number) => {
      const newPuestoJson: Rectangle = {
        x: 60,
        y: 60,
        width: 100,
        height: 100,
        fill: 'green',
        id: Date.now(),
        numero: totalPuestos + 1,
      };
    
      // Actualizamos la referencia de puestos
      const updatedPuestos = [...puestos, newPuestoJson];
    
      // Actualizamos el estado de puestos, pero ahora estamos usando la ref para asegurar que siempre tengamos el valor más reciente
      setPuestos(updatedPuestos);
      CreatePuesto(idFeria)
      // Actualizamos el total de puestos
      setTotalPuestos(totalPuestos + 1);
    
      // Llamamos a updateFeriajson después de que todo haya cambiado
      updateFeriajson(updatedPuestos);
    };
    

    const handleSaveJson = async() => {
      updateFeriajson()
    }

  //agrega el puesto a la lista local
  const updatePuesto = (updatedPuesto: Partial<Rectangle>) => {
    if (selectedPuesto) {
      setPuestos((prevPuestos) =>
        prevPuestos.map((puesto) => (puesto.id === selectedRectangleId ? { ...puesto, ...updatedPuesto } : puesto))
      );
      setTogleMenuD(false);
    }
  };





  const RemovePuesto = (id: number) => {
    setPuestos((prevPuestos) => prevPuestos.filter((puesto) => puesto.id !== id));
    setTogleMenuD(false);
  };


  const toggleMenuDerecha = (id: number) => {
    const PuestoCliked = puestos.find((puesto) => puesto.id === id);
    setSelectedRectangleId(id);
    setSelectedPuesto(PuestoCliked || null);
    setTogleMenuD(true);
  };



  const handleAddStreet = () => {
    const newStreet: Street = {
      id: Date.now(),
      x: 60,
      y: 60,
      points: [0, 0, 100, 100],
      width: 50,
      height: 100,
    };
      // Actualizamos la referencia de calles
      const updatedcalles = [...calles, newStreet];
    
      // Actualizamos el estado de calles, pero ahora estamos usando la ref para asegurar que siempre tengamos el valor más reciente
      setCalles(updatedcalles);
      // Llamamos a updateFeriajson después de que todo haya cambiado
      updateFeriajson(undefined,updatedcalles);

  };

  const handleUpdateStreet = (id: number, updatedProps: Partial<Street>) => {
    setCalles(calles.map((street) => (street.id === id ? { ...street, ...updatedProps } : street)));
  };

  const handleRemoveStreet = (id: number) => {
    setCalles(calles.filter((street) => street.id !== id));
  };


    return (
      <div className="app">

        <header className="header">
          <h1>Ferias Chile</h1>
        </header>

        <div className="main-content" style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
          <div style={{ flex: 1, padding: '10px' }}>
            {isLoading && <p>Cargando...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <Toolbar 
            onAddPuesto={()=>AddPuesto(totalPuestos)} 
            handleSaveJson={handleSaveJson}
            onAddStreet={handleAddStreet} 
            />


            <Canvas
              puestos={puestos}
              setPuestos={setPuestos}
              onPuestoClick={toggleMenuDerecha}
              planWidth={planWidth}
              planHeight={planHeight}
              setPlanWidth={setPlanWidth}
              setPlanHeight={setPlanHeight}
              calles={calles}
              onUpdateStreet={handleUpdateStreet}
              onRemoveStreet={handleRemoveStreet}
            />
          </div>


          <div >
            {togleMenuD && selectedPuesto && (
              <MenuDerecha
                selectedPuesto={selectedPuesto}
                onUpdatePuesto={updatePuesto}
                onRemoveRectangle={RemovePuesto}
                onClose={() => setTogleMenuD(false)}
                isLoading={isLoading}
              />
            )}
          </div>

        </div>
      </div>
    );
  };

  export default Vista;
