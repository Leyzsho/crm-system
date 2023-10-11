import app from '../utils/firebase.js';
import { getAuth, onAuthStateChanged, deleteUser } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js';
import { openClientModal } from './modals.js';

const auth = getAuth(app);
const db = getDatabase();

onAuthStateChanged(auth, async (user) => {
  if (user && user.emailVerified) {
    onValue(ref(db, ('users/' + user.uid)), (snapshot) => {
      const data = snapshot.val();
      const newClientBtn = document.querySelector('.new-client-btn');

      document.querySelector('.lds-ring').remove();
      newClientBtn.disabled = false;

      newClientBtn.addEventListener('click', async event => {
        openClientModal('create');
      });
    });
  } else {
    window.location.href = './register.html';
  }
});
