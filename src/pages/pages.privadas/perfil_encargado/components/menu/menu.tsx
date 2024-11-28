import { Link } from "react-router-dom"


    interface enfMenuProps {
    changeFeria : (id : number) => void
    nombresF : {id: number , nombre:string}[]
    setMenuView : (view: string) => void
    id_feria : number
    }

export const Menu  = ({nombresF , changeFeria , setMenuView , id_feria} : enfMenuProps) => {

        const changeView = (newView : string) => {
            setMenuView(newView)
        }

    return (

        <div className="enfmenu">
            <h1>Mis Ferias</h1>
            <div className="misFerias">
            {nombresF.map((F) => (

            <button key={F.id} onClick={() => {changeFeria(F.id) ; changeView('admin')} } >   {F.nombre}   </button>
            ))}

            </div>

            <div className="menuView">
            <button> <Link to={`Plano/${id_feria}`}>Plano Feria</Link> </button>
                <button onClick={() => changeView('banco')}>Mis Bancos</button>
            </div>


        </div>
    )

    }