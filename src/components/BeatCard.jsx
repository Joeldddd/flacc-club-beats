import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function BeatCard({ beat }) {
  const navigate = useNavigate();

  
  const beatPrice = beat.precio || beat.Precio;

  
  const formattedPrice = beatPrice !== undefined 
    ? `$${parseFloat(beatPrice).toFixed(2)}` 
    : '$N/A'; 

  return (
    <Card className="h-100">
     
      <Card.Img 
        variant="top" 
        src={beat.imagenURL || 'https://placehold.co/400x200/212121/00E0FF?text=FLACC+BEAT'}
        style={{ height: '200px', objectFit: 'cover' }}
        alt={`Portada de ${beat.nombre}`}
      />
      <Card.Body>
        <Card.Title>{beat.nombre}</Card.Title>
        <Card.Text className="fw-bold fs-5" style={{ color: 'var(--color-accent)' }}>
          {formattedPrice} 
        </Card.Text>
      </Card.Body>
      <Card.Footer className="border-0 bg-transparent pt-0">
        <Button 
          onClick={() => navigate(`/beats/${beat.id}`)} 
          variant="primary" 
          className="w-100"
        >
          Ver Detalles
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default BeatCard;