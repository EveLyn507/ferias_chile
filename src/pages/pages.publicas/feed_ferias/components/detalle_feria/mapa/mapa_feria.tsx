

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
    const [zoomLevel, setZoomLevel] = useState(1);

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

  // Función para aumentar el zoom
  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => {
      const nextZoom = Math.floor(prevZoom + 1); // Redondea hacia abajo
      return Math.min(nextZoom, 3.0); // Limita el zoom máximo a 2
    });
  };

  // Función para reducir el zoom
  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => {
      const nextZoom = Math.floor(prevZoom - 0.5); // Redondea hacia abajo
      return Math.max(nextZoom, 0.2); // Limita el zoom mínimo a 1
    });
  };

return (
  <>
      
      {/* Botones de zoom */}
    <div style={{ position: 'relative', top: '10px', right: '10px', paddingLeft: '5%'}}>
    <button onClick={handleZoomIn} style={{ margin: '5px' }}>Zoom In</button>
    <button onClick={handleZoomOut} style={{ margin: '5px' }}>Zoom Out</button>
    </div>

    <div
    style={{
      padding: '20%',
    width: '1000px',  // Un tamaño fijo para el div
    height: '500px', // Un tamaño fijo para el div
    overflow: 'auto', // Habilitar scroll
    position: 'relative',
    }}>
        
      <Stage      
       width={plano.width + planX } // Asegúrate de que el stage sea más grande que el div
        height={plano.height + planY } // Asegúrate de que el stage sea más grande que el div
        scaleX={zoomLevel} // Aplica el zoom al eje X
        scaleY={zoomLevel} // Aplica el zoom al eje Y
        style={{
          backgroundColor: 'transparent',
        }}
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

    />



      {/* Capa para las calles */}
      <StreetsLayer 
            calles={calles}
            isStatic={false}
          />

    </Stage>
    </div>
    </>

)


  }  // fin
  
  export default Mapa;