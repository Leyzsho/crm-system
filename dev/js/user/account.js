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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ1c2VyL2FjY291bnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFwcCBmcm9tICcuLi91dGlscy9maXJlYmFzZS1pbml0LmpzJztcclxuaW1wb3J0IHsgZ2V0QXV0aCwgb25BdXRoU3RhdGVDaGFuZ2VkIH0gZnJvbSAnaHR0cHM6Ly93d3cuZ3N0YXRpYy5jb20vZmlyZWJhc2Vqcy85LjEuMS9maXJlYmFzZS1hdXRoLmpzJztcclxuaW1wb3J0IHsgb3BlbkNoYW5nZUVtYWlsTW9kYWwsIG9wZW5DaGFuZ2VQYXNzd29yZE1vZGFsLCBvcGVuRGVsZXRlQWNjb3VudE1vZGFsLCBvcGVuU2lnbk91dE1vZGFsIH0gZnJvbSAnLi9tb2RhbHMuanMnO1xyXG5jb25zdCBhdXRoID0gZ2V0QXV0aChhcHApO1xyXG5cclxub25BdXRoU3RhdGVDaGFuZ2VkKGF1dGgsIGFzeW5jICh1c2VyKSA9PiB7XHJcbiAgaWYgKHVzZXIgJiYgdXNlci5lbWFpbFZlcmlmaWVkKSB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZGVyJykucmVtb3ZlKCk7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFpbicpLmNsYXNzTGlzdC5yZW1vdmUoJ21haW4tLWhpZGRlbicpO1xyXG5cclxuICAgIGNvbnN0IGN1cnJlbnRFbWFpbCA9IHVzZXIuZW1haWw7XHJcbiAgICBjb25zdCBhY2NvdW50Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFjY291bnQnKTtcclxuICAgIGNvbnN0IGFjY291bnRFbWFpbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhY2NvdW50LWVtYWlsJyk7XHJcblxyXG4gICAgY29uc3QgY2hhbmdlRW1haWxCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhbmdlLWVtYWlsJyk7XHJcbiAgICBjb25zdCBzaWduT3V0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZ24tb3V0Jyk7XHJcbiAgICBjb25zdCBjaGFuZ2VQYXNzd29yZEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGFuZ2UtcGFzc3dvcmQnKTtcclxuICAgIGNvbnN0IGRlbGV0ZVVzZXJCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVsZXRlLWFjY291bnQnKTtcclxuXHJcbiAgICBhY2NvdW50Q29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjY291bnQtLWhpZGRlbicpO1xyXG4gICAgYWNjb3VudEVtYWlsLnRleHRDb250ZW50ID0gYGVtYWlsOiAke2N1cnJlbnRFbWFpbH1gO1xyXG5cclxuICAgIGNoYW5nZUVtYWlsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgICBvcGVuQ2hhbmdlRW1haWxNb2RhbCh1c2VyKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNoYW5nZVBhc3N3b3JkQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgICBvcGVuQ2hhbmdlUGFzc3dvcmRNb2RhbCh1c2VyKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHNpZ25PdXRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAgIG9wZW5TaWduT3V0TW9kYWwoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlbGV0ZVVzZXJCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBldmVudCA9PiB7XHJcbiAgICAgIG9wZW5EZWxldGVBY2NvdW50TW9kYWwodXNlcik7XHJcbiAgICB9KTtcclxuICB9IGVsc2Uge1xyXG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi9yZWdpc3Rlci5odG1sJztcclxuICB9XHJcbn0pO1xyXG4iXSwiZmlsZSI6InVzZXIvYWNjb3VudC5qcyJ9
