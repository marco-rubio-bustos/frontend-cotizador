import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link } from 'react-router-dom'

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
            <Nav.Link as={Link} to="/crear-cliente">
              Crear Cliente
            </Nav.Link>
            <Nav.Link as={Link} to="/listar-clientes">
              Listar Clientes
            </Nav.Link>
            <Nav.Link as={Link} to="/crear-cotizacion">
              Crear Cotización
            </Nav.Link>
            <Nav.Link as={Link} to="/listar-cotizaciones">
              Listar Cotizaciones
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navbars
