import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'; 
import { useParams, useNavigate } from 'react-router-dom'; 
import { getBeatById, deleteBeat, updateBeat } from '../api/firebase'; 
import { 
  Container, Card, Button, ListGroup, Spinner, 
  Modal, Form, Alert, Row, Col 
} from 'react-bootstrap';

const DetalleBeats = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();  
  const [beat, setBeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null); 
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset
  } = useForm();
  const loadBeat = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getBeatById(id);
      
      if (data) {
        setBeat(data);
        setError(null);
        reset({
          nombre: data.nombre,
          precio: data.Precio || data.precio,
          genero: data.genero || '',
          imagenURL: data.imagenURL,
          descripcion: data.descripcion || ''
        });
      } else {
        setError(`Beat con ID ${id} no encontrado.`);
        setBeat(null);
      }
    } catch (err) {
      console.error("Error al cargar el detalle:", err);
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBeat();
  }, [id]); 
  const handleDelete = async () => {
    const confirmDelete = window.confirm(`¿Estás seguro de ELIMINAR el beat "${beat.nombre}"?`);
    
    if (confirmDelete) {
        try {
            setLoading(true);
            await deleteBeat(id); 
            
            alert(`Beat "${beat.nombre}" eliminado con éxito. Redirigiendo...`);
            navigate('/beats'); 
        } catch (err) {
            console.error("Error al eliminar el beat:", err);
            alert("Error al eliminar el beat. Revisa la consola.");
            setLoading(false);
        }
    }
  };
  const onEditSubmit = async (data) => {
    setSuccessMsg(null);
    try {
      const updatedFields = {
        ...data,
        Precio: parseFloat(data.precio),
        precio: undefined 
      };

    
      await updateBeat(id, updatedFields);
      

      setBeat(prev => ({ ...prev, ...updatedFields }));
      
      setSuccessMsg({ type: 'success', text: '¡Beat actualizado con éxito!' });
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setSuccessMsg({ type: 'danger', text: 'Error al actualizar. Intenta de nuevo.' });
    }
  };

  if (loading || !beat) {
    return (
        <Container className="mt-5 text-center">
            {loading ? (
                <>
                  <Spinner animation="border" role="status" className="me-2" />
                  <h2>Cargando detalles...</h2>
                </>
            ) : (
                <h2 className="text-danger">{error || "Beat no encontrado."}</h2>
            )}
            {(!loading && (error || !beat)) && (
                 <Button variant="secondary" onClick={() => navigate('/beats')} className="mt-3">
                    ← Volver al Catálogo
                </Button>
            )}
        </Container>
    );
  }
  return (
    <Container className="my-5 d-flex justify-content-center">
      <Card style={{ maxWidth: '30rem' }} className="shadow-lg">
        {successMsg && <Alert variant={successMsg.type} onClose={() => setSuccessMsg(null)} dismissible>{successMsg.text}</Alert>}
        
        <Card.Img variant="top" src={beat.imagenURL} alt={beat.nombre} /> 
        <Card.Body>
          <Card.Title className="text-center display-6">{beat.nombre}</Card.Title>
          <Card.Text className="lead my-3">{beat.descripcion || "¡Este beat no tiene descripción aún!"}</Card.Text>
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroup.Item className="fw-bold">
            Precio: <span className="text-success">${beat.Precio ? beat.Precio.toFixed(2) : 'N/A'}</span>
          </ListGroup.Item>
          <ListGroup.Item>Género: {beat.genero || 'No especificado'}</ListGroup.Item>
        </ListGroup>
        <Card.Body className="d-flex flex-column gap-2">
          <Button variant="warning" onClick={() => setShowModal(true)}>
            Editar Beat (U)
          </Button> 
    
          <Button variant="danger" onClick={handleDelete}>
            Eliminar Beat (D)
          </Button> 
          
          <hr/>
          
          <Button variant="success" onClick={() => navigate('/comprar')}>
            Añadir a la Cesta
          </Button> 
        </Card.Body>
      </Card>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar: {beat.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onEditSubmit)}>
            
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control 
                type="text"
                {...register('nombre', { required: "El nombre es obligatorio." })}
              />
              {errors.nombre && <span className="text-danger small">{errors.nombre.message}</span>}
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio (USD)</Form.Label>
                  <Form.Control 
                    type="number"
                    step="0.01" 
                    {...register('precio', { 
                      required: "El precio es obligatorio.",
                      min: { value: 1.00, message: "Mínimo $1.00." },
                      valueAsNumber: true 
                    })}
                  />
                  {errors.precio && <span className="text-danger small">{errors.precio.message}</span>}
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Género</Form.Label>
                  <Form.Select {...register('genero', { required: "Selecciona un género." })}>
                    <option value="Trap">Trap</option>
                    <option value="HipHop">Hip Hop</option>
                    <option value="Reggaeton">Reggaeton</option>
                    <option value="Lofi">Lofi</option>
                  </Form.Select>
                  {errors.genero && <span className="text-danger small">{errors.genero.message}</span>}
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>URL de Imagen</Form.Label>
              <Form.Control 
                type="url"
                {...register('imagenURL', { required: "La URL es obligatoria." })}
              />
              {errors.imagenURL && <span className="text-danger small">{errors.imagenURL.message}</span>}
            </Form.Group>
        
            <Form.Group className="mb-4">
              <Form.Label>Descripción</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                {...register('descripcion', { required: "La descripción es obligatoria." })}
              />
              {errors.descripcion && <span className="text-danger small">{errors.descripcion.message}</span>}
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando cambios...' : 'Guardar Cambios'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default DetalleBeats;
  
