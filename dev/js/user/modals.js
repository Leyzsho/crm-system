import app from '../utils/firebase.js';
import { validationEmail, validationPassword } from './validation.js';
import { getAuth, sendPasswordResetEmail, EmailAuthProvider, reauthenticateWithCredential, deleteUser, signOut, updatePassword, verifyBeforeUpdateEmail, sendEmailVerification } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';
import placeholder from '../utils/placeholder.js';
import showHidePassword from '../utils/show-hide-password.js';
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

  emailInput.addEventListener('input', async event => {
    try {
      validationEmail(emailInput.value.trim());
      await sendPasswordResetEmail(auth, emailInput.value.trim());
      emailError.textContent = '';
      confirmBtn.disabled = false;

    } catch(error) {
      emailError.textContent = error.message;
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

  passwordInput.addEventListener('input', event => {
    if (event.currentTarget.value === '') {
      confirmBtn.disabled = true;
    } else {
      confirmBtn.disabled = false;
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
    } catch (error) {
      newPasswordError.textContent = error.message;
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

  document.addEventListener('input', event => {
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
    } catch (error) {
      newEmailError.textContent = error.message;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ1c2VyL21vZGFscy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXBwIGZyb20gJy4uL3V0aWxzL2ZpcmViYXNlLmpzJztcbmltcG9ydCB7IHZhbGlkYXRpb25FbWFpbCwgdmFsaWRhdGlvblBhc3N3b3JkIH0gZnJvbSAnLi92YWxpZGF0aW9uLmpzJztcbmltcG9ydCB7IGdldEF1dGgsIHNlbmRQYXNzd29yZFJlc2V0RW1haWwsIEVtYWlsQXV0aFByb3ZpZGVyLCByZWF1dGhlbnRpY2F0ZVdpdGhDcmVkZW50aWFsLCBkZWxldGVVc2VyLCBzaWduT3V0LCB1cGRhdGVQYXNzd29yZCwgdmVyaWZ5QmVmb3JlVXBkYXRlRW1haWwsIHNlbmRFbWFpbFZlcmlmaWNhdGlvbiB9IGZyb20gJ2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2ZpcmViYXNlanMvOS4xLjEvZmlyZWJhc2UtYXV0aC5qcyc7XG5pbXBvcnQgcGxhY2Vob2xkZXIgZnJvbSAnLi4vdXRpbHMvcGxhY2Vob2xkZXIuanMnO1xuaW1wb3J0IHNob3dIaWRlUGFzc3dvcmQgZnJvbSAnLi4vdXRpbHMvc2hvdy1oaWRlLXBhc3N3b3JkLmpzJztcbmNvbnN0IGF1dGggPSBnZXRBdXRoKGFwcCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuUmVzZXRQYXNzd29yZE1vZGFsKCkge1xuICBjb25zdCBjbG9zZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBjb25zdCBsb2FkZXJCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIGNvbnN0IGRhcmtCYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICBjb25zdCBlbWFpbElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgY29uc3QgZW1haWxFcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgY29uc3QgY29uZmlybUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBjb25zdCBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXG4gIGxldCBzZW5kQWdhaW4gPSBudWxsO1xuXG4gIGNsb3NlQnRuLmNsYXNzTGlzdC5hZGQoJ2Nsb3NlLW1vZGFsLWJ0bicpO1xuICBkYXJrQmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCdkYXJrLWJhY2tncm91bmQnKTtcbiAgbW9kYWwuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbCcpO1xuICB0aXRsZS5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX190aXRsZScpO1xuICBsYWJlbC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19sYWJlbCcpO1xuICBlbWFpbElucHV0LmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2lucHV0Jyk7XG4gIGVtYWlsRXJyb3IuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcbiAgY29uZmlybUJ0bi5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19idG4nKTtcbiAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdtZXNzYWdlJyk7XG5cbiAgdGl0bGUudGV4dENvbnRlbnQgPSAn0KHQsdGA0L7RgSDQv9Cw0YDQvtC70Y8nO1xuICBjb25maXJtQnRuLnRleHRDb250ZW50ID0gJ9Ce0YLQv9GA0LDQstC40YLRjCDQv9C40YHRjNC80L4nO1xuXG4gIGVtYWlsSW5wdXQudHlwZSA9ICd0ZXh0JztcblxuICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcblxuICBsYWJlbC5hcHBlbmQoZW1haWxJbnB1dCk7XG4gIGxhYmVsLmFwcGVuZChlbWFpbEVycm9yKTtcbiAgbW9kYWwuYXBwZW5kKGNsb3NlQnRuKTtcbiAgbW9kYWwuYXBwZW5kKHRpdGxlKTtcbiAgbW9kYWwuYXBwZW5kKGxhYmVsKTtcbiAgbW9kYWwuYXBwZW5kKGNvbmZpcm1CdG4pO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChkYXJrQmFja2dyb3VuZCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKG1vZGFsKTtcblxuICBwbGFjZWhvbGRlcihlbWFpbElucHV0LCAn0JLQstC10LTQuNGC0LUg0L/QvtGH0YLRgycpO1xuXG4gIGVtYWlsSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBhc3luYyBldmVudCA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHZhbGlkYXRpb25FbWFpbChlbWFpbElucHV0LnZhbHVlLnRyaW0oKSk7XG4gICAgICBhd2FpdCBzZW5kUGFzc3dvcmRSZXNldEVtYWlsKGF1dGgsIGVtYWlsSW5wdXQudmFsdWUudHJpbSgpKTtcbiAgICAgIGVtYWlsRXJyb3IudGV4dENvbnRlbnQgPSAnJztcbiAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcblxuICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgIGVtYWlsRXJyb3IudGV4dENvbnRlbnQgPSBlcnJvci5tZXNzYWdlO1xuICAgICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcbiAgfSk7XG5cbiAgY29uZmlybUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGV2ZW50ID0+IHtcbiAgICBjbGVhckludGVydmFsKHNlbmRBZ2Fpbik7XG5cbiAgICB0cnkge1xuICAgICAgY29uZmlybUJ0bi5hcHBlbmQobG9hZGVyQnRuKTtcbiAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgICBhd2FpdCBzZW5kUGFzc3dvcmRSZXNldEVtYWlsKGF1dGgsIGVtYWlsSW5wdXQudmFsdWUudHJpbSgpKTtcblxuICAgICAgbG9hZGVyQnRuLnJlbW92ZSgpO1xuICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQndCwINCy0LDRiNGDINGN0LvQtdC60YLRgNC+0L3QvdGD0Y4g0L/QvtGH0YLRgyDQvtGC0L/RgNCw0LLQu9C10L3QviDQv9C40YHRjNC80L4g0YHQviDRgdCx0YDQvtGB0L7QvCDQv9Cw0YDQvtC70Y8uJztcbiAgICAgIGNvbmZpcm1CdG4uYWZ0ZXIobWVzc2FnZSk7XG5cbiAgICAgIHNlbmRBZ2FpbiA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJyc7XG4gICAgICB9LCA1MDAwKTtcblxuXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0KfRgtC+LdGC0L4g0L/QvtGI0LvQviDQvdC1INGC0LDQui4uLic7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5EZWxldGVBY2NvdW50TW9kYWwodXNlcikge1xuICBjb25zdCBkYXJrQmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gIGNvbnN0IHBhc3N3b3JkSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gIGNvbnN0IGNsb3NlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IGNvbmZpcm1CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgZm9yZ290UGFzc3dvcmRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblxuICBkYXJrQmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCdkYXJrLWJhY2tncm91bmQnKTtcbiAgbW9kYWwuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbCcpO1xuICBsYWJlbC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19sYWJlbCcpO1xuICBwYXNzd29yZElucHV0LmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2lucHV0Jyk7XG4gIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX3RpdGxlJyk7XG4gIGZvcmdvdFBhc3N3b3JkQnRuLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2Rlc2NyLWJ0bicpO1xuICBjbG9zZUJ0bi5jbGFzc0xpc3QuYWRkKCdjbG9zZS1tb2RhbC1idG4nKTtcbiAgY29uZmlybUJ0bi5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19idG4nLCAnYWNjb3VudC1tb2RhbF9fYnRuLS1yZWQnKTtcbiAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xuXG4gIHBhc3N3b3JkSW5wdXQudHlwZSA9ICdwYXNzd29yZCc7XG4gIHRpdGxlLnRleHRDb250ZW50ID0gJ9Cj0LTQsNC70LXQvdC40LUg0LDQutC60LDRg9C90YLQsCc7XG4gIGNvbmZpcm1CdG4udGV4dENvbnRlbnQgPSAn0KPQtNCw0LvQuNGC0Ywg0LDQutC60LDRg9C90YInO1xuICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgZm9yZ290UGFzc3dvcmRCdG4udGV4dENvbnRlbnQgPSAn0K8g0LfQsNCx0YvQuyDQv9Cw0YDQvtC70YwnO1xuXG4gIGxhYmVsLmFwcGVuZChwYXNzd29yZElucHV0KTtcbiAgbW9kYWwuYXBwZW5kKGNsb3NlQnRuKTtcbiAgbW9kYWwuYXBwZW5kKHRpdGxlKTtcbiAgbW9kYWwuYXBwZW5kKGxhYmVsKTtcbiAgbW9kYWwuYXBwZW5kKGZvcmdvdFBhc3N3b3JkQnRuKTtcbiAgbW9kYWwuYXBwZW5kKGNvbmZpcm1CdG4pO1xuICBtb2RhbC5hcHBlbmQobWVzc2FnZSk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGRhcmtCYWNrZ3JvdW5kKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQobW9kYWwpO1xuXG4gIHBsYWNlaG9sZGVyKHBhc3N3b3JkSW5wdXQsICfQktCy0LXQtNC40YLQtSDQv9Cw0YDQvtC70YwnKTtcbiAgc2hvd0hpZGVQYXNzd29yZChwYXNzd29yZElucHV0KTtcblxuICBwYXNzd29yZElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xuICAgIGlmIChldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlID09PSAnJykge1xuICAgICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9XG4gIH0pO1xuXG4gIGNvbmZpcm1CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBldmVudCA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNyZWRlbnRpYWwgPSBFbWFpbEF1dGhQcm92aWRlci5jcmVkZW50aWFsKHVzZXIuZW1haWwsIHBhc3N3b3JkSW5wdXQudmFsdWUudHJpbSgpKTtcbiAgICAgIGF3YWl0IHJlYXV0aGVudGljYXRlV2l0aENyZWRlbnRpYWwodXNlciwgY3JlZGVudGlhbCk7XG4gICAgICBhd2FpdCBkZWxldGVVc2VyKHVzZXIpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9CS0LLQtdC00ZHQvSDQvdC10LLQtdGA0L3Ri9C5INC/0LDRgNC+0LvRjC4nO1xuICAgIH1cbiAgfSk7XG5cbiAgZm9yZ290UGFzc3dvcmRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgbW9kYWwucmVtb3ZlKCk7XG4gICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XG4gICAgb3BlblJlc2V0UGFzc3dvcmRNb2RhbCgpO1xuICB9KTtcblxuICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuU2lnbk91dE1vZGFsKCkge1xuICBjb25zdCBkYXJrQmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gIGNvbnN0IGNsb3NlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IGNvbmZpcm1CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblxuICBkYXJrQmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCdkYXJrLWJhY2tncm91bmQnKTtcbiAgbW9kYWwuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbCcpO1xuICB0aXRsZS5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX190aXRsZScpO1xuICBjbG9zZUJ0bi5jbGFzc0xpc3QuYWRkKCdjbG9zZS1tb2RhbC1idG4nKTtcbiAgY29uZmlybUJ0bi5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19idG4nLCAnYWNjb3VudC1tb2RhbF9fYnRuLS1yZWQnKTtcblxuICB0aXRsZS50ZXh0Q29udGVudCA9ICfQktGL0LnRgtC4INGBINCw0LrQutCw0YPQvdGC0LA/JztcbiAgY29uZmlybUJ0bi50ZXh0Q29udGVudCA9ICfQktGL0LnRgtC4JztcblxuICBtb2RhbC5hcHBlbmQoY2xvc2VCdG4pO1xuICBtb2RhbC5hcHBlbmQodGl0bGUpO1xuICBtb2RhbC5hcHBlbmQoY29uZmlybUJ0bik7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGRhcmtCYWNrZ3JvdW5kKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQobW9kYWwpO1xuXG4gIGNvbmZpcm1CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgc2lnbk91dChhdXRoKTtcbiAgfSk7XG5cbiAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgbW9kYWwucmVtb3ZlKCk7XG4gICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3BlbkNoYW5nZVBhc3N3b3JkTW9kYWwodXNlcikge1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCBkYXJrQmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCBjdXJyZW50UGFzc3dvcmRJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gIGNvbnN0IG5ld1Bhc3N3b3JkSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICBjb25zdCBjb25maXJtQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IGNsb3NlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IGZvcmdvdFBhc3N3b3JkQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IGN1cnJlbnRQYXNzd29yZExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgY29uc3QgbmV3UGFzc3dvcmRMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gIGNvbnN0IG5ld1Bhc3N3b3JkRXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIGNvbnN0IG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cbiAgY3VycmVudFBhc3N3b3JkSW5wdXQudHlwZSA9ICdwYXNzd29yZCc7XG4gIG5ld1Bhc3N3b3JkSW5wdXQudHlwZSA9ICdwYXNzd29yZCc7XG4gIGNvbmZpcm1CdG4udGV4dENvbnRlbnQgPSAn0KHQvNC10L3QuNGC0YwnO1xuICBmb3Jnb3RQYXNzd29yZEJ0bi50ZXh0Q29udGVudCA9ICfQryDQt9Cw0LHRi9C7INC/0LDRgNC+0LvRjCc7XG5cbiAgZGFya0JhY2tncm91bmQuY2xhc3NMaXN0LmFkZCgnZGFyay1iYWNrZ3JvdW5kJyk7XG4gIG1vZGFsLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWwnKTtcbiAgY3VycmVudFBhc3N3b3JkTGFiZWwuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fbGFiZWwnKTtcbiAgbmV3UGFzc3dvcmRMYWJlbC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19sYWJlbCcpO1xuICBjdXJyZW50UGFzc3dvcmRJbnB1dC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19pbnB1dCcpO1xuICBuZXdQYXNzd29yZElucHV0LmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2lucHV0Jyk7XG4gIGNvbmZpcm1CdG4uY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fYnRuJyk7XG4gIGNsb3NlQnRuLmNsYXNzTGlzdC5hZGQoJ2Nsb3NlLW1vZGFsLWJ0bicpO1xuICBmb3Jnb3RQYXNzd29yZEJ0bi5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19kZXNjci1idG4nKTtcbiAgbmV3UGFzc3dvcmRFcnJvci5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xuXG4gIG1vZGFsLnN0eWxlLmJvcmRlckJvdHRvbSA9ICdub25lJztcbiAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgY3VycmVudFBhc3N3b3JkTGFiZWwuYXBwZW5kKGN1cnJlbnRQYXNzd29yZElucHV0KTtcbiAgbmV3UGFzc3dvcmRMYWJlbC5hcHBlbmQobmV3UGFzc3dvcmRJbnB1dCk7XG4gIG5ld1Bhc3N3b3JkTGFiZWwuYXBwZW5kKG5ld1Bhc3N3b3JkRXJyb3IpO1xuICBtb2RhbC5hcHBlbmQoY2xvc2VCdG4pO1xuICBtb2RhbC5hcHBlbmQoY3VycmVudFBhc3N3b3JkTGFiZWwpO1xuICBtb2RhbC5hcHBlbmQobmV3UGFzc3dvcmRMYWJlbCk7XG4gIG1vZGFsLmFwcGVuZChmb3Jnb3RQYXNzd29yZEJ0bik7XG4gIG1vZGFsLmFwcGVuZChjb25maXJtQnRuKTtcbiAgbW9kYWwuYXBwZW5kKG1lc3NhZ2UpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChkYXJrQmFja2dyb3VuZCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKG1vZGFsKTtcblxuICBwbGFjZWhvbGRlcihjdXJyZW50UGFzc3dvcmRJbnB1dCwgJ9CS0LLQtdC00LjRgtC1INGB0YLQsNGA0YvQuSDQv9Cw0YDQvtC70YwnKTtcbiAgcGxhY2Vob2xkZXIobmV3UGFzc3dvcmRJbnB1dCwgJ9CS0LLQtdC00LjRgtC1INC90L7QstGL0Lkg0L/QsNGA0L7Qu9GMJyk7XG4gIHNob3dIaWRlUGFzc3dvcmQoY3VycmVudFBhc3N3b3JkSW5wdXQpO1xuICBzaG93SGlkZVBhc3N3b3JkKG5ld1Bhc3N3b3JkSW5wdXQpO1xuXG4gIG1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xuICAgIHRyeSB7XG4gICAgICB2YWxpZGF0aW9uUGFzc3dvcmQobmV3UGFzc3dvcmRJbnB1dC52YWx1ZS50cmltKCkpO1xuICAgICAgaWYgKGN1cnJlbnRQYXNzd29yZElucHV0LnZhbHVlICE9PSAnJykge1xuICAgICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICBuZXdQYXNzd29yZElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xuICAgIHRyeSB7XG4gICAgICB2YWxpZGF0aW9uUGFzc3dvcmQoZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZS50cmltKCkpO1xuICAgICAgbmV3UGFzc3dvcmRFcnJvci50ZXh0Q29udGVudCA9ICcnO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBuZXdQYXNzd29yZEVycm9yLnRleHRDb250ZW50ID0gZXJyb3IubWVzc2FnZTtcbiAgICB9XG4gIH0pO1xuXG4gIGZvcmdvdFBhc3N3b3JkQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgIG1vZGFsLnJlbW92ZSgpO1xuICAgIGRhcmtCYWNrZ3JvdW5kLnJlbW92ZSgpO1xuICAgIG9wZW5SZXNldFBhc3N3b3JkTW9kYWwoKTtcbiAgfSk7XG5cbiAgY29uZmlybUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGV2ZW50ID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY3JlZGVudGlhbCA9IEVtYWlsQXV0aFByb3ZpZGVyLmNyZWRlbnRpYWwodXNlci5lbWFpbCwgY3VycmVudFBhc3N3b3JkSW5wdXQudmFsdWUudHJpbSgpKTtcbiAgICAgIGF3YWl0IHJlYXV0aGVudGljYXRlV2l0aENyZWRlbnRpYWwodXNlciwgY3JlZGVudGlhbCk7XG4gICAgICBhd2FpdCB1cGRhdGVQYXNzd29yZCh1c2VyLCBuZXdQYXNzd29yZElucHV0LnZhbHVlKTtcbiAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnZXJyb3InKTtcbiAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnbWVzc2FnZScpO1xuICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQn9Cw0YDQvtC70Ywg0LHRi9C7INC40LfQvNC10L3RkdC9Lic7XG4gICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdtZXNzYWdlJyk7XG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG4gICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9CS0LLQtdC00ZHQvSDQvdC10LLQtdGA0L3Ri9C5INC/0LDRgNC+0LvRjC4nO1xuICAgIH1cbiAgfSk7XG5cbiAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgbW9kYWwucmVtb3ZlKCk7XG4gICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3BlbkNoYW5nZUVtYWlsTW9kYWwodXNlcikge1xuICBjb25zdCBkYXJrQmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCBuZXdFbWFpbExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgY29uc3QgcGFzc3dvcmRMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gIGNvbnN0IG5ld0VtYWlsSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICBjb25zdCBwYXNzd29yZElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgY29uc3QgY29uZmlybUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBjb25zdCBmb3Jnb3RQYXNzd29yZEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBjb25zdCBjbG9zZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBjb25zdCBuZXdFbWFpbEVycm9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBjb25zdCBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXG4gIGxldCBjaGVja1VwZGF0ZUVtYWlsID0gbnVsbDtcblxuICBkYXJrQmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCdkYXJrLWJhY2tncm91bmQnKTtcbiAgbW9kYWwuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbCcpO1xuICBuZXdFbWFpbExhYmVsLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2xhYmVsJyk7XG4gIHBhc3N3b3JkTGFiZWwuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fbGFiZWwnKTtcbiAgbmV3RW1haWxJbnB1dC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19pbnB1dCcpO1xuICBwYXNzd29yZElucHV0LmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2lucHV0Jyk7XG4gIGZvcmdvdFBhc3N3b3JkQnRuLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2Rlc2NyLWJ0bicpO1xuICBjb25maXJtQnRuLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2J0bicpO1xuICBjbG9zZUJ0bi5jbGFzc0xpc3QuYWRkKCdjbG9zZS1tb2RhbC1idG4nKTtcbiAgbmV3RW1haWxFcnJvci5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xuXG4gIG5ld0VtYWlsSW5wdXQudHlwZSA9ICd0ZXh0JztcbiAgcGFzc3dvcmRJbnB1dC50eXBlID0gJ3Bhc3N3b3JkJztcbiAgZm9yZ290UGFzc3dvcmRCdG4udGV4dENvbnRlbnQgPSAn0K8g0LfQsNCx0YvQuyDQv9Cw0YDQvtC70YwnO1xuICBjb25maXJtQnRuLnRleHRDb250ZW50ID0gJ9Ch0LzQtdC90LjRgtGMJztcbiAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgbmV3RW1haWxMYWJlbC5hcHBlbmQobmV3RW1haWxJbnB1dCk7XG4gIG5ld0VtYWlsTGFiZWwuYXBwZW5kKG5ld0VtYWlsRXJyb3IpO1xuICBwYXNzd29yZExhYmVsLmFwcGVuZChwYXNzd29yZElucHV0KTtcbiAgbW9kYWwuYXBwZW5kKG5ld0VtYWlsTGFiZWwpO1xuICBtb2RhbC5hcHBlbmQocGFzc3dvcmRMYWJlbCk7XG4gIG1vZGFsLmFwcGVuZChmb3Jnb3RQYXNzd29yZEJ0bik7XG4gIG1vZGFsLmFwcGVuZChjb25maXJtQnRuKTtcbiAgbW9kYWwuYXBwZW5kKG1lc3NhZ2UpO1xuICBtb2RhbC5hcHBlbmQoY2xvc2VCdG4pO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChkYXJrQmFja2dyb3VuZCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKG1vZGFsKTtcblxuICBzaG93SGlkZVBhc3N3b3JkKHBhc3N3b3JkSW5wdXQpO1xuXG4gIHBsYWNlaG9sZGVyKG5ld0VtYWlsSW5wdXQsICfQktCy0LXQtNC40YLQtSDQvdC+0LLRg9GOINC/0L7Rh9GC0YMnKTtcbiAgcGxhY2Vob2xkZXIocGFzc3dvcmRJbnB1dCwgJ9CS0LLQtdC00LjRgtC1INC/0LDRgNC+0LvRjCcpO1xuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xuICAgIHRyeSB7XG4gICAgICB2YWxpZGF0aW9uRW1haWwobmV3RW1haWxJbnB1dC52YWx1ZS50cmltKCkpO1xuICAgICAgaWYgKHBhc3N3b3JkSW5wdXQudmFsdWUgIT09ICcnKSB7XG4gICAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIGZvcmdvdFBhc3N3b3JkQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgIG1vZGFsLnJlbW92ZSgpO1xuICAgIGRhcmtCYWNrZ3JvdW5kLnJlbW92ZSgpO1xuICAgIG9wZW5SZXNldFBhc3N3b3JkTW9kYWwoKTtcbiAgfSk7XG5cbiAgbmV3RW1haWxJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGV2ZW50ID0+IHtcbiAgICB0cnkge1xuICAgICAgdmFsaWRhdGlvbkVtYWlsKGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWUudHJpbSgpKTtcbiAgICAgIG5ld0VtYWlsRXJyb3IudGV4dENvbnRlbnQgPSAnJztcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbmV3RW1haWxFcnJvci50ZXh0Q29udGVudCA9IGVycm9yLm1lc3NhZ2U7XG4gICAgfVxuICB9KTtcblxuICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcbiAgfSk7XG5cbiAgY29uZmlybUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGV2ZW50ID0+IHtcbiAgICBjbGVhckludGVydmFsKGNoZWNrVXBkYXRlRW1haWwpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjcmVkZW50aWFsID0gRW1haWxBdXRoUHJvdmlkZXIuY3JlZGVudGlhbCh1c2VyLmVtYWlsLCBjdXJyZW50UGFzc3dvcmRJbnB1dC52YWx1ZS50cmltKCkpO1xuICAgICAgYXdhaXQgcmVhdXRoZW50aWNhdGVXaXRoQ3JlZGVudGlhbCh1c2VyLCBjcmVkZW50aWFsKTtcbiAgICAgIGF3YWl0IHZlcmlmeUJlZm9yZVVwZGF0ZUVtYWlsKHVzZXIsIG5ld0VtYWlsSW5wdXQudmFsdWUudHJpbSgpKTtcbiAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnZXJyb3InKTtcbiAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnbWVzc2FnZScpO1xuICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQndCwINCy0LDRiNGDINGN0LvQtdC60YLRgNC+0L3QvdGD0Y4g0L/QvtGH0YLRgyDQvtGC0L/RgNCw0LLQu9C10L3QviDQv9C40YHRjNC80L4g0YEg0L/QvtC00YLQstC10YDQttC00LXQvdC40LXQvC4nO1xuICAgICAgY2hlY2tVcGRhdGVFbWFpbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgdXNlci5yZWxvYWQoKTtcbiAgICAgIH0sIDEwMDApO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ21lc3NhZ2UnKTtcbiAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcbiAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0JLQstC10LTQtdC9INC90LXQstC10YDQvdGL0Lkg0L/QsNGA0L7Qu9GMLic7XG4gICAgfVxuICB9KTtcbn1cbiJdLCJmaWxlIjoidXNlci9tb2RhbHMuanMifQ==
