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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcm0vY3JtLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhcHAgZnJvbSAnLi4vdXRpbHMvZmlyZWJhc2UuanMnO1xuaW1wb3J0IHsgZ2V0QXV0aCwgb25BdXRoU3RhdGVDaGFuZ2VkLCBkZWxldGVVc2VyIH0gZnJvbSAnaHR0cHM6Ly93d3cuZ3N0YXRpYy5jb20vZmlyZWJhc2Vqcy85LjEuMS9maXJlYmFzZS1hdXRoLmpzJztcbmltcG9ydCB7IGdldERhdGFiYXNlLCByZWYsIHNldCwgb25WYWx1ZSB9IGZyb20gJ2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2ZpcmViYXNlanMvOS4xLjEvZmlyZWJhc2UtZGF0YWJhc2UuanMnO1xuaW1wb3J0IHsgb3BlbkNsaWVudE1vZGFsIH0gZnJvbSAnLi9tb2RhbHMuanMnO1xuXG5jb25zdCBhdXRoID0gZ2V0QXV0aChhcHApO1xuY29uc3QgZGIgPSBnZXREYXRhYmFzZSgpO1xuXG5vbkF1dGhTdGF0ZUNoYW5nZWQoYXV0aCwgYXN5bmMgKHVzZXIpID0+IHtcbiAgaWYgKHVzZXIgJiYgdXNlci5lbWFpbFZlcmlmaWVkKSB7XG4gICAgb25WYWx1ZShyZWYoZGIsICgndXNlcnMvJyArIHVzZXIudWlkKSksIChzbmFwc2hvdCkgPT4ge1xuICAgICAgY29uc3QgZGF0YSA9IHNuYXBzaG90LnZhbCgpO1xuICAgICAgY29uc3QgbmV3Q2xpZW50QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy1jbGllbnQtYnRuJyk7XG5cbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sZHMtcmluZycpLnJlbW92ZSgpO1xuICAgICAgbmV3Q2xpZW50QnRuLmRpc2FibGVkID0gZmFsc2U7XG5cbiAgICAgIG5ld0NsaWVudEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGV2ZW50ID0+IHtcbiAgICAgICAgb3BlbkNsaWVudE1vZGFsKCdjcmVhdGUnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4vcmVnaXN0ZXIuaHRtbCc7XG4gIH1cbn0pO1xuIl0sImZpbGUiOiJjcm0vY3JtLmpzIn0=
