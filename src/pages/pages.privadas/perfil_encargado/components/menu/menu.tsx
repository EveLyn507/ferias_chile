

    interface enfMenuProps {
    changeFeria : (id : number) => void
    nombresF : {id: number , nombre:string}[]
    }

    export const Menu  = ({nombresF , changeFeria } : enfMenuProps) => {

 

    return (

        <div className="enfmenu">
            <h1>menu</h1>
            <div className="misFerias">
            {nombresF.map((F) => (

            <h4 key={F.id} onClick={() => changeFeria(F.id)} >   {F.nombre}   </h4>
            ))}

            </div>


        </div>
    )

    }