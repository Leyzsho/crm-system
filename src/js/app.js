import app from './firebase.js';
import { getAuth, onAuthStateChanged, deleteUser } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';
const auth = getAuth(app);


onAuthStateChanged(auth, async (user) => {
  if (user && user.emailVerified) {

  } else {
    window.location.href = './register.html';
  }
});

const newClientBtn = document.querySelector('.new-client-btn');

newClientBtn.addEventListener('click', async event => {
  const module = await import('./createFormModal.js');
  module.default();
  // document.body.append(module.default());
});


