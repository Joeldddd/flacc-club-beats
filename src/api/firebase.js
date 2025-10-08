/* global __app_id, __initial_auth_token */
import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    signInAnonymously, 
    onAuthStateChanged, 
    signInWithCustomToken 
} from "firebase/auth";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    doc, 
    getDoc, 
    query, 
    onSnapshot 
} from "firebase/firestore";
import { firebaseConfig, appId as configAppId } from "../config/firebase-config"; 


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const appId = configAppId;


let isInitialized = false;


export const authenticateUser = async () => {
    try {
        
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(auth, __initial_auth_token);
            console.log("Firebase: Autenticación con token exitosa.");
        } else {
            
            await signInAnonymously(auth);
            console.log("Firebase: Autenticación anónima exitosa.");
        }
        isInitialized = true;
        return true;
    } catch (error) {
        console.error("Firebase: Error al autenticar/inicializar.", error);
        isInitialized = false;
        return false;
    }
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Firebase: Usuario autenticado (UID:", user.uid, ")");
    } else {
        console.log("Firebase: Ningún usuario autenticado.");
    }
});



const getPublicCollectionRef = (collectionName) => {
    if (!isInitialized) {
        
        console.warn("Firestore no está inicializado. Asegúrate de que authenticateUser() fue llamado.");
    }
    
    const currentAppId = typeof __app_id !== 'undefined' && __app_id ? __app_id : appId; 

    
    return collection(db, "artifacts", currentAppId, "public", "data", collectionName);
};



/**
 * 
 * @param {object} beatData 
 * @returns {Promise<string>} 
 */
export const addBeat = async (beatData) => {
    try {
        const docRef = await addDoc(getPublicCollectionRef("beats"), {
            ...beatData,
            createdAt: new Date(),
        });
        return docRef.id;
    } catch (e) {
        console.error("Error añadiendo documento beat:", e);
        throw e;
    }
};

/**
 *
 * @param {object} suscriptorData 
 * @returns {Promise<string>} 
 */
export const addSuscriptor = async (suscriptorData) => {
    try {
        const docRef = await addDoc(getPublicCollectionRef("suscriptores"), {
            ...suscriptorData,
            subscribedAt: new Date(),
        });
        return docRef.id;
    } catch (e) {
        console.error("Error añadiendo suscriptor:", e);
        throw e;
    }
};

/**
 *
 * @param {string} id 
 * @returns {Promise<object|null>} 
 */
export const getBeatById = async (id) => {
    try {
        
        const collectionRef = getPublicCollectionRef("beats");
        const docRef = doc(collectionRef, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (e) {
        console.error("Error obteniendo beat por ID:", e);
        throw e;
    }
};


export const getBeatsCollectionQuery = () => {
    return query(getPublicCollectionRef("beats"));
};

export const isDbInitialized = () => isInitialized;










  




    

  

