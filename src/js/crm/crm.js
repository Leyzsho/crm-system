import app from '../utils/firebase-init.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js';
import { openClientModal } from './modals.js';

const auth = getAuth(app);
const db = getDatabase();

onAuthStateChanged(auth, async (user) => {
  if (user && user.emailVerified) {
    onValue(ref(db, ('users/' + user.uid)), (snapshot) => {
      const data = snapshot.val();
      const newClientBtn = document.querySelector('.new-client-btn');
      const clientList = document.querySelector('.client-list');

      document.querySelector('.client-list__loader').remove();
      newClientBtn.disabled = false;
      console.log(data);

      const message = document.createElement('li');
      if (data === null) {
        message.classList.add('client-list__message');
        message.textContent = 'Добавьте вашего первого клиента';
        clientList.append(message);
        message.addEventListener('click', event => {
          openClientModal('create', user, data);
        });
      } else {
        message.remove();
      }

      newClientBtn.addEventListener('click', async event => {
        openClientModal('create', user, data);
      });
    });
  } else {
    window.location.href = './register.html';
  }
});
