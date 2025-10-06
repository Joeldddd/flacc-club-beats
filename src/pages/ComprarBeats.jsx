import React, { useState } from 'react';
import { useForm } from 'react-hook-form'; 
import { Container, Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { addBeat } from '../api/firebase'; 

const CrearBeat = () => {
  const navigate = useNavigate();
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset 
  } = useForm({
    
    defaultValues: {
      nombre: '',
      precio: '',
      genero: 'Trap', 
      imagenURL: '',
      descripcion: ''
    }
  });

  const [message, setMessage] = useState(null); 

  const onSubmit = async (data) => {
    setMessage(null);
    try {
      const beatData = {
        ...data,
        Precio: parseFloat(data.precio),
        precio: undefined 
      };

      const newId = await addBeat(beatData);
    
      setMessage({ type: 'success', text: `Beat "${beatData.nombre}" creado con ID: ${newId}` });
      reset(); 
      
      setTimeout(() => navigate('/beats'), 2000); 

    } catch (err) {
      console.error(err);
      setMessage({ type: 'danger', text: 'Error al guardar el beat. Revisa la consola y tus reglas de Firebase.' });
    }
  };


  return (
    <Container className="my-5">
      <Card className="shadow-lg p-4 mx-auto" style={{ maxWidth: '600px' }}>
        <h1 className="text-center mb-4">¡Sube un Nuevo Beat a FLACC Club!</h1>
        
        {message && <Alert variant={message.type}>{message.text}</Alert>}

        <Form onSubmit={handleSubmit(onSubmit)}>

          <Form.Group className="mb-3" controlId="nombre">
            <Form.Label>Nombre del Beat</Form.Label>
            <Form.Control 
              type="text"
              placeholder="Ej: Trap Melancólico V3"
              {...register('nombre', { required: "El nombre es obligatorio.", minLength: { value: 3, message: "Mínimo 3 caracteres." } })}
            />
            {errors.nombre && <span className="text-danger small">{errors.nombre.message}</span>}
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="precio">
                <Form.Label>Precio (USD)</Form.Label>
                <Form.Control 
                  type="number"
                  step="0.01"
                  placeholder="Ej: 29.99"
                  {...register('precio', { 
                    required: "El precio es obligatorio.",
                    min: { value: 1.00, message: "El precio debe ser al menos $1.00." },
                    valueAsNumber: true 
                  })}
                />
                {errors.precio && <span className="text-danger small">{errors.precio.message}</span>}
              </Form.Group>
            </Col>

    
            <Col md={6}>
              <Form.Group className="mb-3" controlId="genero">
                <Form.Label>Género</Form.Label>
                <Form.Select 
                  {...register('genero', { required: "Debes seleccionar un género." })}
                >
                  <option value="">Selecciona...</option>
                  <option value="Trap">Trap</option>
                  <option value="HipHop">Hip Hop</option>
                  <option value="Reggaeton">Reggaeton</option>
                  <option value="Lofi">Lofi</option>
                </Form.Select>
                {errors.genero && <span className="text-danger small">{errors.genero.message}</span>}
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3" controlId="imagenURL">
            <Form.Label>URL de Imagen de Portada</Form.Label>
            <Form.Control 
              type="url"
              placeholder="https://ejemplo.com/portada.jpg"
              {...register('imagenURL', { 
                required: "La URL de la imagen es obligatoria.",
                pattern: { value: /^(ftp|http|https):\/\/[^ "]+$/, message: "Formato de URL inválido." } // Validación simple de URL
              })}
            />
            {errors.imagenURL && <span className="text-danger small">{errors.imagenURL.message}</span>}
          </Form.Group>
        
          <Form.Group className="mb-4" controlId="descripcion">
            <Form.Label>Descripción del Beat</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="Describe el ambiente, BPM y la instrumentación..."
              {...register('descripcion', { required: "La descripción es obligatoria.", maxLength: { value: 500, message: "Máximo 500 caracteres." } })}
            />
            {errors.descripcion && <span className="text-danger small">{errors.descripcion.message}</span>}
          </Form.Group>
          <Button 
            variant="primary" 
            type="submit" 
            className="w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Beat en Catálogo'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default CrearBeat;