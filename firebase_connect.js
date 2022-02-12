const serviceaccount = require('./firebase-service-key.json');
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceaccount)
})

const db = admin.firestore(); 

module.exports = db;