
import './App.css'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import './components/css/base.css'
import { View_feed } from './components/feed_ferias/view_feed';


function App() {

return (


  <BrowserRouter>
  <Routes>

    <Route path='/' element = {<View_feed/>}>  </Route>
    <Route path='/login' element = {<Login/>}>  </Route>
    <Route path='*' element = {<>NOT FOUND</>} />
  </Routes>


  </BrowserRouter>





);


}

export default App;
