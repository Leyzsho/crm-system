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
