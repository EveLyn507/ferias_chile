
import { Stage, Layer, Rect, Line, Image as KonvaImage, Text } from 'react-konva';
import { useState, useEffect, useCallback } from 'react';
import StreetPage from './StreetPage';
import React from 'react';
import { CanvasProps } from './models/canvasModels';
import { Rectangle } from './models/vistaplanoModels';


const Canvas: React.FC<CanvasProps> = ({
  puestos,
  setPuestos,
  planWidth,
  planHeight,
  setPlanWidth,
  setPlanHeight,
  calles,
  onUpdateStreet,
  onRemoveStreet,
  onPuestoClick,
  isStatic = false,
}) => {
  const planX = 50;
  const planY = 50;
  const gridSize = 50;
  const controlSize = 8;

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [hoveredRect, setHoveredRect] = useState<Rectangle | null>(null);

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

  // Función para calcular dimensiones en metros
  const calculateDimensionsInMeters = useCallback((width: number, height: number) => {
    const metersWidth = (width / gridSize) * 2; // Convertimos basado en tamaño base de 2 metros
    const metersHeight = (height / gridSize) * 2;
    return { metersWidth, metersHeight };
  }, []);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Rect
          x={planX}
          y={planY}
          width={planWidth}
          height={planHeight}
          fill="lightgray"
          stroke="black"
          strokeWidth={2}
        />

        {Array.from({ length: planWidth / gridSize }, (_, i) => (
          <Line
            key={`v-${i}`}
            points={[planX + i * gridSize, planY, planX + i * gridSize, planY + planHeight]}
            stroke="#ddd"
            strokeWidth={1}
          />
        ))}

        {Array.from({ length: planHeight / gridSize }, (_, i) => (
          <Line
            key={`h-${i}`}
            points={[planX, planY + i * gridSize, planX + planWidth, planY + i * gridSize]}
            stroke="#ddd"
            strokeWidth={1}
          />
        ))}

        {/* Controlador para redimensionar el plano */}
        {!isStatic && (
          <Rect
            x={planX + planWidth - controlSize / 2}
            y={planY + planHeight - controlSize / 2}
            width={controlSize}
            height={controlSize}
            fill="blue"
            draggable
            dragBoundFunc={(pos) => {
              const newWidth = Math.max(200, pos.x - planX); // Restricción mínima
              const newHeight = Math.max(200, pos.y - planY); // Restricción mínima
              setPlanWidth(newWidth);
              setPlanHeight(newHeight);
              return pos;
            }}
          />
        )}
      </Layer>

      <Layer>
        {puestos.map((rect) => {
          const { metersWidth, metersHeight } = calculateDimensionsInMeters(rect.width, rect.height);

          return (
            <React.Fragment key={rect.id}>
              <KonvaImage
                image={image || undefined}
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                draggable={!isStatic} // Condicional para habilitar o deshabilitar el arrastre
                onClick={!isStatic ? () => onPuestoClick(rect.id) : undefined}
                onDragEnd={(e) => {
                  if (!isStatic) {
                    const updatedpuestos = puestos.map((r) =>
                      r.id === rect.id ? { ...r, x: e.target.x(), y: e.target.y() } : r
                    );
                    setPuestos(updatedpuestos);
                  }
                }}
              />
              <Text
                x={rect.x}
                y={rect.y - 20}
                text={`N${rect.numero} | ${metersWidth.toFixed(2)}m x ${metersHeight.toFixed(2)}m`}
                fontSize={12}
                fill="black"
              />

              {/* Mostrar dimensiones al pasar el ratón sobre el puesto */}
              {!isStatic && (
                <Text
                  x={rect.x}
                  y={rect.y - 40}
                  text={`Click para editar: ${metersWidth.toFixed(2)}m x ${metersHeight.toFixed(2)}m`}
                  fontSize={12}
                  fill="black"
                  visible={hoveredRect?.id === rect.id} // Solo se muestra si el rectángulo está siendo hover
                  onMouseEnter={() => setHoveredRect(rect)}
                  onMouseLeave={() => setHoveredRect(null)}
                />
              )}

              {/* Control para redimensionar los puestos */}
              {!isStatic && (
                <Rect
                  x={rect.x + rect.width - controlSize / 2}
                  y={rect.y + rect.height - controlSize / 2}
                  width={controlSize}
                  height={controlSize}
                  fill="red"
                  draggable
                  dragBoundFunc={(pos) => {
                    const newWidth = Math.max(controlSize, pos.x - rect.x);
                    const newHeight = Math.max(controlSize, pos.y - rect.y);

                    const updatedpuestos = puestos.map((r) =>
                      r.id === rect.id ? { ...r, width: newWidth, height: newHeight } : r
                    );
                    setPuestos(updatedpuestos);

                    return pos;
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
        <StreetPage calles={calles} onRemoveStreet={onRemoveStreet} onUpdateStreet={onUpdateStreet} />
      </Layer>
    </Stage>
  );
};

export default Canvas;
