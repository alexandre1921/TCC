import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { connectAuthEmulator, getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_CONFIG_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_CONFIG_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_CONFIG_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_CONFIG_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_CONFIG_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_CONFIG_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_CONFIG_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);

function getAuthEmulatorHost() {
    const host = import.meta.env.VITE_FIREBASE_EMULATOR_HOST;
    const port = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_PORT;

    return `http://${host}:${port}`;
}

const shouldConnectEmulator = import.meta.env.VITE_FIREBASE_EMULATOR === 'true';

if (shouldConnectEmulator) {
    const host = getAuthEmulatorHost();

    connectAuthEmulator(auth, host);
    connectFirestoreEmulator(firestore, host, Number(import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_PORT));
}
