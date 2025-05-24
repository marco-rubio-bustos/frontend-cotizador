import { Container, Nav, Navbar } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'

function Navbars() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/" className="p-0">
          <img
            alt="logo etiquetando"
            src="/src/components/img/etiquetando.png"
            height="50"
            className="d-inline-block align-top p-0"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink
              to="/crear-cliente"
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? "nav-link custom active" : "nav-link custom"
              }
            >
              Crear Cliente
            </NavLink>
            <NavLink
              to="/listar-clientes"
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? "nav-link custom active" : "nav-link custom"
              }
            >
              Listar Clientes
            </NavLink>
            <NavLink
              to="/crear-cotizacion"
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? "nav-link custom active" : "nav-link custom"
              }
            >
              Crear Cotización
            </NavLink>
            <NavLink
              to="/listar-cotizaciones"
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? "nav-link custom active" : "nav-link custom"
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
