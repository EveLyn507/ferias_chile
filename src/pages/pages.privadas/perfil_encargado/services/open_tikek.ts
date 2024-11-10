
import axios from "axios";

export const OpenTiket = async (id_feria : number )  => {

    try {
        const response = await axios.post(`http://localhost:5000/tiket` ,{id_feria });
        console.log('solicitud de apertura exitosa con  la feria :', response.data)

        return response.status
    } catch (error) {
        console.error('Error al abrir tiket', error);
        throw error; // Lanzar el error para que se maneje fuera de esta función
    }

        
    };


