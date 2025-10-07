import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { addSuscriptor } from '../api/firebase';
import { FaDiscord, FaBolt } from 'react-icons/fa6'; 

function HomePage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
  const [message, setMessage] = useState(null);

  const onSubmit = async (data) => {
    setMessage(null);
    try {
      await addSuscriptor(data); 
      setMessage({ type: 'success', text: `¡Gracias por unirte, ${data.nombre}! Revisa tu correo.` });
      reset();
    } catch (err) {
      console.error("Error al registrar suscriptor:", err);
      setMessage({ type: 'danger', text: 'Error al registrar. Por favor, inténtalo más tarde.' });
    }
  };

  return (
    <>
      <div className="homepage-hero text-center text-white">
        <Container>
          <h1 className="display-1 mb-4">FLACC CLUB BEATS <FaBolt className="mb-3" /></h1>
          <p className="lead mb-5">
            Tu fuente exclusiva para Trap, Drill, y Reggaetón de calidad mundial.
            <br />
            Ritmos frescos garantizados para el siguiente nivel de tu música.
          </p>
          <Button 
            as={Link} 
            to="/beats" 
            variant="danger" 
            size="lg" 
            className="me-3 btn-hero-custom"
          >
            Explora Nuestros Beats
          </Button>
          <Button 
            as="a"
            href="https://discord.gg/ejemplo" 
            target="_blank" 
            variant="outline-light" 
            size="lg"
          >
            Únete al Discord <FaDiscord />
          </Button>
        </Container>
      </div>

      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card 
              className="p-4 text-center border-accent-neon" 
              style={{ backgroundColor: 'var(--color-dark-secondary)' }}
            >
              <Card.Body>
                <h2 className="text-accent-neon mb-3">Únete al Club Flacc y Recibe Beats Gratis</h2>
                <p className="text-light">Sé el primero en saber sobre nuevos lanzamientos y ofertas exclusivas.</p>
                
                {message && <Alert variant={message.type}>{message.text}</Alert>}

                <Form onSubmit={handleSubmit(onSubmit)}>
                  
                  
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Tu Nombre"
                      {...register("nombre", { required: "Tu nombre es necesario." })}
                      className="bg-dark text-light border-secondary"
                    />
                    {errors.nombre && <p className="text-danger mt-1">{errors.nombre.message}</p>}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Control
                      type="email"
                      placeholder="Tu Correo Electrónico"
                      {...register("email", { 
                        required: "El email es obligatorio.",
                        pattern: { value: /^\S+@\S+$/i, message: "Formato de email inválido." }
                      })}
                      className="bg-dark text-light border-secondary"
                    />
                    {errors.email && <p className="text-danger mt-1">{errors.email.message}</p>}
                  </Form.Group>
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100" 
                    disabled={isSubmitting}
                    style={{ 
                      backgroundColor: 'var(--color-accent)', 
                      borderColor: 'var(--color-accent)', 
                      color: 'var(--color-dark-primary)',
                      fontWeight: 'bold' 
                    }}
                  >
                    {isSubmitting ? 'Registrando...' : '¡Quiero Unirme a Flacc club!'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default HomePage;

    