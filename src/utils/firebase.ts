// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set } from 'firebase/database';

const firebaseConfig = {
    apiKey: 'AIzaSyDF78n24MUOCGaceF_abT44fwWJyENQvFw',
    authDomain: 'visit-count-c90a2.firebaseapp.com',
    projectId: 'visit-count-c90a2',
    storageBucket: 'visit-count-c90a2.appspot.com',
    messagingSenderId: '869998155105',
    databaseURL: 'visit-count-c90a2-default-rtdb.asia-southeast1.firebasedatabase.app',
    appId: '1:869998155105:web:57f93cbf4797c23fd4a120',
    measurementId: 'G-8M0EJL5VZR',
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, get, set };
