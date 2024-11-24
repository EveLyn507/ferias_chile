/* eslint-disable @typescript-eslint/no-explicit-any */
/* StreetsLayer.tsx */
import React, { useRef, useState } from 'react';
import {  Circle, Image as KonvaImage, Layer } from 'react-konva';
import { PlanoItemElement } from '../models/vistaplanoModels';
import { StreetPageProps } from '../models/canvasModels';
import DistanceLine from './distanceLine';



const StreetsLayer: React.FC<StreetPageProps> = ({
  calles,
  onStreetClick,
  image,
  isStatic = false,
  isAltPressed,
  hoveredItem,
  selectedItem,
  setHoveredItem
}) => {
  const layerRef = useRef(null);

  // Estado para gestionar la calle con el foco
  const [focusedStreet, setFocusedStreet] = useState<PlanoItemElement | null>(null);





  // Función para manejar el arrastre de las calles
  const handleDragStreet = (e: any, selectedCalle: PlanoItemElement, idx: number) => {
    if (!selectedCalle || selectedCalle.dimenciones.isStatic || isStatic) return; // No mover si es estático

    const updatedCalles = calles.map((r) =>
      r.id_elemento === selectedCalle.id_elemento
        ? { ...r, dimenciones: { ...r.dimenciones, x: e.target.x(), y: e.target.y() } }
        : r
    );

    onStreetClick(updatedCalles[idx]);
  };

  // Función para manejar el redimensionamiento de las calles
  const handleResizeStreet = (e: any, selectedCalle: PlanoItemElement, side: 'right' | 'bottom', idx: number , ) => {
    if (!selectedCalle || selectedCalle.dimenciones.isStatic || isStatic) return; // No redimensionar si es estático
   
    
    const newWidth = side === 'right' ? e.target.x() - selectedCalle.dimenciones.x : selectedCalle.dimenciones.width;
    const newHeight = side === 'bottom' ? e.target.y() - selectedCalle.dimenciones.y : selectedCalle.dimenciones.height;
  console.log(newWidth);
  
    const updatedCalles = calles.map((r) =>
      r.id_elemento === selectedCalle.id_elemento
        ? { ...r, dimenciones: { ...r.dimenciones, width: newWidth, height: newHeight } }
        : r
    );
    // Actualizamos el tamaño de la calle
    onStreetClick(updatedCalles[idx]);
  };

  return (
    <Layer ref={layerRef}>
      {calles.map((street, index) => {
        const defaultWidth = 50000; // Nuevo tamaño mayor por defecto
        const defaultHeight = 50000; // Nuevo tamaño mayor por defecto

        const width = street.dimenciones.width || defaultWidth;
        const height = street.dimenciones.height || defaultHeight;

        // Calcular las posiciones de los puntos de redimensionamiento
        const rightCornerX = street.dimenciones.x + width;
        const rightCornerY = street.dimenciones.y + height;
        const leftCornerX = street.dimenciones.x;
        const leftCornerY = street.dimenciones.y + height;
     
        
        return (
          <React.Fragment key={street.id_elemento}>
            {/* Calle Rectangular */}
            <KonvaImage
              image={image || undefined}
              x={street.dimenciones.x}
              y={street.dimenciones.y}
              width={street.dimenciones.width}
              height={street.dimenciones.height}
              fill="black"
              draggable={!isStatic} // Solo se puede mover si no es estático
              onDragMove={(e) => handleDragStreet(e, street, index)}
              onDragStart={() =>   setFocusedStreet(street) }
              onMouseEnter={() => setHoveredItem(street)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => {
                if (!isStatic) {
                  setFocusedStreet(street); // Establece el foco al hacer clic en la calle
                  onStreetClick(street);
                }
              }}
            />
            {isAltPressed && hoveredItem && selectedItem && <DistanceLine itemA={selectedItem} itemB={hoveredItem} />}

            {/* Puntos de control para redimensionar */}
            {!isStatic && focusedStreet?.id_elemento === street.id_elemento && (
              <>
                {/* Esquina inferior derecha */}
                <Circle
                  x={rightCornerX}
                  y={rightCornerY}
                  radius={8}
                  fill="red"
                  draggable={!street.dimenciones.isStatic && !isStatic} // Deshabilitar el redimensionamiento si es estático
                  onDragMove={(e) => handleResizeStreet(e, street, 'right', index)}
                />

                {/* Esquina inferior izquierda */}
                <Circle
                  x={leftCornerX}
                  y={leftCornerY}
                  
                  radius={8}
                  fill="blue"
                  draggable={!street.dimenciones.isStatic && !isStatic} // Deshabilitar el redimensionamiento si es estático
                  onDragMove={(e) => handleResizeStreet(e, street, 'bottom', index ) }
                />
              </>
            )}
          </React.Fragment>
        );
      })}
    </Layer>
  );
};

export default StreetsLayer;
