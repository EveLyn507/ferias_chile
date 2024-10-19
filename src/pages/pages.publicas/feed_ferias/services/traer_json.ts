import axios from "axios";

 export const fetchFeriaData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/feria/3'); 
      const datos = response.data;
        return datos
    } catch (error) {
      console.error('Error al obtener los datos de la feria:', error);
    }
  };