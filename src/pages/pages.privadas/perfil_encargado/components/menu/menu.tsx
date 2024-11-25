

    interface enfMenuProps {
    changeFeria : (id : number) => void
    nombresF : {id: number , nombre:string}[]
    }

    export const Menu  = ({nombresF , changeFeria } : enfMenuProps) => {

 

    return (

        <div className="enfmenu">
            <h1>Mis Ferias</h1>
            <div className="misFerias">
            {nombresF.map((F) => (

            <button key={F.id} onClick={() => changeFeria(F.id)} >   {F.nombre}   </button>
            ))}

            </div>


        </div>
    )

    }