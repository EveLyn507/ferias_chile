

import { Stage, Layer, Rect, Line } from 'react-konva';
import { useState, useEffect } from 'react';

import React from 'react';
import { CanvasProps } from './models/canvasModels';
import StreetsLayer from './layers/streelayer';
import PuestosLayer from './layers/puestoLayer';
import { PlanoItemElement } from './models/vistaplanoModels';

  const Canvas2: React.FC<CanvasProps> = ({
    puestos,
    setPuestos,
    calles,
    onItemClick,
    plano,
    onChangePlano,
    isStatic = false,

  }) => { 
    const planX = 50;
    const planY = 50;
    const gridSize = 50;
    const controlSize = 8;
  
    const [hoveredRect, setHoveredRect] = useState<PlanoItemElement | null>(null);
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
        draggable={true}
        dragBoundFunc={(pos) => {
          const newWidth = Math.max(200, pos.x - planX); // Restricción mínima
          const newHeight = Math.max(200, pos.y - planY); // Restricción mínima

          const newplano =  {...plano , width: newWidth , height : newHeight}
          onChangePlano(newplano)
          
          return pos;
        }}
      />
    )}
  </Layer>


  <PuestosLayer
  puestos={puestos}  // Lista de puestos, debe ser un arreglo de objetos Rectangle
  setPuestos={setPuestos}  // Función para actualizar los puestos
  isStatic={false}  // Si los puestos son estáticos o no (pueden moverse o redimensionarse)
  image={image}  // Imagen que se aplicará a los puestos (si es necesario)
  onPuestoClick={onItemClick}  // Función que se ejecuta cuando se hace clic en un puesto
  hoveredRect={hoveredRect}  // El puesto actualmente seleccionado o sobre el cual se pasa el ratón
  setHoveredRect={setHoveredRect}  // Función para actualizar el puesto sobre el que se pasa el ratón
/>



  {/* Capa para las calles */}
  <StreetsLayer 
        calles={calles}
        onStreetClick={onItemClick}  // Función que se ejecuta cuando se hace clic en un puesto
        isStatic={isStatic}
      />

</Stage>
)


  }  // fin
  
  export default Canvas2;