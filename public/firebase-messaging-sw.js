// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB9VoGSJtqFlIExA_8tEt516OkBUbu4G4A",
  authDomain: "tarrawatch-b888f.firebaseapp.com",
  projectId: "tarrawatch-b888f",
  messagingSenderId: "348082025465",
  appId: "1:348082025465:web:66904f6f8056caae464328",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icon.png', // Ícono opcional
  });
});

