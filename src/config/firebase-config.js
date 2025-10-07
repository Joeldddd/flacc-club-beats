/* global __app_id */

// Configuración local de Firebase (usada si no se está en el entorno de Canvas)
const localFirebaseConfig = {
    // 🛑 CLAVE CORREGIDA: Se añade la 'L' al final (9G0L)
    apiKey: "AIzaSyAIimfwPD0xxGohDh5-Hlaa0SRPSS9P9G0L", 
    authDomain: "flacc-club-beats.firebaseapp.com",
    projectId: "flacc-club-beats",
    storageBucket: "flacc-club-beats.firebasestorage.app",
    messagingSenderId: "553378684245",
    appId: "1:553378684245:web:7691741976e7a5a5b263dc"
};

// Usar el ID de aplicación inyectado por el entorno si existe, sino usar el ID del proyecto local.
const injectedAppId = typeof __app_id !== 'undefined' && __app_id ? __app_id : localFirebaseConfig.projectId;

export const firebaseConfig = localFirebaseConfig;
export const appId = injectedAppId;
