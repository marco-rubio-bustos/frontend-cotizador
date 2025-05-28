import { Container, Nav, Navbar } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'
import { URL_FRONT } from '../utils/config'

function Navbars() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/cotizador" className="p-0">
          <img
            alt="logo etiquetando"
            src={`${URL_FRONT}/img/etiquetando.png`}
            height="50"
            className="d-inline-block align-top p-0"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink
              to="/cotizador/crear-cliente"
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? 'nav-link custom active' : 'nav-link custom'
              }
            >
              Crear Cliente
            </NavLink>
            <NavLink
              to="/cotizador/listar-clientes"
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? 'nav-link custom active' : 'nav-link custom'
              }
            >
              Listar Clientes
            </NavLink>
            <NavLink
              to="/cotizador/crear-cotizacion"
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? 'nav-link custom active' : 'nav-link custom'
              }
            >
              Crear Cotización
            </NavLink>
            <NavLink
              to="/cotizador/listar-cotizaciones"
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? 'nav-link custom active' : 'nav-link custom'
              }
            >
              Listar Cotizaciones
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navbars
