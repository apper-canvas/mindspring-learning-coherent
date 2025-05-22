import { Workbox } from 'workbox-window';

export function register() {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');

    wb.addEventListener('installed', event => {
      if (event.isUpdate) {
        if (confirm('New content is available. Reload to update?')) {
          window.location.reload();
        }
      }
    });

    wb.addEventListener('activated', event => {
      // When the service worker is activated, claim clients
      if (event.isUpdate) {
        console.log('Service worker updated and activated');
      } else {
        console.log('Service worker activated for the first time');
      }
    });

    // Register the service worker
    wb.register();
  }
}