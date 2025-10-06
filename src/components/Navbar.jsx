import React from 'react';
import { Container, Nav, Navbar as BootstrapNavbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          FLACC Club Beats
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
        
            <Nav.Link as={NavLink} to="/">
              Inicio
            </Nav.Link>
            
            <Nav.Link as={NavLink} to="/beats">
              Catálogo de Beats
            </Nav.Link>
            <Nav.Link as={NavLink} to="/comprar">
              Comprar / Crear Beat
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;