

import { Stage, Layer, Rect, Line } from 'react-konva';
import { useState, useEffect } from 'react';

import React from 'react';
import PuestosLayer from './puestoLayer';
import StreetsLayer from './streelayer';
import { MapaCanvas } from './mapaModel';
import './mapa.css'




  const Mapa: React.FC<MapaCanvas> = ({
    plano,
    puestos,
    calles,
    isStatic

  }) => { 
    const planX = 50;
    const planY = 50;
    const gridSize = 50;
    const controlSize = 8;
  
    const [image, setImage] = useState<HTMLImageElement | null>(null);
   
    
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



return (
  <div className='contenedor-mapa'>
      <Stage width={window.innerWidth} height={window.innerHeight}>
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

    />



      {/* Capa para las calles */}
      <StreetsLayer 
            calles={calles}
            isStatic={false}
          />

    </Stage>
  </div>

)


  }  // fin
  
  export default Mapa;