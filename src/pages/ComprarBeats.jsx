import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { addBeat } from '../api/firebase';
import { FaUpload } from 'react-icons/fa6';

function ComprarBeats() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage(null);
    try {
  
      const beatData = {
        ...data,
      
        precio: parseFloat(data.precio), 
      };

      const newId = await addBeat(beatData);
      
      setMessage({ type: 'success', text: `¡Beat "${data.nombre}" subido con éxito! ID: ${newId}` });
      reset();

      setTimeout(() => {
        navigate('/beats');
      }, 1500); 

    } catch (err) {
      console.error("Error al añadir beat:", err);
      setMessage({ type: 'danger', text: 'Error al subir el beat. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <Card className="p-4 shadow-lg" style={{ backgroundColor: 'var(--color-dark-secondary)' }}>
        <Card.Body>
          <h1 className="text-accent-neon mb-4 text-center">¡Sube un Nuevo Beat a FLACC Club!</h1>

          {message && <Alert variant={message.type}>{message.text}</Alert>}

          <Form onSubmit={handleSubmit(onSubmit)}>
            
          
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Nombre del Beat</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ej: Trap Melancólico V3"
                {...register("nombre", { required: "El nombre es obligatorio." })}
                className="bg-dark text-light border-secondary"
              />
              {errors.nombre && <p className="text-danger">{errors.nombre.message}</p>}
            </Form.Group>

        
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Precio (USD)</Form.Label>
              <Form.Control 
                type="number" 
                step="0.01" 
                placeholder="Ej: 29.99"
                {...register("precio", { 
                    required: "El precio es obligatorio.",
                    valueAsNumber: true,
                    min: { value: 0.01, message: "El precio debe ser mayor a cero." }
                })}
                className="bg-dark text-light border-secondary"
              />
              {errors.precio && <p className="text-danger">{errors.precio.message}</p>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-light">Género</Form.Label>
              <Form.Select 
                {...register("genero", { required: "Selecciona un género." })}
                className="bg-dark text-light border-secondary"
              >
                <option value="">Selecciona un Género</option>
                <option value="Trap">Trap</option>
                <option value="Drill">Drill</option>
                <option value="Reggaeton">Reggaetón</option>
                <option value="HipHop">Hip Hop</option>
              </Form.Select>
              {errors.genero && <p className="text-danger">{errors.genero.message}</p>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-light">URL de Imagen de Portada</Form.Label>
              <Form.Control 
                type="url" 
                placeholder="https://ejemplo.com/portada"
                {...register("imagenURL")}
                className="bg-dark text-light border-secondary"
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="text-light">Descripción del Beat</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Describe el ambiente, el BPM y la instrumentación..."
                {...register("descripcion")}
                className="bg-dark text-light border-secondary"
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100" 
              disabled={loading}
              style={{ 
                backgroundColor: 'var(--color-accent)', 
                borderColor: 'var(--color-accent)', 
                color: 'var(--color-dark-primary)',
                fontWeight: 'bold' 
              }}
            >
              <FaUpload className="me-2" /> {loading ? 'Subiendo...' : 'Guardar Beat en Catálogo'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ComprarBeats;

 
  

