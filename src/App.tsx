import './App.css'
import '../src/css/button.css'
import CreateCustomer from './components/pages/CreateCustomer'
import ListCustomer from './components/pages/ListCustomer'
import CreateQuotation from './components/pages/CreateQuotation'
import ListQuotation from './components/pages/ListQuotation'
import Navbars from './components/navbar/Navbars'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Navbars />
      <Routes>
        <Route path="/" element={<h1>Bienvenido</h1>} />
        <Route path="/crear-cliente" element={<CreateCustomer />} />
        <Route path="/listar-clientes" element={<ListCustomer />} />
        <Route path="/crear-cotizacion" element={<CreateQuotation />} />
        <Route path="/listar-cotizaciones" element={<ListQuotation />} />
      </Routes>
    </Router>
  )
}

export default App
