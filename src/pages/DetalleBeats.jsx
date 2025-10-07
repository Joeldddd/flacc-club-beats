import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { initializeApp } from 'firebase/app'; 
import { 
    getFirestore, 
    doc, 
    getDoc, 
    deleteDoc 
} from 'firebase/firestore';

import { getAuth, onAuthStateChanged, signInWithCustomToken, signInAnonymously } from 'firebase/auth'; 

const getPublicCollectionPath = (appId, collectionName) => {
    return `artifacts/${appId}/public/data/${collectionName}`;
};


/* global __app_id, __firebase_config, __initial_auth_token */


function DetalleBeats() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  
  const [beat, setBeat] = useState(null);
  
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); 

  
  const [db, setDb] = useState(null);
  const [currentAppId, setCurrentAppId] = useState(null);
  const [userId, setUserId] = useState(null);
  
  const [isAuthReady, setIsAuthReady] = useState(false); 
  
  useEffect(() => {
    
    const injectedAppId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    
    const injectedConfig = typeof __firebase_config !== 'undefined' ? __firebase_config : null;
    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
    
    if (!injectedConfig || injectedConfig.trim() === '' || injectedConfig.trim() === '{}') {
        console.error("Firebase Config: No se pudo inyectar o está vacío. Esto detiene el servicio de DB.");
        setError('Error al iniciar los servicios de Firebase. Configuración inválida.');
        setIsAuthReady(true);
        setLoading(false);
        return; 
    }
    
    let appInstance;
    try {
        const firebaseConfig = JSON.parse(injectedConfig);
        
        
        console.log("Firebase Config (parsed):", firebaseConfig); 

        setCurrentAppId(injectedAppId);

        
        appInstance = initializeApp(firebaseConfig);
        
        const currentDb = getFirestore(appInstance); 
        const currentAuth = getAuth(appInstance);
        
        setDb(currentDb);
        
        
        const authenticate = async () => {
            if (initialAuthToken) {
                await signInWithCustomToken(currentAuth, initialAuthToken).catch((e) => {
                    console.error("Error signing in with custom token, signing in anonymously.", e);
                    return signInAnonymously(currentAuth);
                });
            } else {
                await signInAnonymously(currentAuth).catch((e) => {
                    console.error("Error signing in anonymously.", e);
                });
            }
        };

         
        const unsubscribe = onAuthStateChanged(currentAuth, (user) => {
            setUserId(user ? user.uid : null);
            setIsAuthReady(true); 
        });

        
        authenticate();
        
        return () => unsubscribe(); 

    } catch (e) {
        
        console.error("Error FATAL al inicializar Firebase:", e.message);
        setError('Error al iniciar los servicios de Firebase. Configuración inválida o malformada.');
        setIsAuthReady(true); 
        setLoading(false); 
    }
  }, []); 

  
  
  useEffect(() => {
    const fetchBeat = async () => {
        
        if (!db || !isAuthReady || !id || error) return; 

        try {
            setLoading(true);
        
            const beatRef = doc(db, getPublicCollectionPath(currentAppId, 'beats'), id);
            const docSnap = await getDoc(beatRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setBeat({ id: docSnap.id, ...data, userId: data.userId || null }); 
                setError(null); 
            } else {
                setError('El beat que buscas no existe o fue eliminado.');
            }
        } catch (err) {
            console.error("Error al cargar el beat:", err);
            
            if (!error) { 
                setError('Ocurrió un error al intentar cargar los detalles.');
            }
        } finally {
            setLoading(false); 
        }
    };

    fetchBeat();

  }, [id, db, isAuthReady, currentAppId, error]); 

  
 
  const isOwner = userId && userId === beat?.userId;


  const handleDelete = async () => {
    
    if (!db || isDeleting || !isOwner) return; 
    
    
    if (!window.confirm('¿Estás seguro de que quieres eliminar este beat? Esta acción es irreversible.')) {
        return; 
    }

    setIsDeleting(true); 
    try {
      
      const beatRef = doc(db, getPublicCollectionPath(currentAppId, 'beats'), id);
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


  const beatPrice = beat.precio || beat.Precio;
 
  const numericPrice = typeof beatPrice === 'string' ? parseFloat(beatPrice) : beatPrice;
  const formattedPrice = numericPrice !== undefined && !isNaN(numericPrice) ? numericPrice.toFixed(2) : 'N/A';


  return (
    <Container className="my-5">
      <Card className="shadow-lg p-4" style={{ backgroundColor: 'var(--color-dark-secondary)' }}>
        <Row>
          <Col md={8} className="mb-4 mb-md-0">
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
          </Col>
        
          <Col md={4}>
            <Card.Body className="p-0">
              <h1 className="text-accent-neon mb-2">{beat.nombre}</h1>
              <p className="lead text-light">
         
                <span className="me-2" style={{ color: 'var(--color-accent)', fontSize: '1.25rem' }}>🎵</span>
                Género: <span className="fw-bold">{beat.genero}</span>
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
                <Button variant="success" size="lg" disabled>
                  Comprar / Licenciar
                </Button>
                
                
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



