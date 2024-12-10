

import { Stage, Layer, Rect, Line } from 'react-konva';
import { useState, useEffect } from 'react';

import React from 'react';
import PuestosLayer from './puestoLayer';
import StreetsLayer from './streelayer';
import { arriendo, plano, PlanoItemElement } from './mapaModel';
import './mapa.css'
import { ArriendoModal } from './cartel';

  
export interface MapaCanvas2 {
  puestos: PlanoItemElement[];
  calles: PlanoItemElement[];
  plano: plano 
  isStatic : true
  arriendos : arriendo[]
  nombreFeria: string
}



  const Mapa: React.FC<MapaCanvas2> = ({
    plano,
    puestos,
    calles,
    isStatic,
    arriendos,
    nombreFeria,

  }) => { 
    const planX = 50;
    const planY = 50;
    const gridSize = 50;
    const controlSize = 8;
    const [zoomLevel, setZoomLevel] = useState(1);
    const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });

    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedObject, setSelectedObject] = useState<arriendo | null>(null);
  
    
    const handleObjectClick =  (idP : number) => {
      const arrSelect =  arriendos.find(arr => arr.id_puesto === idP)
      console.log(arrSelect, idP);
      
      if(arrSelect){
        setSelectedObject(arrSelect);
        setModalOpen(true);
      }
    
    };

    console.log(nombreFeria);
    
    
    // Cargar imagen de los puestos
    useEffect(() => {
    const img = new window.Image();
    img.src = '/imagenes/puesto.png';
    img.onload = () => {
        setImage(img);
    };
    img.onerror = () => {
        console.error('Error loading the image');
    };
    }, []);

    const pwid = window.innerWidth < 768 ? window.innerWidth - 20 : 800
    const phei = window.innerWidth < 768 ? 400 : 600
    const [stageSize, setStageSize] = useState({ width: 1260, height: 540 });

    useEffect(() => {
      const handleResize = () => {
        const width = window.innerWidth * 0.85; // 80% del ancho de la ventana
        const height = window.innerHeight * 0.71; // 60% del alto de la ventana
        setStageSize({ width, height });
      };
  
      handleResize(); // Ajustar al cargar
      window.addEventListener("resize", handleResize);
  
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);
return (

<>

<h1 style={{ position: 'relative', marginTop: '5%', marginRight: 'auto', marginLeft : 'auto'  }}> Mapa {nombreFeria}</h1>
<div style={{ position: 'relative', marginRight: 'auto', marginLeft : 'auto' }}>


        <button onClick={() => setZoomLevel(Math.min(zoomLevel + 0.1, 4))} style={{ margin: '5px' }}>
          Zoom In
        </button>
        <button onClick={() => setZoomLevel(Math.max(zoomLevel - 0.1, 0.1))} style={{ margin: '5px' }}>
          Zoom Out
        </button>
      </div>

      <Stage  
      className='stage'
      width={pwid}  // Ajusta el ancho a pantalla pequeña
      height={phei}  // Ajusta la altura en pantallas más pequeñas
        scaleX={zoomLevel}
        scaleY={zoomLevel}
        x={stagePosition.x}
        y={stagePosition.y}
        draggable
        style={{border : 'black solid 1px'}}
      >
        <Layer>

        <Rect
          x={planX}
          y={planY}
          width={plano.width}
          height={plano.height}
          fill="lightgray"
          stroke="black"
          strokeWidth={2}
        />
        {/*GRILLA DE LAS LINEAS DEL FONDO*/}
        {Array.from({ length: plano.width / gridSize }, (_, i) => (
          <Line
            key={`v-${i}`}
            points={[planX + i * gridSize, planY, planX + i * gridSize, planY + plano.height]}
            stroke="#ddd"
            strokeWidth={1}
          />
        ))}

        {Array.from({ length: plano.height / gridSize }, (_, i) => (
          <Line
            key={`h-${i}`}
            points={[planX, planY + i * gridSize, planX + plano.width, planY + i * gridSize]}
            stroke="#ddd"
            strokeWidth={1}
          />
        ))} 


        {/* Controlador para redimensionar el plano */}
        {!isStatic && (
          <Rect
            x={planX + plano.width - controlSize / 2}
            y={planY + plano.height - controlSize / 2}
            width={controlSize}
            height={controlSize}
            fill="blue"
          />
        )}
      </Layer>


      <PuestosLayer
      puestos={puestos}  // Lista de puestos, debe ser un arreglo de objetos Rectangle
      isStatic={false}  // Si los puestos son estáticos o no (pueden moverse o redimensionarse)
      image={image}  // Imagen que se aplicará a los puestos (si es necesario)
      itemClick={handleObjectClick}
      arriendos={arriendos}

    />
      {/* Capa para las calles */}
      <StreetsLayer 
            calles={calles}
            isStatic={false}
          />
    </Stage>


    <ArriendoModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        arriendo={selectedObject}
      />

    </>

)


  }  // fin
  
  export default Mapa;