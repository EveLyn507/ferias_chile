/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import {  FeriaData, PlanoItemElement, Rectangle } from "../models/vistaplanoModels";

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



export const CreatenewItemElement = async (newPuesto : PlanoItemElement) => {
    
    try {
        const response = await axios.post(`${API_URL}/CreatePuesto`, {newPuesto});
        console.log("Puesto creado:", response.data);
        if(response.status=== 200) {
            return response.data
        }
      } catch (error) {
        console.error("Error al crear puesto:", error);
      }
};
  


export const UpdatePuesto = async (updatedPuesto : Rectangle) => {

    
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
  

