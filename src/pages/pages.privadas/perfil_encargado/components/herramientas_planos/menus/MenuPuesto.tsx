
/* eslint-disable @typescript-eslint/no-explicit-any */
import { dataPuesto,  PlanoItemElement, Rectangle } from "../models/vistaplanoModels";
import '../css/menuD.css';

interface MenuDerechaProps {
  selectedPuesto: PlanoItemElement | null;
  onRemoveRectangle: (id: number) => void;
  setSelectedItem: (item : PlanoItemElement) => void
  isLoading: boolean;
}





const MenuDerecha: React.FC<MenuDerechaProps> = ({
  selectedPuesto,
  onRemoveRectangle,
  setSelectedItem,
  isLoading,
}) => {



  const handleChangeDimencion = (field: keyof Rectangle, value: any) => {
    if (!selectedPuesto) return;
    
    // Crear un objeto actualizado para pasar a onUpdatePuesto
    const updatedPuesto = { ...selectedPuesto, [field]: value };
    setSelectedItem(updatedPuesto);
  };


  const handleChangePdata = (field: keyof dataPuesto, value: any) => {
    if (!selectedPuesto) return;
    
    // Crear un objeto actualizado para pasar a onUpdatePuesto
    const updatedPuesto = { ...selectedPuesto, [field]: value };
    setSelectedItem(updatedPuesto);
  };


  const ActualizarPuesto = async () => {
    if (!selectedPuesto || selectedPuesto.id_elemento === undefined) {
      console.error("Error: `selectedPuesto` o `numero` no están definidos.");
      return;
    }


  };

  return (
    <div className="menu-container">
      <h3 className="menu-header">Editar Puesto {selectedPuesto?.id_elemento}</h3>

      <div className="xyinput-group">
        <div className="xy">
          <label>X</label>
          <input
            type="number"
            value={selectedPuesto?.dimenciones.x }
            onChange={(e) => handleChangeDimencion("x", parseFloat(e.target.value))}
          />
        </div>
        <div className="xy">
          <label>Y</label>
          <input
            type="number"
            value={selectedPuesto?.dimenciones.y }
            onChange={(e) => handleChangeDimencion("y", parseFloat(e.target.value))}
          />
        </div>
      </div>
      <br />
      <div className="xyinput-group">
        <div className="xy">
          <label>Width</label>
          <input
            type="number"
            value={selectedPuesto?.dimenciones.width }
            onChange={(e) => handleChangeDimencion("width", parseFloat(e.target.value))}
          />
        </div>
        <div className="xy">
          <label>Height</label>
          <input
            type="number"
            value={selectedPuesto?.dimenciones.height }
            onChange={(e) => handleChangeDimencion("height", parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="input-group">
        <label>Descripción:</label>
        <input
          type="text"
          value={selectedPuesto?.dataPuesto!.descripcion || "vacio"}
          onChange={(e) => handleChangePdata("descripcion", e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Tipo de Puesto:</label>
        <select
          value={selectedPuesto?.dataPuesto?.id_tipo_puesto || ""}
          onChange={(e) => handleChangePdata("id_tipo_puesto", e.target.value)}
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
          value={selectedPuesto?.dataPuesto!.id_estado_puesto || ""}
          onChange={(e) => handleChangePdata("id_estado_puesto", e.target.value)}
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
          value={selectedPuesto?.dataPuesto!.precio || 0}
          onChange={(e) => handleChangePdata("precio", parseFloat(e.target.value))}
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
        onClick={() => onRemoveRectangle(selectedPuesto!.id_elemento!)}
        className="menu-button delete-button"
      >
        Eliminar Puesto
      </button>
    </div>
  );
};

export default MenuDerecha;
