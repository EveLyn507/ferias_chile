

    interface enfMenuProps {
    setMenuView : (view: string) => void

    }

export const Menu  = ({ setMenuView } : enfMenuProps) => {

    return (

        <div className="ftemenu">
            <div className="menuView">
         
                <button onClick={() => setMenuView('configuracion')}>Configuracion</button>
                <button onClick={() => setMenuView('postulaciones')}>Bolsa Empleo</button>
            </div>


        </div>
    )

    }