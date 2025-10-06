import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="homepage-hero bg-dark text-white text-center py-5">
      <Container>
        <Row className="align-items-center" style={{ minHeight: '60vh' }}>
          <Col>
            <h1 className="display-2 fw-bold mb-3">FLACC Club Beats</h1>
            <p className="lead mb-4">
              Tu fuente exclusiva para instrumentales de Trap, Hip Hop y Reggaetón.
              ¡Calidad de estudio directo a tu proyecto!
            </p>
            <Button 
              as={Link} 
              to="/beats" 
              variant="danger" 
              size="lg" 
              className="me-3"
            >
              Explorar Catálogo
            </Button>
        
            <Button 
              as={Link} 
              to="/comprar" 
              variant="outline-light" 
              size="lg"
            >
              Vender Mi Música
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;