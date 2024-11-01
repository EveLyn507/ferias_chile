import { Link } from "react-router-dom"

export const HomeSupervisor = () => {
  return (
    <div>
      <h1>Supervisor - Home</h1>
      <Link to="/supervisor/gestion">Gestionar Feria</Link>
      <Link to="/supervisor/postulaciones">Postulaciones</Link>
    </div>
  )
}