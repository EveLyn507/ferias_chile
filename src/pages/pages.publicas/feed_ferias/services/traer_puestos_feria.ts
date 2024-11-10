/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"



export const Traer_puestos = async (id_feria: any) => {
    try {
        const response = await axios.get(`http://localhost:5000/ferias/${id_feria}`);
        const puesto = response.data;
        return puesto; // Retorna los datos de la feria
    } catch (error) {
        console.error('Error al traer ferias', error);
        throw error; // Lanzar el error para que se maneje fuera de esta función
    }
};



export const Traer_puestos_actividad = async (nombre_feria: string ,date : string ) => {
    console.log(date);
    
    try {
        const response = await axios.get(`http://localhost:5000/getPuestosActividad/${nombre_feria}/${date}`);
        const puesto = response.data;
        return puesto; // Retorna los datos de la feria
    } catch (error) {
        console.error('Error al traer ferias', error);
        throw error; // Lanzar el error para que se maneje fuera de esta función
    }
};


