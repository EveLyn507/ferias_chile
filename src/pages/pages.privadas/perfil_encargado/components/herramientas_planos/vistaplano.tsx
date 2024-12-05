
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';

import Toolbar from './Toolbar';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DeletedItem, plano, PlanoItemElement } from './models/vistaplanoModels';
import Canvas from './Canvas2';
import MenuPuesto from './menus/MenuPuesto';
import MenuCalle from './menus/MenuCalle';
import { debounce } from 'lodash';
import { vistaProps } from './models/canvasModels';
import MenuPlano from './menus/MenuPlano';

const API_URL = 'http://localhost:5000';

const Vista = ({ savePlanoItem, CreateNewItemElement, UpdatePlano, DeleteItemPlano }: vistaProps) => {
  const { id_feria } = useParams<{ id_feria: string }>();
  const idFeria = id_feria ? parseInt(id_feria) : 0 //extrae el id feria
  const [puestos, setPuestos] = useState<Map<number,PlanoItemElement>>(new Map()); //lista de los puestos 
  const [calles, setCalles] = useState<PlanoItemElement[]>([]);//lista de las calles
  const [totalPuestos, setTotalPuestos] = useState<number>(0); //contador de los puestos actuales
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const [Planocharge, setPlanocharge] = useState<boolean>(false); //controla cuando el plano esta cargado
  const [error, setError] = useState<string | null>(null);

  // tamaño del canvas por default
  const [newDimplano, setDimPlano] = useState<plano | null>(null) // captura las dimenciones modificadas del plano
  const [plano, setPlano] = useState<plano>({
    id_feria: idFeria,
    id_plano: null,
    width: 500,
    height: 500

  })


  //guarda el item actual que el usuario esta utilizando
  const [selectedItem, setSelectedItem] = useState<PlanoItemElement | null>(null);
  const ItemClick = (item: PlanoItemElement) => {
    setSelectedItem(item); 
  };


  //Carga de los elementos del plano y otros utilizados
  useEffect(() => {
    const fetchFeriaData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/api/feria/${id_feria}`);
        const data = response.data

        await setPlano(data.plano)
        const elements = await data.elements
        const puestos:PlanoItemElement[] = await elements.filter((puestos: { id_tipo_elemento: number; }) => puestos.id_tipo_elemento === 1)
        const calles = await elements.filter((calles: { id_tipo_elemento: number; }) => calles.id_tipo_elemento === 2)
        if (calles.length != 0) {
       
          setCalles(calles)
        }
        if (puestos.length != 0) {
          const mapPuestos = new Map(puestos.map((puesto: PlanoItemElement)  => [puesto.id_elemento!, puesto]));
          setPuestos(mapPuestos)
        }

      } catch (error) {
        console.error('Error al obtener los datos de la feria:', error);
        setError('Error al obtener los datos de la feria');
      } finally {
        setIsLoading(false);
        setPlanocharge(true)
      }

      console.log('me activo fetch');

    };

    fetchFeriaData()

  }, []);


  const deleteItem = async (delItem: PlanoItemElement) => {
    const deleteItem: DeletedItem = {
      id_elemento: delItem!.id_elemento!,
      id_tipo_elemento: delItem!.id_tipo_elemento,
      nombre_elemento: delItem!.nombre_elemento,
      id_plano: delItem!.id_plano!,
      id_puesto: delItem!.dataPuesto?.id_puesto || null,
      id_feria: delItem!.id_feria!
      }
      console.log('esto se elimno', delItem);
      await DeleteItemPlano(deleteItem)

      if (delItem.id_tipo_elemento === 1) {
        //const updatedPuestos = puestos.filter((r) => r.id_elemento !== delItem.id_elemento);
        //setPuestos(updatedPuestos)
      } else if (delItem.id_tipo_elemento === 2) {
      const updatedCalles = calles.filter((r) => r.id_elemento !== delItem.id_elemento);
      setCalles(updatedCalles)
    }
  }


  //Aplicacion de debounsce para guardar en bdsolo cuando el elemento deja de modificarse
  const debousnce = () => {
    savePlanoItem(selectedItem!) // guarda en bd
  }
  const debouncedSave = debounce(debousnce, 150);


  // Actualiza el estado en BD y en local cuando el item seleccionado es modificado
  const updateItemSelected = async () => {
    if (!selectedItem){
      return
    }
    if (selectedItem.id_tipo_elemento === null) {
      return
    }

    if (selectedItem.id_tipo_elemento === 1) {
      if (puestos.has(selectedItem.id_elemento!)) {
        const item = puestos.get(selectedItem.id_elemento!)
        puestos.set(item!.id_elemento! , selectedItem)
      }

    }
    else if (selectedItem?.id_tipo_elemento === 2) {
      setCalles((prevCalles) =>
        prevCalles.map((calles) => (calles.id_elemento === selectedItem!.id_elemento ? { ...calles, ...selectedItem } : calles))
      );
    }
  }

  useEffect(() => {
    if (selectedItem === null) {
      return
    }
      updateItemSelected() //modifica el item local con selected item 
      
      debouncedSave() // llama al guardado en bd con debounce
      return () => debouncedSave.cancel() 
  }, [selectedItem])


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
    return () => debouncedSavePlano.cancel()
  }, [newDimplano])


  //añade un nuevo puesto
  const AddPuesto = async (totalPuestos: number) => {
    const newPuesto: PlanoItemElement = {
      id_feria: idFeria,
      id_elemento: null,
      id_plano: plano.id_plano,
      nombre_elemento: 'nuevo puesto' + totalPuestos + 1,
      id_tipo_elemento: 1,
      dimenciones: {
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
        descripcion: '',
        numero: null,
        id_feria: idFeria,
        id_puesto: null,
        id_tipo_puesto: 1,
        id_estado_puesto: 1,
        precio: 0
      }

    };
    const responseNew: PlanoItemElement = await CreateNewItemElement(newPuesto)
    console.log('agrega', responseNew);

    // actualizo la lista de puestos 

    puestos.set(responseNew.id_elemento!, responseNew)
      setTotalPuestos(totalPuestos + 1);
  };


  const addCalle = async () => {
    const newStreet: PlanoItemElement = {
      id_feria: idFeria,
      id_elemento: totalPuestos + 1,
      id_plano: plano.id_plano,
      nombre_elemento: 'nueva calle' + totalPuestos + 1,
      id_tipo_elemento: 2,
      dimenciones: {
        x: 60,
        y: 60,
        points: [0, 0, 100, 100],
        width: 50,
        height: 100,
        isStatic: false
      },
      stile: null,
      id_puesto: null,
      dataPuesto: null

    };
    const responseNew = await CreateNewItemElement(newStreet) // guarda en bd

    // actualizo la lista de puestos 
    const updatedcalles = [...calles, responseNew];
    setCalles(updatedcalles); //setea local

  };

  //funciones drag
  return (
    <div className="herramienta">
    <div className="toolbar">
    <Toolbar
      onAddPuesto={() => AddPuesto(totalPuestos)}
      onAddStreet={addCalle}
    />
   </div>
        <div className="main-content" >

            {isLoading && <p>Cargando...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

      
            <div className="canvas-container">
              <Canvas
                puestos={puestos}
                setPuestos={setPuestos}
                onItemClick={ItemClick}
                plano={plano}
                calles={calles}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                />
            </div>

            <div className="planoMenu">
            {selectedItem?.id_tipo_elemento === 2 ? (
              <MenuCalle
                selectedCalle={selectedItem}
                setSelectedItem={setSelectedItem}
                deleteItem={deleteItem}
                isLoading={isLoading}
              />
            ) : selectedItem?.id_tipo_elemento === 1 ? (
              <MenuPuesto
                selectedPuesto={selectedItem}
                deleteItem={deleteItem}
                setSelectedItem={setSelectedItem}
                isLoading={isLoading}
              />
            ) : (
              // Solo renderizar MenuPlano cuando 'plano' tenga datos
              Planocharge === true ? (
                <MenuPlano plano={plano} onChangePlano={setDimPlano} />
              ) : (
                <div>Esperando la carga de datos del plano...</div> // Mensaje mientras se carga
              )
            )}
            </div>
          </div>
          </div>
  );
};

export default Vista;
