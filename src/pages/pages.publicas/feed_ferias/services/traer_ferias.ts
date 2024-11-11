import axios from "axios";


export const traerFerias = async (page: number , limit : number , idComuna : number | null , idRegion : number | null) => {

    try{
        const response  = await axios.post('http://localhost:5000/Feed-ferias', {page , limit , idComuna , idRegion} )
        const feria = response.data
        return feria

    }
    catch (error) {
        console.error('Error al traer ferias', error);

      }
    }