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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ1c2VyL21vZGFscy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXBwIGZyb20gJy4uL3V0aWxzL2ZpcmViYXNlLmpzJztcbmltcG9ydCB7IHZhbGlkYXRpb25FbWFpbCwgdmFsaWRhdGlvblBhc3N3b3JkIH0gZnJvbSAnLi92YWxpZGF0aW9uLmpzJztcbmltcG9ydCB7IGdldEF1dGgsIHNlbmRQYXNzd29yZFJlc2V0RW1haWwsIEVtYWlsQXV0aFByb3ZpZGVyLCByZWF1dGhlbnRpY2F0ZVdpdGhDcmVkZW50aWFsLCBkZWxldGVVc2VyLCBzaWduT3V0LCB1cGRhdGVQYXNzd29yZCwgdmVyaWZ5QmVmb3JlVXBkYXRlRW1haWwsIHNlbmRFbWFpbFZlcmlmaWNhdGlvbiB9IGZyb20gJ2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2ZpcmViYXNlanMvOS4xLjEvZmlyZWJhc2UtYXV0aC5qcyc7XG5pbXBvcnQgeyBzaG93SGlkZVBhc3N3b3JkLCBwbGFjZWhvbGRlciwgd2l0aG91dFNwYWNlIH0gZnJvbSAnLi4vdXRpbHMvaW5wdXQuanMnO1xuY29uc3QgYXV0aCA9IGdldEF1dGgoYXBwKTtcblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5SZXNldFBhc3N3b3JkTW9kYWwoKSB7XG4gIGNvbnN0IGNsb3NlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IGxvYWRlckJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgY29uc3QgZGFya0JhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gIGNvbnN0IGVtYWlsSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICBjb25zdCBlbWFpbEVycm9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBjb25zdCBjb25maXJtQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cbiAgbGV0IHNlbmRBZ2FpbiA9IG51bGw7XG5cbiAgY2xvc2VCdG4uY2xhc3NMaXN0LmFkZCgnY2xvc2UtbW9kYWwtYnRuJyk7XG4gIGRhcmtCYWNrZ3JvdW5kLmNsYXNzTGlzdC5hZGQoJ2RhcmstYmFja2dyb3VuZCcpO1xuICBtb2RhbC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsJyk7XG4gIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX3RpdGxlJyk7XG4gIGxhYmVsLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2xhYmVsJyk7XG4gIGVtYWlsSW5wdXQuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9faW5wdXQnKTtcbiAgZW1haWxFcnJvci5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xuICBjb25maXJtQnRuLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2J0bicpO1xuICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ21lc3NhZ2UnKTtcblxuICB0aXRsZS50ZXh0Q29udGVudCA9ICfQodCx0YDQvtGBINC/0LDRgNC+0LvRjyc7XG4gIGNvbmZpcm1CdG4udGV4dENvbnRlbnQgPSAn0J7RgtC/0YDQsNCy0LjRgtGMINC/0LjRgdGM0LzQvic7XG5cbiAgZW1haWxJbnB1dC50eXBlID0gJ3RleHQnO1xuXG4gIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuXG4gIGxhYmVsLmFwcGVuZChlbWFpbElucHV0KTtcbiAgbGFiZWwuYXBwZW5kKGVtYWlsRXJyb3IpO1xuICBtb2RhbC5hcHBlbmQoY2xvc2VCdG4pO1xuICBtb2RhbC5hcHBlbmQodGl0bGUpO1xuICBtb2RhbC5hcHBlbmQobGFiZWwpO1xuICBtb2RhbC5hcHBlbmQoY29uZmlybUJ0bik7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGRhcmtCYWNrZ3JvdW5kKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQobW9kYWwpO1xuXG4gIHBsYWNlaG9sZGVyKGVtYWlsSW5wdXQsICfQktCy0LXQtNC40YLQtSDQv9C+0YfRgtGDJyk7XG5cbiAgbW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XG4gICAgd2l0aG91dFNwYWNlKGV2ZW50LnRhcmdldCk7XG4gIH0pO1xuXG4gIGVtYWlsSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBhc3luYyBldmVudCA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHZhbGlkYXRpb25FbWFpbChlbWFpbElucHV0LnZhbHVlLnRyaW0oKSk7XG4gICAgICBhd2FpdCBzZW5kUGFzc3dvcmRSZXNldEVtYWlsKGF1dGgsIGVtYWlsSW5wdXQudmFsdWUudHJpbSgpKTtcbiAgICAgIGVtYWlsRXJyb3IudGV4dENvbnRlbnQgPSAnJztcbiAgICAgIGVtYWlsSW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnYWNjb3VudC1tb2RhbF9faW5wdXQtLWVycm9yJyk7XG4gICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gZmFsc2U7XG5cbiAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICBlbWFpbEVycm9yLnRleHRDb250ZW50ID0gZXJyb3IubWVzc2FnZTtcbiAgICAgIGVtYWlsSW5wdXQuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9faW5wdXQtLWVycm9yJyk7XG4gICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgIG1vZGFsLnJlbW92ZSgpO1xuICAgIGRhcmtCYWNrZ3JvdW5kLnJlbW92ZSgpO1xuICB9KTtcblxuICBjb25maXJtQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZXZlbnQgPT4ge1xuICAgIGNsZWFySW50ZXJ2YWwoc2VuZEFnYWluKTtcblxuICAgIHRyeSB7XG4gICAgICBjb25maXJtQnRuLmFwcGVuZChsb2FkZXJCdG4pO1xuICAgICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICAgIGF3YWl0IHNlbmRQYXNzd29yZFJlc2V0RW1haWwoYXV0aCwgZW1haWxJbnB1dC52YWx1ZS50cmltKCkpO1xuXG4gICAgICBsb2FkZXJCdG4ucmVtb3ZlKCk7XG4gICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9Cd0LAg0LLQsNGI0YMg0Y3Qu9C10LrRgtGA0L7QvdC90YPRjiDQv9C+0YfRgtGDINC+0YLQv9GA0LDQstC70LXQvdC+INC/0LjRgdGM0LzQviDRgdC+INGB0LHRgNC+0YHQvtC8INC/0LDRgNC+0LvRjy4nO1xuICAgICAgY29uZmlybUJ0bi5hZnRlcihtZXNzYWdlKTtcblxuICAgICAgc2VuZEFnYWluID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAnJztcbiAgICAgIH0sIDUwMDApO1xuXG5cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQp9GC0L4t0YLQviDQv9C+0YjQu9C+INC90LUg0YLQsNC6Li4uJztcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3BlbkRlbGV0ZUFjY291bnRNb2RhbCh1c2VyKSB7XG4gIGNvbnN0IGRhcmtCYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgY29uc3QgcGFzc3dvcmRJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgY29uc3QgY2xvc2VCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgY29uZmlybUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBjb25zdCBmb3Jnb3RQYXNzd29yZEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBjb25zdCBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXG4gIGRhcmtCYWNrZ3JvdW5kLmNsYXNzTGlzdC5hZGQoJ2RhcmstYmFja2dyb3VuZCcpO1xuICBtb2RhbC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsJyk7XG4gIGxhYmVsLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2xhYmVsJyk7XG4gIHBhc3N3b3JkSW5wdXQuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9faW5wdXQnKTtcbiAgdGl0bGUuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fdGl0bGUnKTtcbiAgZm9yZ290UGFzc3dvcmRCdG4uY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fZGVzY3ItYnRuJyk7XG4gIGNsb3NlQnRuLmNsYXNzTGlzdC5hZGQoJ2Nsb3NlLW1vZGFsLWJ0bicpO1xuICBjb25maXJtQnRuLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2J0bicsICdhY2NvdW50LW1vZGFsX19idG4tLXJlZCcpO1xuICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG5cbiAgcGFzc3dvcmRJbnB1dC50eXBlID0gJ3Bhc3N3b3JkJztcbiAgdGl0bGUudGV4dENvbnRlbnQgPSAn0KPQtNCw0LvQtdC90LjQtSDQsNC60LrQsNGD0L3RgtCwJztcbiAgY29uZmlybUJ0bi50ZXh0Q29udGVudCA9ICfQo9C00LDQu9C40YLRjCDQsNC60LrQsNGD0L3Rgic7XG4gIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuICBmb3Jnb3RQYXNzd29yZEJ0bi50ZXh0Q29udGVudCA9ICfQryDQt9Cw0LHRi9C7INC/0LDRgNC+0LvRjCc7XG5cbiAgbGFiZWwuYXBwZW5kKHBhc3N3b3JkSW5wdXQpO1xuICBtb2RhbC5hcHBlbmQoY2xvc2VCdG4pO1xuICBtb2RhbC5hcHBlbmQodGl0bGUpO1xuICBtb2RhbC5hcHBlbmQobGFiZWwpO1xuICBtb2RhbC5hcHBlbmQoZm9yZ290UGFzc3dvcmRCdG4pO1xuICBtb2RhbC5hcHBlbmQoY29uZmlybUJ0bik7XG4gIG1vZGFsLmFwcGVuZChtZXNzYWdlKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZGFya0JhY2tncm91bmQpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChtb2RhbCk7XG5cbiAgcGxhY2Vob2xkZXIocGFzc3dvcmRJbnB1dCwgJ9CS0LLQtdC00LjRgtC1INC/0LDRgNC+0LvRjCcpO1xuICBzaG93SGlkZVBhc3N3b3JkKHBhc3N3b3JkSW5wdXQpO1xuXG4gIG1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xuICAgIHdpdGhvdXRTcGFjZShldmVudC50YXJnZXQpO1xuICB9KTtcblxuICBwYXNzd29yZElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xuICAgIGlmIChldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlID09PSAnJykge1xuICAgICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBwYXNzd29yZElucHV0LmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2lucHV0LS1lcnJvcicpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICBwYXNzd29yZElucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjY291bnQtbW9kYWxfX2lucHV0LS1lcnJvcicpO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uZmlybUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGV2ZW50ID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY3JlZGVudGlhbCA9IEVtYWlsQXV0aFByb3ZpZGVyLmNyZWRlbnRpYWwodXNlci5lbWFpbCwgcGFzc3dvcmRJbnB1dC52YWx1ZS50cmltKCkpO1xuICAgICAgYXdhaXQgcmVhdXRoZW50aWNhdGVXaXRoQ3JlZGVudGlhbCh1c2VyLCBjcmVkZW50aWFsKTtcbiAgICAgIGF3YWl0IGRlbGV0ZVVzZXIodXNlcik7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0JLQstC10LTRkdC9INC90LXQstC10YDQvdGL0Lkg0L/QsNGA0L7Qu9GMLic7XG4gICAgfVxuICB9KTtcblxuICBmb3Jnb3RQYXNzd29yZEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcbiAgICBvcGVuUmVzZXRQYXNzd29yZE1vZGFsKCk7XG4gIH0pO1xuXG4gIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgIG1vZGFsLnJlbW92ZSgpO1xuICAgIGRhcmtCYWNrZ3JvdW5kLnJlbW92ZSgpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5TaWduT3V0TW9kYWwoKSB7XG4gIGNvbnN0IGRhcmtCYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgY29uc3QgY2xvc2VCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgY29uZmlybUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXG4gIGRhcmtCYWNrZ3JvdW5kLmNsYXNzTGlzdC5hZGQoJ2RhcmstYmFja2dyb3VuZCcpO1xuICBtb2RhbC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsJyk7XG4gIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX3RpdGxlJyk7XG4gIGNsb3NlQnRuLmNsYXNzTGlzdC5hZGQoJ2Nsb3NlLW1vZGFsLWJ0bicpO1xuICBjb25maXJtQnRuLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2J0bicsICdhY2NvdW50LW1vZGFsX19idG4tLXJlZCcpO1xuXG4gIHRpdGxlLnRleHRDb250ZW50ID0gJ9CS0YvQudGC0Lgg0YEg0LDQutC60LDRg9C90YLQsD8nO1xuICBjb25maXJtQnRuLnRleHRDb250ZW50ID0gJ9CS0YvQudGC0LgnO1xuXG4gIG1vZGFsLmFwcGVuZChjbG9zZUJ0bik7XG4gIG1vZGFsLmFwcGVuZCh0aXRsZSk7XG4gIG1vZGFsLmFwcGVuZChjb25maXJtQnRuKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZGFya0JhY2tncm91bmQpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChtb2RhbCk7XG5cbiAgbW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XG4gICAgd2l0aG91dFNwYWNlKGV2ZW50LnRhcmdldCk7XG4gIH0pO1xuXG4gIGNvbmZpcm1CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgc2lnbk91dChhdXRoKTtcbiAgfSk7XG5cbiAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgbW9kYWwucmVtb3ZlKCk7XG4gICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3BlbkNoYW5nZVBhc3N3b3JkTW9kYWwodXNlcikge1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCBkYXJrQmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCBjdXJyZW50UGFzc3dvcmRJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gIGNvbnN0IG5ld1Bhc3N3b3JkSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICBjb25zdCBjb25maXJtQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IGNsb3NlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IGZvcmdvdFBhc3N3b3JkQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IGN1cnJlbnRQYXNzd29yZExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgY29uc3QgbmV3UGFzc3dvcmRMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gIGNvbnN0IG5ld1Bhc3N3b3JkRXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIGNvbnN0IG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cbiAgY3VycmVudFBhc3N3b3JkSW5wdXQudHlwZSA9ICdwYXNzd29yZCc7XG4gIG5ld1Bhc3N3b3JkSW5wdXQudHlwZSA9ICdwYXNzd29yZCc7XG4gIGNvbmZpcm1CdG4udGV4dENvbnRlbnQgPSAn0KHQvNC10L3QuNGC0YwnO1xuICBmb3Jnb3RQYXNzd29yZEJ0bi50ZXh0Q29udGVudCA9ICfQryDQt9Cw0LHRi9C7INC/0LDRgNC+0LvRjCc7XG5cbiAgZGFya0JhY2tncm91bmQuY2xhc3NMaXN0LmFkZCgnZGFyay1iYWNrZ3JvdW5kJyk7XG4gIG1vZGFsLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWwnKTtcbiAgY3VycmVudFBhc3N3b3JkTGFiZWwuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fbGFiZWwnKTtcbiAgbmV3UGFzc3dvcmRMYWJlbC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19sYWJlbCcpO1xuICBjdXJyZW50UGFzc3dvcmRJbnB1dC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19pbnB1dCcpO1xuICBuZXdQYXNzd29yZElucHV0LmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2lucHV0Jyk7XG4gIGNvbmZpcm1CdG4uY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fYnRuJyk7XG4gIGNsb3NlQnRuLmNsYXNzTGlzdC5hZGQoJ2Nsb3NlLW1vZGFsLWJ0bicpO1xuICBmb3Jnb3RQYXNzd29yZEJ0bi5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19kZXNjci1idG4nKTtcbiAgbmV3UGFzc3dvcmRFcnJvci5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xuXG4gIG1vZGFsLnN0eWxlLmJvcmRlckJvdHRvbSA9ICdub25lJztcbiAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgY3VycmVudFBhc3N3b3JkTGFiZWwuYXBwZW5kKGN1cnJlbnRQYXNzd29yZElucHV0KTtcbiAgbmV3UGFzc3dvcmRMYWJlbC5hcHBlbmQobmV3UGFzc3dvcmRJbnB1dCk7XG4gIG5ld1Bhc3N3b3JkTGFiZWwuYXBwZW5kKG5ld1Bhc3N3b3JkRXJyb3IpO1xuICBtb2RhbC5hcHBlbmQoY2xvc2VCdG4pO1xuICBtb2RhbC5hcHBlbmQoY3VycmVudFBhc3N3b3JkTGFiZWwpO1xuICBtb2RhbC5hcHBlbmQobmV3UGFzc3dvcmRMYWJlbCk7XG4gIG1vZGFsLmFwcGVuZChmb3Jnb3RQYXNzd29yZEJ0bik7XG4gIG1vZGFsLmFwcGVuZChjb25maXJtQnRuKTtcbiAgbW9kYWwuYXBwZW5kKG1lc3NhZ2UpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChkYXJrQmFja2dyb3VuZCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKG1vZGFsKTtcblxuICBwbGFjZWhvbGRlcihjdXJyZW50UGFzc3dvcmRJbnB1dCwgJ9CS0LLQtdC00LjRgtC1INGB0YLQsNGA0YvQuSDQv9Cw0YDQvtC70YwnKTtcbiAgcGxhY2Vob2xkZXIobmV3UGFzc3dvcmRJbnB1dCwgJ9CS0LLQtdC00LjRgtC1INC90L7QstGL0Lkg0L/QsNGA0L7Qu9GMJyk7XG4gIHNob3dIaWRlUGFzc3dvcmQoY3VycmVudFBhc3N3b3JkSW5wdXQpO1xuICBzaG93SGlkZVBhc3N3b3JkKG5ld1Bhc3N3b3JkSW5wdXQpO1xuXG4gIG1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xuICAgIHdpdGhvdXRTcGFjZShldmVudC50YXJnZXQpO1xuICAgIHRyeSB7XG4gICAgICB2YWxpZGF0aW9uUGFzc3dvcmQobmV3UGFzc3dvcmRJbnB1dC52YWx1ZS50cmltKCkpO1xuICAgICAgaWYgKGN1cnJlbnRQYXNzd29yZElucHV0LnZhbHVlICE9PSAnJykge1xuICAgICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICBuZXdQYXNzd29yZElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xuICAgIHRyeSB7XG4gICAgICB2YWxpZGF0aW9uUGFzc3dvcmQoZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZS50cmltKCkpO1xuICAgICAgbmV3UGFzc3dvcmRFcnJvci50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgbmV3UGFzc3dvcmRJbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdhY2NvdW50LW1vZGFsX19pbnB1dC0tZXJyb3InKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbmV3UGFzc3dvcmRFcnJvci50ZXh0Q29udGVudCA9IGVycm9yLm1lc3NhZ2U7XG4gICAgICBuZXdQYXNzd29yZElucHV0LmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2lucHV0LS1lcnJvcicpO1xuICAgIH1cbiAgfSk7XG5cbiAgZm9yZ290UGFzc3dvcmRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgbW9kYWwucmVtb3ZlKCk7XG4gICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XG4gICAgb3BlblJlc2V0UGFzc3dvcmRNb2RhbCgpO1xuICB9KTtcblxuICBjb25maXJtQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZXZlbnQgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjcmVkZW50aWFsID0gRW1haWxBdXRoUHJvdmlkZXIuY3JlZGVudGlhbCh1c2VyLmVtYWlsLCBjdXJyZW50UGFzc3dvcmRJbnB1dC52YWx1ZS50cmltKCkpO1xuICAgICAgYXdhaXQgcmVhdXRoZW50aWNhdGVXaXRoQ3JlZGVudGlhbCh1c2VyLCBjcmVkZW50aWFsKTtcbiAgICAgIGF3YWl0IHVwZGF0ZVBhc3N3b3JkKHVzZXIsIG5ld1Bhc3N3b3JkSW5wdXQudmFsdWUpO1xuICAgICAgbWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvcicpO1xuICAgICAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdtZXNzYWdlJyk7XG4gICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9Cf0LDRgNC+0LvRjCDQsdGL0Lsg0LjQt9C80LXQvdGR0L0uJztcbiAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ21lc3NhZ2UnKTtcbiAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcbiAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0JLQstC10LTRkdC9INC90LXQstC10YDQvdGL0Lkg0L/QsNGA0L7Qu9GMLic7XG4gICAgfVxuICB9KTtcblxuICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuQ2hhbmdlRW1haWxNb2RhbCh1c2VyKSB7XG4gIGNvbnN0IGRhcmtCYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IG5ld0VtYWlsTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICBjb25zdCBwYXNzd29yZExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgY29uc3QgbmV3RW1haWxJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gIGNvbnN0IHBhc3N3b3JkSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICBjb25zdCBjb25maXJtQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IGZvcmdvdFBhc3N3b3JkQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IGNsb3NlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IG5ld0VtYWlsRXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIGNvbnN0IG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cbiAgbGV0IGNoZWNrVXBkYXRlRW1haWwgPSBudWxsO1xuXG4gIGRhcmtCYWNrZ3JvdW5kLmNsYXNzTGlzdC5hZGQoJ2RhcmstYmFja2dyb3VuZCcpO1xuICBtb2RhbC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsJyk7XG4gIG5ld0VtYWlsTGFiZWwuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fbGFiZWwnKTtcbiAgcGFzc3dvcmRMYWJlbC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19sYWJlbCcpO1xuICBuZXdFbWFpbElucHV0LmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2lucHV0Jyk7XG4gIHBhc3N3b3JkSW5wdXQuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9faW5wdXQnKTtcbiAgZm9yZ290UGFzc3dvcmRCdG4uY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fZGVzY3ItYnRuJyk7XG4gIGNvbmZpcm1CdG4uY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fYnRuJyk7XG4gIGNsb3NlQnRuLmNsYXNzTGlzdC5hZGQoJ2Nsb3NlLW1vZGFsLWJ0bicpO1xuICBuZXdFbWFpbEVycm9yLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG5cbiAgbmV3RW1haWxJbnB1dC50eXBlID0gJ3RleHQnO1xuICBwYXNzd29yZElucHV0LnR5cGUgPSAncGFzc3dvcmQnO1xuICBmb3Jnb3RQYXNzd29yZEJ0bi50ZXh0Q29udGVudCA9ICfQryDQt9Cw0LHRi9C7INC/0LDRgNC+0LvRjCc7XG4gIGNvbmZpcm1CdG4udGV4dENvbnRlbnQgPSAn0KHQvNC10L3QuNGC0YwnO1xuICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcblxuICBuZXdFbWFpbExhYmVsLmFwcGVuZChuZXdFbWFpbElucHV0KTtcbiAgbmV3RW1haWxMYWJlbC5hcHBlbmQobmV3RW1haWxFcnJvcik7XG4gIHBhc3N3b3JkTGFiZWwuYXBwZW5kKHBhc3N3b3JkSW5wdXQpO1xuICBtb2RhbC5hcHBlbmQobmV3RW1haWxMYWJlbCk7XG4gIG1vZGFsLmFwcGVuZChwYXNzd29yZExhYmVsKTtcbiAgbW9kYWwuYXBwZW5kKGZvcmdvdFBhc3N3b3JkQnRuKTtcbiAgbW9kYWwuYXBwZW5kKGNvbmZpcm1CdG4pO1xuICBtb2RhbC5hcHBlbmQobWVzc2FnZSk7XG4gIG1vZGFsLmFwcGVuZChjbG9zZUJ0bik7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGRhcmtCYWNrZ3JvdW5kKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQobW9kYWwpO1xuXG4gIHNob3dIaWRlUGFzc3dvcmQocGFzc3dvcmRJbnB1dCk7XG5cbiAgcGxhY2Vob2xkZXIobmV3RW1haWxJbnB1dCwgJ9CS0LLQtdC00LjRgtC1INC90L7QstGD0Y4g0L/QvtGH0YLRgycpO1xuICBwbGFjZWhvbGRlcihwYXNzd29yZElucHV0LCAn0JLQstC10LTQuNGC0LUg0L/QsNGA0L7Qu9GMJyk7XG5cbiAgbW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XG4gICAgd2l0aG91dFNwYWNlKGV2ZW50LnRhcmdldCk7XG4gICAgdHJ5IHtcbiAgICAgIHZhbGlkYXRpb25FbWFpbChuZXdFbWFpbElucHV0LnZhbHVlLnRyaW0oKSk7XG4gICAgICBpZiAocGFzc3dvcmRJbnB1dC52YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgZm9yZ290UGFzc3dvcmRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgbW9kYWwucmVtb3ZlKCk7XG4gICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XG4gICAgb3BlblJlc2V0UGFzc3dvcmRNb2RhbCgpO1xuICB9KTtcblxuICBuZXdFbWFpbElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xuICAgIHRyeSB7XG4gICAgICB2YWxpZGF0aW9uRW1haWwoZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZS50cmltKCkpO1xuICAgICAgbmV3RW1haWxFcnJvci50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgbmV3RW1haWxJbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdhY2NvdW50LW1vZGFsX19pbnB1dC0tZXJyb3InKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbmV3RW1haWxFcnJvci50ZXh0Q29udGVudCA9IGVycm9yLm1lc3NhZ2U7XG4gICAgICBuZXdFbWFpbElucHV0LmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2lucHV0LS1lcnJvcicpO1xuICAgIH1cbiAgfSk7XG5cbiAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgbW9kYWwucmVtb3ZlKCk7XG4gICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XG4gIH0pO1xuXG4gIGNvbmZpcm1CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBldmVudCA9PiB7XG4gICAgY2xlYXJJbnRlcnZhbChjaGVja1VwZGF0ZUVtYWlsKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY3JlZGVudGlhbCA9IEVtYWlsQXV0aFByb3ZpZGVyLmNyZWRlbnRpYWwodXNlci5lbWFpbCwgY3VycmVudFBhc3N3b3JkSW5wdXQudmFsdWUudHJpbSgpKTtcbiAgICAgIGF3YWl0IHJlYXV0aGVudGljYXRlV2l0aENyZWRlbnRpYWwodXNlciwgY3JlZGVudGlhbCk7XG4gICAgICBhd2FpdCB2ZXJpZnlCZWZvcmVVcGRhdGVFbWFpbCh1c2VyLCBuZXdFbWFpbElucHV0LnZhbHVlLnRyaW0oKSk7XG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2Vycm9yJyk7XG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ21lc3NhZ2UnKTtcbiAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0J3QsCDQstCw0YjRgyDRjdC70LXQutGC0YDQvtC90L3Rg9GOINC/0L7Rh9GC0YMg0L7RgtC/0YDQsNCy0LvQtdC90L4g0L/QuNGB0YzQvNC+INGBINC/0L7QtNGC0LLQtdGA0LbQtNC10L3QuNC10LwuJztcbiAgICAgIGNoZWNrVXBkYXRlRW1haWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIHVzZXIucmVsb2FkKCk7XG4gICAgICB9LCAxMDAwKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdtZXNzYWdlJyk7XG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG4gICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9CS0LLQtdC00LXQvSDQvdC10LLQtdGA0L3Ri9C5INC/0LDRgNC+0LvRjC4nO1xuICAgIH1cbiAgfSk7XG59XG4iXSwiZmlsZSI6InVzZXIvbW9kYWxzLmpzIn0=
