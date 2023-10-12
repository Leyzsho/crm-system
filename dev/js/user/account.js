import app from '../utils/firebase.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';
import { openChangeEmailModal, openChangePasswordModal, openDeleteAccountModal, openSignOutModal } from './modals.js';
const auth = getAuth(app);

onAuthStateChanged(auth, async (user) => {
  if (user && user.emailVerified) {
    document.getElementById('loader').remove();
    document.querySelector('.main').classList.remove('main--hidden');

    const currentEmail = user.email;
    const accountContainer = document.querySelector('.account');
    const accountEmail = document.getElementById('account-email');

    const changeEmailBtn = document.getElementById('change-email');
    const signOutBtn = document.getElementById('sign-out');
    const changePasswordBtn = document.getElementById('change-password');
    const deleteUserBtn = document.getElementById('delete-account');

    accountContainer.classList.remove('account--hidden');
    accountEmail.textContent = `email: ${currentEmail}`;


    changeEmailBtn.addEventListener('click', event => {
      openChangeEmailModal(user);
    });

    changePasswordBtn.addEventListener('click', event => {
      openChangePasswordModal(user);
    });

    signOutBtn.addEventListener('click', event => {
      openSignOutModal();
    });

    deleteUserBtn.addEventListener('click', async event => {
      openDeleteAccountModal(user);
    });
  } else {
    window.location.href = './register.html';
  }
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ1c2VyL2FjY291bnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFwcCBmcm9tICcuLi91dGlscy9maXJlYmFzZS5qcyc7XG5pbXBvcnQgeyBnZXRBdXRoLCBvbkF1dGhTdGF0ZUNoYW5nZWQgfSBmcm9tICdodHRwczovL3d3dy5nc3RhdGljLmNvbS9maXJlYmFzZWpzLzkuMS4xL2ZpcmViYXNlLWF1dGguanMnO1xuaW1wb3J0IHsgb3BlbkNoYW5nZUVtYWlsTW9kYWwsIG9wZW5DaGFuZ2VQYXNzd29yZE1vZGFsLCBvcGVuRGVsZXRlQWNjb3VudE1vZGFsLCBvcGVuU2lnbk91dE1vZGFsIH0gZnJvbSAnLi9tb2RhbHMuanMnO1xuY29uc3QgYXV0aCA9IGdldEF1dGgoYXBwKTtcblxub25BdXRoU3RhdGVDaGFuZ2VkKGF1dGgsIGFzeW5jICh1c2VyKSA9PiB7XG4gIGlmICh1c2VyICYmIHVzZXIuZW1haWxWZXJpZmllZCkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkZXInKS5yZW1vdmUoKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFpbicpLmNsYXNzTGlzdC5yZW1vdmUoJ21haW4tLWhpZGRlbicpO1xuXG4gICAgY29uc3QgY3VycmVudEVtYWlsID0gdXNlci5lbWFpbDtcbiAgICBjb25zdCBhY2NvdW50Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFjY291bnQnKTtcbiAgICBjb25zdCBhY2NvdW50RW1haWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWNjb3VudC1lbWFpbCcpO1xuXG4gICAgY29uc3QgY2hhbmdlRW1haWxCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhbmdlLWVtYWlsJyk7XG4gICAgY29uc3Qgc2lnbk91dEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaWduLW91dCcpO1xuICAgIGNvbnN0IGNoYW5nZVBhc3N3b3JkQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYW5nZS1wYXNzd29yZCcpO1xuICAgIGNvbnN0IGRlbGV0ZVVzZXJCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVsZXRlLWFjY291bnQnKTtcblxuICAgIGFjY291bnRDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWNjb3VudC0taGlkZGVuJyk7XG4gICAgYWNjb3VudEVtYWlsLnRleHRDb250ZW50ID0gYGVtYWlsOiAke2N1cnJlbnRFbWFpbH1gO1xuXG5cbiAgICBjaGFuZ2VFbWFpbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICAgIG9wZW5DaGFuZ2VFbWFpbE1vZGFsKHVzZXIpO1xuICAgIH0pO1xuXG4gICAgY2hhbmdlUGFzc3dvcmRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICBvcGVuQ2hhbmdlUGFzc3dvcmRNb2RhbCh1c2VyKTtcbiAgICB9KTtcblxuICAgIHNpZ25PdXRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICBvcGVuU2lnbk91dE1vZGFsKCk7XG4gICAgfSk7XG5cbiAgICBkZWxldGVVc2VyQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZXZlbnQgPT4ge1xuICAgICAgb3BlbkRlbGV0ZUFjY291bnRNb2RhbCh1c2VyKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuL3JlZ2lzdGVyLmh0bWwnO1xuICB9XG59KTtcbiJdLCJmaWxlIjoidXNlci9hY2NvdW50LmpzIn0=
