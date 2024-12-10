import { Stage, Layer, Rect, Line } from 'react-konva';
import { useState, useEffect } from 'react';
import React from 'react';
import PuestosLayer from './puestoLayer';
import StreetsLayer from './streelayer';
import { arriendo, MapaCanvas } from './mapaModel';
import './mapa.css';
import { ArriendoModal } from './cartel';

const Mapa: React.FC<MapaCanvas> = ({
  plano,
  puestos,
  calles,
  isStatic,
  arriendos
}) => { 
  const planX = 50;
  const planY = 50;
  const gridSize = 50;
  const controlSize = 8;

  // Establecer el zoom base para móviles más alto para que los puestos se vean correctamente
  const [zoomLevel, setZoomLevel] = useState(window.innerWidth < 768 ? 1.5 : 1); 
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedObject, setSelectedObject] = useState<arriendo | null>(null);

  const handleObjectClick = (idP: number) => {
    const arrSelect = arriendos.find(arr => arr.id_puesto === idP);
    if (arrSelect) {
      setSelectedObject(arrSelect);
      setModalOpen(true);
    }
  };

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
    <>
      <div style={{ position: 'relative', top: '10px', right: '10px', paddingBottom: '10px' }}>
        <button onClick={() => setZoomLevel(Math.min(zoomLevel + 0.1, 4))} style={{ margin: '5px' }}>
          Zoom In
        </button>
        <button onClick={() => setZoomLevel(Math.max(zoomLevel - 0.1, 0.1))} style={{ margin: '5px' }}>
          Zoom Out
        </button>
      </div>

      <Stage
        width={window.innerWidth < 768 ? window.innerWidth - 20 : 800}  // Ajusta el ancho a pantalla pequeña
        height={window.innerWidth < 768 ? 400 : 600}  // Ajusta la altura en pantallas más pequeñas
        scaleX={zoomLevel}
        scaleY={zoomLevel}
        x={stagePosition.x}
        y={stagePosition.y}
        draggable
        style={{ 
          border: 'black solid 5px', 
          backgroundColor: 'transparent', 
          margin: 'auto' 
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
          {/* GRILLA DE LAS LINEAS DEL FONDO */}
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
  );
};

export default Mapa;
