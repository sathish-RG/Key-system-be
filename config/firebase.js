const admin = require('firebase-admin');

const serviceAccount = require('./your-firebase-adminsdk.json'); // download from Firebase console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
