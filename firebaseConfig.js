// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';
// import { setLogLevel } from 'firebase/database';
// setLogLevel('silent');
const firebaseConfig = {
  apiKey: "AIzaSyDT70YkCrIadn4-N2-JhVvHijhpT1QgYFE",
  authDomain: "silentaaryan123.firebaseapp.com",
  databaseURL: "https://silentaaryan123-default-rtdb.firebaseio.com",
  projectId: "silentaaryan123",
  storageBucket: "silentaaryan123.appspot.com",
  messagingSenderId: "55329491104",
  appId: "1:55329491104:web:a95a5a86ccdbb2d76ba1c5"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, push };
