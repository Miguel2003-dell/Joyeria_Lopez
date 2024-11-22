import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/service-worker.js`)
//       .then((registration) => {
//         console.log('Service Worker registrado con éxito:', registration);
//       })
//       .catch((error) => {
//         console.error('Error al registrar el Service Worker:', error);
//       });
//   });
// }