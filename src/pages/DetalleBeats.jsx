import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { doc, deleteDoc, getDoc } from 'firebase/firestore'; 
import { onAuthStateChanged } from 'firebase/auth'; 
import { db, auth, appId } from '../api/firebase'; 


const getPublicCollectionPath = (currentAppId, collectionName) => {
    
    return `artifacts/${currentAppId}/public/data/${collectionName}`;
};

function DetalleBeats() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [beat, setBeat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    
    useEffect(() => {
        
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            const currentUserId = user ? user.uid : null;
            setUserId(currentUserId);
            setIsAuthReady(true);
            
           
            console.log("Usuario autenticado (UID):", currentUserId);
        });
        return () => unsubscribe();
    }, []); 

    
    useEffect(() => {
        const fetchBeat = async () => {
            
            if (!isAuthReady || !id || error) return; 

            try {
                setLoading(true);

                const beatRef = doc(db, getPublicCollectionPath(appId, 'beats'), id);
                const docSnap = await getDoc(beatRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setBeat({ id: docSnap.id, ...data, userId: data.userId || null, instagram: data.instagram || '@flacc.beats' });
                    setError(null);
                } else {
                    setError('El beat que buscas no existe o fue eliminado.');
                }
            } catch (err) {
                console.error("Error al cargar el beat:", err);
                if (!error) {
                    setError('Ocurrió un error al intentar cargar los detalles. (Revisa reglas de seguridad).');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBeat();

    }, [id, isAuthReady, error]); 

    
    const isOwner = userId && userId === beat?.userId;
    
    
    if (isAuthReady && beat) {
        console.log(`Es dueño: ${isOwner} | User ID: ${userId} | Beat Owner ID: ${beat.userId}`);
    }

    const handleDelete = async () => {
        
        if (!db || isDeleting || !isOwner) return; 
        
        
        if (!window.confirm('¿Estás seguro de que quieres eliminar este beat? Esta acción es irreversible.')) {
            return; 
        }

        setIsDeleting(true); 
        try {
            const beatRef = doc(db, getPublicCollectionPath(appId, 'beats'), id); 
            await deleteDoc(beatRef);
            
            navigate('/beats', { state: { message: 'Beat eliminado con éxito.' } }); 
        } catch (err) {
            console.error("Error al eliminar el beat:", err);
            setError('Error al eliminar el beat. Asegúrate de tener permisos. (Error: ' + err.message + ')');
        } finally {
            setIsDeleting(false); 
        }
    };
    
    
    
    if (loading || !isAuthReady) { 
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="info" />
                <p className="mt-2 text-accent-neon">
                    {!isAuthReady ? 'Iniciando servicios de autenticación...' : 'Cargando Beat...'}
                </p>
            </Container>
        );
    }


    if (error) {
        return (
            <Container className="my-5">
                <Alert variant="danger" className="text-center">{error}</Alert>
                <div className="text-center mt-4">
                    <Button onClick={() => navigate('/beats')} variant="outline-light">Volver al Catálogo</Button>
                </div>
            </Container>
        );
    }

    if (!beat) return null;
    
   
    const beatPrice = beat.precio || beat.Precio || '0';
    const numericPrice = typeof beatPrice === 'string' ? parseFloat(beatPrice) : beatPrice;
    const formattedPrice = numericPrice !== undefined && !isNaN(numericPrice) ? numericPrice.toFixed(2) : 'N/A';
    const hasValidPrice = numericPrice !== undefined && !isNaN(numericPrice) && numericPrice > 0;


    const instagramUser = beat.instagram ? beat.instagram.replace('@', '') : 'flacc.beats';

    return (
        <Container className="my-5">
            <Card className="shadow-lg p-4" style={{ backgroundColor: 'var(--color-dark-secondary)' }}>
                
                <Row>
                    <Col md={6} className="mb-4 mb-md-0"> 
                        <img 
                            src={beat.imagenURL || 'https://placehold.co/800x450/212121/00E0FF?text=FLACC+BEAT'} 
                            alt={`Portada de ${beat.nombre}`} 
                            className="img-fluid rounded-3" 
                            
                            style={{ maxHeight: '450px', objectFit: 'cover', width: '100%' }}
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x450/212121/00E0FF?text=FLACC+BEAT'; }}
                        />
                        {beat.audioURL && (
                            <div className="mt-3">
                                <audio controls className="w-full bg-gray-700 p-2 rounded-lg">
                                    <source src={beat.audioURL} type="audio/mpeg" />
                                    Tu navegador no soporta el elemento de audio.
                                </audio>
                            </div>
                        )}
                      
                        {!hasValidPrice && (
                             <Alert variant="warning" className="mt-3">
                                Advertencia: El precio de este beat no es válido o está en cero.
                             </Alert>
                        )}
                    </Col>
                    
                    <Col md={6}> 
                        <Card.Body className="p-0">
                            <h1 className="text-accent-neon mb-2">{beat.nombre}</h1>
                            <p className="lead text-light">
                                <span className="me-2" style={{ color: 'var(--color-accent)', fontSize: '1.25rem' }}>🎵</span>
                                Género: <span className="fw-bold">{beat.genero || 'No especificado'}</span>
                            </p>
                            
                            <hr className="border-secondary" />

                            <div className="d-flex align-items-center mb-4">
                                <span className="me-2 fs-2" style={{ color: 'var(--color-accent)' }}>💲</span>
                                <span className="fs-1 fw-bold text-accent-neon">${formattedPrice}</span>
                            </div>
                            
                            <p className="text-muted">
                                {beat.descripcion || 'No hay descripción disponible para este beat.'}
                            </p>

                            <hr className="border-secondary" />
                            
                            <div className="d-grid gap-2">

                                <a 
                                    href={`https://www.instagram.com/${instagramUser}`}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn btn-lg fw-bold"
                                  
                                    style={{
                                        backgroundColor: 'var(--color-accent-neon)',
                                        borderColor: 'var(--color-accent-neon)',
                                        color: '#6449cca2', 
                                        boxShadow: '0 0 10px var(--color-accent-neon), 0 0 20px rgba(0, 224, 255, 0.5)', // Sombra para efecto "neón"
                                        transition: 'all 0.3s ease-in-out',
                                        textShadow: '0 0 1px #000',
                                    }}
                                    
                                    onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 0 15px var(--color-accent-neon), 0 0 30px rgba(0, 224, 255, 0.8)'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.boxShadow = '0 0 10px var(--color-accent-neon), 0 0 20px rgba(0, 224, 255, 0.5)'; }}
                                >
                                    Comprar / Licenciar (Contactar por Instagram)
                                </a>
                                
                                
                                {isOwner && (
                                    <>
                                        <Button 
                                            onClick={() => navigate(`/editar/${id}`)}
                                            variant="primary" 
                                            className="btn-block" 
                                        >
                                            <span className="me-2">✏️</span> Editar Beat
                                        </Button>
                                        <Button 
                                            onClick={handleDelete}
                                            variant="danger" 
                                            className="btn-block"
                                            disabled={isDeleting} 
                                        >
                                            {isDeleting ? (
                                                <>
                                                    <Spinner animation="border" size="sm" className="me-2" /> Eliminando...
                                                </>
                                            ) : (
                                                <>
                                                    <span className="me-2">🗑️</span> Eliminar Beat
                                                </>
                                            )}
                                        </Button>
                                    </>
                                )}
                                
                                <Button 
                                    onClick={() => navigate('/beats')} 
                                    variant="outline-light"
                                    className="mt-3"
                                >
                                    Volver al Catálogo
                                </Button>

                            </div>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
}

export default DetalleBeats;