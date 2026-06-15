importScripts(
  "https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCIRoeTv5bs6Qu9KonNwe6lnmmZrEyfB_s",
  authDomain: "taskhub-92b4e.firebaseapp.com",
  projectId: "taskhub-92b4e",
  storageBucket: "taskhub-92b4e.firebasestorage.app",
  messagingSenderId: "414083373933",
  appId: "1:414083373933:web:0b761f8a297c1c1cd89864",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "/icon-192.png",
    }
  );
});