
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Registrazione } from './componenti/Registrazione.jsx'
import { Login } from './componenti/Login.jsx'
import Home from './componenti/Home.jsx'

function App() {
  

  return (
    <BrowserRouter>
      <Routes>

        <Route element={'/'}><Registrazione></Registrazione></Route>
        <Route element= {'/login'}><Login></Login></Route>
        <Route element= {'/home'}><Home></Home></Route>
      </Routes>
       
    </BrowserRouter>
  )
}

export default App
