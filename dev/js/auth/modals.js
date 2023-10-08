import app from '../firebase.js';
import { validationEmail, validationPassword } from './validation.js';
import { getAuth, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';
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

  closeBtn.classList.add('close-modal-btn');
  darkBackground.classList.add('dark-background');
  modal.classList.add('auth__modal');
  title.classList.add('auth__title');
  label.classList.add('auth__label');
  emailInput.classList.add('auth__input');
  emailError.classList.add('descr-error');
  confirmBtn.classList.add('auth__btn');
  message.classList.add('descr-error');

  title.textContent = 'Сброс пароля';
  confirmBtn.textContent = 'Отправить письмо';

  emailInput.type = 'text';
  emailInput.placeholder = 'Введите ваш email';

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

    } catch(error) {
      emailError.textContent = error.message;
    }
  });

  closeBtn.addEventListener('click', event => {
    modal.remove();
    darkBackground.remove();
  });

  confirmBtn.addEventListener('click', async event => {
    if (emailError.textContent !== '') return;

    if (emailInput.value === '') {
      emailError.textContent = 'Пожалуйста, введите email';
      return;
    }

    try {
      confirmBtn.append(loaderBtn);
      confirmBtn.disabled = true;

      await sendPasswordResetEmail(auth, emailInput.value.trim());

      loaderBtn.remove();
      message.textContent = 'На вашу электронную почту отправлено письмо со сбросом пароля.';
      confirmBtn.after(message);

      
    } catch (error) {
      message.textContent = 'Что-то пошло не так...';
    }
  });
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhdXRoL21vZGFscy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXBwIGZyb20gJy4uL2ZpcmViYXNlLmpzJztcbmltcG9ydCB7IHZhbGlkYXRpb25FbWFpbCwgdmFsaWRhdGlvblBhc3N3b3JkIH0gZnJvbSAnLi92YWxpZGF0aW9uLmpzJztcbmltcG9ydCB7IGdldEF1dGgsIHNlbmRQYXNzd29yZFJlc2V0RW1haWwgfSBmcm9tICdodHRwczovL3d3dy5nc3RhdGljLmNvbS9maXJlYmFzZWpzLzkuMS4xL2ZpcmViYXNlLWF1dGguanMnO1xuY29uc3QgYXV0aCA9IGdldEF1dGgoYXBwKTtcblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5SZXNldFBhc3N3b3JkTW9kYWwoKSB7XG4gIGNvbnN0IGNsb3NlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IGxvYWRlckJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgY29uc3QgZGFya0JhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gIGNvbnN0IGVtYWlsSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICBjb25zdCBlbWFpbEVycm9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBjb25zdCBjb25maXJtQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cbiAgY2xvc2VCdG4uY2xhc3NMaXN0LmFkZCgnY2xvc2UtbW9kYWwtYnRuJyk7XG4gIGRhcmtCYWNrZ3JvdW5kLmNsYXNzTGlzdC5hZGQoJ2RhcmstYmFja2dyb3VuZCcpO1xuICBtb2RhbC5jbGFzc0xpc3QuYWRkKCdhdXRoX19tb2RhbCcpO1xuICB0aXRsZS5jbGFzc0xpc3QuYWRkKCdhdXRoX190aXRsZScpO1xuICBsYWJlbC5jbGFzc0xpc3QuYWRkKCdhdXRoX19sYWJlbCcpO1xuICBlbWFpbElucHV0LmNsYXNzTGlzdC5hZGQoJ2F1dGhfX2lucHV0Jyk7XG4gIGVtYWlsRXJyb3IuY2xhc3NMaXN0LmFkZCgnZGVzY3ItZXJyb3InKTtcbiAgY29uZmlybUJ0bi5jbGFzc0xpc3QuYWRkKCdhdXRoX19idG4nKTtcbiAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdkZXNjci1lcnJvcicpO1xuXG4gIHRpdGxlLnRleHRDb250ZW50ID0gJ9Ch0LHRgNC+0YEg0L/QsNGA0L7Qu9GPJztcbiAgY29uZmlybUJ0bi50ZXh0Q29udGVudCA9ICfQntGC0L/RgNCw0LLQuNGC0Ywg0L/QuNGB0YzQvNC+JztcblxuICBlbWFpbElucHV0LnR5cGUgPSAndGV4dCc7XG4gIGVtYWlsSW5wdXQucGxhY2Vob2xkZXIgPSAn0JLQstC10LTQuNGC0LUg0LLQsNGIIGVtYWlsJztcblxuICBsYWJlbC5hcHBlbmQoZW1haWxJbnB1dCk7XG4gIGxhYmVsLmFwcGVuZChlbWFpbEVycm9yKTtcbiAgbW9kYWwuYXBwZW5kKGNsb3NlQnRuKTtcbiAgbW9kYWwuYXBwZW5kKHRpdGxlKTtcbiAgbW9kYWwuYXBwZW5kKGxhYmVsKTtcbiAgbW9kYWwuYXBwZW5kKGNvbmZpcm1CdG4pO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChkYXJrQmFja2dyb3VuZCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKG1vZGFsKTtcblxuICBlbWFpbElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgYXN5bmMgZXZlbnQgPT4ge1xuICAgIHRyeSB7XG4gICAgICB2YWxpZGF0aW9uRW1haWwoZW1haWxJbnB1dC52YWx1ZS50cmltKCkpO1xuICAgICAgYXdhaXQgc2VuZFBhc3N3b3JkUmVzZXRFbWFpbChhdXRoLCBlbWFpbElucHV0LnZhbHVlLnRyaW0oKSk7XG4gICAgICBlbWFpbEVycm9yLnRleHRDb250ZW50ID0gJyc7XG5cbiAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICBlbWFpbEVycm9yLnRleHRDb250ZW50ID0gZXJyb3IubWVzc2FnZTtcbiAgICB9XG4gIH0pO1xuXG4gIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgIG1vZGFsLnJlbW92ZSgpO1xuICAgIGRhcmtCYWNrZ3JvdW5kLnJlbW92ZSgpO1xuICB9KTtcblxuICBjb25maXJtQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZXZlbnQgPT4ge1xuICAgIGlmIChlbWFpbEVycm9yLnRleHRDb250ZW50ICE9PSAnJykgcmV0dXJuO1xuXG4gICAgaWYgKGVtYWlsSW5wdXQudmFsdWUgPT09ICcnKSB7XG4gICAgICBlbWFpbEVycm9yLnRleHRDb250ZW50ID0gJ9Cf0L7QttCw0LvRg9C50YHRgtCwLCDQstCy0LXQtNC40YLQtSBlbWFpbCc7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbmZpcm1CdG4uYXBwZW5kKGxvYWRlckJ0bik7XG4gICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcblxuICAgICAgYXdhaXQgc2VuZFBhc3N3b3JkUmVzZXRFbWFpbChhdXRoLCBlbWFpbElucHV0LnZhbHVlLnRyaW0oKSk7XG5cbiAgICAgIGxvYWRlckJ0bi5yZW1vdmUoKTtcbiAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0J3QsCDQstCw0YjRgyDRjdC70LXQutGC0YDQvtC90L3Rg9GOINC/0L7Rh9GC0YMg0L7RgtC/0YDQsNCy0LvQtdC90L4g0L/QuNGB0YzQvNC+INGB0L4g0YHQsdGA0L7RgdC+0Lwg0L/QsNGA0L7Qu9GPLic7XG4gICAgICBjb25maXJtQnRuLmFmdGVyKG1lc3NhZ2UpO1xuXG4gICAgICBcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQp9GC0L4t0YLQviDQv9C+0YjQu9C+INC90LUg0YLQsNC6Li4uJztcbiAgICB9XG4gIH0pO1xufVxuIl0sImZpbGUiOiJhdXRoL21vZGFscy5qcyJ9
