import React from 'react'
import Login from './Login';
import Signup from './Signup'
import Home from './Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
function App() {
    return(
      <BrowserRouter basename='todo'>
        <Routes>
          <Route path='/Login' element={<Login/>}></Route>
          <Route path='/Home' element={<Home/>}></Route>
<<<<<<< HEAD
          <Route path="/" element={<Signup />} />
=======
          <Route path="/" element={<Signup/>} />
>>>>>>> 64f41513656c380cf4cc0396a4c98c3cc8b300c4
        </Routes>
      </BrowserRouter>
    )
}

export default App;
