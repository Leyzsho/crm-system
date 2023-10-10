import app from '../firebase.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';
import { openChangeEmailModal, openChangePasswordModal, openDeleteAccountModal, openSignOutModal } from './modals.js';
const auth = getAuth(app);

onAuthStateChanged(auth, async (user) => {
  if (user && user.emailVerified) {
    document.getElementById('loader').remove();

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


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhdXRoL2FjY291bnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFwcCBmcm9tICcuLi9maXJlYmFzZS5qcyc7XG5pbXBvcnQgeyBnZXRBdXRoLCBvbkF1dGhTdGF0ZUNoYW5nZWQgfSBmcm9tICdodHRwczovL3d3dy5nc3RhdGljLmNvbS9maXJlYmFzZWpzLzkuMS4xL2ZpcmViYXNlLWF1dGguanMnO1xuaW1wb3J0IHsgb3BlbkNoYW5nZUVtYWlsTW9kYWwsIG9wZW5DaGFuZ2VQYXNzd29yZE1vZGFsLCBvcGVuRGVsZXRlQWNjb3VudE1vZGFsLCBvcGVuU2lnbk91dE1vZGFsIH0gZnJvbSAnLi9tb2RhbHMuanMnO1xuY29uc3QgYXV0aCA9IGdldEF1dGgoYXBwKTtcblxub25BdXRoU3RhdGVDaGFuZ2VkKGF1dGgsIGFzeW5jICh1c2VyKSA9PiB7XG4gIGlmICh1c2VyICYmIHVzZXIuZW1haWxWZXJpZmllZCkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkZXInKS5yZW1vdmUoKTtcblxuICAgIGNvbnN0IGN1cnJlbnRFbWFpbCA9IHVzZXIuZW1haWw7XG4gICAgY29uc3QgYWNjb3VudENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hY2NvdW50Jyk7XG4gICAgY29uc3QgYWNjb3VudEVtYWlsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjY291bnQtZW1haWwnKTtcblxuICAgIGNvbnN0IGNoYW5nZUVtYWlsQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYW5nZS1lbWFpbCcpO1xuICAgIGNvbnN0IHNpZ25PdXRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lnbi1vdXQnKTtcbiAgICBjb25zdCBjaGFuZ2VQYXNzd29yZEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGFuZ2UtcGFzc3dvcmQnKTtcbiAgICBjb25zdCBkZWxldGVVc2VyQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbGV0ZS1hY2NvdW50Jyk7XG5cbiAgICBhY2NvdW50Q29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjY291bnQtLWhpZGRlbicpO1xuICAgIGFjY291bnRFbWFpbC50ZXh0Q29udGVudCA9IGBlbWFpbDogJHtjdXJyZW50RW1haWx9YDtcblxuXG4gICAgY2hhbmdlRW1haWxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICBvcGVuQ2hhbmdlRW1haWxNb2RhbCh1c2VyKTtcbiAgICB9KTtcblxuICAgIGNoYW5nZVBhc3N3b3JkQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgb3BlbkNoYW5nZVBhc3N3b3JkTW9kYWwodXNlcik7XG4gICAgfSk7XG5cbiAgICBzaWduT3V0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgb3BlblNpZ25PdXRNb2RhbCgpO1xuICAgIH0pO1xuXG4gICAgZGVsZXRlVXNlckJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGV2ZW50ID0+IHtcbiAgICAgIG9wZW5EZWxldGVBY2NvdW50TW9kYWwodXNlcik7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi9yZWdpc3Rlci5odG1sJztcbiAgfVxufSk7XG5cbiJdLCJmaWxlIjoiYXV0aC9hY2NvdW50LmpzIn0=
