import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, onSnapshot, getFirestore, limit } from "firebase/firestore";
import { auth, db, appId, authenticateUser } from '../api/firebase'; 
import BeatCard from '../components/BeatCard';

const BeatsPage = () => {
    const [beats, setBeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);

 
    useEffect(() => {
        authenticateUser()
            .then(uid => {
                setUserId(uid);
            })
            .catch(err => {
                console.error("Error al autenticar usuario:", err);
                setError("Error de autenticación inicial.");
            });
    }, []);

  
    const fetchBeats = useCallback(() => {
        if (!db) {
            
            console.error("Firestore no está disponible. Revisa src/api/firebase.js.");
            setError("Los servicios de la base de datos no están disponibles.");
            setLoading(false);
            return;
        }

        try {
           
            const beatsRef = collection(db, 'artifacts', appId, 'public', 'data', 'beats');
            
            
            const beatsQuery = query(beatsRef, limit(50)); 
            
            
            const unsubscribe = onSnapshot(beatsQuery, (snapshot) => {
                const fetchedBeats = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                
                fetchedBeats.sort((a, b) => (b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0) - (a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0));

                setBeats(fetchedBeats);
                setLoading(false);
            }, (err) => {
                console.error("Error al escuchar beats:", err);
                setError("Error al cargar la lista de beats.");
                setLoading(false);
            });

            
            return () => unsubscribe();

        } catch (e) {
            console.error("Error al configurar onSnapshot:", e);
            setError("Error interno al acceder a la colección.");
            setLoading(false);
        }
    }, []); 
    
    
    useEffect(() => {
        
        if (userId) {
            fetchBeats();
        }
    }, [userId, fetchBeats]);

    
    if (loading) {
        return (
            <div className="container my-5 text-center text-light">
                <p>Cargando catálogo de beats...</p>
                <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container my-5 text-center">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error de Conexión</h4>
                    <p>{error}</p>
                    <hr />
                    <p className="mb-0">Asegúrate de que las Reglas de Seguridad de tu Firestore permiten lectura pública.</p>
                </div>
            </div>
        );
    }
    
    
    return (
        <div className="container my-5">
            <h1 className="text-center text-info mb-4">Catálogo de FLACC Club Beats</h1>
            <p className="text-center text-secondary">ID de Usuario/Sesión: {userId ? userId : 'No autenticado'}</p>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {beats.length > 0 ? (
                    beats.map(beat => (
                        <div key={beat.id} className="col">
                            <Link to={`/beats/${beat.id}`} className="text-decoration-none">
                                <BeatCard beat={beat} />
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center">
                        <div className="alert alert-warning" role="alert">
                            Aún no hay beats en el catálogo. ¡Sé el primero en crear uno!
                        </div>
                        <Link to="/comprar" className="btn btn-outline-info mt-3">
                            Crear Beat
                        </Link>
                    </div>
                )}
            </div>

            <footer className="text-center mt-5 pt-3 border-top border-secondary">
                <p className="text-muted">Desarrollado con React y Firebase.</p>
                <p className="text-muted small">Path de colección: /artifacts/{appId}/public/data/beats</p>
            </footer>
        </div>
    );
};

export default BeatsPage;
