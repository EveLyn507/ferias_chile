/* eslint-disable react-hooks/exhaustive-deps */


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
    selectedItem,
    setSelectedItem


  }) => { 
    const planX = 50;
    const planY = 50;
    const gridSize = 50;
    const controlSize = 8;
    const [isAltPressed, setIsAltPressed] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<PlanoItemElement | null>(null); // null,
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


console.log('hover', hoveredItem);
console.log('alt', isAltPressed);


const moveKey = (item: PlanoItemElement, e: 'keyUp' | 'keydown' | 'keyLeft' | 'keyRigth') => {
  let updated = { ...item }; // Crea una copia del item original

  // Actualizar las coordenadas según la tecla presionada
  if (e === 'keyUp') {
    updated = { 
      ...item, 
      dimenciones: { 
        ...item.dimenciones, 
        y: item.dimenciones.y - 1 // Mover hacia arriba
      }
    };
  } else if (e === 'keydown') {
    updated = { 
      ...item, 
      dimenciones: { 
        ...item.dimenciones, 
        y: item.dimenciones.y + 1 // Mover hacia abajo
      }
    };
  } else if (e === 'keyLeft') {
    updated = { 
      ...item, 
      dimenciones: { 
        ...item.dimenciones, 
        x: item.dimenciones.x - 1 // Mover hacia la izquierda
      }
    };
  } else if (e === 'keyRigth') {
    updated = { 
      ...item, 
      dimenciones: { 
        ...item.dimenciones, 
        x: item.dimenciones.x + 1 // Mover hacia la derecha
      }
    };
  }

  // Actualiza el estado con el nuevo item
  setSelectedItem(updated);
};

useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (selectedItem) {
      // Verificar si la tecla presionada es una flecha
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault(); // Evitar scroll
          moveKey(selectedItem, 'keyUp');
          break;
        case 'ArrowDown':
          event.preventDefault(); // Evitar scroll
          moveKey(selectedItem, 'keydown');
          break;
        case 'ArrowLeft':
          event.preventDefault(); // Evitar scroll
          moveKey(selectedItem, 'keyLeft');
          break;
        case 'ArrowRight':
          event.preventDefault(); // Evitar scroll
          moveKey(selectedItem, 'keyRigth');
          break;
        default:
          break; // Si no es una tecla de flecha, no hacer nada
      }
    }
  };

  // Agregar el event listener cuando el componente se monte
  window.addEventListener('keydown', handleKeyDown);

  // Limpiar el event listener cuando el componente se desmonte
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [selectedItem]);

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Shift') {
          setIsAltPressed(true);
        }
      };
  
      const handleKeyUp = (event: KeyboardEvent) => {
        if (event.key === 'Shift') {
          setIsAltPressed(false);
        }
      };
  
      // Escuchar eventos
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
  
      // Limpiar eventos
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
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
          const newWidth = Math.max(200, Math.floor(pos.x - planX)); // Redondear a entero
          const newHeight = Math.max(200, Math.floor(pos.y - planY)); // Redondear a entero

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
  hoveredItem={hoveredItem}  // El puesto actualmente seleccionado o sobre el cual se pasa el ratón
  setHoveredItem={setHoveredItem}  // Función para actualizar el puesto sobre el que se pasa el ratón
  isAltPressed={isAltPressed}
  selectedItem={selectedItem}
/>



  {/* Capa para las calles */}
  <StreetsLayer 
        calles={calles}
        onStreetClick={onItemClick}  // Función que se ejecuta cuando se hace clic en un puesto
        isStatic={isStatic}
        hoveredItem={hoveredItem}  // El puesto actualmente seleccionado o sobre el cual se pasa el ratón
        setHoveredItem={setHoveredItem}  // Función para actualizar el puesto sobre el que se pasa el ratón
        isAltPressed={isAltPressed}
        selectedItem={selectedItem}
      />

</Stage>
)


  }  // fin
  
  export default Canvas2;