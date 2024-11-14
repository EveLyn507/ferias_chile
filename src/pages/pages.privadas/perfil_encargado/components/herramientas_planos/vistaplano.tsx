
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';

import Toolbar from './Toolbar';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {  PlanoItemElement } from './models/vistaplanoModels';
import Canvas from './Canvas2';
import MenuPuesto from './menus/MenuPuesto';
import MenuCalle from './menus/MenuCalle';
import MenuVacio from './menus/menuContainers';
import { CreatePuesto } from './services/funcionesHP';
import { debounce } from 'lodash';



  const API_URL = 'http://localhost:5000';

interface vistaProps {
  savePlanoItem : (selectedItem : PlanoItemElement) => void
}


  const Vista = ({savePlanoItem} : vistaProps ) => {

    const [totalPuestos, setTotalPuestos] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { id_feria } = useParams<{ id_feria: string }>();
    const idFeria = id_feria ? parseInt(id_feria) : 0 //extrae el id feria

    //variables de la herramienta
  // tamaño del canvas
    const [planWidth, setPlanWidth] = useState<number>(600); 
    const [planHeight, setPlanHeight] = useState<number>(400);
    const [id_plano, setIdPLano] = useState<number | null>(null);
//LA DIFERENCIA EN LA INTERFAZ RADICA EN EL PARAMETRO DE DIMENCIONES
    const [puestos, setPuestos] = useState<PlanoItemElement[]>([]); //lista de los puestos 
    const [calles, setCalles] = useState<PlanoItemElement[]>([]);//lista de las calles



    const PrevSelectedItem = useRef<PlanoItemElement|null>(null);
    const [selectedItem, setSelectedItem] = useState<PlanoItemElement|null>(null);
    // Función para manejar el clic en un ítem de cualquier layer
    const ItemClick = (item: PlanoItemElement ) => {
      setSelectedItem(item); // Guardar el item seleccionado
    };



    const debousnce=  () => {
       savePlanoItem(selectedItem!)
    }

    const debouncedSave = debounce(debousnce, 300);

    
    // actualiza en local cada ves que el item cambia , tambien guarda en bd 
    useEffect(()=> {
      if (selectedItem === null ){
        return
      } 
      const setItem = async () => {
        if(selectedItem?.id_tipo_elemento === null){
          return
        }
        else if(selectedItem?.id_tipo_elemento=== 1) {
          
          setPuestos((prevPuestos) =>
            prevPuestos.map((puesto) => (puesto.id_elemento === selectedItem!.id_elemento ? { ...puesto, ...selectedItem } : puesto))
          );
        }
        else if (selectedItem?.id_tipo_elemento=== 2){
          setCalles((prevCalles) =>
            prevCalles.map((calles) => (calles.id_elemento === selectedItem!.id_elemento ? { ...calles, ...selectedItem } : calles))
        );
      }
      }
      PrevSelectedItem.current = selectedItem
      console.log('actual' , selectedItem.id_elemento,'prev',PrevSelectedItem.current.id_elemento);
      
      setItem()
      debouncedSave()
      if (selectedItem.id_elemento === PrevSelectedItem.current.id_elemento){
        return () => debouncedSave.cancel()
      }
     
    },[selectedItem])

    
    //carga de los puestos de la feria y su json
    useEffect(() => {
      const fetchFeriaData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await axios.get(`${API_URL}/api/feria/${id_feria}`);
         const data = response.data
    
         
          await setPlanWidth(data.plano.width)
          await setPlanHeight(data.plano.height)
          await setIdPLano(data.plano.id_plano)
          const elements = await data.elements
          const puestos = await elements.filter((puestos: { id_tipo_elemento: number; }) => puestos.id_tipo_elemento === 1)
          const calles = await elements.filter((calles: { id_tipo_elemento: number; }) => calles.id_tipo_elemento === 2)
          if (calles.length != 0) {
            setCalles(calles)
          }
          if (puestos.length != 0) {
            setPuestos(puestos)
          }
         
      
      
        } catch (error) {
          console.error('Error al obtener los datos de la feria:', error);
          setError('Error al obtener los datos de la feria');
        } finally {
          setIsLoading(false);
        }
      };

      fetchFeriaData()
    
    }, []);

    
    //añade un nuevo puesto
    const AddPuesto = async (totalPuestos: number) => {
      const newPuesto: PlanoItemElement = {
        id_elemento: null,
        id_plano: id_plano,
        nombre_elemento : 'nuevo puesto' + totalPuestos + 1,
        id_tipo_elemento : 1,
        dimenciones : {
          x: 60,
          y: 60,
          width: 100,
          height: 100,
          fill: 'green',
          isStatic: false
        },
        stile: null,
        id_puesto: null,
        dataPuesto: {
          descripcion : '',
          numero : null,
          id_feria : idFeria,
          id_tipo_puesto : 1,
          id_estado_puesto : 1,
          precio : 0
        }
     
      };
      const responseNew = await CreatePuesto(newPuesto)
      console.log('agrega',responseNew);
      
      // actualizo la lista de puestos 
      const updatedPuestos = [...puestos, responseNew];
      setPuestos(updatedPuestos);
      setTotalPuestos(totalPuestos + 1);
    };
    

  const RemovePuesto = (id: number) => {
    setPuestos((prevPuestos) => prevPuestos.filter((puesto) => puesto.id_elemento !== id));

  };

  const handleAddStreet = () => {
    const newStreet: PlanoItemElement = {
      id_elemento:  totalPuestos + 1,
      id_plano: id_plano,
      nombre_elemento : 'nueva calle' + totalPuestos + 1,
      id_tipo_elemento : 2,
      dimenciones  : {
        x: 60,
        y: 60,
        points: [0, 0, 100, 100],
        width: 50,
        height: 100,
        isStatic: false
      },
      stile: null,
      id_puesto: null,
      dataPuesto : null

    };
      // Actualizamos la referencia de calles
      const updatedcalles = [...calles, newStreet];
    
      // Actualizamos el estado de calles, pero ahora estamos usando la ref para asegurar que siempre tengamos el valor más reciente
      setCalles(updatedcalles);
      // Llamamos a updateFeriajson después de que todo haya cambiado
  };


  const handleRemoveStreet = (id: number) => {
    setCalles(calles.filter((street) => street.id_elemento !== id));
  };



  //funciones drag

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

            onAddStreet={handleAddStreet} 
            />


            <Canvas
              puestos={puestos}
              setPuestos={setPuestos}
              onItemClick={ItemClick}
              planWidth={planWidth}
              planHeight={planHeight}
              setPlanWidth={setPlanWidth}
              setPlanHeight={setPlanHeight}
              calles={calles}
              onRemoveStreet={handleRemoveStreet}
             
            />
          </div>


          <div>
      {selectedItem?.id_tipo_elemento === 2? (
        <MenuCalle
          selectedCalle={selectedItem }
          onRemoveStreet={handleRemoveStreet}
          setSelectedItem={setSelectedItem}
          isLoading={isLoading}
        />
      ) : selectedItem?.id_tipo_elemento === 1 ? (
        <MenuPuesto
          selectedPuesto={selectedItem }
          onRemoveRectangle={RemovePuesto}
          setSelectedItem= {setSelectedItem}
          isLoading={isLoading}
        />
      ) : (
        <MenuVacio />
      )}
    </div>

        </div>
      </div>
    );
  };

  export default Vista;
