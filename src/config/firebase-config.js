/* global __app_id */

const localFirebaseConfig = {
    
    apiKey: "AIzaSyAIimfwPD0xxGohDh5-Hlaa0SRPSS9P9G0", 
    authDomain: "flacc-club-beats.firebaseapp.com",
    projectId: "flacc-club-beats",
    storageBucket: "flacc-club-beats.firebasestorage.app",
    messagingSenderId: "553378684245",
    appId: "1:553378684245:web:7691741976e7a5a5b263dc"
};


const injectedAppId = typeof __app_id !== 'undefined' && __app_id ? __app_id : localFirebaseConfig.projectId;

export const firebaseConfig = localFirebaseConfig;
export const appId = injectedAppId;

