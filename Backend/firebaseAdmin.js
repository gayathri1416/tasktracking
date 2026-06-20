const { initializeApp, cert, getApps } = require("firebase-admin/app");

const serviceAccount = require("./config/serviceAccountKey.json");

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount),
      })
    : getApps()[0];

module.exports = app;