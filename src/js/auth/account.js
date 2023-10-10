import app from '../firebase.js';
import { getAuth, onAuthStateChanged, reauthenticateWithCredential, updateEmail, sendEmailVerification, EmailAuthProvider } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';
import { openChangePasswordModal, openDeleteAccountModal, openSignOutModal } from './modals.js';
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
      changeEmailBtn.disabled = true;
      const container = document.createElement('div');
      const newEmailInput = document.createElement('input');
      const currentPasswordInput = document.createElement('input');
      const confirmBtn = document.createElement('button');
      const cancelBtn = document.createElement('button');

      newEmailInput.type = 'email';
      newEmailInput.placeholder = 'Введите новый email';
      currentPasswordInput.type = 'password';
      currentPasswordInput.placeholder = 'Введите пароль';
      confirmBtn.textContent = 'Сменить';
      cancelBtn.textContent = 'Отменить';

      container.classList.add('account__change-data-container');
      newEmailInput.classList.add('account__input');
      currentPasswordInput.classList.add('account__input');
      confirmBtn.classList.add('account__btn', 'account__change-data-confirm-btn');
      cancelBtn.classList.add('account__btn', 'account__btn--red');

      container.append(newEmailInput);
      container.append(currentPasswordInput);
      container.append(confirmBtn);
      container.append(cancelBtn);
      changeEmailBtn.after(container);

      cancelBtn.addEventListener('click', event => {
        container.remove();
        changeEmailBtn.disabled = false;
      });

      confirmBtn.addEventListener('click', async event => {
        const credential = EmailAuthProvider.credential(currentEmail, currentPasswordInput.value.trim());

        try {
          await reauthenticateWithCredential(user, credential);

          await sendEmailVerification(user);

          if (user.isEmailVerified) {
            await updateEmail(user, newEmailInput.value.trim());

            accountEmail.textContent = `email: ${newEmailInput.value.trim()}`;
            changeEmailBtn.disabled = false;
            container.remove();
          } else {
            console.log('не подтверждена')
          }
        } catch (error) {
          console.log(error.message)
        }
      });
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

