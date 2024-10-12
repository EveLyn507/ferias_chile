import axios from "axios";
import React, { useState } from "react"

export const Registro = () => {

  const [nombre,setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rut, setRut] = useState('');
  const [mail, setmail] = useState('');
  const [telefono,setTelefono] = useState('');
  const [contrasena,Setcontrasena] = useState('');
  const [contrasena2,Setcontrasena2] = useState('');
  const [error2, setError2] = useState('');
  const [role, setRole] = useState('');


  const clicRegistro =async  (e: React.FormEvent) => {
    e.preventDefault();

    try{
      const response = await axios.post('http://localhost:5000/registro' , {mail , rut ,nombre , apellido , telefono  , role, contrasena }) 
      console.log('Registro exitoso:', response.data);
    } catch(err) {
      setError2('error al registrar usuario');
      console.error(err);
    }
 
  }

return (
<>


<h2>registro</h2>
<form onSubmit={clicRegistro}>
    <div>
      <div>
      <label htmlFor="">nombre</label>
        <input type="text" value={nombre} onChange={(e)=> setNombre(e.target.value)}required/>  
       
        </div>
      <div>
      <label htmlFor="">apellido</label>
        <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)}/>
        </div>

        <div>
      <label htmlFor="">rut</label>
        <input type="text" value={rut} onChange={(e) => setRut(e.target.value)}required />
        </div>

      <div>
      <label htmlFor="">mail</label>
        <input type="email"  value={mail} onChange={(e) => setmail(e.target.value)} required/>
        </div>

      <div>
        <label htmlFor="">telefono</label>
        <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)}/>
        </div>

        <div>
        <label htmlFor="">contrasena</label> 
        <input type="password" value={contrasena} onChange={(e) => Setcontrasena(e.target.value)} required/>
        </div>

        <div>
        <label htmlFor="">repetir</label>
        <input type="password" value={contrasena2} onChange={(e) => Setcontrasena2(e.target.value)} required/>
        </div>
    </div>


      <div>
      <select 
                id="role" 
                name="role"  
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                required
            >
                <option value="" disabled>Select a role</option>
                <option value={1}>Encargado</option>
                <option value={2}>Feriante</option> 
                <option value={3}>Administrador Muni</option>
            </select>
      </div>
    <button type="submit">registrarse</button>
    {error2 && <p>{error2}</p>}
</form>





  </>
)


}

