import { Link } from "react-router-dom"

export const HomeSupervisor = () => {
  return (
    <div>
      <h1>Supervisor - Home</h1>
      <Link to="/GestionSupervisor">Gestionar Feria</Link>
      <Link to="/postulaciones">Postulaciones</Link>
    </div>
  )
}