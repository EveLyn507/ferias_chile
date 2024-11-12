import React, { useCallback, useRef } from 'react';
import { Rect, Text, Image as KonvaImage, Layer } from 'react-konva';
import { Rectangle } from '../models/vistaplanoModels';


interface PuestosLayerProps {
  puestos: Rectangle[];
  setPuestos: React.Dispatch<React.SetStateAction<Rectangle[]>>;
  isStatic: boolean;
  image: HTMLImageElement | null;
  onPuestoClick: (item : Rectangle) => void;
  hoveredRect: Rectangle | null;
  setHoveredRect: React.Dispatch<React.SetStateAction<Rectangle | null>>;
}




const PuestosLayer: React.FC<PuestosLayerProps> = ({
  puestos,
  setPuestos,
  isStatic,
  image,
  onPuestoClick,
  hoveredRect,
  setHoveredRect,
}) => {

  const layerRef = useRef(null);
    // Función para calcular dimensiones en metros
    const calculateDimensionsInMeters = useCallback((width: number, height: number) => {
      const metersWidth = (width / 50) * 2; // Convertimos basado en tamaño base de 2 metros
      const metersHeight = (height / 50) * 2;
      return { metersWidth, metersHeight };
    }, []);


  return (
    <Layer ref={layerRef}>
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
              draggable={!isStatic}
              onClick={!isStatic ? () => onPuestoClick(rect) : undefined}
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
                visible={hoveredRect?.id === rect.id}
                onMouseEnter={() => setHoveredRect(rect)}
                onMouseLeave={() => setHoveredRect(null)}
              />
            )}

            {/* Control para redimensionar los puestos */}
            {!isStatic && (
              <Rect
                x={rect.x + rect.width - 8 / 2}
                y={rect.y + rect.height - 8 / 2}
                width={8}
                height={8}
                fill="red"
                draggable
                dragBoundFunc={(pos) => {
                  const newWidth = Math.max(8, pos.x - rect.x);
                  const newHeight = Math.max(8, pos.y - rect.y);

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
    </Layer>
  );
};

export default PuestosLayer;
