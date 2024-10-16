/* eslint-disable @typescript-eslint/no-explicit-any */
import { Stage, Layer, Rect, Line } from 'react-konva';
import AreaPage from './Areapage';
import StreetPage from './StreetPage';

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
  onRemoveRectangle: (id: number) => void;
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
}

const Canvas: React.FC<CanvasProps> = ({
  rectangles,
  setRectangles,
  onRemoveRectangle,
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
}) => {
  const planX = 50; 
  const planY = 50; 
  const gridSize = 50; 
  const controlSize = 10;

  const gridLines: JSX.Element[] = [];


  for (let i = 0; i < planWidth / gridSize; i++) {
    gridLines.push(
      <Line
        key={`v-${i}`}
        points={[planX + i * gridSize, planY, planX + i * gridSize, planY + planHeight]}
        stroke="#ddd"
        strokeWidth={1}
      />
    );
  }

  for (let i = 0; i < planHeight / gridSize; i++) {
    gridLines.push(
      <Line
        key={`h-${i}`}
        points={[planX, planY + i * gridSize, planX + planWidth, planY + i * gridSize]}
        stroke="#ddd"
        strokeWidth={1}
      />
    );
  }

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

        {gridLines}

        <Rect
          x={planX + planWidth - controlSize / 2}
          y={planY + planHeight - controlSize / 2}
          width={controlSize}
          height={controlSize}
          fill="blue"
          draggable
          dragBoundFunc={(pos) => {
            const newX = Math.max(planX + controlSize, pos.x); // Ancho mínimo
            const newY = Math.max(planY + controlSize, pos.y); // Alto mínimo
            setPlanWidth(newX - planX); // Actualiza el ancho del plano
            setPlanHeight(newY - planY); // Actualiza el alto del plano
            return { x: newX, y: newY }; // Retorna la nueva posición del controlador
          }}
        />
        </Layer>

        <Layer>
        {rectangles.map((rect) => (
          <Rect
            key={rect.id}
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            fill={rect.fill}
            draggable
            onClick={() => onRemoveRectangle(rect.id)}
            onDragEnd={(e) => {
              const updatedRectangles = rectangles.map(r => 
                r.id === rect.id
                  ? { ...r, x: e.target.x(), y: e.target.y() }
                  : r
              );
              setRectangles(updatedRectangles);
            }}
          />
        ))}
        <AreaPage areas={areas} onRemoveArea={onRemoveArea} onUpdateArea={onUpdateArea} />
        <StreetPage streets={streets} onRemoveStreet={onRemoveStreet} onUpdateStreet={onUpdateStreet} />
      </Layer>
    </Stage>
  );
};

export default Canvas;
