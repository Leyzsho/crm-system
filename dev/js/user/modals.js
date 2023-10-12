import app from '../utils/firebase-init.js';
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ1c2VyL21vZGFscy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXBwIGZyb20gJy4uL3V0aWxzL2ZpcmViYXNlLWluaXQuanMnO1xuaW1wb3J0IHsgdmFsaWRhdGlvbkVtYWlsLCB2YWxpZGF0aW9uUGFzc3dvcmQgfSBmcm9tICcuL3ZhbGlkYXRpb24uanMnO1xuaW1wb3J0IHsgZ2V0QXV0aCwgc2VuZFBhc3N3b3JkUmVzZXRFbWFpbCwgRW1haWxBdXRoUHJvdmlkZXIsIHJlYXV0aGVudGljYXRlV2l0aENyZWRlbnRpYWwsIGRlbGV0ZVVzZXIsIHNpZ25PdXQsIHVwZGF0ZVBhc3N3b3JkLCB2ZXJpZnlCZWZvcmVVcGRhdGVFbWFpbCwgc2VuZEVtYWlsVmVyaWZpY2F0aW9uIH0gZnJvbSAnaHR0cHM6Ly93d3cuZ3N0YXRpYy5jb20vZmlyZWJhc2Vqcy85LjEuMS9maXJlYmFzZS1hdXRoLmpzJztcbmltcG9ydCB7IHNob3dIaWRlUGFzc3dvcmQsIHBsYWNlaG9sZGVyLCB3aXRob3V0U3BhY2UgfSBmcm9tICcuLi91dGlscy9pbnB1dC5qcyc7XG5jb25zdCBhdXRoID0gZ2V0QXV0aChhcHApO1xuXG5leHBvcnQgZnVuY3Rpb24gb3BlblJlc2V0UGFzc3dvcmRNb2RhbCgpIHtcbiAgY29uc3QgY2xvc2VCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgbG9hZGVyQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICBjb25zdCBkYXJrQmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgY29uc3QgZW1haWxJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gIGNvbnN0IGVtYWlsRXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIGNvbnN0IGNvbmZpcm1CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblxuICBsZXQgc2VuZEFnYWluID0gbnVsbDtcblxuICBjbG9zZUJ0bi5jbGFzc0xpc3QuYWRkKCdjbG9zZS1tb2RhbC1idG4nKTtcbiAgZGFya0JhY2tncm91bmQuY2xhc3NMaXN0LmFkZCgnZGFyay1iYWNrZ3JvdW5kJyk7XG4gIG1vZGFsLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWwnKTtcbiAgdGl0bGUuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fdGl0bGUnKTtcbiAgbGFiZWwuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fbGFiZWwnKTtcbiAgZW1haWxJbnB1dC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19pbnB1dCcpO1xuICBlbWFpbEVycm9yLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG4gIGNvbmZpcm1CdG4uY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fYnRuJyk7XG4gIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnbWVzc2FnZScpO1xuXG4gIHRpdGxlLnRleHRDb250ZW50ID0gJ9Ch0LHRgNC+0YEg0L/QsNGA0L7Qu9GPJztcbiAgY29uZmlybUJ0bi50ZXh0Q29udGVudCA9ICfQntGC0L/RgNCw0LLQuNGC0Ywg0L/QuNGB0YzQvNC+JztcblxuICBlbWFpbElucHV0LnR5cGUgPSAndGV4dCc7XG5cbiAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgbGFiZWwuYXBwZW5kKGVtYWlsSW5wdXQpO1xuICBsYWJlbC5hcHBlbmQoZW1haWxFcnJvcik7XG4gIG1vZGFsLmFwcGVuZChjbG9zZUJ0bik7XG4gIG1vZGFsLmFwcGVuZCh0aXRsZSk7XG4gIG1vZGFsLmFwcGVuZChsYWJlbCk7XG4gIG1vZGFsLmFwcGVuZChjb25maXJtQnRuKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZGFya0JhY2tncm91bmQpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChtb2RhbCk7XG5cbiAgcGxhY2Vob2xkZXIoZW1haWxJbnB1dCwgJ9CS0LLQtdC00LjRgtC1INC/0L7Rh9GC0YMnKTtcblxuICBtb2RhbC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGV2ZW50ID0+IHtcbiAgICB3aXRob3V0U3BhY2UoZXZlbnQudGFyZ2V0KTtcbiAgfSk7XG5cbiAgZW1haWxJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGFzeW5jIGV2ZW50ID0+IHtcbiAgICB0cnkge1xuICAgICAgdmFsaWRhdGlvbkVtYWlsKGVtYWlsSW5wdXQudmFsdWUudHJpbSgpKTtcbiAgICAgIGF3YWl0IHNlbmRQYXNzd29yZFJlc2V0RW1haWwoYXV0aCwgZW1haWxJbnB1dC52YWx1ZS50cmltKCkpO1xuICAgICAgZW1haWxFcnJvci50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgZW1haWxJbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdhY2NvdW50LW1vZGFsX19pbnB1dC0tZXJyb3InKTtcbiAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcblxuICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgIGVtYWlsRXJyb3IudGV4dENvbnRlbnQgPSBlcnJvci5tZXNzYWdlO1xuICAgICAgZW1haWxJbnB1dC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19pbnB1dC0tZXJyb3InKTtcbiAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgbW9kYWwucmVtb3ZlKCk7XG4gICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XG4gIH0pO1xuXG4gIGNvbmZpcm1CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBldmVudCA9PiB7XG4gICAgY2xlYXJJbnRlcnZhbChzZW5kQWdhaW4pO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbmZpcm1CdG4uYXBwZW5kKGxvYWRlckJ0bik7XG4gICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcblxuICAgICAgYXdhaXQgc2VuZFBhc3N3b3JkUmVzZXRFbWFpbChhdXRoLCBlbWFpbElucHV0LnZhbHVlLnRyaW0oKSk7XG5cbiAgICAgIGxvYWRlckJ0bi5yZW1vdmUoKTtcbiAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0J3QsCDQstCw0YjRgyDRjdC70LXQutGC0YDQvtC90L3Rg9GOINC/0L7Rh9GC0YMg0L7RgtC/0YDQsNCy0LvQtdC90L4g0L/QuNGB0YzQvNC+INGB0L4g0YHQsdGA0L7RgdC+0Lwg0L/QsNGA0L7Qu9GPLic7XG4gICAgICBjb25maXJtQnRuLmFmdGVyKG1lc3NhZ2UpO1xuXG4gICAgICBzZW5kQWdhaW4gPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgfSwgNTAwMCk7XG5cblxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9Cn0YLQvi3RgtC+INC/0L7RiNC70L4g0L3QtSDRgtCw0LouLi4nO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuRGVsZXRlQWNjb3VudE1vZGFsKHVzZXIpIHtcbiAgY29uc3QgZGFya0JhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICBjb25zdCBwYXNzd29yZElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICBjb25zdCBjbG9zZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBjb25zdCBjb25maXJtQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IGZvcmdvdFBhc3N3b3JkQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cbiAgZGFya0JhY2tncm91bmQuY2xhc3NMaXN0LmFkZCgnZGFyay1iYWNrZ3JvdW5kJyk7XG4gIG1vZGFsLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWwnKTtcbiAgbGFiZWwuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fbGFiZWwnKTtcbiAgcGFzc3dvcmRJbnB1dC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19pbnB1dCcpO1xuICB0aXRsZS5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX190aXRsZScpO1xuICBmb3Jnb3RQYXNzd29yZEJ0bi5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19kZXNjci1idG4nKTtcbiAgY2xvc2VCdG4uY2xhc3NMaXN0LmFkZCgnY2xvc2UtbW9kYWwtYnRuJyk7XG4gIGNvbmZpcm1CdG4uY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fYnRuJywgJ2FjY291bnQtbW9kYWxfX2J0bi0tcmVkJyk7XG4gIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcblxuICBwYXNzd29yZElucHV0LnR5cGUgPSAncGFzc3dvcmQnO1xuICB0aXRsZS50ZXh0Q29udGVudCA9ICfQo9C00LDQu9C10L3QuNC1INCw0LrQutCw0YPQvdGC0LAnO1xuICBjb25maXJtQnRuLnRleHRDb250ZW50ID0gJ9Cj0LTQsNC70LjRgtGMINCw0LrQutCw0YPQvdGCJztcbiAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gIGZvcmdvdFBhc3N3b3JkQnRuLnRleHRDb250ZW50ID0gJ9CvINC30LDQsdGL0Lsg0L/QsNGA0L7Qu9GMJztcblxuICBsYWJlbC5hcHBlbmQocGFzc3dvcmRJbnB1dCk7XG4gIG1vZGFsLmFwcGVuZChjbG9zZUJ0bik7XG4gIG1vZGFsLmFwcGVuZCh0aXRsZSk7XG4gIG1vZGFsLmFwcGVuZChsYWJlbCk7XG4gIG1vZGFsLmFwcGVuZChmb3Jnb3RQYXNzd29yZEJ0bik7XG4gIG1vZGFsLmFwcGVuZChjb25maXJtQnRuKTtcbiAgbW9kYWwuYXBwZW5kKG1lc3NhZ2UpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChkYXJrQmFja2dyb3VuZCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKG1vZGFsKTtcblxuICBwbGFjZWhvbGRlcihwYXNzd29yZElucHV0LCAn0JLQstC10LTQuNGC0LUg0L/QsNGA0L7Qu9GMJyk7XG4gIHNob3dIaWRlUGFzc3dvcmQocGFzc3dvcmRJbnB1dCk7XG5cbiAgbW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XG4gICAgd2l0aG91dFNwYWNlKGV2ZW50LnRhcmdldCk7XG4gIH0pO1xuXG4gIHBhc3N3b3JkSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XG4gICAgaWYgKGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWUgPT09ICcnKSB7XG4gICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHBhc3N3b3JkSW5wdXQuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9faW5wdXQtLWVycm9yJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIHBhc3N3b3JkSW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnYWNjb3VudC1tb2RhbF9faW5wdXQtLWVycm9yJyk7XG4gICAgfVxuICB9KTtcblxuICBjb25maXJtQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZXZlbnQgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjcmVkZW50aWFsID0gRW1haWxBdXRoUHJvdmlkZXIuY3JlZGVudGlhbCh1c2VyLmVtYWlsLCBwYXNzd29yZElucHV0LnZhbHVlLnRyaW0oKSk7XG4gICAgICBhd2FpdCByZWF1dGhlbnRpY2F0ZVdpdGhDcmVkZW50aWFsKHVzZXIsIGNyZWRlbnRpYWwpO1xuICAgICAgYXdhaXQgZGVsZXRlVXNlcih1c2VyKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQktCy0LXQtNGR0L0g0L3QtdCy0LXRgNC90YvQuSDQv9Cw0YDQvtC70YwuJztcbiAgICB9XG4gIH0pO1xuXG4gIGZvcmdvdFBhc3N3b3JkQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgIG1vZGFsLnJlbW92ZSgpO1xuICAgIGRhcmtCYWNrZ3JvdW5kLnJlbW92ZSgpO1xuICAgIG9wZW5SZXNldFBhc3N3b3JkTW9kYWwoKTtcbiAgfSk7XG5cbiAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgbW9kYWwucmVtb3ZlKCk7XG4gICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3BlblNpZ25PdXRNb2RhbCgpIHtcbiAgY29uc3QgZGFya0JhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICBjb25zdCBjbG9zZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBjb25zdCBjb25maXJtQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cbiAgZGFya0JhY2tncm91bmQuY2xhc3NMaXN0LmFkZCgnZGFyay1iYWNrZ3JvdW5kJyk7XG4gIG1vZGFsLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWwnKTtcbiAgdGl0bGUuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fdGl0bGUnKTtcbiAgY2xvc2VCdG4uY2xhc3NMaXN0LmFkZCgnY2xvc2UtbW9kYWwtYnRuJyk7XG4gIGNvbmZpcm1CdG4uY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fYnRuJywgJ2FjY291bnQtbW9kYWxfX2J0bi0tcmVkJyk7XG5cbiAgdGl0bGUudGV4dENvbnRlbnQgPSAn0JLRi9C50YLQuCDRgSDQsNC60LrQsNGD0L3RgtCwPyc7XG4gIGNvbmZpcm1CdG4udGV4dENvbnRlbnQgPSAn0JLRi9C50YLQuCc7XG5cbiAgbW9kYWwuYXBwZW5kKGNsb3NlQnRuKTtcbiAgbW9kYWwuYXBwZW5kKHRpdGxlKTtcbiAgbW9kYWwuYXBwZW5kKGNvbmZpcm1CdG4pO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChkYXJrQmFja2dyb3VuZCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKG1vZGFsKTtcblxuICBtb2RhbC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGV2ZW50ID0+IHtcbiAgICB3aXRob3V0U3BhY2UoZXZlbnQudGFyZ2V0KTtcbiAgfSk7XG5cbiAgY29uZmlybUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICBzaWduT3V0KGF1dGgpO1xuICB9KTtcblxuICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuQ2hhbmdlUGFzc3dvcmRNb2RhbCh1c2VyKSB7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IGRhcmtCYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IGN1cnJlbnRQYXNzd29yZElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgY29uc3QgbmV3UGFzc3dvcmRJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gIGNvbnN0IGNvbmZpcm1CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgY2xvc2VCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgZm9yZ290UGFzc3dvcmRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgY3VycmVudFBhc3N3b3JkTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICBjb25zdCBuZXdQYXNzd29yZExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgY29uc3QgbmV3UGFzc3dvcmRFcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgY29uc3QgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblxuICBjdXJyZW50UGFzc3dvcmRJbnB1dC50eXBlID0gJ3Bhc3N3b3JkJztcbiAgbmV3UGFzc3dvcmRJbnB1dC50eXBlID0gJ3Bhc3N3b3JkJztcbiAgY29uZmlybUJ0bi50ZXh0Q29udGVudCA9ICfQodC80LXQvdC40YLRjCc7XG4gIGZvcmdvdFBhc3N3b3JkQnRuLnRleHRDb250ZW50ID0gJ9CvINC30LDQsdGL0Lsg0L/QsNGA0L7Qu9GMJztcblxuICBkYXJrQmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCdkYXJrLWJhY2tncm91bmQnKTtcbiAgbW9kYWwuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbCcpO1xuICBjdXJyZW50UGFzc3dvcmRMYWJlbC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19sYWJlbCcpO1xuICBuZXdQYXNzd29yZExhYmVsLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2xhYmVsJyk7XG4gIGN1cnJlbnRQYXNzd29yZElucHV0LmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2lucHV0Jyk7XG4gIG5ld1Bhc3N3b3JkSW5wdXQuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9faW5wdXQnKTtcbiAgY29uZmlybUJ0bi5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19idG4nKTtcbiAgY2xvc2VCdG4uY2xhc3NMaXN0LmFkZCgnY2xvc2UtbW9kYWwtYnRuJyk7XG4gIGZvcmdvdFBhc3N3b3JkQnRuLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2Rlc2NyLWJ0bicpO1xuICBuZXdQYXNzd29yZEVycm9yLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG5cbiAgbW9kYWwuc3R5bGUuYm9yZGVyQm90dG9tID0gJ25vbmUnO1xuICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcblxuICBjdXJyZW50UGFzc3dvcmRMYWJlbC5hcHBlbmQoY3VycmVudFBhc3N3b3JkSW5wdXQpO1xuICBuZXdQYXNzd29yZExhYmVsLmFwcGVuZChuZXdQYXNzd29yZElucHV0KTtcbiAgbmV3UGFzc3dvcmRMYWJlbC5hcHBlbmQobmV3UGFzc3dvcmRFcnJvcik7XG4gIG1vZGFsLmFwcGVuZChjbG9zZUJ0bik7XG4gIG1vZGFsLmFwcGVuZChjdXJyZW50UGFzc3dvcmRMYWJlbCk7XG4gIG1vZGFsLmFwcGVuZChuZXdQYXNzd29yZExhYmVsKTtcbiAgbW9kYWwuYXBwZW5kKGZvcmdvdFBhc3N3b3JkQnRuKTtcbiAgbW9kYWwuYXBwZW5kKGNvbmZpcm1CdG4pO1xuICBtb2RhbC5hcHBlbmQobWVzc2FnZSk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGRhcmtCYWNrZ3JvdW5kKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQobW9kYWwpO1xuXG4gIHBsYWNlaG9sZGVyKGN1cnJlbnRQYXNzd29yZElucHV0LCAn0JLQstC10LTQuNGC0LUg0YHRgtCw0YDRi9C5INC/0LDRgNC+0LvRjCcpO1xuICBwbGFjZWhvbGRlcihuZXdQYXNzd29yZElucHV0LCAn0JLQstC10LTQuNGC0LUg0L3QvtCy0YvQuSDQv9Cw0YDQvtC70YwnKTtcbiAgc2hvd0hpZGVQYXNzd29yZChjdXJyZW50UGFzc3dvcmRJbnB1dCk7XG4gIHNob3dIaWRlUGFzc3dvcmQobmV3UGFzc3dvcmRJbnB1dCk7XG5cbiAgbW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XG4gICAgd2l0aG91dFNwYWNlKGV2ZW50LnRhcmdldCk7XG4gICAgdHJ5IHtcbiAgICAgIHZhbGlkYXRpb25QYXNzd29yZChuZXdQYXNzd29yZElucHV0LnZhbHVlLnRyaW0oKSk7XG4gICAgICBpZiAoY3VycmVudFBhc3N3b3JkSW5wdXQudmFsdWUgIT09ICcnKSB7XG4gICAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIG5ld1Bhc3N3b3JkSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHZhbGlkYXRpb25QYXNzd29yZChldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlLnRyaW0oKSk7XG4gICAgICBuZXdQYXNzd29yZEVycm9yLnRleHRDb250ZW50ID0gJyc7XG4gICAgICBuZXdQYXNzd29yZElucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjY291bnQtbW9kYWxfX2lucHV0LS1lcnJvcicpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBuZXdQYXNzd29yZEVycm9yLnRleHRDb250ZW50ID0gZXJyb3IubWVzc2FnZTtcbiAgICAgIG5ld1Bhc3N3b3JkSW5wdXQuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9faW5wdXQtLWVycm9yJyk7XG4gICAgfVxuICB9KTtcblxuICBmb3Jnb3RQYXNzd29yZEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcbiAgICBvcGVuUmVzZXRQYXNzd29yZE1vZGFsKCk7XG4gIH0pO1xuXG4gIGNvbmZpcm1CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBldmVudCA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNyZWRlbnRpYWwgPSBFbWFpbEF1dGhQcm92aWRlci5jcmVkZW50aWFsKHVzZXIuZW1haWwsIGN1cnJlbnRQYXNzd29yZElucHV0LnZhbHVlLnRyaW0oKSk7XG4gICAgICBhd2FpdCByZWF1dGhlbnRpY2F0ZVdpdGhDcmVkZW50aWFsKHVzZXIsIGNyZWRlbnRpYWwpO1xuICAgICAgYXdhaXQgdXBkYXRlUGFzc3dvcmQodXNlciwgbmV3UGFzc3dvcmRJbnB1dC52YWx1ZSk7XG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2Vycm9yJyk7XG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ21lc3NhZ2UnKTtcbiAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0J/QsNGA0L7Qu9GMINCx0YvQuyDQuNC30LzQtdC90ZHQvS4nO1xuICAgICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnbWVzc2FnZScpO1xuICAgICAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xuICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQktCy0LXQtNGR0L0g0L3QtdCy0LXRgNC90YvQuSDQv9Cw0YDQvtC70YwuJztcbiAgICB9XG4gIH0pO1xuXG4gIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgIG1vZGFsLnJlbW92ZSgpO1xuICAgIGRhcmtCYWNrZ3JvdW5kLnJlbW92ZSgpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5DaGFuZ2VFbWFpbE1vZGFsKHVzZXIpIHtcbiAgY29uc3QgZGFya0JhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgbmV3RW1haWxMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gIGNvbnN0IHBhc3N3b3JkTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICBjb25zdCBuZXdFbWFpbElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgY29uc3QgcGFzc3dvcmRJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gIGNvbnN0IGNvbmZpcm1CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgZm9yZ290UGFzc3dvcmRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgY2xvc2VCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgbmV3RW1haWxFcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgY29uc3QgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblxuICBsZXQgY2hlY2tVcGRhdGVFbWFpbCA9IG51bGw7XG5cbiAgZGFya0JhY2tncm91bmQuY2xhc3NMaXN0LmFkZCgnZGFyay1iYWNrZ3JvdW5kJyk7XG4gIG1vZGFsLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWwnKTtcbiAgbmV3RW1haWxMYWJlbC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19sYWJlbCcpO1xuICBwYXNzd29yZExhYmVsLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2xhYmVsJyk7XG4gIG5ld0VtYWlsSW5wdXQuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9faW5wdXQnKTtcbiAgcGFzc3dvcmRJbnB1dC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19pbnB1dCcpO1xuICBmb3Jnb3RQYXNzd29yZEJ0bi5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19kZXNjci1idG4nKTtcbiAgY29uZmlybUJ0bi5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19idG4nKTtcbiAgY2xvc2VCdG4uY2xhc3NMaXN0LmFkZCgnY2xvc2UtbW9kYWwtYnRuJyk7XG4gIG5ld0VtYWlsRXJyb3IuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcblxuICBuZXdFbWFpbElucHV0LnR5cGUgPSAndGV4dCc7XG4gIHBhc3N3b3JkSW5wdXQudHlwZSA9ICdwYXNzd29yZCc7XG4gIGZvcmdvdFBhc3N3b3JkQnRuLnRleHRDb250ZW50ID0gJ9CvINC30LDQsdGL0Lsg0L/QsNGA0L7Qu9GMJztcbiAgY29uZmlybUJ0bi50ZXh0Q29udGVudCA9ICfQodC80LXQvdC40YLRjCc7XG4gIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuXG4gIG5ld0VtYWlsTGFiZWwuYXBwZW5kKG5ld0VtYWlsSW5wdXQpO1xuICBuZXdFbWFpbExhYmVsLmFwcGVuZChuZXdFbWFpbEVycm9yKTtcbiAgcGFzc3dvcmRMYWJlbC5hcHBlbmQocGFzc3dvcmRJbnB1dCk7XG4gIG1vZGFsLmFwcGVuZChuZXdFbWFpbExhYmVsKTtcbiAgbW9kYWwuYXBwZW5kKHBhc3N3b3JkTGFiZWwpO1xuICBtb2RhbC5hcHBlbmQoZm9yZ290UGFzc3dvcmRCdG4pO1xuICBtb2RhbC5hcHBlbmQoY29uZmlybUJ0bik7XG4gIG1vZGFsLmFwcGVuZChtZXNzYWdlKTtcbiAgbW9kYWwuYXBwZW5kKGNsb3NlQnRuKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZGFya0JhY2tncm91bmQpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChtb2RhbCk7XG5cbiAgc2hvd0hpZGVQYXNzd29yZChwYXNzd29yZElucHV0KTtcblxuICBwbGFjZWhvbGRlcihuZXdFbWFpbElucHV0LCAn0JLQstC10LTQuNGC0LUg0L3QvtCy0YPRjiDQv9C+0YfRgtGDJyk7XG4gIHBsYWNlaG9sZGVyKHBhc3N3b3JkSW5wdXQsICfQktCy0LXQtNC40YLQtSDQv9Cw0YDQvtC70YwnKTtcblxuICBtb2RhbC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGV2ZW50ID0+IHtcbiAgICB3aXRob3V0U3BhY2UoZXZlbnQudGFyZ2V0KTtcbiAgICB0cnkge1xuICAgICAgdmFsaWRhdGlvbkVtYWlsKG5ld0VtYWlsSW5wdXQudmFsdWUudHJpbSgpKTtcbiAgICAgIGlmIChwYXNzd29yZElucHV0LnZhbHVlICE9PSAnJykge1xuICAgICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICBmb3Jnb3RQYXNzd29yZEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcbiAgICBvcGVuUmVzZXRQYXNzd29yZE1vZGFsKCk7XG4gIH0pO1xuXG4gIG5ld0VtYWlsSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHZhbGlkYXRpb25FbWFpbChldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlLnRyaW0oKSk7XG4gICAgICBuZXdFbWFpbEVycm9yLnRleHRDb250ZW50ID0gJyc7XG4gICAgICBuZXdFbWFpbElucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjY291bnQtbW9kYWxfX2lucHV0LS1lcnJvcicpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBuZXdFbWFpbEVycm9yLnRleHRDb250ZW50ID0gZXJyb3IubWVzc2FnZTtcbiAgICAgIG5ld0VtYWlsSW5wdXQuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9faW5wdXQtLWVycm9yJyk7XG4gICAgfVxuICB9KTtcblxuICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcbiAgfSk7XG5cbiAgY29uZmlybUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGV2ZW50ID0+IHtcbiAgICBjbGVhckludGVydmFsKGNoZWNrVXBkYXRlRW1haWwpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjcmVkZW50aWFsID0gRW1haWxBdXRoUHJvdmlkZXIuY3JlZGVudGlhbCh1c2VyLmVtYWlsLCBjdXJyZW50UGFzc3dvcmRJbnB1dC52YWx1ZS50cmltKCkpO1xuICAgICAgYXdhaXQgcmVhdXRoZW50aWNhdGVXaXRoQ3JlZGVudGlhbCh1c2VyLCBjcmVkZW50aWFsKTtcbiAgICAgIGF3YWl0IHZlcmlmeUJlZm9yZVVwZGF0ZUVtYWlsKHVzZXIsIG5ld0VtYWlsSW5wdXQudmFsdWUudHJpbSgpKTtcbiAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnZXJyb3InKTtcbiAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnbWVzc2FnZScpO1xuICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQndCwINCy0LDRiNGDINGN0LvQtdC60YLRgNC+0L3QvdGD0Y4g0L/QvtGH0YLRgyDQvtGC0L/RgNCw0LLQu9C10L3QviDQv9C40YHRjNC80L4g0YEg0L/QvtC00YLQstC10YDQttC00LXQvdC40LXQvC4nO1xuICAgICAgY2hlY2tVcGRhdGVFbWFpbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgdXNlci5yZWxvYWQoKTtcbiAgICAgIH0sIDEwMDApO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ21lc3NhZ2UnKTtcbiAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcbiAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0JLQstC10LTQtdC9INC90LXQstC10YDQvdGL0Lkg0L/QsNGA0L7Qu9GMLic7XG4gICAgfVxuICB9KTtcbn1cbiJdLCJmaWxlIjoidXNlci9tb2RhbHMuanMifQ==
