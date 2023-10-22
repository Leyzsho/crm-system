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
    const loader = document.createElement('span');
    event.currentTarget.append(loader);
    event.currentTarget.disabled = true;

    try {
      const credential = EmailAuthProvider.credential(user.email, passwordInput.value.trim());
      await reauthenticateWithCredential(user, credential);
      await deleteUser(user);
    } catch (error) {
      loader.remove();
      message.textContent = 'Введён неверный пароль.';
      event.currentTarget.disabled = false;
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

  title.textContent = 'Выйти из аккаунта?';
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ1c2VyL21vZGFscy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXBwIGZyb20gJy4uL3V0aWxzL2ZpcmViYXNlLWluaXQuanMnO1xyXG5pbXBvcnQgeyB2YWxpZGF0aW9uRW1haWwsIHZhbGlkYXRpb25QYXNzd29yZCB9IGZyb20gJy4vdmFsaWRhdGlvbi5qcyc7XHJcbmltcG9ydCB7IGdldEF1dGgsIHNlbmRQYXNzd29yZFJlc2V0RW1haWwsIEVtYWlsQXV0aFByb3ZpZGVyLCByZWF1dGhlbnRpY2F0ZVdpdGhDcmVkZW50aWFsLCBkZWxldGVVc2VyLCBzaWduT3V0LCB1cGRhdGVQYXNzd29yZCwgdmVyaWZ5QmVmb3JlVXBkYXRlRW1haWwsIHNlbmRFbWFpbFZlcmlmaWNhdGlvbiB9IGZyb20gJ2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2ZpcmViYXNlanMvOS4xLjEvZmlyZWJhc2UtYXV0aC5qcyc7XHJcbmltcG9ydCB7IHNob3dIaWRlUGFzc3dvcmQsIHBsYWNlaG9sZGVyLCB3aXRob3V0U3BhY2UgfSBmcm9tICcuLi91dGlscy9pbnB1dC5qcyc7XHJcbmNvbnN0IGF1dGggPSBnZXRBdXRoKGFwcCk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gb3BlblJlc2V0UGFzc3dvcmRNb2RhbCgpIHtcclxuICBjb25zdCBjbG9zZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gIGNvbnN0IGxvYWRlckJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICBjb25zdCBkYXJrQmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xyXG4gIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcclxuICBjb25zdCBlbWFpbElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICBjb25zdCBlbWFpbEVycm9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gIGNvbnN0IGNvbmZpcm1CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICBjb25zdCBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG5cclxuICBsZXQgc2VuZEFnYWluID0gbnVsbDtcclxuXHJcbiAgY2xvc2VCdG4uY2xhc3NMaXN0LmFkZCgnY2xvc2UtbW9kYWwtYnRuJyk7XHJcbiAgZGFya0JhY2tncm91bmQuY2xhc3NMaXN0LmFkZCgnZGFyay1iYWNrZ3JvdW5kJyk7XHJcbiAgbW9kYWwuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbCcpO1xyXG4gIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX3RpdGxlJyk7XHJcbiAgbGFiZWwuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fbGFiZWwnKTtcclxuICBlbWFpbElucHV0LmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2lucHV0Jyk7XHJcbiAgZW1haWxFcnJvci5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xyXG4gIGNvbmZpcm1CdG4uY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fYnRuJyk7XHJcbiAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdtZXNzYWdlJyk7XHJcblxyXG4gIHRpdGxlLnRleHRDb250ZW50ID0gJ9Ch0LHRgNC+0YEg0L/QsNGA0L7Qu9GPJztcclxuICBjb25maXJtQnRuLnRleHRDb250ZW50ID0gJ9Ce0YLQv9GA0LDQstC40YLRjCDQv9C40YHRjNC80L4nO1xyXG5cclxuICBlbWFpbElucHV0LnR5cGUgPSAndGV4dCc7XHJcblxyXG4gIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xyXG5cclxuICBsYWJlbC5hcHBlbmQoZW1haWxJbnB1dCk7XHJcbiAgbGFiZWwuYXBwZW5kKGVtYWlsRXJyb3IpO1xyXG4gIG1vZGFsLmFwcGVuZChjbG9zZUJ0bik7XHJcbiAgbW9kYWwuYXBwZW5kKHRpdGxlKTtcclxuICBtb2RhbC5hcHBlbmQobGFiZWwpO1xyXG4gIG1vZGFsLmFwcGVuZChjb25maXJtQnRuKTtcclxuICBkb2N1bWVudC5ib2R5LmFwcGVuZChkYXJrQmFja2dyb3VuZCk7XHJcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQobW9kYWwpO1xyXG5cclxuICBwbGFjZWhvbGRlcihlbWFpbElucHV0LCAn0JLQstC10LTQuNGC0LUg0L/QvtGH0YLRgycpO1xyXG5cclxuICBtb2RhbC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGV2ZW50ID0+IHtcclxuICAgIHdpdGhvdXRTcGFjZShldmVudC50YXJnZXQpO1xyXG4gIH0pO1xyXG5cclxuICBlbWFpbElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgYXN5bmMgZXZlbnQgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgdmFsaWRhdGlvbkVtYWlsKGVtYWlsSW5wdXQudmFsdWUudHJpbSgpKTtcclxuICAgICAgYXdhaXQgc2VuZFBhc3N3b3JkUmVzZXRFbWFpbChhdXRoLCBlbWFpbElucHV0LnZhbHVlLnRyaW0oKSk7XHJcbiAgICAgIGVtYWlsRXJyb3IudGV4dENvbnRlbnQgPSAnJztcclxuICAgICAgZW1haWxJbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdhY2NvdW50LW1vZGFsX19pbnB1dC0tZXJyb3InKTtcclxuICAgICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xyXG5cclxuICAgIH0gY2F0Y2goZXJyb3IpIHtcclxuICAgICAgZW1haWxFcnJvci50ZXh0Q29udGVudCA9IGVycm9yLm1lc3NhZ2U7XHJcbiAgICAgIGVtYWlsSW5wdXQuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9faW5wdXQtLWVycm9yJyk7XHJcbiAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcclxuICAgIG1vZGFsLnJlbW92ZSgpO1xyXG4gICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XHJcbiAgfSk7XHJcblxyXG4gIGNvbmZpcm1CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBldmVudCA9PiB7XHJcbiAgICBjbGVhckludGVydmFsKHNlbmRBZ2Fpbik7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uZmlybUJ0bi5hcHBlbmQobG9hZGVyQnRuKTtcclxuICAgICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcblxyXG4gICAgICBhd2FpdCBzZW5kUGFzc3dvcmRSZXNldEVtYWlsKGF1dGgsIGVtYWlsSW5wdXQudmFsdWUudHJpbSgpKTtcclxuXHJcbiAgICAgIGxvYWRlckJ0bi5yZW1vdmUoKTtcclxuICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQndCwINCy0LDRiNGDINGN0LvQtdC60YLRgNC+0L3QvdGD0Y4g0L/QvtGH0YLRgyDQvtGC0L/RgNCw0LLQu9C10L3QviDQv9C40YHRjNC80L4g0YHQviDRgdCx0YDQvtGB0L7QvCDQv9Cw0YDQvtC70Y8uJztcclxuICAgICAgY29uZmlybUJ0bi5hZnRlcihtZXNzYWdlKTtcclxuXHJcbiAgICAgIHNlbmRBZ2FpbiA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICcnO1xyXG4gICAgICB9LCA1MDAwKTtcclxuXHJcblxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQp9GC0L4t0YLQviDQv9C+0YjQu9C+INC90LUg0YLQsNC6Li4uJztcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5EZWxldGVBY2NvdW50TW9kYWwodXNlcikge1xyXG4gIGNvbnN0IGRhcmtCYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XHJcbiAgY29uc3QgcGFzc3dvcmRJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xyXG4gIGNvbnN0IGNsb3NlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgY29uc3QgY29uZmlybUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gIGNvbnN0IGZvcmdvdFBhc3N3b3JkQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgY29uc3QgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuXHJcbiAgZGFya0JhY2tncm91bmQuY2xhc3NMaXN0LmFkZCgnZGFyay1iYWNrZ3JvdW5kJyk7XHJcbiAgbW9kYWwuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbCcpO1xyXG4gIGxhYmVsLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2xhYmVsJyk7XHJcbiAgcGFzc3dvcmRJbnB1dC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19pbnB1dCcpO1xyXG4gIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX3RpdGxlJyk7XHJcbiAgZm9yZ290UGFzc3dvcmRCdG4uY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fZGVzY3ItYnRuJyk7XHJcbiAgY2xvc2VCdG4uY2xhc3NMaXN0LmFkZCgnY2xvc2UtbW9kYWwtYnRuJyk7XHJcbiAgY29uZmlybUJ0bi5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19idG4nLCAnYWNjb3VudC1tb2RhbF9fYnRuLS1yZWQnKTtcclxuICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XHJcblxyXG4gIHBhc3N3b3JkSW5wdXQudHlwZSA9ICdwYXNzd29yZCc7XHJcbiAgdGl0bGUudGV4dENvbnRlbnQgPSAn0KPQtNCw0LvQtdC90LjQtSDQsNC60LrQsNGD0L3RgtCwJztcclxuICBjb25maXJtQnRuLnRleHRDb250ZW50ID0gJ9Cj0LTQsNC70LjRgtGMINCw0LrQutCw0YPQvdGCJztcclxuICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuICBmb3Jnb3RQYXNzd29yZEJ0bi50ZXh0Q29udGVudCA9ICfQryDQt9Cw0LHRi9C7INC/0LDRgNC+0LvRjCc7XHJcblxyXG4gIGxhYmVsLmFwcGVuZChwYXNzd29yZElucHV0KTtcclxuICBtb2RhbC5hcHBlbmQoY2xvc2VCdG4pO1xyXG4gIG1vZGFsLmFwcGVuZCh0aXRsZSk7XHJcbiAgbW9kYWwuYXBwZW5kKGxhYmVsKTtcclxuICBtb2RhbC5hcHBlbmQoZm9yZ290UGFzc3dvcmRCdG4pO1xyXG4gIG1vZGFsLmFwcGVuZChjb25maXJtQnRuKTtcclxuICBtb2RhbC5hcHBlbmQobWVzc2FnZSk7XHJcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZGFya0JhY2tncm91bmQpO1xyXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKG1vZGFsKTtcclxuXHJcbiAgcGxhY2Vob2xkZXIocGFzc3dvcmRJbnB1dCwgJ9CS0LLQtdC00LjRgtC1INC/0LDRgNC+0LvRjCcpO1xyXG4gIHNob3dIaWRlUGFzc3dvcmQocGFzc3dvcmRJbnB1dCk7XHJcblxyXG4gIG1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xyXG4gICAgd2l0aG91dFNwYWNlKGV2ZW50LnRhcmdldCk7XHJcbiAgfSk7XHJcblxyXG4gIHBhc3N3b3JkSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XHJcbiAgICBpZiAoZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZSA9PT0gJycpIHtcclxuICAgICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgIHBhc3N3b3JkSW5wdXQuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9faW5wdXQtLWVycm9yJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgIHBhc3N3b3JkSW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnYWNjb3VudC1tb2RhbF9faW5wdXQtLWVycm9yJyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGNvbmZpcm1CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBldmVudCA9PiB7XHJcbiAgICBjb25zdCBsb2FkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICBldmVudC5jdXJyZW50VGFyZ2V0LmFwcGVuZChsb2FkZXIpO1xyXG4gICAgZXZlbnQuY3VycmVudFRhcmdldC5kaXNhYmxlZCA9IHRydWU7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgY3JlZGVudGlhbCA9IEVtYWlsQXV0aFByb3ZpZGVyLmNyZWRlbnRpYWwodXNlci5lbWFpbCwgcGFzc3dvcmRJbnB1dC52YWx1ZS50cmltKCkpO1xyXG4gICAgICBhd2FpdCByZWF1dGhlbnRpY2F0ZVdpdGhDcmVkZW50aWFsKHVzZXIsIGNyZWRlbnRpYWwpO1xyXG4gICAgICBhd2FpdCBkZWxldGVVc2VyKHVzZXIpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgbG9hZGVyLnJlbW92ZSgpO1xyXG4gICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9CS0LLQtdC00ZHQvSDQvdC10LLQtdGA0L3Ri9C5INC/0LDRgNC+0LvRjC4nO1xyXG4gICAgICBldmVudC5jdXJyZW50VGFyZ2V0LmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGZvcmdvdFBhc3N3b3JkQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgbW9kYWwucmVtb3ZlKCk7XHJcbiAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcclxuICAgIG9wZW5SZXNldFBhc3N3b3JkTW9kYWwoKTtcclxuICB9KTtcclxuXHJcbiAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICBtb2RhbC5yZW1vdmUoKTtcclxuICAgIGRhcmtCYWNrZ3JvdW5kLnJlbW92ZSgpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gb3BlblNpZ25PdXRNb2RhbCgpIHtcclxuICBjb25zdCBkYXJrQmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xyXG4gIGNvbnN0IGNsb3NlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgY29uc3QgY29uZmlybUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG5cclxuICBkYXJrQmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCdkYXJrLWJhY2tncm91bmQnKTtcclxuICBtb2RhbC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsJyk7XHJcbiAgdGl0bGUuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fdGl0bGUnKTtcclxuICBjbG9zZUJ0bi5jbGFzc0xpc3QuYWRkKCdjbG9zZS1tb2RhbC1idG4nKTtcclxuICBjb25maXJtQnRuLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2J0bicsICdhY2NvdW50LW1vZGFsX19idG4tLXJlZCcpO1xyXG5cclxuICB0aXRsZS50ZXh0Q29udGVudCA9ICfQktGL0LnRgtC4INC40Lcg0LDQutC60LDRg9C90YLQsD8nO1xyXG4gIGNvbmZpcm1CdG4udGV4dENvbnRlbnQgPSAn0JLRi9C50YLQuCc7XHJcblxyXG4gIG1vZGFsLmFwcGVuZChjbG9zZUJ0bik7XHJcbiAgbW9kYWwuYXBwZW5kKHRpdGxlKTtcclxuICBtb2RhbC5hcHBlbmQoY29uZmlybUJ0bik7XHJcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZGFya0JhY2tncm91bmQpO1xyXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKG1vZGFsKTtcclxuXHJcbiAgbW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XHJcbiAgICB3aXRob3V0U3BhY2UoZXZlbnQudGFyZ2V0KTtcclxuICB9KTtcclxuXHJcbiAgY29uZmlybUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcclxuICAgIHNpZ25PdXQoYXV0aCk7XHJcbiAgfSk7XHJcblxyXG4gIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgbW9kYWwucmVtb3ZlKCk7XHJcbiAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5DaGFuZ2VQYXNzd29yZE1vZGFsKHVzZXIpIHtcclxuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIGNvbnN0IGRhcmtCYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgY29uc3QgY3VycmVudFBhc3N3b3JkSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gIGNvbnN0IG5ld1Bhc3N3b3JkSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gIGNvbnN0IGNvbmZpcm1CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICBjb25zdCBjbG9zZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gIGNvbnN0IGZvcmdvdFBhc3N3b3JkQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgY29uc3QgY3VycmVudFBhc3N3b3JkTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xyXG4gIGNvbnN0IG5ld1Bhc3N3b3JkTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xyXG4gIGNvbnN0IG5ld1Bhc3N3b3JkRXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgY29uc3QgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuXHJcbiAgY3VycmVudFBhc3N3b3JkSW5wdXQudHlwZSA9ICdwYXNzd29yZCc7XHJcbiAgbmV3UGFzc3dvcmRJbnB1dC50eXBlID0gJ3Bhc3N3b3JkJztcclxuICBjb25maXJtQnRuLnRleHRDb250ZW50ID0gJ9Ch0LzQtdC90LjRgtGMJztcclxuICBmb3Jnb3RQYXNzd29yZEJ0bi50ZXh0Q29udGVudCA9ICfQryDQt9Cw0LHRi9C7INC/0LDRgNC+0LvRjCc7XHJcblxyXG4gIGRhcmtCYWNrZ3JvdW5kLmNsYXNzTGlzdC5hZGQoJ2RhcmstYmFja2dyb3VuZCcpO1xyXG4gIG1vZGFsLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWwnKTtcclxuICBjdXJyZW50UGFzc3dvcmRMYWJlbC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19sYWJlbCcpO1xyXG4gIG5ld1Bhc3N3b3JkTGFiZWwuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fbGFiZWwnKTtcclxuICBjdXJyZW50UGFzc3dvcmRJbnB1dC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19pbnB1dCcpO1xyXG4gIG5ld1Bhc3N3b3JkSW5wdXQuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9faW5wdXQnKTtcclxuICBjb25maXJtQnRuLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2J0bicpO1xyXG4gIGNsb3NlQnRuLmNsYXNzTGlzdC5hZGQoJ2Nsb3NlLW1vZGFsLWJ0bicpO1xyXG4gIGZvcmdvdFBhc3N3b3JkQnRuLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2Rlc2NyLWJ0bicpO1xyXG4gIG5ld1Bhc3N3b3JkRXJyb3IuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcclxuXHJcbiAgbW9kYWwuc3R5bGUuYm9yZGVyQm90dG9tID0gJ25vbmUnO1xyXG4gIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xyXG5cclxuICBjdXJyZW50UGFzc3dvcmRMYWJlbC5hcHBlbmQoY3VycmVudFBhc3N3b3JkSW5wdXQpO1xyXG4gIG5ld1Bhc3N3b3JkTGFiZWwuYXBwZW5kKG5ld1Bhc3N3b3JkSW5wdXQpO1xyXG4gIG5ld1Bhc3N3b3JkTGFiZWwuYXBwZW5kKG5ld1Bhc3N3b3JkRXJyb3IpO1xyXG4gIG1vZGFsLmFwcGVuZChjbG9zZUJ0bik7XHJcbiAgbW9kYWwuYXBwZW5kKGN1cnJlbnRQYXNzd29yZExhYmVsKTtcclxuICBtb2RhbC5hcHBlbmQobmV3UGFzc3dvcmRMYWJlbCk7XHJcbiAgbW9kYWwuYXBwZW5kKGZvcmdvdFBhc3N3b3JkQnRuKTtcclxuICBtb2RhbC5hcHBlbmQoY29uZmlybUJ0bik7XHJcbiAgbW9kYWwuYXBwZW5kKG1lc3NhZ2UpO1xyXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGRhcmtCYWNrZ3JvdW5kKTtcclxuICBkb2N1bWVudC5ib2R5LmFwcGVuZChtb2RhbCk7XHJcblxyXG4gIHBsYWNlaG9sZGVyKGN1cnJlbnRQYXNzd29yZElucHV0LCAn0JLQstC10LTQuNGC0LUg0YHRgtCw0YDRi9C5INC/0LDRgNC+0LvRjCcpO1xyXG4gIHBsYWNlaG9sZGVyKG5ld1Bhc3N3b3JkSW5wdXQsICfQktCy0LXQtNC40YLQtSDQvdC+0LLRi9C5INC/0LDRgNC+0LvRjCcpO1xyXG4gIHNob3dIaWRlUGFzc3dvcmQoY3VycmVudFBhc3N3b3JkSW5wdXQpO1xyXG4gIHNob3dIaWRlUGFzc3dvcmQobmV3UGFzc3dvcmRJbnB1dCk7XHJcblxyXG4gIG1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xyXG4gICAgd2l0aG91dFNwYWNlKGV2ZW50LnRhcmdldCk7XHJcbiAgICB0cnkge1xyXG4gICAgICB2YWxpZGF0aW9uUGFzc3dvcmQobmV3UGFzc3dvcmRJbnB1dC52YWx1ZS50cmltKCkpO1xyXG4gICAgICBpZiAoY3VycmVudFBhc3N3b3JkSW5wdXQudmFsdWUgIT09ICcnKSB7XHJcbiAgICAgICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgbmV3UGFzc3dvcmRJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGV2ZW50ID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHZhbGlkYXRpb25QYXNzd29yZChldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlLnRyaW0oKSk7XHJcbiAgICAgIG5ld1Bhc3N3b3JkRXJyb3IudGV4dENvbnRlbnQgPSAnJztcclxuICAgICAgbmV3UGFzc3dvcmRJbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdhY2NvdW50LW1vZGFsX19pbnB1dC0tZXJyb3InKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIG5ld1Bhc3N3b3JkRXJyb3IudGV4dENvbnRlbnQgPSBlcnJvci5tZXNzYWdlO1xyXG4gICAgICBuZXdQYXNzd29yZElucHV0LmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2lucHV0LS1lcnJvcicpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBmb3Jnb3RQYXNzd29yZEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcclxuICAgIG1vZGFsLnJlbW92ZSgpO1xyXG4gICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XHJcbiAgICBvcGVuUmVzZXRQYXNzd29yZE1vZGFsKCk7XHJcbiAgfSk7XHJcblxyXG4gIGNvbmZpcm1CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBldmVudCA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBjcmVkZW50aWFsID0gRW1haWxBdXRoUHJvdmlkZXIuY3JlZGVudGlhbCh1c2VyLmVtYWlsLCBjdXJyZW50UGFzc3dvcmRJbnB1dC52YWx1ZS50cmltKCkpO1xyXG4gICAgICBhd2FpdCByZWF1dGhlbnRpY2F0ZVdpdGhDcmVkZW50aWFsKHVzZXIsIGNyZWRlbnRpYWwpO1xyXG4gICAgICBhd2FpdCB1cGRhdGVQYXNzd29yZCh1c2VyLCBuZXdQYXNzd29yZElucHV0LnZhbHVlKTtcclxuICAgICAgbWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvcicpO1xyXG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ21lc3NhZ2UnKTtcclxuICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQn9Cw0YDQvtC70Ywg0LHRi9C7INC40LfQvNC10L3RkdC9Lic7XHJcbiAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgbWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdtZXNzYWdlJyk7XHJcbiAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcclxuICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQktCy0LXQtNGR0L0g0L3QtdCy0LXRgNC90YvQuSDQv9Cw0YDQvtC70YwuJztcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICBtb2RhbC5yZW1vdmUoKTtcclxuICAgIGRhcmtCYWNrZ3JvdW5kLnJlbW92ZSgpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gb3BlbkNoYW5nZUVtYWlsTW9kYWwodXNlcikge1xyXG4gIGNvbnN0IGRhcmtCYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBjb25zdCBuZXdFbWFpbExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcclxuICBjb25zdCBwYXNzd29yZExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcclxuICBjb25zdCBuZXdFbWFpbElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICBjb25zdCBwYXNzd29yZElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICBjb25zdCBjb25maXJtQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgY29uc3QgZm9yZ290UGFzc3dvcmRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICBjb25zdCBjbG9zZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gIGNvbnN0IG5ld0VtYWlsRXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgY29uc3QgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuXHJcbiAgbGV0IGNoZWNrVXBkYXRlRW1haWwgPSBudWxsO1xyXG5cclxuICBkYXJrQmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCdkYXJrLWJhY2tncm91bmQnKTtcclxuICBtb2RhbC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsJyk7XHJcbiAgbmV3RW1haWxMYWJlbC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19sYWJlbCcpO1xyXG4gIHBhc3N3b3JkTGFiZWwuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fbGFiZWwnKTtcclxuICBuZXdFbWFpbElucHV0LmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2lucHV0Jyk7XHJcbiAgcGFzc3dvcmRJbnB1dC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19pbnB1dCcpO1xyXG4gIGZvcmdvdFBhc3N3b3JkQnRuLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2Rlc2NyLWJ0bicpO1xyXG4gIGNvbmZpcm1CdG4uY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fYnRuJyk7XHJcbiAgY2xvc2VCdG4uY2xhc3NMaXN0LmFkZCgnY2xvc2UtbW9kYWwtYnRuJyk7XHJcbiAgbmV3RW1haWxFcnJvci5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xyXG5cclxuICBuZXdFbWFpbElucHV0LnR5cGUgPSAndGV4dCc7XHJcbiAgcGFzc3dvcmRJbnB1dC50eXBlID0gJ3Bhc3N3b3JkJztcclxuICBmb3Jnb3RQYXNzd29yZEJ0bi50ZXh0Q29udGVudCA9ICfQryDQt9Cw0LHRi9C7INC/0LDRgNC+0LvRjCc7XHJcbiAgY29uZmlybUJ0bi50ZXh0Q29udGVudCA9ICfQodC80LXQvdC40YLRjCc7XHJcbiAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcblxyXG4gIG5ld0VtYWlsTGFiZWwuYXBwZW5kKG5ld0VtYWlsSW5wdXQpO1xyXG4gIG5ld0VtYWlsTGFiZWwuYXBwZW5kKG5ld0VtYWlsRXJyb3IpO1xyXG4gIHBhc3N3b3JkTGFiZWwuYXBwZW5kKHBhc3N3b3JkSW5wdXQpO1xyXG4gIG1vZGFsLmFwcGVuZChuZXdFbWFpbExhYmVsKTtcclxuICBtb2RhbC5hcHBlbmQocGFzc3dvcmRMYWJlbCk7XHJcbiAgbW9kYWwuYXBwZW5kKGZvcmdvdFBhc3N3b3JkQnRuKTtcclxuICBtb2RhbC5hcHBlbmQoY29uZmlybUJ0bik7XHJcbiAgbW9kYWwuYXBwZW5kKG1lc3NhZ2UpO1xyXG4gIG1vZGFsLmFwcGVuZChjbG9zZUJ0bik7XHJcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZGFya0JhY2tncm91bmQpO1xyXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKG1vZGFsKTtcclxuXHJcbiAgc2hvd0hpZGVQYXNzd29yZChwYXNzd29yZElucHV0KTtcclxuXHJcbiAgcGxhY2Vob2xkZXIobmV3RW1haWxJbnB1dCwgJ9CS0LLQtdC00LjRgtC1INC90L7QstGD0Y4g0L/QvtGH0YLRgycpO1xyXG4gIHBsYWNlaG9sZGVyKHBhc3N3b3JkSW5wdXQsICfQktCy0LXQtNC40YLQtSDQv9Cw0YDQvtC70YwnKTtcclxuXHJcbiAgbW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XHJcbiAgICB3aXRob3V0U3BhY2UoZXZlbnQudGFyZ2V0KTtcclxuICAgIHRyeSB7XHJcbiAgICAgIHZhbGlkYXRpb25FbWFpbChuZXdFbWFpbElucHV0LnZhbHVlLnRyaW0oKSk7XHJcbiAgICAgIGlmIChwYXNzd29yZElucHV0LnZhbHVlICE9PSAnJykge1xyXG4gICAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGZvcmdvdFBhc3N3b3JkQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgbW9kYWwucmVtb3ZlKCk7XHJcbiAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcclxuICAgIG9wZW5SZXNldFBhc3N3b3JkTW9kYWwoKTtcclxuICB9KTtcclxuXHJcbiAgbmV3RW1haWxJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGV2ZW50ID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHZhbGlkYXRpb25FbWFpbChldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlLnRyaW0oKSk7XHJcbiAgICAgIG5ld0VtYWlsRXJyb3IudGV4dENvbnRlbnQgPSAnJztcclxuICAgICAgbmV3RW1haWxJbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdhY2NvdW50LW1vZGFsX19pbnB1dC0tZXJyb3InKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIG5ld0VtYWlsRXJyb3IudGV4dENvbnRlbnQgPSBlcnJvci5tZXNzYWdlO1xyXG4gICAgICBuZXdFbWFpbElucHV0LmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2lucHV0LS1lcnJvcicpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcclxuICAgIG1vZGFsLnJlbW92ZSgpO1xyXG4gICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XHJcbiAgfSk7XHJcblxyXG4gIGNvbmZpcm1CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBldmVudCA9PiB7XHJcbiAgICBjbGVhckludGVydmFsKGNoZWNrVXBkYXRlRW1haWwpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgY3JlZGVudGlhbCA9IEVtYWlsQXV0aFByb3ZpZGVyLmNyZWRlbnRpYWwodXNlci5lbWFpbCwgY3VycmVudFBhc3N3b3JkSW5wdXQudmFsdWUudHJpbSgpKTtcclxuICAgICAgYXdhaXQgcmVhdXRoZW50aWNhdGVXaXRoQ3JlZGVudGlhbCh1c2VyLCBjcmVkZW50aWFsKTtcclxuICAgICAgYXdhaXQgdmVyaWZ5QmVmb3JlVXBkYXRlRW1haWwodXNlciwgbmV3RW1haWxJbnB1dC52YWx1ZS50cmltKCkpO1xyXG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2Vycm9yJyk7XHJcbiAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnbWVzc2FnZScpO1xyXG4gICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9Cd0LAg0LLQsNGI0YMg0Y3Qu9C10LrRgtGA0L7QvdC90YPRjiDQv9C+0YfRgtGDINC+0YLQv9GA0LDQstC70LXQvdC+INC/0LjRgdGM0LzQviDRgSDQv9C+0LTRgtCy0LXRgNC20LTQtdC90LjQtdC8Lic7XHJcbiAgICAgIGNoZWNrVXBkYXRlRW1haWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgdXNlci5yZWxvYWQoKTtcclxuICAgICAgfSwgMTAwMCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ21lc3NhZ2UnKTtcclxuICAgICAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xyXG4gICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9CS0LLQtdC00LXQvSDQvdC10LLQtdGA0L3Ri9C5INC/0LDRgNC+0LvRjC4nO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcbiJdLCJmaWxlIjoidXNlci9tb2RhbHMuanMifQ==
