import { Route, Routes  } from "react-router-dom";

interface Props{
     children : JSX.Element[] | JSX.Element;
}

export const NotFound = ({children} : Props) => {

  return(
    
    <Routes>  
        {children} 
    
    <Route path="*" element={<div> not found</div>} />
    
    </Routes>

)
}
