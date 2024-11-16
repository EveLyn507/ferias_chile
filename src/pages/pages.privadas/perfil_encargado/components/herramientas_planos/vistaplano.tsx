
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';

import Toolbar from './Toolbar';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {  DeletedItem, plano, PlanoItemElement } from './models/vistaplanoModels';
import Canvas from './Canvas2';
import MenuPuesto from './menus/MenuPuesto';
import MenuCalle from './menus/MenuCalle';
import MenuVacio from './menus/menuContainers';
import { debounce } from 'lodash';
import { vistaProps } from './models/canvasModels';



  const API_URL = 'http://localhost:5000';



  const Vista = ({savePlanoItem , CreateNewItemElement,UpdatePlano ,DeleteItemPlano} : vistaProps ) => {

    const [totalPuestos, setTotalPuestos] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { id_feria } = useParams<{ id_feria: string }>();
    const idFeria = id_feria ? parseInt(id_feria) : 0 //extrae el id feria

    //variables de la herramienta
  // tamaño del canvas por default
  const[newDimplano, setNewDimPlano] = useState<plano | null>( null) // para tomar las nuevas dimenciones
  const[plano, setPlano] = useState<plano>({
    id_feria : idFeria,
    id_plano : null,
    width: 500,
    height : 500

  })

//LA DIFERENCIA EN LA INTERFAZ RADICA EN EL PARAMETRO DE DIMENCIONES
    const [puestos, setPuestos] = useState<PlanoItemElement[]>([]); //lista de los puestos 
    const [calles, setCalles] = useState<PlanoItemElement[]>([]);//lista de las calles



    const [selectedItem, setSelectedItem] = useState<PlanoItemElement|null>(null);
    // Función para manejar el clic en un ítem de cualquier layer
    const ItemClick = (item: PlanoItemElement ) => {
      setSelectedItem(item); // Guardar el item seleccionado
    };


    //guardado del item del plano
    const debousnce=  () => {
       savePlanoItem(selectedItem!)
    }
    const debouncedSave = debounce(debousnce, 150);



    const deleteItem = async (delItem : PlanoItemElement) => {
      const deleteItem:DeletedItem = {
        id_elemento: delItem!.id_elemento!,
        id_tipo_elemento : delItem!.id_tipo_elemento,
        nombre_elemento : delItem!.nombre_elemento,
        id_plano : delItem!.id_plano!,
        id_puesto : delItem!.dataPuesto?.id_puesto || null,
        id_feria : delItem!.id_feria!
      }
      console.log('esto se elimno' , delItem );
      
       await DeleteItemPlano(deleteItem)

      if(delItem.id_tipo_elemento === 1) {

        const updatedPuestos = puestos.filter((r) => r.id_elemento !== delItem.id_elemento);
        setPuestos(updatedPuestos)

      }else if (delItem.id_tipo_elemento=== 2) {

        const updatedCalles = calles.filter((r) => r.id_elemento !== delItem.id_elemento);
        setCalles(updatedCalles)
      }


    }

    // actualiza en local cada ves que el item cambia , tambien guarda en bd 
    useEffect(()=> {
      if (selectedItem === null  ){
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
  
      
      setItem()

      debouncedSave()
        return () => debouncedSave.cancel() 
    },[selectedItem])

    
    //carga de los puestos de la feria y su json
    useEffect(() => {
      const fetchFeriaData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await axios.get(`${API_URL}/api/feria/${id_feria}`);
         const data = response.data
          
          await setPlano(data.plano)
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

        console.log('me activo fetch');
        
      };

      fetchFeriaData()
    
    }, []);
  
        //actualiza las dimenciones del plano 
        const OnChangePlano = async () => {
          UpdatePlano(newDimplano!)
          setPlano(newDimplano!)
        }
        const debouncedSavePlano = debounce(OnChangePlano, 300);
    
        useEffect(() => {
          if (newDimplano === null) { 
            return
          }
          debouncedSavePlano()
          return () =>  debouncedSavePlano.cancel()
        }, [newDimplano] )
    
    
    //añade un nuevo puesto
    const AddPuesto = async (totalPuestos: number) => {
      const newPuesto: PlanoItemElement = {
        id_feria : idFeria,
        id_elemento: null,
        id_plano: plano.id_plano,
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
          id_puesto: null,
          id_tipo_puesto : 1,
          id_estado_puesto : 1,
          precio : 0
        }
     
      };
      const responseNew =  await CreateNewItemElement(newPuesto)
      console.log('agrega',responseNew);
      
      // actualizo la lista de puestos 
      const updatedPuestos = [...puestos, responseNew];
      setPuestos(updatedPuestos); //setea local
      setTotalPuestos(totalPuestos + 1);
    };
    


  const addCalle = async () => {
    const newStreet: PlanoItemElement = {
      id_feria : idFeria,
      id_elemento:  totalPuestos + 1,
      id_plano: plano.id_plano,
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
     const responseNew = await CreateNewItemElement(newStreet) // guarda en bd
  
      // actualizo la lista de puestos 
      const updatedcalles = [...calles, responseNew];
      setCalles(updatedcalles); //setea local

  };





  //funciones drag

  return (
    <>
      <div className="mobile-warning">
        Esta vista no es compatible con dispositivos móviles.
      </div>

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

            onAddStreet={addCalle} 
            />

            <Canvas
              puestos={puestos}
              setPuestos={setPuestos}
              onItemClick={ItemClick}
              plano={plano}
              onChangePlano={setNewDimPlano}
              calles={calles}
             
            />
          </div>

          <div>
      {selectedItem?.id_tipo_elemento === 2? (
        <MenuCalle
          selectedCalle={selectedItem }
          setSelectedItem={setSelectedItem}
          deleteItem={deleteItem}
          isLoading={isLoading}
        />
      ) : selectedItem?.id_tipo_elemento === 1 ? (
        <MenuPuesto
          selectedPuesto={selectedItem }
          deleteItem={deleteItem}
          setSelectedItem= {setSelectedItem}
          isLoading={isLoading}
        />
      ) : (
        <MenuVacio />
      )}
    </div>

        </div>
      </div>
    </>
  );
};

  export default Vista;
