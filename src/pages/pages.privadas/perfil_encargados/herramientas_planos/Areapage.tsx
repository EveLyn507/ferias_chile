import { Rect, Text } from 'react-konva';

interface Area {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AreaPageProps {
  areas: Area[];
  onRemoveArea: (id: number) => void;
  onUpdateArea: (id: number, updatedProps: Partial<Area>) => void;
}

const AreaPage: React.FC<AreaPageProps> = ({ areas, onRemoveArea, onUpdateArea }) => {
  const controlSize = 10;

  return (
    <>
      {areas.map((area) => (
        <React.Fragment key={area.id}>
          <Rect
            x={area.x}
            y={area.y}
            width={area.width}
            height={area.height}
            fill="rgba(0, 0, 255, 0.3)"
            draggable
            onDragMove={(e) => {
              const newX = e.target.x();
              const newY = e.target.y();
              onUpdateArea(area.id, { x: newX, y: newY });
            }}
            onDblClick={() => onRemoveArea(area.id)}
          />
          <Text x={area.x + 5} y={area.y + 5} text={area.name} fontSize={16} />
          <Rect
            x={area.x + area.width - controlSize / 2}
            y={area.y + area.height - controlSize / 2}
            width={controlSize}
            height={controlSize}
            fill="red"
            draggable
            onDragMove={(e) => {
              const newWidth = Math.max(50, e.target.x() - area.x);
              const newHeight = Math.max(50, e.target.y() - area.y);
              onUpdateArea(area.id, { width: newWidth, height: newHeight });
            }}
          />
        </React.Fragment>
      ))}
    </>
  );
};

export default AreaPage;
