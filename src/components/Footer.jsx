import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaPhone, FaEnvelope, FaInstagram } from 'react-icons/fa6'; 

const Footer = () => (
    <footer className="bg-dark text-white text-center py-4 mt-5">
      <Container>
        <Row className="justify-content-center align-items-center">
          
        
          <Col md={4} className="mb-3 mb-md-0 text-md-start">
            <h5 className="fw-bold" style={{ color: 'var(--color-accent)' }}>Contacto FLACC Club</h5>
            <ul className="list-unstyled">
              <li>
                <FaPhone className="me-2" /> 
                <a href="tel:+541112345678" className="text-decoration-none" style={{ color: 'var(--color-text-light)' }}>
                  +54 11 1234 5678
                </a>
              </li>
              <li>
                <FaEnvelope className="me-2" /> 
                <a href="mailto:info@flacclub.com" className="text-decoration-none" style={{ color: 'var(--color-text-light)' }}>
                  info@flacclub.com
                </a>
              </li>
            </ul>
          </Col>

         
          <Col md={4} className="text-center mb-3 mb-md-0">
            <p className="mb-0">&copy; {new Date().getFullYear()} FLACC Club Beats.</p>
            <small className="text-muted">Desarrollado con React y Firebase.</small>
          </Col>
          
         
          <Col md={4} className="text-md-end">
             <h5 className="fw-bold" style={{ color: 'var(--color-accent)' }}>Síguenos</h5>
             <a href="https://instagram.com/tuusuario" target="_blank" rel="noopener noreferrer" 
                className="text-white mx-2 fs-4" 
                style={{ color: 'var(--color-text-light)' }}>
                <FaInstagram style={{ color: 'var(--color-accent)', transition: 'color 0.3s' }} 
                             onMouseOver={e => e.currentTarget.style.color='white'}
                             onMouseOut={e => e.currentTarget.style.color='var(--color-accent)'} />
             </a>
            
          </Col>

        </Row>
      </Container>
    </footer>
);

export default Footer;