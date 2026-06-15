import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCIRoeTv5bs6Qu9KonNwe6lnmmZrEyfB_s",
  authDomain: "taskhub-92b4e.firebaseapp.com",
  projectId: "taskhub-92b4e",
  storageBucket: "taskhub-92b4e.firebasestorage.app",
  messagingSenderId: "414083373933",
  appId: "1:414083373933:web:0b761f8a297c1c1cd89864",
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);