import React, { useEffect, useState } from 'react';
import { getBeats } from '../api/firebase'; 
import { Container, Row, Col, Card, Button } from 'react-bootstrap'; 
import { Link } from 'react-router-dom';

const BeatsPage = () => {
  const [beats, setBeats] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const loadBeats = async () => {
      setLoading(true);
      const data = await getBeats();
      setBeats(data); 
      setLoading(false);
    };
    loadBeats();
  }, []);

  if (loading) {
    return <Container className="mt-5 text-center"><h2>Cargando Beats...</h2></Container>;
  }
  
  return (
    <Container className="my-5">
      <h1>Catálogo de Beats</h1>
      <Row className="g-4"> 
        {beats.map((beat) => (
          <Col key={beat.id} xs={12} sm={6} md={4}> 
            <Card>
              <Card.Img variant="top" src={beat.imagenURL} alt={beat.nombre} />
              <Card.Body>
                <Card.Title>{beat.nombre}</Card.Title>
                <Card.Text>${beat.Precio ? beat.Precio.toFixed(2) : 'N/A'}</Card.Text>
                
                <Link to={`/beats/${beat.id}`} className="btn btn-primary w-100">
                  Ver Detalles
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default BeatsPage;