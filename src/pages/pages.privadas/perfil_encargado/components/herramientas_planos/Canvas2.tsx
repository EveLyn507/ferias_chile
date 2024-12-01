/* eslint-disable react-hooks/exhaustive-deps */
import { Stage, Layer, Rect, Line } from 'react-konva';
import { useState, useEffect, useRef } from 'react';
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
  isStatic = false,
  selectedItem,
  setSelectedItem
}) => {
  const planX = 50;
  const planY = 50;
  const gridSize = 50;
  const [isAltPressed, setIsAltPressed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<PlanoItemElement | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageS, setCalleImage] = useState<HTMLImageElement | null>(null);
  // Estado para el nivel de zoom
  const [zoomLevel, setZoomLevel] = useState(1);

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

  useEffect(() => {
    const img = new window.Image();
    img.src = '/imagenes/calle.jpg'; // Ruta de la segunda imagen
    img.onload = () => {
      setCalleImage(img);
    };
    img.onerror = () => {
      console.error('Error loading the calle image');
    };
  }, []);

  const moveKey = (item: PlanoItemElement, e: 'keyUp' | 'keydown' | 'keyLeft' | 'keyRigth') => {
    let updated = { ...item };

    if (e === 'keyUp') {
      updated = {
        ...item,
        dimenciones: {
          ...item.dimenciones,
          y: item.dimenciones.y - 1
        }
      };
    } else if (e === 'keydown') {
      updated = {
        ...item,
        dimenciones: {
          ...item.dimenciones,
          y: item.dimenciones.y + 1
        }
      };
    } else if (e === 'keyLeft') {
      updated = {
        ...item,
        dimenciones: {
          ...item.dimenciones,
          x: item.dimenciones.x - 1
        }
      };
    } else if (e === 'keyRigth') {
      updated = {
        ...item,
        dimenciones: {
          ...item.dimenciones,
          x: item.dimenciones.x + 1
        }
      };
    }

    setSelectedItem(updated);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedItem) {
        switch (event.key) {
          case 'ArrowUp':
            event.preventDefault();
            moveKey(selectedItem, 'keyUp');
            break;
          case 'ArrowDown':
            event.preventDefault();
            moveKey(selectedItem, 'keydown');
            break;
          case 'ArrowLeft':
            event.preventDefault();
            moveKey(selectedItem, 'keyLeft');
            break;
          case 'ArrowRight':
            event.preventDefault();
            moveKey(selectedItem, 'keyRigth');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

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

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  
  const containerRef = useRef<HTMLDivElement>(null);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setStagePosition({
          x: containerRef.current.scrollLeft,
          y: containerRef.current.scrollTop
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);


  const containerWidth = 1000;
  const containerHeight = 500;
  // Calcular la región visible y centrar el Stage
  const stageWidth = Math.min(plano.width, containerWidth / zoomLevel);
  const stageHeight = Math.min(plano.height, containerHeight / zoomLevel);
  const stageX = Math.max(0, (plano.width - stageWidth) / 2);
  const stageY = Math.max(0, (plano.height - stageHeight) / 2);


  return (

    <>
      
                {/* Botones de zoom */}
                <div style={{ position: 'relative', top: '10px', right: '10px', paddingBottom: '10px' }}>
        <button onClick={() => setZoomLevel(Math.min(zoomLevel + 0.1, 4))} style={{ margin: '5px' }}>Zoom In</button>
        <button onClick={() => setZoomLevel(Math.max(zoomLevel - 0.1, 0.5))} style={{ margin: '5px' }}>Zoom Out</button>
      </div>

    <div
      ref={containerRef}
       style={{
        width: '1000px',
        height: '500px',
        overflow: 'auto',
        position: 'relative',
        border: '1px solid #ccc', // Para visualizar el contorno
      }}
    >


      <Stage
        width={plano.width + 200 } // Asegúrate de que el stage sea más grande que el div
        height={plano.height + 200 } // Asegúrate de que el stage sea más grande que el div
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
            onClick={ () => setSelectedItem(null)}
            strokeWidth={2}
          />
          {/* Grilla de las líneas del fondo */}
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

     
  
        </Layer>

        <PuestosLayer
          puestos={puestos}
          setPuestos={setPuestos}
          isStatic={false}
          image={image}
          onPuestoClick={onItemClick}
          hoveredItem={hoveredItem}
          setHoveredItem={setHoveredItem}
          isAltPressed={isAltPressed}
          selectedItem={selectedItem}
        />

        <StreetsLayer
          calles={calles}
          onStreetClick={onItemClick}
          isStatic={isStatic}
          image={imageS}
          hoveredItem={hoveredItem}
          setHoveredItem={setHoveredItem}
          isAltPressed={isAltPressed}
          selectedItem={selectedItem}
        />
      </Stage>

 
    </div>
    </>
  );
};

export default Canvas2;
