import app from '../utils/firebase-init.js';
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
      const clientList = document.querySelector('.client-list');

      document.querySelector('.client-list__loader').remove();
      newClientBtn.disabled = false;

      if (data === null) {
        const message = document.createElement('li');
        message.classList.add('client-list__message');
        message.textContent = 'Добавьте вашего первого клиента';
        clientList.append(message);
        message.addEventListener('click', event => {
          openClientModal('create');
        });
      }

      newClientBtn.addEventListener('click', async event => {
        openClientModal('create');
      });
    });
  } else {
    window.location.href = './register.html';
  }
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcm0vY3JtLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhcHAgZnJvbSAnLi4vdXRpbHMvZmlyZWJhc2UtaW5pdC5qcyc7XG5pbXBvcnQgeyBnZXRBdXRoLCBvbkF1dGhTdGF0ZUNoYW5nZWQsIGRlbGV0ZVVzZXIgfSBmcm9tICdodHRwczovL3d3dy5nc3RhdGljLmNvbS9maXJlYmFzZWpzLzkuMS4xL2ZpcmViYXNlLWF1dGguanMnO1xuaW1wb3J0IHsgZ2V0RGF0YWJhc2UsIHJlZiwgc2V0LCBvblZhbHVlIH0gZnJvbSAnaHR0cHM6Ly93d3cuZ3N0YXRpYy5jb20vZmlyZWJhc2Vqcy85LjEuMS9maXJlYmFzZS1kYXRhYmFzZS5qcyc7XG5pbXBvcnQgeyBvcGVuQ2xpZW50TW9kYWwgfSBmcm9tICcuL21vZGFscy5qcyc7XG5cbmNvbnN0IGF1dGggPSBnZXRBdXRoKGFwcCk7XG5jb25zdCBkYiA9IGdldERhdGFiYXNlKCk7XG5cbm9uQXV0aFN0YXRlQ2hhbmdlZChhdXRoLCBhc3luYyAodXNlcikgPT4ge1xuICBpZiAodXNlciAmJiB1c2VyLmVtYWlsVmVyaWZpZWQpIHtcbiAgICBvblZhbHVlKHJlZihkYiwgKCd1c2Vycy8nICsgdXNlci51aWQpKSwgKHNuYXBzaG90KSA9PiB7XG4gICAgICBjb25zdCBkYXRhID0gc25hcHNob3QudmFsKCk7XG4gICAgICBjb25zdCBuZXdDbGllbnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LWNsaWVudC1idG4nKTtcbiAgICAgIGNvbnN0IGNsaWVudExpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2xpZW50LWxpc3QnKTtcblxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNsaWVudC1saXN0X19sb2FkZXInKS5yZW1vdmUoKTtcbiAgICAgIG5ld0NsaWVudEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgICBpZiAoZGF0YSA9PT0gbnVsbCkge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbGlzdF9fbWVzc2FnZScpO1xuICAgICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9CU0L7QsdCw0LLRjNGC0LUg0LLQsNGI0LXQs9C+INC/0LXRgNCy0L7Qs9C+INC60LvQuNC10L3RgtCwJztcbiAgICAgICAgY2xpZW50TGlzdC5hcHBlbmQobWVzc2FnZSk7XG4gICAgICAgIG1lc3NhZ2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICAgICAgb3BlbkNsaWVudE1vZGFsKCdjcmVhdGUnKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIG5ld0NsaWVudEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGV2ZW50ID0+IHtcbiAgICAgICAgb3BlbkNsaWVudE1vZGFsKCdjcmVhdGUnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4vcmVnaXN0ZXIuaHRtbCc7XG4gIH1cbn0pO1xuIl0sImZpbGUiOiJjcm0vY3JtLmpzIn0=
