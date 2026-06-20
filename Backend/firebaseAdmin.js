console.log("PROJECT_ID:", !!process.env.FIREBASE_PROJECT_ID);
console.log("CLIENT_EMAIL:", !!process.env.FIREBASE_CLIENT_EMAIL);
console.log("PRIVATE_KEY:", !!process.env.FIREBASE_PRIVATE_KEY);
const { initializeApp, cert, getApps } = require("firebase-admin/app");

const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!privateKey) {
  throw new Error("FIREBASE_PRIVATE_KEY is missing");
}

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      })
    : getApps()[0];

module.exports = app;