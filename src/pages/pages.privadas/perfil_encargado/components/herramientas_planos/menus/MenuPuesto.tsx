
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Rectangle } from "../models/vistaplanoModels";
import '../css/menuD.css';

interface MenuDerechaProps {
  selectedPuesto: Rectangle | null;
  onRemoveRectangle: (id: number) => void;
  setSelectedItem: (item : Rectangle) => void
  isLoading: boolean;
}

const MenuDerecha: React.FC<MenuDerechaProps> = ({
  selectedPuesto,
  onRemoveRectangle,
  setSelectedItem,
  isLoading,
}) => {


  const handleChange = (field: keyof Rectangle, value: any) => {
    if (!selectedPuesto) return;
    
    // Crear un objeto actualizado para pasar a onUpdatePuesto
    const updatedPuesto = { ...selectedPuesto, [field]: value };
    setSelectedItem(updatedPuesto);
  };

  const ActualizarPuesto = async () => {
    if (!selectedPuesto || selectedPuesto.numero === undefined) {
      console.error("Error: `selectedPuesto` o `numero` no están definidos.");
      return;
    }


  };

  return (
    <div className="menu-container">
      <h3 className="menu-header">Editar Puesto {selectedPuesto?.id}</h3>

      <div className="xyinput-group">
        <div className="xy">
          <label>X</label>
          <input
            type="number"
            value={selectedPuesto?.x || 0}
            onChange={(e) => handleChange("x", parseFloat(e.target.value))}
          />
        </div>
        <div className="xy">
          <label>Y</label>
          <input
            type="number"
            value={selectedPuesto?.y || 0}
            onChange={(e) => handleChange("y", parseFloat(e.target.value))}
          />
        </div>
      </div>
      <br />
      <div className="xyinput-group">
        <div className="xy">
          <label>Width</label>
          <input
            type="number"
            value={selectedPuesto?.width || 0}
            onChange={(e) => handleChange("width", parseFloat(e.target.value))}
          />
        </div>
        <div className="xy">
          <label>Height</label>
          <input
            type="number"
            value={selectedPuesto?.height || 0}
            onChange={(e) => handleChange("height", parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="input-group">
        <label>Descripción:</label>
        <input
          type="text"
          value={selectedPuesto?.descripcion || ""}
          onChange={(e) => handleChange("descripcion", e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Tipo de Puesto:</label>
        <select
          value={selectedPuesto?.tipoPuesto || ""}
          onChange={(e) => handleChange("tipoPuesto", e.target.value)}
        >
          <option value="">Selecciona una opción</option>
          <option value="1">Día</option>
          <option value="2">Plazo</option>
          <option value="3">Contacto</option>
        </select>
      </div>

      <div className="input-group">
        <label>Estado del Puesto:</label>
        <select
          value={selectedPuesto?.estadoPuesto || ""}
          onChange={(e) => handleChange("estadoPuesto", e.target.value)}
        >
          <option value="">Selecciona una opción</option>
          <option value="1">Disponible</option>
          <option value="2">Ocupado</option>
          <option value="3">Mantenimiento</option>
        </select>
      </div>

      <div className="input-group">
        <label>Precio:</label>
        <input
          type="number"
          value={selectedPuesto?.precio || 0}
          onChange={(e) => handleChange("precio", parseFloat(e.target.value))}
        />
      </div>

      <button
        onClick={ActualizarPuesto}
        disabled={isLoading}
        className="menu-button save-button"
      >
        {isLoading ? 'Guardando...' : 'Guardar'}
      </button>

      <button
        onClick={() => onRemoveRectangle(selectedPuesto!.id)}
        className="menu-button delete-button"
      >
        Eliminar Puesto
      </button>
    </div>
  );
};

export default MenuDerecha;
