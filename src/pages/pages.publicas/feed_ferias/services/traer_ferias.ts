import axios from "axios";


export const traerFerias = async (page: number , limit : number) => {

    try{
        const response  = await axios.post('http://localhost:5000/Feed-ferias', {page , limit} )
        const feria = response.data
        return feria

    }
    catch (error) {
        console.error('Error al traer ferias', error);

      }
    }