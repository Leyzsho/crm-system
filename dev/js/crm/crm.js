import app from '../utils/firebase.js';
import { getAuth, onAuthStateChanged, deleteUser } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js';
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
        const modals = await import('./modals.js');
        modals.openClientModal(data, 'change');
      });
    });
  } else {
    window.location.href = './register.html';
  }
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcm0vY3JtLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhcHAgZnJvbSAnLi4vdXRpbHMvZmlyZWJhc2UuanMnO1xuaW1wb3J0IHsgZ2V0QXV0aCwgb25BdXRoU3RhdGVDaGFuZ2VkLCBkZWxldGVVc2VyIH0gZnJvbSAnaHR0cHM6Ly93d3cuZ3N0YXRpYy5jb20vZmlyZWJhc2Vqcy85LjEuMS9maXJlYmFzZS1hdXRoLmpzJztcbmltcG9ydCB7IGdldERhdGFiYXNlLCByZWYsIHNldCwgb25WYWx1ZSB9IGZyb20gJ2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2ZpcmViYXNlanMvOS4xLjEvZmlyZWJhc2UtZGF0YWJhc2UuanMnO1xuY29uc3QgYXV0aCA9IGdldEF1dGgoYXBwKTtcbmNvbnN0IGRiID0gZ2V0RGF0YWJhc2UoKTtcbm9uQXV0aFN0YXRlQ2hhbmdlZChhdXRoLCBhc3luYyAodXNlcikgPT4ge1xuICBpZiAodXNlciAmJiB1c2VyLmVtYWlsVmVyaWZpZWQpIHtcbiAgICBvblZhbHVlKHJlZihkYiwgKCd1c2Vycy8nICsgdXNlci51aWQpKSwgKHNuYXBzaG90KSA9PiB7XG4gICAgICBjb25zdCBkYXRhID0gc25hcHNob3QudmFsKCk7XG4gICAgICBjb25zdCBuZXdDbGllbnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LWNsaWVudC1idG4nKTtcblxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxkcy1yaW5nJykucmVtb3ZlKCk7XG4gICAgICBuZXdDbGllbnRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcblxuICAgICAgbmV3Q2xpZW50QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZXZlbnQgPT4ge1xuICAgICAgICBjb25zdCBtb2RhbHMgPSBhd2FpdCBpbXBvcnQoJy4vbW9kYWxzLmpzJyk7XG4gICAgICAgIG1vZGFscy5vcGVuQ2xpZW50TW9kYWwoZGF0YSwgJ2NoYW5nZScpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi9yZWdpc3Rlci5odG1sJztcbiAgfVxufSk7XG4iXSwiZmlsZSI6ImNybS9jcm0uanMifQ==
