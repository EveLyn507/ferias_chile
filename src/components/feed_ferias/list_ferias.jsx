export const Item_list = ({ferias}) => {

    console.log(ferias); // Para depurar el estado de ferias
  return (

        <div className="ferias">
            { ferias.map((ferias) => <div className = 'card' key={ferias.id}> {ferias.nombre} </div>
            
            )  }


     

    </div>

  )
}
