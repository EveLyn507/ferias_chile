
/* eslint-disable @typescript-eslint/no-explicit-any */
import { dataPuesto,  PlanoItemElement, Rectangle } from "../models/vistaplanoModels";

interface MenuDerechaProps {
  selectedPuesto: PlanoItemElement | null;
  deleteItem: (item: PlanoItemElement) => void;
  setSelectedItem: (item : PlanoItemElement) => void
  isLoading: boolean;
}


const MenuPuesto: React.FC<MenuDerechaProps> = ({
  selectedPuesto,
  deleteItem,
  setSelectedItem,
  
}) => {

const scale = 100

const handleChangeDimencion = (field: keyof Rectangle, value: any) => {
  if (!selectedPuesto) return;

  if (field === "width" || field === "height") {
    value = value * scale; // Convertimos el valor a píxeles si es necesario
  }



  // Crear un objeto actualizado para pasar a onUpdatePuesto
  const updatedPuesto = {
    ...selectedPuesto,
    dimenciones: {
      ...selectedPuesto.dimenciones,
      [field]: value,
    },
  };

  setSelectedItem(updatedPuesto);
};



  const handleChangePdata = (field: keyof dataPuesto, value: any) => {
    if (!selectedPuesto) return;
    
  
    // Crear un objeto actualizado para pasar a onUpdatePuesto
    const updatedPuesto = { ...selectedPuesto, dataPuesto : { ...selectedPuesto.dataPuesto!, [field]: value }  };
    setSelectedItem(updatedPuesto);
  };




  return (
    <div className="menu-container">
      <div className="menu-content">
 
      <h3 className="menu-header">Editar Puesto {selectedPuesto?.id_elemento}</h3>

      <div className="xyinput-group">
        <div className="xy">
          <label>X</label>
          <input
            type="number"
            value={selectedPuesto?.dimenciones.x }
            onChange={(e) => handleChangeDimencion("x", parseInt(e.target.value))}
          />
        </div>
        <div className="xy">
          <label>Y</label>
          <input
            type="number"
            value={selectedPuesto?.dimenciones.y  }
            onChange={(e) => handleChangeDimencion("y", parseInt(e.target.value))}
          />
        </div>
      </div>
      <br />
      <div className="xyinput-group">
        <div className="xy">
          <label>Ancho (M) </label>
          <input
            type="number"
            value={selectedPuesto!.dimenciones.width! / scale  }
            onChange={(e) => handleChangeDimencion("width", parseInt(e.target.value) )}
          />
        </div>
        <div className="xy">
          <label>Largo (M)</label> 
          <input
            type="number"
            value={selectedPuesto!.dimenciones.height! /scale }
            onChange={(e) => handleChangeDimencion("height", parseInt(e.target.value ))}
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
          onChange={(e) => handleChangePdata("id_tipo_puesto", parseInt(e.target.value))}
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
      <div className="botones-menu">


      <button
        onClick={() => deleteItem(selectedPuesto!)}
        className="menu-button delete-button"
      >
        Eliminar Puesto
      </button>
      </div>
             
      </div>
    </div>
  );
};

export default MenuPuesto;
