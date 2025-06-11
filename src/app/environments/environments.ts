export const environment = {
  production: false,
  firebase: {
    apiKey: (window as any)['__env']?.FIREBASE_API_KEY,
    authDomain: (window as any)['__env']?.FIREBASE_AUTH_DOMAIN,
    projectId: (window as any)['__env']?.FIREBASE_PROJECT_ID,
    storageBucket: (window as any)['__env']?.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: (window as any)['__env']?.FIREBASE_MESSAGING_SENDER_ID,
    appId: (window as any)['__env']?.FIREBASE_APP_ID,
    measurementId: (window as any)['__env']?.FIREBASE_MEASUREMENT_ID,
  },
};
