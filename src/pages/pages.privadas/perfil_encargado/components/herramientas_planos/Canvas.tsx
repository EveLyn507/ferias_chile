import { Stage, Layer, Rect, Line, Image as KonvaImage, Text } from 'react-konva';
import { useState, useEffect } from 'react';
import AreaPage from './Areapage';
import StreetPage from './StreetPage';
import React from 'react';

interface Rectangle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

interface CanvasProps {
  rectangles: Rectangle[];
  setRectangles: React.Dispatch<React.SetStateAction<Rectangle[]>>;
  planWidth: number;
  planHeight: number;
  setPlanWidth: (width: number) => void;  
  setPlanHeight: (height: number) => void;
  areas: any[]; 
  onRemoveArea: (id: number) => void;
  streets: any[];
  onUpdateArea: (id: number, updatedProps: any) => void; 
  onUpdateStreet: (id: number, updatedProps: any) => void; 
  onRemoveStreet: (id: number) => void; 
  onRectangleClick: (id: number) => void; 
}

const Canvas: React.FC<CanvasProps> = ({
  rectangles,
  setRectangles,
  planWidth,
  planHeight,
  setPlanWidth,
  setPlanHeight,
  areas,
  onRemoveArea,
  streets,
  onUpdateArea,
  onUpdateStreet,
  onRemoveStreet,
  onRectangleClick,
}) => {
  const planX = 50;
  const planY = 50;
  const gridSize = 50;
  const controlSize = 8;

  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = '/imagenes/puesto.png';
    img.onload = () => {
      setImage(img);
    };
  }, []);

  const calculateDimensionsInMeters = (width: number, height: number) => {
    const metersWidth = (width / gridSize) * 2; // Convertimos basado en tamaño base de 2 metros
    const metersHeight = (height / gridSize) * 2;
    return { metersWidth, metersHeight };
  };

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
        <Rect
          x={planX + planWidth - controlSize / 2}
          y={planY + planHeight - controlSize / 2}
          width={controlSize}
          height={controlSize}
          fill="blue"
          draggable
          dragBoundFunc={(pos) => {
            const newWidth = Math.max(controlSize, pos.x - planX);
            const newHeight = Math.max(controlSize, pos.y - planY);
            setPlanWidth(newWidth);
            setPlanHeight(newHeight);
            return pos;
          }}
        />
      </Layer>

      <Layer>
        {rectangles.map((rect) => {
          const { metersWidth, metersHeight } = calculateDimensionsInMeters(rect.width, rect.height);

          return (
            <React.Fragment key={rect.id}>
              <KonvaImage
                image={image || undefined}
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                draggable
                onClick={() => onRectangleClick(rect.id)}
                onDragEnd={(e) => {
                  const updatedRectangles = rectangles.map((r) =>
                    r.id === rect.id ? { ...r, x: e.target.x(), y: e.target.y() } : r
                  );
                  setRectangles(updatedRectangles);
                }}
              />
              <Text
                x={rect.x}
                y={rect.y - 20}
                text={`${metersWidth.toFixed(2)}m x ${metersHeight.toFixed(2)}m`}
                fontSize={12}
                fill="black"
              />
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

                  const updatedRectangles = rectangles.map((r) =>
                    r.id === rect.id ? { ...r, width: newWidth, height: newHeight } : r
                  );
                  setRectangles(updatedRectangles);

                  return pos;
                }}
              />
            </React.Fragment>
          );
        })}
        <AreaPage areas={areas} onRemoveArea={onRemoveArea} onUpdateArea={onUpdateArea} />
        <StreetPage streets={streets} onRemoveStreet={onRemoveStreet} onUpdateStreet={onUpdateStreet} />
      </Layer>
    </Stage>
  );
};

export default Canvas;
