import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyBxqMmxnnITLmIA1fNjY35hkUKMYE-qIqc",
  authDomain: "crm-system-9d29c.firebaseapp.com",
  databaseURL: "https://crm-system-9d29c-default-rtdb.firebaseio.com",
  projectId: "crm-system-9d29c",
  storageBucket: "crm-system-9d29c.appspot.com",
  messagingSenderId: "48438386908",
  appId: "1:48438386908:web:b96dd3eefdf3d95f435419",
  measurementId: "G-CZBSFV8M1P"
};

const app = initializeApp(firebaseConfig);

export default app;
