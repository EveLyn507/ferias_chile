import React, { useCallback, useRef, useState } from 'react';
import { Rect, Text, Image as KonvaImage, Layer } from 'react-konva';
import { PlanoItemElement } from '../models/vistaplanoModels';

interface PuestosLayerProps {
  puestos: PlanoItemElement[];
  setPuestos: React.Dispatch<React.SetStateAction<PlanoItemElement[]>>;
  isStatic: boolean;
  image: HTMLImageElement | null;
  onPuestoClick: (item: PlanoItemElement) => void;
  hoveredRect: PlanoItemElement | null;
  setHoveredRect: React.Dispatch<React.SetStateAction<PlanoItemElement | null>>;
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

  // Estado para el puesto que tiene el foco
  const [focusedPuesto, setFocusedPuesto] = useState<PlanoItemElement | null>(null);

  // Función para calcular dimensiones en metros
  const calculateDimensionsInMeters = useCallback((width: number, height: number) => {
    const metersWidth = (width / 50) * 2; // Convertimos basado en tamaño base de 2 metros
    const metersHeight = (height / 50) * 2;
    return { metersWidth, metersHeight };
  }, []);

  return (
    <Layer ref={layerRef}>
      {puestos.map((Puesto, index) => {
        const { metersWidth, metersHeight } = calculateDimensionsInMeters(Puesto.dimenciones.width, Puesto.dimenciones.height);

        return (
          <React.Fragment key={Puesto.id_elemento}>
            <KonvaImage
              image={image || undefined}
              x={Puesto.dimenciones.x}
              y={Puesto.dimenciones.y}
              width={Puesto.dimenciones.width}
              height={Puesto.dimenciones.height}
              draggable={!isStatic}
              
              onClick={() => {
                if (!isStatic) {
                  setFocusedPuesto(Puesto); // Establece el foco al puesto clickeado
                  onPuestoClick(Puesto);
                }
              }}
              onDragStart={() => { setFocusedPuesto(Puesto);} }
              onDragMove={(e) => {
              
                if (!isStatic && focusedPuesto?.id_elemento === Puesto.id_elemento) {
                  const updatedpuestos = puestos.map((r) =>
                    r.id_elemento === Puesto.id_elemento
                      ? { ...r, dimenciones: { ...r.dimenciones, x: e.target.x(), y: e.target.y() } }
                      : r
                  );
                  setPuestos(updatedpuestos);
                  onPuestoClick(updatedpuestos[index]);
                }
              }}
            />
            <Text
              x={Puesto.dimenciones.x}
              y={Puesto.dimenciones.y - 20}
              text={`N${Puesto.nombre_elemento} | ${metersWidth.toFixed(2)}m x ${metersHeight.toFixed(2)}m`}
              fontSize={12}
              fill="black"
            />

            {/* Mostrar dimensiones al pasar el ratón sobre el puesto */}
            {!isStatic && (
              <Text
                x={Puesto.dimenciones.x}
                y={Puesto.dimenciones.y - 40}
                text={`Click para editar: ${metersWidth.toFixed(2)}m x ${metersHeight.toFixed(2)}m`}
                fontSize={12}
                fill="black"
                visible={hoveredRect?.id_elemento === Puesto.id_elemento}
                onMouseEnter={() => setHoveredRect(Puesto)}
                onMouseLeave={() => setHoveredRect(null)}
              />
            )}

            {/* Control para redimensionar los puestos, solo si el puesto tiene foco */}
            {!isStatic && focusedPuesto?.id_elemento === Puesto.id_elemento && (
              <Rect
                x={Puesto.dimenciones.x + Puesto.dimenciones.width - 4} // Mueve el botón junto al borde del puesto
                y={Puesto.dimenciones.y + Puesto.dimenciones.height - 4}
                width={8}
                height={8}
                fill="red"
                draggable={!Puesto.dimenciones.isStatic && !isStatic}
                dragBoundFunc={(pos) => {
                  const newWidth = Math.max(8, pos.x - Puesto.dimenciones.x);
                  const newHeight = Math.max(8, pos.y - Puesto.dimenciones.y);

                  const updatedpuestos = puestos.map((r) =>
                    r.id_elemento === Puesto.id_elemento
                      ? { ...r, dimenciones: { ...r.dimenciones, width: newWidth, height: newHeight } }
                      : r
                  );
                  setPuestos(updatedpuestos);
                  onPuestoClick(updatedpuestos[index]);

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
