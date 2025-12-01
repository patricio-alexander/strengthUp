import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIRABASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIRABASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIRABASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIRABASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIRABASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIRABASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIRABASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const firestore = getFirestore(app);

export { auth, firestore };
