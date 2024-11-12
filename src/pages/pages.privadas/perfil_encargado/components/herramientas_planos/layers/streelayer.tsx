/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* StreetsLayer.tsx */
import React, { useRef } from 'react';
import { Rect, Circle, Layer } from 'react-konva';
import { Street } from '../models/vistaplanoModels';



interface StreetPageProps {
    calles: Street[]; // Arreglo de calles
    onRemoveStreet: (id: number) => void; // Función para eliminar una calle
    onUpdateStreet: (id: number, updates: { x?: number; y?: number; width?: number; height?: number }) => void; // Función para actualizar las propiedades de una calle
    onStreetClick: (item : Street) => void; // para detectar item click
    isStatic?: boolean; // Indica si las calles son estáticas o no (opcional, valor por defecto es false)
  }


const StreetsLayer: React.FC<StreetPageProps> = ({ 
  calles,
  onRemoveStreet,
  onStreetClick, 
  isStatic = false }) => {

  const layerRef = useRef(null);
  // Función para manejar el arrastre de las calles
  const handleDragStreet = (e: any, selectedCalle: Street , idx : number) => {
    if (!selectedCalle || selectedCalle.isStatic || isStatic) return; // No mover si es estático

    const updatedCalles = calles.map((r) =>
      r.id === selectedCalle.id ? { ...r, x: e.target.x(), y: e.target.y() } : r
    );

    onStreetClick(updatedCalles[idx])
  };

  // Función para manejar el redimensionamiento de las calles
  const handleResizeStreet = (e: any, selectedCalle: Street, side: 'right' | 'bottom' , idx : number) => {

    if (!selectedCalle || selectedCalle.isStatic || isStatic) return; // No redimensionar si es estático

    const newWidth = side === 'right' ? e.target.x() - selectedCalle.x : selectedCalle.width;
    const newHeight = side === 'bottom' ? e.target.y() - selectedCalle.y : selectedCalle.height;

    const updatedCalles = calles.map((r) =>
      r.id === selectedCalle.id ? { ...r, width: newWidth, height: newHeight } : r
    );

    // Actualizamos el tamaño de la calle
    onStreetClick(updatedCalles[idx])
  };

  return (
    <Layer ref={layerRef}>
      {calles.map((street , index) => {
        // Tamaño por defecto para las calles si no se ha definido
        const defaultWidth = 50000;  // Nuevo tamaño mayor por defecto
        const defaultHeight = 50000;  // Nuevo tamaño mayor por defecto

        const width = street.width || defaultWidth;
        const height = street.height || defaultHeight;

        return (
          <React.Fragment key={street.id}>
            {/* Calle Rectangular */}
            <Rect
              x={street.x}
              y={street.y}
              width={width}
              height={height}
              fill="black"
              draggable={!street.isStatic && !isStatic}  // Solo se puede mover si no es estático
              onDragEnd={(e) => handleDragStreet(e, street , index)}
              onDblClick={() => onRemoveStreet(street.id)}
              onClick={!isStatic ? () => onStreetClick(street) : undefined}
            />
            

            {/* Puntos de control para redimensionar */}
            {!isStatic && (
              <>
                {/* Esquina inferior derecha */}
                <Circle
                  x={street.x + width}
                  y={street.y + height}
                  radius={8}
                  fill="red"
                  draggable={!isStatic}  // Deshabilitar el redimensionamiento si es estático
                  onDragMove={(e) => handleResizeStreet(e, street, 'right' , index)}
                />
                
                {/* Esquina inferior izquierda */}
                <Circle
                  x={street.x}
                  y={street.y + height}
                  radius={8}
                  fill="blue"
                  draggable={!isStatic}  // Deshabilitar el redimensionamiento si es estático
                  onDragMove={(e) => handleResizeStreet(e, street, 'bottom' , index)}
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
