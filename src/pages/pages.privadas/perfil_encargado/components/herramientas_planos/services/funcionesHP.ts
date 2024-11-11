import axios from "axios";
import { datosPuesto, FeriaData } from "../models/vistaplanoModels";

const API_URL = 'http://localhost:5000';

export const UpdateJsonFeria =async  (Updatedpuesto : FeriaData) => {




    try {
        const response = await fetch(`${API_URL}/api/feria`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({Updatedpuesto}),
        });

        const result = await response.json();

        if (!response.ok) {
        throw new Error('Error al guardar la feria: ' + result.error);
        }

        const feriaId = result.id_feria;
        console.log('Feria guardada con ID:', feriaId);
        console.log('feria guardada');

        return result.status

    
    } catch (error) {
        console.error('Error al guardar la feria:', error);
    }
}



export const CreatePuesto = async (id_feria : number) => {
    
    try {
        const response = await axios.post(`${API_URL}/CreatePuesto`, {id_feria});
        console.log("Puesto creado:", response.data);
        if(response.status=== 200) {
            return true
        }
      } catch (error) {
        console.error("Error al crear puesto:", error);
      }
};
  


export const UpdatePuesto = async (updatedPuesto : datosPuesto) => {

    
    try {
        const response = await axios.post(`${API_URL}/UpdatePuesto`, {updatedPuesto});
        console.log("Puesto actualizado:", response.data);
    
        if(response.status=== 200) {
            return true
        }
      } catch (error) {
        console.error("Error al actualizar el  puesto:", error);
      }
};
  
