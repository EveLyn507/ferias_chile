import { Stage, Layer, Rect, Line } from 'react-konva';

interface Rectangle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

interface CanvasProps {
  rectangles: Rectangle[];
  onRemoveRectangle: (id: string) => void;
  planWidth: number;
  planHeight: number;
  setPlanWidth: (width: number) => void;
  setPlanHeight: (height: number) => void;
}

const Canvas: React.FC<CanvasProps> = ({ rectangles, onRemoveRectangle, planWidth, planHeight, setPlanWidth, setPlanHeight }) => {
  const planX = 50;  // Posición fija del plano en X
  const planY = 50;  // Posición fija del plano en Y
  const gridSize = 50;  // Tamaño de la cuadrícula
  const controlSize = 10;  // Tamaño de los controladores de redimensionamiento

  const gridLines: JSX.Element[] = [];

  // Líneas verticales dentro del área delimitada
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

  // Líneas horizontales dentro del área delimitada
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
        {/* Dibuja el área delimitada del plano */}
        <Rect
          x={planX}
          y={planY}
          width={planWidth}
          height={planHeight}
          stroke="black"
          strokeWidth={4}
          fill="lightgray"
        />

        {/* Dibuja la cuadrícula dentro del área delimitada */}
        {gridLines}

        {/* Controlador inferior derecho para redimensionar */}
        <Rect
          x={planX + planWidth - controlSize / 2}
          y={planY + planHeight - controlSize / 2}
          width={controlSize}
          height={controlSize}
          fill="blue"
          draggable
          dragBoundFunc={(pos) => {
            // Restringir los controladores a los límites
            const newX = Math.max(planX + 100, pos.x);  // Asegura que el ancho mínimo sea 100px
            const newY = Math.max(planY + 100, pos.y);  // Asegura que el alto mínimo sea 100px
            setPlanWidth(newX - planX);
            setPlanHeight(newY - planY);
            return { x: newX, y: newY };
          }}
        />
      </Layer>

      <Layer>
        {/* Renderizar los rectángulos (puestos) dentro del área delimitada */}
        {rectangles.map((rect) => (
          <Rect
            key={rect.id}
            x={Math.min(Math.max(rect.x, planX), planX + planWidth - rect.width)}  // Restricción en X
            y={Math.min(Math.max(rect.y, planY), planY + planHeight - rect.height)} // Restricción en Y
            width={rect.width}
            height={rect.height}
            fill={rect.fill}
            draggable
            onClick={() => onRemoveRectangle(rect.id)}
            onDragEnd={(e) => {
              // Restringir el movimiento dentro del área delimitada
              const x = Math.min(Math.max(e.target.x(), planX), planX + planWidth - rect.width);
              const y = Math.min(Math.max(e.target.y(), planY), planY + planHeight - rect.height);
              e.target.position({ x, y });
            }}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default Canvas;
