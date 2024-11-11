
import './cards_feed.css'

interface pageProps {
    page : number
    setPage : (page : number ) => void 
}


const Paginacion = ({page , setPage } : pageProps) => {
    // Estado para las ferias y la página actual
   

    // Función para manejar el cambio de página
    const nextPage = async () => {
        await setPage(page + 1); // Incrementa la página

 
    };

    const prevPage = async () => {
        await setPage( (page > 1 ? page - 1 : 1)); // Decrementa la página, no permite valores menores a 1
    
    };

    return (
        <div className="center-content">
          <button
            className="pagination-button"
            onClick={prevPage}
            disabled={page === 1}
          >
            Anterior
          </button>
          <span className="pagination-text">Página {page}</span>
          <button className="pagination-button" onClick={nextPage}>
            Siguiente
          </button>
        </div>
      );
    };

export default Paginacion;
