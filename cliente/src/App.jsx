
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Registrazione } from './componenti/Registrazione'
import { Login } from './componenti/Login'
import Home from './componenti/Home.jsx'


function App() {
  

  return (
    <BrowserRouter>
      <Routes>

      <Route path="/" element={<Registrazione />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
       
    </BrowserRouter>
  )
}

export default App
