import app from '../firebase.js';
import { validationEmail, validationPassword } from './validation.js';
import { getAuth, sendPasswordResetEmail, EmailAuthProvider, reauthenticateWithCredential, deleteUser, signOut, updatePassword } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';
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
  emailInput.placeholder = 'Введите email';

  confirmBtn.disabled = true;

  label.append(emailInput);
  label.append(emailError);
  modal.append(closeBtn);
  modal.append(title);
  modal.append(label);
  modal.append(confirmBtn);
  document.body.append(darkBackground);
  document.body.append(modal);

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
  const passwordInput = document.createElement('input');
  const title = document.createElement('h2');
  const closeBtn = document.createElement('button');
  const confirmBtn = document.createElement('button');
  const message = document.createElement('p');

  darkBackground.classList.add('dark-background');
  modal.classList.add('account-modal');
  passwordInput.classList.add('account-modal__input');
  title.classList.add('account-modal__title');
  closeBtn.classList.add('close-modal-btn');
  confirmBtn.classList.add('account-modal__btn', 'account-modal__btn--red');
  message.classList.add('error');

  passwordInput.type = 'password';
  passwordInput.placeholder = 'Введите пароль';
  title.textContent = 'Удаление аккаунта';
  confirmBtn.textContent = 'Удалить аккаунт';
  confirmBtn.disabled = true;

  modal.append(closeBtn);
  modal.append(title);
  modal.append(passwordInput);
  modal.append(confirmBtn);
  modal.append(message);
  document.body.append(darkBackground);
  document.body.append(modal);

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
  const currentPasswordLabel = document.createElement('label');
  const newPasswordLabel = document.createElement('label');
  const newPasswordError = document.createElement('p');
  const message = document.createElement('p');

  currentPasswordInput.type = 'password';
  currentPasswordInput.placeholder = 'Введите старый пароль';
  newPasswordInput.type = 'password';
  newPasswordInput.placeholder = 'Введите новый пароль';
  confirmBtn.textContent = 'Сменить';

  darkBackground.classList.add('dark-background');
  modal.classList.add('account-modal');
  currentPasswordLabel.classList.add('account-modal__label');
  newPasswordLabel.classList.add('account-modal__label');
  currentPasswordInput.classList.add('account-modal__input');
  newPasswordInput.classList.add('account-modal__input');
  confirmBtn.classList.add('account-modal__btn');
  closeBtn.classList.add('close-modal-btn');
  newPasswordError.classList.add('error');

  modal.style.borderBottom = 'none';
  confirmBtn.disabled = true;

  currentPasswordLabel.append(currentPasswordInput);
  newPasswordLabel.append(newPasswordInput);
  newPasswordLabel.append(newPasswordError);
  modal.append(closeBtn);
  modal.append(currentPasswordLabel);
  modal.append(newPasswordLabel);
  modal.append(confirmBtn);
  modal.append(message);
  document.body.append(darkBackground);
  document.body.append(modal);

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhdXRoL21vZGFscy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXBwIGZyb20gJy4uL2ZpcmViYXNlLmpzJztcbmltcG9ydCB7IHZhbGlkYXRpb25FbWFpbCwgdmFsaWRhdGlvblBhc3N3b3JkIH0gZnJvbSAnLi92YWxpZGF0aW9uLmpzJztcbmltcG9ydCB7IGdldEF1dGgsIHNlbmRQYXNzd29yZFJlc2V0RW1haWwsIEVtYWlsQXV0aFByb3ZpZGVyLCByZWF1dGhlbnRpY2F0ZVdpdGhDcmVkZW50aWFsLCBkZWxldGVVc2VyLCBzaWduT3V0LCB1cGRhdGVQYXNzd29yZCB9IGZyb20gJ2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2ZpcmViYXNlanMvOS4xLjEvZmlyZWJhc2UtYXV0aC5qcyc7XG5jb25zdCBhdXRoID0gZ2V0QXV0aChhcHApO1xuXG5leHBvcnQgZnVuY3Rpb24gb3BlblJlc2V0UGFzc3dvcmRNb2RhbCgpIHtcbiAgY29uc3QgY2xvc2VCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgbG9hZGVyQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICBjb25zdCBkYXJrQmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgY29uc3QgZW1haWxJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gIGNvbnN0IGVtYWlsRXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIGNvbnN0IGNvbmZpcm1CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblxuICBsZXQgc2VuZEFnYWluID0gbnVsbDtcblxuICBjbG9zZUJ0bi5jbGFzc0xpc3QuYWRkKCdjbG9zZS1tb2RhbC1idG4nKTtcbiAgZGFya0JhY2tncm91bmQuY2xhc3NMaXN0LmFkZCgnZGFyay1iYWNrZ3JvdW5kJyk7XG4gIG1vZGFsLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWwnKTtcbiAgdGl0bGUuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fdGl0bGUnKTtcbiAgbGFiZWwuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fbGFiZWwnKTtcbiAgZW1haWxJbnB1dC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19pbnB1dCcpO1xuICBlbWFpbEVycm9yLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG4gIGNvbmZpcm1CdG4uY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9fYnRuJyk7XG4gIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnbWVzc2FnZScpO1xuXG4gIHRpdGxlLnRleHRDb250ZW50ID0gJ9Ch0LHRgNC+0YEg0L/QsNGA0L7Qu9GPJztcbiAgY29uZmlybUJ0bi50ZXh0Q29udGVudCA9ICfQntGC0L/RgNCw0LLQuNGC0Ywg0L/QuNGB0YzQvNC+JztcblxuICBlbWFpbElucHV0LnR5cGUgPSAndGV4dCc7XG4gIGVtYWlsSW5wdXQucGxhY2Vob2xkZXIgPSAn0JLQstC10LTQuNGC0LUgZW1haWwnO1xuXG4gIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuXG4gIGxhYmVsLmFwcGVuZChlbWFpbElucHV0KTtcbiAgbGFiZWwuYXBwZW5kKGVtYWlsRXJyb3IpO1xuICBtb2RhbC5hcHBlbmQoY2xvc2VCdG4pO1xuICBtb2RhbC5hcHBlbmQodGl0bGUpO1xuICBtb2RhbC5hcHBlbmQobGFiZWwpO1xuICBtb2RhbC5hcHBlbmQoY29uZmlybUJ0bik7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGRhcmtCYWNrZ3JvdW5kKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQobW9kYWwpO1xuXG4gIGVtYWlsSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBhc3luYyBldmVudCA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHZhbGlkYXRpb25FbWFpbChlbWFpbElucHV0LnZhbHVlLnRyaW0oKSk7XG4gICAgICBhd2FpdCBzZW5kUGFzc3dvcmRSZXNldEVtYWlsKGF1dGgsIGVtYWlsSW5wdXQudmFsdWUudHJpbSgpKTtcbiAgICAgIGVtYWlsRXJyb3IudGV4dENvbnRlbnQgPSAnJztcbiAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcblxuICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgIGVtYWlsRXJyb3IudGV4dENvbnRlbnQgPSBlcnJvci5tZXNzYWdlO1xuICAgICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcbiAgfSk7XG5cbiAgY29uZmlybUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGV2ZW50ID0+IHtcbiAgICBjbGVhckludGVydmFsKHNlbmRBZ2Fpbik7XG5cbiAgICB0cnkge1xuICAgICAgY29uZmlybUJ0bi5hcHBlbmQobG9hZGVyQnRuKTtcbiAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgICBhd2FpdCBzZW5kUGFzc3dvcmRSZXNldEVtYWlsKGF1dGgsIGVtYWlsSW5wdXQudmFsdWUudHJpbSgpKTtcblxuICAgICAgbG9hZGVyQnRuLnJlbW92ZSgpO1xuICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQndCwINCy0LDRiNGDINGN0LvQtdC60YLRgNC+0L3QvdGD0Y4g0L/QvtGH0YLRgyDQvtGC0L/RgNCw0LLQu9C10L3QviDQv9C40YHRjNC80L4g0YHQviDRgdCx0YDQvtGB0L7QvCDQv9Cw0YDQvtC70Y8uJztcbiAgICAgIGNvbmZpcm1CdG4uYWZ0ZXIobWVzc2FnZSk7XG5cbiAgICAgIHNlbmRBZ2FpbiA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJyc7XG4gICAgICB9LCA1MDAwKTtcblxuXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0KfRgtC+LdGC0L4g0L/QvtGI0LvQviDQvdC1INGC0LDQui4uLic7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5EZWxldGVBY2NvdW50TW9kYWwodXNlcikge1xuICBjb25zdCBkYXJrQmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCBwYXNzd29yZElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICBjb25zdCBjbG9zZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBjb25zdCBjb25maXJtQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cbiAgZGFya0JhY2tncm91bmQuY2xhc3NMaXN0LmFkZCgnZGFyay1iYWNrZ3JvdW5kJyk7XG4gIG1vZGFsLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWwnKTtcbiAgcGFzc3dvcmRJbnB1dC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19pbnB1dCcpO1xuICB0aXRsZS5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX190aXRsZScpO1xuICBjbG9zZUJ0bi5jbGFzc0xpc3QuYWRkKCdjbG9zZS1tb2RhbC1idG4nKTtcbiAgY29uZmlybUJ0bi5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19idG4nLCAnYWNjb3VudC1tb2RhbF9fYnRuLS1yZWQnKTtcbiAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xuXG4gIHBhc3N3b3JkSW5wdXQudHlwZSA9ICdwYXNzd29yZCc7XG4gIHBhc3N3b3JkSW5wdXQucGxhY2Vob2xkZXIgPSAn0JLQstC10LTQuNGC0LUg0L/QsNGA0L7Qu9GMJztcbiAgdGl0bGUudGV4dENvbnRlbnQgPSAn0KPQtNCw0LvQtdC90LjQtSDQsNC60LrQsNGD0L3RgtCwJztcbiAgY29uZmlybUJ0bi50ZXh0Q29udGVudCA9ICfQo9C00LDQu9C40YLRjCDQsNC60LrQsNGD0L3Rgic7XG4gIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuXG4gIG1vZGFsLmFwcGVuZChjbG9zZUJ0bik7XG4gIG1vZGFsLmFwcGVuZCh0aXRsZSk7XG4gIG1vZGFsLmFwcGVuZChwYXNzd29yZElucHV0KTtcbiAgbW9kYWwuYXBwZW5kKGNvbmZpcm1CdG4pO1xuICBtb2RhbC5hcHBlbmQobWVzc2FnZSk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGRhcmtCYWNrZ3JvdW5kKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQobW9kYWwpO1xuXG4gIHBhc3N3b3JkSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XG4gICAgaWYgKGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWUgPT09ICcnKSB7XG4gICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uZmlybUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGV2ZW50ID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY3JlZGVudGlhbCA9IEVtYWlsQXV0aFByb3ZpZGVyLmNyZWRlbnRpYWwodXNlci5lbWFpbCwgcGFzc3dvcmRJbnB1dC52YWx1ZS50cmltKCkpO1xuICAgICAgYXdhaXQgcmVhdXRoZW50aWNhdGVXaXRoQ3JlZGVudGlhbCh1c2VyLCBjcmVkZW50aWFsKTtcbiAgICAgIGF3YWl0IGRlbGV0ZVVzZXIodXNlcik7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0JLQstC10LTRkdC9INC90LXQstC10YDQvdGL0Lkg0L/QsNGA0L7Qu9GMLic7XG4gICAgfVxuICB9KTtcblxuXG4gIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgIG1vZGFsLnJlbW92ZSgpO1xuICAgIGRhcmtCYWNrZ3JvdW5kLnJlbW92ZSgpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5TaWduT3V0TW9kYWwoKSB7XG4gIGNvbnN0IGRhcmtCYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgY29uc3QgY2xvc2VCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgY29uZmlybUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXG4gIGRhcmtCYWNrZ3JvdW5kLmNsYXNzTGlzdC5hZGQoJ2RhcmstYmFja2dyb3VuZCcpO1xuICBtb2RhbC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsJyk7XG4gIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX3RpdGxlJyk7XG4gIGNsb3NlQnRuLmNsYXNzTGlzdC5hZGQoJ2Nsb3NlLW1vZGFsLWJ0bicpO1xuICBjb25maXJtQnRuLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2J0bicsICdhY2NvdW50LW1vZGFsX19idG4tLXJlZCcpO1xuXG4gIHRpdGxlLnRleHRDb250ZW50ID0gJ9CS0YvQudGC0Lgg0YEg0LDQutC60LDRg9C90YLQsD8nO1xuICBjb25maXJtQnRuLnRleHRDb250ZW50ID0gJ9CS0YvQudGC0LgnO1xuXG4gIG1vZGFsLmFwcGVuZChjbG9zZUJ0bik7XG4gIG1vZGFsLmFwcGVuZCh0aXRsZSk7XG4gIG1vZGFsLmFwcGVuZChjb25maXJtQnRuKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZGFya0JhY2tncm91bmQpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChtb2RhbCk7XG5cbiAgY29uZmlybUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICBzaWduT3V0KGF1dGgpO1xuICB9KTtcblxuICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuQ2hhbmdlUGFzc3dvcmRNb2RhbCh1c2VyKSB7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IGRhcmtCYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IGN1cnJlbnRQYXNzd29yZElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgY29uc3QgbmV3UGFzc3dvcmRJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gIGNvbnN0IGNvbmZpcm1CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgY2xvc2VCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgY3VycmVudFBhc3N3b3JkTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICBjb25zdCBuZXdQYXNzd29yZExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgY29uc3QgbmV3UGFzc3dvcmRFcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgY29uc3QgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblxuICBjdXJyZW50UGFzc3dvcmRJbnB1dC50eXBlID0gJ3Bhc3N3b3JkJztcbiAgY3VycmVudFBhc3N3b3JkSW5wdXQucGxhY2Vob2xkZXIgPSAn0JLQstC10LTQuNGC0LUg0YHRgtCw0YDRi9C5INC/0LDRgNC+0LvRjCc7XG4gIG5ld1Bhc3N3b3JkSW5wdXQudHlwZSA9ICdwYXNzd29yZCc7XG4gIG5ld1Bhc3N3b3JkSW5wdXQucGxhY2Vob2xkZXIgPSAn0JLQstC10LTQuNGC0LUg0L3QvtCy0YvQuSDQv9Cw0YDQvtC70YwnO1xuICBjb25maXJtQnRuLnRleHRDb250ZW50ID0gJ9Ch0LzQtdC90LjRgtGMJztcblxuICBkYXJrQmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCdkYXJrLWJhY2tncm91bmQnKTtcbiAgbW9kYWwuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbCcpO1xuICBjdXJyZW50UGFzc3dvcmRMYWJlbC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19sYWJlbCcpO1xuICBuZXdQYXNzd29yZExhYmVsLmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2xhYmVsJyk7XG4gIGN1cnJlbnRQYXNzd29yZElucHV0LmNsYXNzTGlzdC5hZGQoJ2FjY291bnQtbW9kYWxfX2lucHV0Jyk7XG4gIG5ld1Bhc3N3b3JkSW5wdXQuY2xhc3NMaXN0LmFkZCgnYWNjb3VudC1tb2RhbF9faW5wdXQnKTtcbiAgY29uZmlybUJ0bi5jbGFzc0xpc3QuYWRkKCdhY2NvdW50LW1vZGFsX19idG4nKTtcbiAgY2xvc2VCdG4uY2xhc3NMaXN0LmFkZCgnY2xvc2UtbW9kYWwtYnRuJyk7XG4gIG5ld1Bhc3N3b3JkRXJyb3IuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcblxuICBtb2RhbC5zdHlsZS5ib3JkZXJCb3R0b20gPSAnbm9uZSc7XG4gIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuXG4gIGN1cnJlbnRQYXNzd29yZExhYmVsLmFwcGVuZChjdXJyZW50UGFzc3dvcmRJbnB1dCk7XG4gIG5ld1Bhc3N3b3JkTGFiZWwuYXBwZW5kKG5ld1Bhc3N3b3JkSW5wdXQpO1xuICBuZXdQYXNzd29yZExhYmVsLmFwcGVuZChuZXdQYXNzd29yZEVycm9yKTtcbiAgbW9kYWwuYXBwZW5kKGNsb3NlQnRuKTtcbiAgbW9kYWwuYXBwZW5kKGN1cnJlbnRQYXNzd29yZExhYmVsKTtcbiAgbW9kYWwuYXBwZW5kKG5ld1Bhc3N3b3JkTGFiZWwpO1xuICBtb2RhbC5hcHBlbmQoY29uZmlybUJ0bik7XG4gIG1vZGFsLmFwcGVuZChtZXNzYWdlKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZGFya0JhY2tncm91bmQpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChtb2RhbCk7XG5cbiAgbW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHZhbGlkYXRpb25QYXNzd29yZChuZXdQYXNzd29yZElucHV0LnZhbHVlLnRyaW0oKSk7XG4gICAgICBpZiAoY3VycmVudFBhc3N3b3JkSW5wdXQudmFsdWUgIT09ICcnKSB7XG4gICAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIG5ld1Bhc3N3b3JkSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHZhbGlkYXRpb25QYXNzd29yZChldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlLnRyaW0oKSk7XG4gICAgICBuZXdQYXNzd29yZEVycm9yLnRleHRDb250ZW50ID0gJyc7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIG5ld1Bhc3N3b3JkRXJyb3IudGV4dENvbnRlbnQgPSBlcnJvci5tZXNzYWdlO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uZmlybUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGV2ZW50ID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY3JlZGVudGlhbCA9IEVtYWlsQXV0aFByb3ZpZGVyLmNyZWRlbnRpYWwodXNlci5lbWFpbCwgY3VycmVudFBhc3N3b3JkSW5wdXQudmFsdWUudHJpbSgpKTtcbiAgICAgIGF3YWl0IHJlYXV0aGVudGljYXRlV2l0aENyZWRlbnRpYWwodXNlciwgY3JlZGVudGlhbCk7XG4gICAgICBhd2FpdCB1cGRhdGVQYXNzd29yZCh1c2VyLCBuZXdQYXNzd29yZElucHV0LnZhbHVlKTtcbiAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnZXJyb3InKTtcbiAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnbWVzc2FnZScpO1xuICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQn9Cw0YDQvtC70Ywg0LHRi9C7INC40LfQvNC10L3RkdC9Lic7XG4gICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdtZXNzYWdlJyk7XG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG4gICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9CS0LLQtdC00ZHQvSDQvdC10LLQtdGA0L3Ri9C5INC/0LDRgNC+0LvRjC4nO1xuICAgIH1cbiAgfSk7XG5cbiAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgbW9kYWwucmVtb3ZlKCk7XG4gICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XG4gIH0pO1xufVxuIl0sImZpbGUiOiJhdXRoL21vZGFscy5qcyJ9
