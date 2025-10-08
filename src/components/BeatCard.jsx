import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function BeatCard({ beat }) {
  const navigate = useNavigate();

  // 1. Lógica robusta para obtener y formatear el precio:
  const rawPrice = beat.precio || beat.Precio; // Usa 'precio' o 'Precio'
  const numericPrice = parseFloat(rawPrice);
  
  // 2. Determinar el formato final:
  const formattedPrice = 
    !isNaN(numericPrice) && numericPrice >= 0 
    ? `$${numericPrice.toFixed(2)}` 
    : 'Precio no disponible'; // Se usa un mensaje más claro que '$N/A'

  return (
    <Card 
      className="h-100 shadow-lg text-white border-0" 
      style={{ backgroundColor: 'var(--color-dark-secondary)' }}
    >
      
      <Card.Img 
        variant="top" 
        src={beat.imagenURL || 'https://placehold.co/400x200/212121/00E0FF?text=FLACC+BEAT'}
        style={{ height: '200px', objectFit: 'cover' }}
        alt={`Portada de ${beat.nombre}`}
      />
      
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-white mb-1">{beat.nombre}</Card.Title>
        <Card.Text className="fw-bold fs-5 mt-auto" style={{ color: 'var(--color-accent-neon)' }}>
          {formattedPrice} 
        </Card.Text>
      </Card.Body>
      
      {/* Añadimos un poco de padding al pie */}
      <Card.Footer className="border-0 bg-transparent pt-0 pb-3 px-3">
        <Button 
          onClick={() => navigate(`/beats/${beat.id}`)} 
          variant="primary" // Usamos 'primary' o un color que destaque, por ejemplo, info o success
          className="w-100"
        >
          Ver Detalles
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default BeatCard;