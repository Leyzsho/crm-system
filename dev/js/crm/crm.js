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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcm0vY3JtLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhcHAgZnJvbSAnLi4vdXRpbHMvZmlyZWJhc2UtaW5pdC5qcyc7XG5pbXBvcnQgeyBnZXRBdXRoLCBvbkF1dGhTdGF0ZUNoYW5nZWQgfSBmcm9tICdodHRwczovL3d3dy5nc3RhdGljLmNvbS9maXJlYmFzZWpzLzkuMS4xL2ZpcmViYXNlLWF1dGguanMnO1xuaW1wb3J0IHsgZ2V0RGF0YWJhc2UsIHJlZiwgb25WYWx1ZSB9IGZyb20gJ2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2ZpcmViYXNlanMvOS4xLjEvZmlyZWJhc2UtZGF0YWJhc2UuanMnO1xuaW1wb3J0IHsgb3BlbkNsaWVudE1vZGFsIH0gZnJvbSAnLi9tb2RhbHMuanMnO1xuXG5jb25zdCBhdXRoID0gZ2V0QXV0aChhcHApO1xuY29uc3QgZGIgPSBnZXREYXRhYmFzZSgpO1xuXG5vbkF1dGhTdGF0ZUNoYW5nZWQoYXV0aCwgYXN5bmMgKHVzZXIpID0+IHtcbiAgaWYgKHVzZXIgJiYgdXNlci5lbWFpbFZlcmlmaWVkKSB7XG4gICAgb25WYWx1ZShyZWYoZGIsICgndXNlcnMvJyArIHVzZXIudWlkKSksIChzbmFwc2hvdCkgPT4ge1xuICAgICAgY29uc3QgZGF0YSA9IHNuYXBzaG90LnZhbCgpO1xuICAgICAgY29uc3QgbmV3Q2xpZW50QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy1jbGllbnQtYnRuJyk7XG4gICAgICBjb25zdCBjbGllbnRMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNsaWVudC1saXN0Jyk7XG5cbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbGllbnQtbGlzdF9fbG9hZGVyJykucmVtb3ZlKCk7XG4gICAgICBuZXdDbGllbnRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuXG4gICAgICBjb25zdCBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIGlmIChkYXRhID09PSBudWxsKSB7XG4gICAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX21lc3NhZ2UnKTtcbiAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQlNC+0LHQsNCy0YzRgtC1INCy0LDRiNC10LPQviDQv9C10YDQstC+0LPQviDQutC70LjQtdC90YLQsCc7XG4gICAgICAgIGNsaWVudExpc3QuYXBwZW5kKG1lc3NhZ2UpO1xuICAgICAgICBtZXNzYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgICAgIG9wZW5DbGllbnRNb2RhbCgnY3JlYXRlJywgdXNlciwgZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWVzc2FnZS5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgbmV3Q2xpZW50QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZXZlbnQgPT4ge1xuICAgICAgICBvcGVuQ2xpZW50TW9kYWwoJ2NyZWF0ZScsIHVzZXIsIGRhdGEpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi9yZWdpc3Rlci5odG1sJztcbiAgfVxufSk7XG4iXSwiZmlsZSI6ImNybS9jcm0uanMifQ==
