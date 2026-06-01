// Service Worker with Workbox
// This file will be compiled and registered in main.tsx

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(error => {
    console.error('ServiceWorker registration failed:', error);
  });
}
