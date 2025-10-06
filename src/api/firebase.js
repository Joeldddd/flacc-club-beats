import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAlimfwPD8xXGoDh5-H1aaOSRPS5P9G0", 
  authDomain: "flacc-club-beats.firebaseapp.com",
  projectId: "flacc-club-beats",
  storageBucket: "flacc-club-beats.firebaseapp.com",
  messagingSenderId: "553378684245",
  appId: "1:553378684245:web:7691741976e7a5a5b263dc"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const beatsCollectionRef = collection(db, "Beats");
/**
 * @returns {Array}
 */
export const getBeats = async () => {
  try {
    const querySnapshot = await getDocs(beatsCollectionRef);
    
    const beatsList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return beatsList;
    
  } catch (error) {
    console.error("Error al obtener los beats: ", error);
    return []; 
  }
};
/**
 * @param {string} id 
 * @returns {Object|null}
 */
export const getBeatById = async (id) => {
  try {
    const beatRef = doc(db, "Beats", id);
    const docSnap = await getDoc(beatRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No se encontró el beat con ID:", id);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el beat por ID: ", error);
    return null;
  }
};
/**
 * @param {Object} beatData 
 * @returns {string} 
 */
export const addBeat = async (beatData) => {
  try {
    const docRef = await addDoc(beatsCollectionRef, beatData);
    return docRef.id;
  } catch (error) {
    console.error("Error al añadir el beat: ", error);
    throw new Error("No se pudo crear el beat.");
  }
};
/**
 * @param {string} id 
 * @param {Object} updatedFields
 */
export const updateBeat = async (id, updatedFields) => {
  try {
    const beatRef = doc(db, "Beats", id);
    await updateDoc(beatRef, updatedFields);
  } catch (error) {
    console.error(`Error al actualizar el beat ${id}: `, error);
    throw new Error(`No se pudo actualizar el beat con ID ${id}.`);
 }
};
/**
 * @param {string} id
 */
export const deleteBeat = async (id) => {
  try {
    const beatRef = doc(db, "Beats", id);
    await deleteDoc(beatRef);
  } catch (error) {
    console.error(`Error al eliminar el beat ${id}: `, error);
    throw new Error(`No se pudo eliminar el beat con ID ${id}.`);
  }
};
