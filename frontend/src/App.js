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
          <Route path="/" element={<Signup/>} />
        </Routes>
      </BrowserRouter>
    )
}

export default App;
