import axios from "axios";


export const traerFerias = async () => {

    try{
        const response  = await axios.get('http://localhost:5000/Feed-ferias')
        const feria = response.data
        return feria

    }
    catch (error) {
        console.error('Error al traer ferias', error);

      }
    }