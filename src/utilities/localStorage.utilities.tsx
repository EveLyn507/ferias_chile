

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