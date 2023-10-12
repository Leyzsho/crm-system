import app from '../utils/firebase.js';
import { validationEmail, validationPassword } from './validation.js';
import { getAuth, sendPasswordResetEmail, EmailAuthProvider, reauthenticateWithCredential, deleteUser, signOut, updatePassword, verifyBeforeUpdateEmail, sendEmailVerification } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';
import { showHidePassword, placeholder, withoutSpace } from '../utils/input.js';
const auth = getAuth(app);

export function openResetPasswordModal() {
  const closeBtn = document.createElement('button');
  const loaderBtn = document.createElement('span');
  const darkBackground = document.createElement('div');
  const modal = document.createElement('div');
  const title = document.createElement('h2');
  const label = document.createElement('label');
  const emailInput = document.createElement('input');
  const emailError = document.createElement('p');
  const confirmBtn = document.createElement('button');
  const message = document.createElement('p');

  let sendAgain = null;

  closeBtn.classList.add('close-modal-btn');
  darkBackground.classList.add('dark-background');
  modal.classList.add('account-modal');
  title.classList.add('account-modal__title');
  label.classList.add('account-modal__label');
  emailInput.classList.add('account-modal__input');
  emailError.classList.add('error');
  confirmBtn.classList.add('account-modal__btn');
  message.classList.add('message');

  title.textContent = 'Сброс пароля';
  confirmBtn.textContent = 'Отправить письмо';

  emailInput.type = 'text';

  confirmBtn.disabled = true;

  label.append(emailInput);
  label.append(emailError);
  modal.append(closeBtn);
  modal.append(title);
  modal.append(label);
  modal.append(confirmBtn);
  document.body.append(darkBackground);
  document.body.append(modal);

  placeholder(emailInput, 'Введите почту');

  modal.addEventListener('input', event => {
    withoutSpace(event.target);
  });

  emailInput.addEventListener('input', async event => {
    try {
      validationEmail(emailInput.value.trim());
      await sendPasswordResetEmail(auth, emailInput.value.trim());
      emailError.textContent = '';
      emailInput.classList.remove('account-modal__input--error');
      confirmBtn.disabled = false;

    } catch(error) {
      emailError.textContent = error.message;
      emailInput.classList.add('account-modal__input--error');
      confirmBtn.disabled = true;
    }
  });

  closeBtn.addEventListener('click', event => {
    modal.remove();
    darkBackground.remove();
  });

  confirmBtn.addEventListener('click', async event => {
    clearInterval(sendAgain);

    try {
      confirmBtn.append(loaderBtn);
      confirmBtn.disabled = true;

      await sendPasswordResetEmail(auth, emailInput.value.trim());

      loaderBtn.remove();
      message.textContent = 'На вашу электронную почту отправлено письмо со сбросом пароля.';
      confirmBtn.after(message);

      sendAgain = setInterval(() => {
        confirmBtn.disabled = false;
        message.textContent = '';
      }, 5000);


    } catch (error) {
      message.textContent = 'Что-то пошло не так...';
    }
  });
}

export function openDeleteAccountModal(user) {
  const darkBackground = document.createElement('div');
  const modal = document.createElement('div');
  const label = document.createElement('label');
  const passwordInput = document.createElement('input');
  const title = document.createElement('h2');
  const closeBtn = document.createElement('button');
  const confirmBtn = document.createElement('button');
  const forgotPasswordBtn = document.createElement('button');
  const message = document.createElement('p');

  darkBackground.classList.add('dark-background');
  modal.classList.add('account-modal');
  label.classList.add('account-modal__label');
  passwordInput.classList.add('account-modal__input');
  title.classList.add('account-modal__title');
  forgotPasswordBtn.classList.add('account-modal__descr-btn');
  closeBtn.classList.add('close-modal-btn');
  confirmBtn.classList.add('account-modal__btn', 'account-modal__btn--red');
  message.classList.add('error');

  passwordInput.type = 'password';
  title.textContent = 'Удаление аккаунта';
  confirmBtn.textContent = 'Удалить аккаунт';
  confirmBtn.disabled = true;
  forgotPasswordBtn.textContent = 'Я забыл пароль';

  label.append(passwordInput);
  modal.append(closeBtn);
  modal.append(title);
  modal.append(label);
  modal.append(forgotPasswordBtn);
  modal.append(confirmBtn);
  modal.append(message);
  document.body.append(darkBackground);
  document.body.append(modal);

  placeholder(passwordInput, 'Введите пароль');
  showHidePassword(passwordInput);

  modal.addEventListener('input', event => {
    withoutSpace(event.target);
  });

  passwordInput.addEventListener('input', event => {
    if (event.currentTarget.value === '') {
      confirmBtn.disabled = true;
      passwordInput.classList.add('account-modal__input--error');
    } else {
      confirmBtn.disabled = false;
      passwordInput.classList.remove('account-modal__input--error');
    }
  });

  confirmBtn.addEventListener('click', async event => {
    try {
      const credential = EmailAuthProvider.credential(user.email, passwordInput.value.trim());
      await reauthenticateWithCredential(user, credential);
      await deleteUser(user);
    } catch (error) {
      message.textContent = 'Введён неверный пароль.';
    }
  });

  forgotPasswordBtn.addEventListener('click', event => {
    modal.remove();
    darkBackground.remove();
    openResetPasswordModal();
  });

  closeBtn.addEventListener('click', event => {
    modal.remove();
    darkBackground.remove();
  });
}

export function openSignOutModal() {
  const darkBackground = document.createElement('div');
  const modal = document.createElement('div');
  const title = document.createElement('h2');
  const closeBtn = document.createElement('button');
  const confirmBtn = document.createElement('button');

  darkBackground.classList.add('dark-background');
  modal.classList.add('account-modal');
  title.classList.add('account-modal__title');
  closeBtn.classList.add('close-modal-btn');
  confirmBtn.classList.add('account-modal__btn', 'account-modal__btn--red');

  title.textContent = 'Выйти с аккаунта?';
  confirmBtn.textContent = 'Выйти';

  modal.append(closeBtn);
  modal.append(title);
  modal.append(confirmBtn);
  document.body.append(darkBackground);
  document.body.append(modal);

  modal.addEventListener('input', event => {
    withoutSpace(event.target);
  });

  confirmBtn.addEventListener('click', event => {
    signOut(auth);
  });

  closeBtn.addEventListener('click', event => {
    modal.remove();
    darkBackground.remove();
  });
}

export function openChangePasswordModal(user) {
  const modal = document.createElement('div');
  const darkBackground = document.createElement('div');
  const currentPasswordInput = document.createElement('input');
  const newPasswordInput = document.createElement('input');
  const confirmBtn = document.createElement('button');
  const closeBtn = document.createElement('button');
  const forgotPasswordBtn = document.createElement('button');
  const currentPasswordLabel = document.createElement('label');
  const newPasswordLabel = document.createElement('label');
  const newPasswordError = document.createElement('p');
  const message = document.createElement('p');

  currentPasswordInput.type = 'password';
  newPasswordInput.type = 'password';
  confirmBtn.textContent = 'Сменить';
  forgotPasswordBtn.textContent = 'Я забыл пароль';

  darkBackground.classList.add('dark-background');
  modal.classList.add('account-modal');
  currentPasswordLabel.classList.add('account-modal__label');
  newPasswordLabel.classList.add('account-modal__label');
  currentPasswordInput.classList.add('account-modal__input');
  newPasswordInput.classList.add('account-modal__input');
  confirmBtn.classList.add('account-modal__btn');
  closeBtn.classList.add('close-modal-btn');
  forgotPasswordBtn.classList.add('account-modal__descr-btn');
  newPasswordError.classList.add('error');

  modal.style.borderBottom = 'none';
  confirmBtn.disabled = true;

  currentPasswordLabel.append(currentPasswordInput);
  newPasswordLabel.append(newPasswordInput);
  newPasswordLabel.append(newPasswordError);
  modal.append(closeBtn);
  modal.append(currentPasswordLabel);
  modal.append(newPasswordLabel);
  modal.append(forgotPasswordBtn);
  modal.append(confirmBtn);
  modal.append(message);
  document.body.append(darkBackground);
  document.body.append(modal);

  placeholder(currentPasswordInput, 'Введите старый пароль');
  placeholder(newPasswordInput, 'Введите новый пароль');
  showHidePassword(currentPasswordInput);
  showHidePassword(newPasswordInput);

  modal.addEventListener('input', event => {
    withoutSpace(event.target);
    try {
      validationPassword(newPasswordInput.value.trim());
      if (currentPasswordInput.value !== '') {
        confirmBtn.disabled = false;
      } else {
        confirmBtn.disabled = true;
      }
    } catch (error) {
      confirmBtn.disabled = true;
    }
  });

  newPasswordInput.addEventListener('input', event => {
    try {
      validationPassword(event.currentTarget.value.trim());
      newPasswordError.textContent = '';
      newPasswordInput.classList.remove('account-modal__input--error');
    } catch (error) {
      newPasswordError.textContent = error.message;
      newPasswordInput.classList.add('account-modal__input--error');
    }
  });

  forgotPasswordBtn.addEventListener('click', event => {
    modal.remove();
    darkBackground.remove();
    openResetPasswordModal();
  });

  confirmBtn.addEventListener('click', async event => {
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPasswordInput.value.trim());
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPasswordInput.value);
      message.classList.remove('error');
      message.classList.add('message');
      message.textContent = 'Пароль был изменён.';
      confirmBtn.disabled = true;
    } catch (error) {
      message.classList.remove('message');
      message.classList.add('error');
      message.textContent = 'Введён неверный пароль.';
    }
  });

  closeBtn.addEventListener('click', event => {
    modal.remove();
    darkBackground.remove();
  });
}

export function openChangeEmailModal(user) {
  const darkBackground = document.createElement('div');
  const modal = document.createElement('div');
  const newEmailLabel = document.createElement('label');
  const passwordLabel = document.createElement('label');
  const newEmailInput = document.createElement('input');
  const passwordInput = document.createElement('input');
  const confirmBtn = document.createElement('button');
  const forgotPasswordBtn = document.createElement('button');
  const closeBtn = document.createElement('button');
  const newEmailError = document.createElement('p');
  const message = document.createElement('p');

  let checkUpdateEmail = null;

  darkBackground.classList.add('dark-background');
  modal.classList.add('account-modal');
  newEmailLabel.classList.add('account-modal__label');
  passwordLabel.classList.add('account-modal__label');
  newEmailInput.classList.add('account-modal__input');
  passwordInput.classList.add('account-modal__input');
  forgotPasswordBtn.classList.add('account-modal__descr-btn');
  confirmBtn.classList.add('account-modal__btn');
  closeBtn.classList.add('close-modal-btn');
  newEmailError.classList.add('error');

  newEmailInput.type = 'text';
  passwordInput.type = 'password';
  forgotPasswordBtn.textContent = 'Я забыл пароль';
  confirmBtn.textContent = 'Сменить';
  confirmBtn.disabled = true;

  newEmailLabel.append(newEmailInput);
  newEmailLabel.append(newEmailError);
  passwordLabel.append(passwordInput);
  modal.append(newEmailLabel);
  modal.append(passwordLabel);
  modal.append(forgotPasswordBtn);
  modal.append(confirmBtn);
  modal.append(message);
  modal.append(closeBtn);
  document.body.append(darkBackground);
  document.body.append(modal);

  showHidePassword(passwordInput);

  placeholder(newEmailInput, 'Введите новую почту');
  placeholder(passwordInput, 'Введите пароль');

  modal.addEventListener('input', event => {
    withoutSpace(event.target);
    try {
      validationEmail(newEmailInput.value.trim());
      if (passwordInput.value !== '') {
        confirmBtn.disabled = false;
      } else {
        confirmBtn.disabled = true;
      }
    } catch (error) {
      confirmBtn.disabled = true;
    }
  });

  forgotPasswordBtn.addEventListener('click', event => {
    modal.remove();
    darkBackground.remove();
    openResetPasswordModal();
  });

  newEmailInput.addEventListener('input', event => {
    try {
      validationEmail(event.currentTarget.value.trim());
      newEmailError.textContent = '';
      newEmailInput.classList.remove('account-modal__input--error');
    } catch (error) {
      newEmailError.textContent = error.message;
      newEmailInput.classList.add('account-modal__input--error');
    }
  });

  closeBtn.addEventListener('click', event => {
    modal.remove();
    darkBackground.remove();
  });

  confirmBtn.addEventListener('click', async event => {
    clearInterval(checkUpdateEmail);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPasswordInput.value.trim());
      await reauthenticateWithCredential(user, credential);
      await verifyBeforeUpdateEmail(user, newEmailInput.value.trim());
      message.classList.remove('error');
      message.classList.add('message');
      message.textContent = 'На вашу электронную почту отправлено письмо с подтверждением.';
      checkUpdateEmail = setInterval(() => {
        user.reload();
      }, 1000);
    } catch (error) {
      message.classList.remove('message');
      message.classList.add('error');
      message.textContent = 'Введен неверный пароль.';
    }
  });
}
