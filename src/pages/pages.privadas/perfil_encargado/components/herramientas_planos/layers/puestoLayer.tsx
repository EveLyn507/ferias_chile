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
      {puestos.map((Puesto , index) => {
        const { metersWidth, metersHeight } = calculateDimensionsInMeters(Puesto.width, Puesto.height);

        return (
          <React.Fragment key={Puesto.id}>
            <KonvaImage
              image={image || undefined}
              x={Puesto.x}
              y={Puesto.y}
              width={Puesto.width}
              height={Puesto.height}
              draggable={!isStatic}
              onClick={!isStatic ? () => onPuestoClick(Puesto) : undefined}
              onDragEnd={(e) => {
                if (!isStatic) {
                  const idx = index
                  const updatedpuestos = puestos.map((r) =>
                    r.id === Puesto.id ? { ...r, x: e.target.x(), y: e.target.y() } : r
                  );
                  onPuestoClick(updatedpuestos[idx])
                }
              }}
            />
            <Text
              x={Puesto.x}
              y={Puesto.y - 20}
              text={`N${Puesto.numero} | ${metersWidth.toFixed(2)}m x ${metersHeight.toFixed(2)}m`}
              fontSize={12}
              fill="black"
            />

            {/* Mostrar dimensiones al pasar el ratón sobre el puesto */}
            {!isStatic && (
              <Text
                x={Puesto.x}
                y={Puesto.y - 40}
                text={`Click para editar: ${metersWidth.toFixed(2)}m x ${metersHeight.toFixed(2)}m`}
                fontSize={12}
                fill="black"
                visible={hoveredRect?.id === Puesto.id}
                onMouseEnter={() => setHoveredRect(Puesto)}
                onMouseLeave={() => setHoveredRect(null)}
              />
            )}

            {/* Control para redimensionar los puestos */}
            {!isStatic && (
              <Rect
                x={Puesto.x + Puesto.width - 8 / 2}
                y={Puesto.y + Puesto.height - 8 / 2}
                width={8}
                height={8}
                fill="red"
                draggable
                dragBoundFunc={(pos ) => {
                  const newWidth = Math.max(8, pos.x - Puesto.x);
                  const newHeight = Math.max(8, pos.y - Puesto.y);
                  const idx = index

                  const updatedpuestos = puestos.map((r) =>
                    r.id === Puesto.id ? { ...r, width: newWidth, height: newHeight } : r
                  );
                  setPuestos(updatedpuestos);
                  onPuestoClick(updatedpuestos[idx])

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
