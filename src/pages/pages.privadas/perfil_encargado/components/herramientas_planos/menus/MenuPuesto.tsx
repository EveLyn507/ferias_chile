/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useParams } from "react-router-dom";
import {  Rectangle } from "../models/vistaplanoModels";
import '../css/menuD.css'; // Importa el archivo CSS
import { UpdatePuesto } from "../services/funcionesHP";

interface MenuDerechaProps {
  selectedPuesto: Rectangle | null;
  onUpdatePuesto: (updatedPuesto: Partial<Rectangle>) => void;
  onRemoveRectangle: (id: number) => void;
  isLoading: boolean;
}

const MenuDerecha: React.FC<MenuDerechaProps> = ({
  selectedPuesto,
  onUpdatePuesto,
  onRemoveRectangle,
  isLoading,
}) => {
  const { id_feria } = useParams<{ id_feria: string }>();

  const [dataPuesto, setDataPuesto] = useState<Rectangle>({
    id: selectedPuesto?.id || 0,
    x: selectedPuesto?.x || 0,
    y: selectedPuesto?.y || 0,
    width: selectedPuesto?.width || 0,
    height: selectedPuesto?.height || 0,
    fill: selectedPuesto?.fill || "",
    descripcion: selectedPuesto?.descripcion || "",
    tipoPuesto: selectedPuesto?.tipoPuesto || "",
    estadoPuesto: selectedPuesto?.estadoPuesto || "",
    numero: selectedPuesto?.numero || 0,
    precio: selectedPuesto?.precio || 0,
    type: 'puesto'
  });

  const handleChange = (field: keyof Rectangle, value: any) => {
    setDataPuesto((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const ActualizarPuesto = async () => {
    if (!selectedPuesto || selectedPuesto.numero === undefined) {
      console.error("Error: `selectedPuesto` o `numero` no están definidos.");
      return;
    }

    const result = await UpdatePuesto(dataPuesto);
    if (result === true) {
      onUpdatePuesto(dataPuesto);
    }
  };

  return (
    <div className="menu-container">
      <h3 className="menu-header">Editar Puesto {selectedPuesto?.id}</h3>

      <div className="xyinput-group">
  <div className="xy">
    <label>X</label>
    <input type="number" value={0} />
  </div>
  <div className="xy">
    <label>Y</label>
    <input type="number" value={0} />
  </div>
</div>
<br />
<div className="xyinput-group">
  <div className="xy">
    <label>Width</label>
    <input type="number" value={0} />
  </div>
  <div className="xy">
    <label>Height</label>
    <input type="number" value={0} />
  </div>
</div>


      <div className="input-group">
        <label>Descripción:</label>
        <input
          type="text"
          value={dataPuesto.descripcion || ""}
          onChange={(e) => handleChange("descripcion", e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Descripción:</label>
        <input
          type="text"
          value={dataPuesto.descripcion || ""}
          onChange={(e) => handleChange("descripcion", e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Tipo de Puesto:</label>
        <select
          value={dataPuesto.tipoPuesto || ""}
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
          value={dataPuesto.estadoPuesto || ""}
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
          value={dataPuesto.precio || 0} // Suponiendo que el precio se refiere al ancho
          onChange={(e) => handleChange("width", parseFloat(e.target.value))}
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
