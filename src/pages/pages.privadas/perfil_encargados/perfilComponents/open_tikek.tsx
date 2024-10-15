
import axios from "axios";

export const OpenTiket = async (id_feria : number , mail : string)  => {

    try {
        const response = await axios.post(`http://localhost:5000/tiket` ,{id_feria , mail});
        console.log('solicitud de apertura exitosa con  la feria :', response.data)
    } catch (error) {
        console.error('Error al traer ferias', error);
        throw error; // Lanzar el error para que se maneje fuera de esta función
    }

        
    };


