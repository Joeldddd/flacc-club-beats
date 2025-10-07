FLACC Club Beats - Tienda de Instrumentales
Esta aplicación web es una plataforma de comercio electrónico diseñada para que productores de música suban sus beats (instrumentales) a un catálogo centralizado y para que los usuarios puedan ver el listado, obtener detalles y suscribirse al newsletter. El catálogo se actualiza en tiempo real utilizando la base de datos Google Cloud Firestore.

🛠️ Tecnologías Utilizadas
Frontend: ReactJS

Lenguaje: JavaScript (ES6+)

Estilado: CSS / (Si aplica: Bootstrap o Tailwind CSS)

Base de Datos: Google Cloud Firestore (Real-time NoSQL Database)

Servicios de Despliegue: Vercel

🔗 Enlaces del Proyecto
Recurso

URL

Repositorio GitHub

https://docs.github.com/es/repositories/creating-and-managing-repositories/quickstart-for-repositories

Aplicación Desplegada (Vercel)

https://www.youtube.com/watch?v=yxLOBFXSkv0

⚙️ Configuración y Ejecución Local
Para ejecutar esta aplicación en tu entorno local, sigue los siguientes pasos.

Requisitos Previos
Necesitas tener Node.js y npm (o yarn) instalados en tu sistema.

1. Clonar el Repositorio
Abre tu terminal y clona el proyecto:

git clone [https://docs.github.com/es/repositories/creating-and-managing-repositories/quickstart-for-repositories](https://docs.github.com/es/repositories/creating-and-managing-repositories/quickstart-for-repositories)
cd flacc-club-beats

2. Instalación de Dependencias
Instala todas las dependencias del proyecto (incluyendo Firebase):

npm install
# o si usas yarn
# yarn install

3. Configuración de Firebase
Para que la aplicación se conecte a la base de datos, debes tener la configuración de tu proyecto de Firebase en el archivo: src/config/firebase-config.js.

Asegúrate de que este archivo contenga tu configuración (la clave de API ya está corregida):

// src/config/firebase-config.js (Ejemplo)
const localFirebaseConfig = {
    apiKey: "AIzaSyAIimfwPD0xxGohDh5-Hlaa0SRPSS9P9G0L", 
    authDomain: "flacc-club-beats.firebaseapp.com",
    // ... otros campos
};
export const firebaseConfig = localFirebaseConfig;

⚠️ NOTA DE SEGURIDAD/FIREBASE: Si encuentras errores de conexión (Error: Configuración inválida o se queda en Loading...), verifica que las Reglas de Seguridad de tu base de datos en Firestore estén configuradas para permitir lecturas y escrituras públicas:

// Reglas de Firestore
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/public/data/{collectionName}/{document=**} {
      allow read, write: if true;
    }
  }
}

4. Iniciar la Aplicación
Ejecuta el proyecto en modo de desarrollo. Se abrirá en http://localhost:3000 (o un puerto similar).

npm start
# o si usas yarn
# yarn start