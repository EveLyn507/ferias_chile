import {  useNavigate } from "react-router-dom"


    interface enfMenuProps {
    changeFeria : (id : number) => void
    nombresF : {id: number , nombre:string}[]
    setMenuView : (view: string) => void
    id_feria : number
    }

export const Menu  = ({nombresF , changeFeria , setMenuView , id_feria} : enfMenuProps) => {
        const navigate = useNavigate()


        const goPlano = () => {
            navigate(`Plano/${id_feria}`)
        }

        const changeView = (newView : string) => {
            setMenuView(newView)
        }
        

    return (

        <div className="enfmenu">
            <br />
            <button onClick={() => changeView('nueva-feria')}> Crear Feria</button>
            <h1>Mis Ferias</h1>
            <div className="misFerias">
            {nombresF.map((F) => (

            <button key={F.id} onClick={() => {changeFeria(F.id) ; changeView('admin')} } >   {F.nombre}   </button>
            ))}

            </div>

            <div className="menuView">
            <button onClick={goPlano}> Plano Feria </button>
                <button onClick={() => changeView('banco')}>Mis Bancos</button>
            </div>


        </div>
    )

    }