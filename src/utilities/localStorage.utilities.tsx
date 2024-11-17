import { useNavigate, Navigate  } from 'react-router-dom';

export const persistLocalStorage = <T,>(_key : string , value : T ) => {
    localStorage.setItem('user', JSON.stringify({ ...value}));
}



export const clearLocalStorage = (key : string) => {
    localStorage.removeItem(key)
}


export const clearSessionStorage = (key : string) => {
    sessionStorage.removeItem(key)
}

export const formatFecha = async () =>{
    
}


export const Logout = () => {
    const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem('user'); 
      navigate('/login'); 
    };
  
    return <button onClick={handleLogout}>Cerrar Sesión</button>;
  };


  export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const storedUser = localStorage.getItem('user');
    const isAuthenticated = storedUser !== null;
  
    return isAuthenticated ? children : <Navigate to="/login" />;
  };


  export const getStoredUser = () => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  };