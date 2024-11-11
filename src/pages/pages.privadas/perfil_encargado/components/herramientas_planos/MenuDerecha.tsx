
import {  useState } from "react";
import { useParams } from "react-router-dom";
import { datosPuesto,  Rectangle } from "./models/vistaplanoModels";
import './css/menuD.css'; // Importa el archivo CSS
import { UpdatePuesto } from "./services/funcionesHP";


interface MenuDerechaProps {
  selectedPuesto: Rectangle ;
  onUpdatePuesto: (updatedPuesto: Partial<Rectangle>) => void;
  onRemoveRectangle: (id: number) => void;
  onClose: () => void;
  isLoading: boolean;
}



const MenuDerecha: React.FC<MenuDerechaProps> = ({
  selectedPuesto,
  onUpdatePuesto,
  onRemoveRectangle,
  onClose,
  isLoading,}) => {
    

  
  const { id_feria } = useParams<{ id_feria: string }>();
  const [descripcion, setDescripcion] = useState(selectedPuesto.descripcion);
  const [tipoPuesto, setTipoPuesto] = useState(selectedPuesto.tipoPuesto);
  const [estadoPuesto, setEstadoPuesto] = useState(selectedPuesto.estadoPuesto);
  const [precio, setPrecio] = useState(0);



  const ActualizarPuesto = async () => {
    if (!selectedPuesto || selectedPuesto.numero === undefined) {
      console.error("Error: `selectedPuesto` o `numero` no están definidos.");
      return;
    }
    const puestoUpdated: datosPuesto = {
      id_tipo_puesto: Number(tipoPuesto),
      numero: selectedPuesto!.numero, 
      descripcion: descripcion? descripcion :  '',
      id_feria: Number(id_feria),
      id_estado_puesto: Number(estadoPuesto),

    };


    //llamado a la funcion en services , luego udaptea en local 
    const resutl = await UpdatePuesto(puestoUpdated)
    if(resutl === true) {

      onUpdatePuesto(puestoUpdated)
    }

  }

  return (
    <div className="menuDerecha">
      <h3>Editar Puesto {selectedPuesto.id}</h3>
      <div>
        <label>Descripción:</label>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <div>
        <label>Tipo de Puesto:</label>
        <select
          value={tipoPuesto}
          onChange={(e) => setTipoPuesto(e.target.value)}
        >
          <option value="">Selecciona una opción</option>
          <option value="1">Día</option>
          <option value="2">Plazo</option>
          <option value="3">Contacto</option>
        </select>
      </div>
      <div>
        <label>Estado del Puesto:</label>
        <select
          value={estadoPuesto}
          onChange={(e) => setEstadoPuesto(e.target.value)}
        >
          <option value="">Selecciona una opción</option>
          <option value="1">Disponible</option>
          <option value="2">Ocupado</option>
          <option value="3">Mantenimiento</option>
        </select>
      </div>
 
      <div>
        <label>Precio:</label>
        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(parseFloat(e.target.value))}
        />
      </div>

      <button
        onClick={ActualizarPuesto}
        disabled={isLoading}
        className="saveButton"
      >
        {isLoading ? 'Guardando...' : 'Guardar'}
      </button>
      <button
        onClick={() => onRemoveRectangle(selectedPuesto.id)}
        className="deleteButton"
      >
        Eliminar Puesto
      </button>
      <button onClick={onClose} className="closeButton">
        Cerrar
      </button>
    </div>
  );
};

export default MenuDerecha;
