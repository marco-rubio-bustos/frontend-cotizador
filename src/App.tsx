import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import '../src/css/button.css'
import { Buffer } from 'buffer'
import CreateCustomer from './components/pages/CreateCustomer'
import Welcome from './components/pages/Welcome'
import EditCustomer from './components/pages/EditCustomer'
import ListCustomer from './components/pages/ListCustomer'
import CreateQuotation from './components/pages/CreateQuotation'
import ListQuotation from './components/pages/ListQuotation'
import Navbars from './components/navbar/Navbars'
import store from './store/store'
import { Provider } from 'react-redux'

declare global {
  interface Window {
    Buffer: typeof Buffer
  }
}

window.Buffer = Buffer

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbars />
        <Routes>
          <Route path="/cotizador" element={<Welcome />} />
          <Route path="/cotizador/crear-cliente" element={<CreateCustomer />} />
          <Route
            path="/cotizador/editar-cliente/:id"
            element={<EditCustomer />}
          />
          <Route path="/cotizador/listar-clientes" element={<ListCustomer />} />
          <Route
            path="/cotizador/crear-cotizacion"
            element={<CreateQuotation />}
          />
          <Route
            path="/cotizador/listar-cotizaciones"
            element={<ListQuotation />}
          />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
