import app from '../utils/firebase-init.js';
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ1c2VyL2FjY291bnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFwcCBmcm9tICcuLi91dGlscy9maXJlYmFzZS1pbml0LmpzJztcbmltcG9ydCB7IGdldEF1dGgsIG9uQXV0aFN0YXRlQ2hhbmdlZCB9IGZyb20gJ2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2ZpcmViYXNlanMvOS4xLjEvZmlyZWJhc2UtYXV0aC5qcyc7XG5pbXBvcnQgeyBvcGVuQ2hhbmdlRW1haWxNb2RhbCwgb3BlbkNoYW5nZVBhc3N3b3JkTW9kYWwsIG9wZW5EZWxldGVBY2NvdW50TW9kYWwsIG9wZW5TaWduT3V0TW9kYWwgfSBmcm9tICcuL21vZGFscy5qcyc7XG5jb25zdCBhdXRoID0gZ2V0QXV0aChhcHApO1xuXG5vbkF1dGhTdGF0ZUNoYW5nZWQoYXV0aCwgYXN5bmMgKHVzZXIpID0+IHtcbiAgaWYgKHVzZXIgJiYgdXNlci5lbWFpbFZlcmlmaWVkKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWRlcicpLnJlbW92ZSgpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYWluJykuY2xhc3NMaXN0LnJlbW92ZSgnbWFpbi0taGlkZGVuJyk7XG5cbiAgICBjb25zdCBjdXJyZW50RW1haWwgPSB1c2VyLmVtYWlsO1xuICAgIGNvbnN0IGFjY291bnRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWNjb3VudCcpO1xuICAgIGNvbnN0IGFjY291bnRFbWFpbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhY2NvdW50LWVtYWlsJyk7XG5cbiAgICBjb25zdCBjaGFuZ2VFbWFpbEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGFuZ2UtZW1haWwnKTtcbiAgICBjb25zdCBzaWduT3V0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZ24tb3V0Jyk7XG4gICAgY29uc3QgY2hhbmdlUGFzc3dvcmRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhbmdlLXBhc3N3b3JkJyk7XG4gICAgY29uc3QgZGVsZXRlVXNlckJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZWxldGUtYWNjb3VudCcpO1xuXG4gICAgYWNjb3VudENvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdhY2NvdW50LS1oaWRkZW4nKTtcbiAgICBhY2NvdW50RW1haWwudGV4dENvbnRlbnQgPSBgZW1haWw6ICR7Y3VycmVudEVtYWlsfWA7XG5cblxuICAgIGNoYW5nZUVtYWlsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgb3BlbkNoYW5nZUVtYWlsTW9kYWwodXNlcik7XG4gICAgfSk7XG5cbiAgICBjaGFuZ2VQYXNzd29yZEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICAgIG9wZW5DaGFuZ2VQYXNzd29yZE1vZGFsKHVzZXIpO1xuICAgIH0pO1xuXG4gICAgc2lnbk91dEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICAgIG9wZW5TaWduT3V0TW9kYWwoKTtcbiAgICB9KTtcblxuICAgIGRlbGV0ZVVzZXJCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBldmVudCA9PiB7XG4gICAgICBvcGVuRGVsZXRlQWNjb3VudE1vZGFsKHVzZXIpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4vcmVnaXN0ZXIuaHRtbCc7XG4gIH1cbn0pO1xuIl0sImZpbGUiOiJ1c2VyL2FjY291bnQuanMifQ==
