/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* StreetsLayer.tsx */
import React, { useRef, useState } from 'react';
import { Rect, Circle, Layer } from 'react-konva';
import { Street } from '../models/vistaplanoModels';



interface StreetPageProps {
    calles: Street[]; // Arreglo de calles
    onRemoveStreet: (id: number) => void; // Función para eliminar una calle
    onUpdateStreet: (id: number, updates: { x?: number; y?: number; width?: number; height?: number }) => void; // Función para actualizar las propiedades de una calle
    onStreetClick: (item : Street) => void; // para detectar item click
    isStatic?: boolean; // Indica si las calles son estáticas o no (opcional, valor por defecto es false)
  }


const StreetsLayer: React.FC<StreetPageProps> = ({ calles, onRemoveStreet, onUpdateStreet,onStreetClick, isStatic = false }) => {
  const [selectedStreetId, setSelectedStreetId] = useState<number | null>(null);
  const layerRef = useRef(null);
  // Función para manejar el arrastre de las calles
  const handleDragStreet = (e: any, streetId: number) => {
    const street = calles.find((street) => street.id === streetId);
    if (!street || street.isStatic || isStatic) return; // No mover si es estático

    const newX = e.target.x();
    const newY = e.target.y();
    onUpdateStreet(streetId, { x: newX, y: newY });
  };

  // Función para manejar el redimensionamiento de las calles
  const handleResizeStreet = (e: any, streetId: number, side: 'right' | 'bottom') => {
    const street = calles.find((street) => street.id === streetId);
    if (!street || street.isStatic || isStatic) return; // No redimensionar si es estático

    const newWidth = side === 'right' ? e.target.x() - street.x : street.width;
    const newHeight = side === 'bottom' ? e.target.y() - street.y : street.height;

    // Actualizamos el tamaño de la calle
    onUpdateStreet(streetId, { width: newWidth, height: newHeight });
  };

  return (
    <Layer ref={layerRef}>
      {calles.map((street) => {
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
              onDragMove={(e) => handleDragStreet(e, street.id)}
              onDblClick={() => onRemoveStreet(street.id)}
              onClick={() => setSelectedStreetId(selectedStreetId === street.id ? null : street.id)}
            />
            
            {/* Puntos de control para redimensionar */}
            {selectedStreetId === street.id && !street.isStatic && (
              <>
                {/* Esquina inferior derecha */}
                <Circle
                  x={street.x + width}
                  y={street.y + height}
                  radius={8}
                  fill="red"
                  draggable={!isStatic}  // Deshabilitar el redimensionamiento si es estático
                  onDragMove={(e) => handleResizeStreet(e, street.id, 'right')}
                />
                
                {/* Esquina inferior izquierda */}
                <Circle
                  x={street.x}
                  y={street.y + height}
                  radius={8}
                  fill="blue"
                  draggable={!isStatic}  // Deshabilitar el redimensionamiento si es estático
                  onDragMove={(e) => handleResizeStreet(e, street.id, 'bottom')}
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
