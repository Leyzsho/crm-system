import app from '../utils/firebase-init.js';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, deleteUser, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';
import { validationEmail, validationPassword } from './validation.js';
import { openResetPasswordModal } from './modals.js';
import { showHidePassword, placeholder, withoutSpace } from '../utils/input.js';
const auth = getAuth(app);

let checkEmailVerified = null;
let isEmailNotVerified = true;

onAuthStateChanged(auth, async (user) => {
  if (user && user.emailVerified) {
    // если пользователь есть в базе данных и он верифицировал email, то прогоняем со страницы
    window.location.href = './account.html';
  } else if (user && !user.emailVerified) {
    if (isEmailNotVerified) {
      // Если пользователь зарегистрировался, но не подтвердил email, и при этом прервал процесс аутентификации, такими действиями как: перезагрузка текущей страницы, переход на другую страницу, то мы удаляем его из базы данных
      deleteUser(user);
      isEmailNotVerified = false;
      return;
    }
    // когда пользователь зарегистрировался, firebase отправляет ему письмо для верификации, поэтому каждое производное время проверяем, подтвердил ли он или нет. Я не знал, как еще можно было реализовать данный момент в реальном времени без обновление страницы
    checkEmailVerified = setInterval(() => {
      user.reload();
      if (user.emailVerified) {
        window.location.href = './account.html';
      }
    }, 1000);
  } else {
    clearInterval(checkEmailVerified);
    isEmailNotVerified = false;
  }
});

const form = document.getElementById('auth');
const formBtn = document.getElementById('form-btn');

const emailInput = document.getElementById('auth-email');
const passwordInput = document.getElementById('auth-password');
const repeatPasswordInput = document.getElementById('auth-repeat-password');

const message = document.createElement('p');
const emailError = document.getElementById('auth-email-error');
const passwordError = document.getElementById('auth-password-error');
const repeatPasswordError = document.getElementById('auth-repeat-password-error');

placeholder(emailInput, 'Введите почту');
placeholder(passwordInput, 'Введите пароль');
showHidePassword(passwordInput);

document.getElementById('loader').remove();
document.querySelector('.main').classList.remove('main--hidden');

formBtn.disabled = true;

form.addEventListener('input', event => {
  withoutSpace(event.target);
});

emailInput.addEventListener('input', event => {
  try {
    validationEmail(emailInput.value);
    emailError.textContent = '';
    emailInput.classList.remove('auth__input--error');
  } catch (error) {
    emailInput.classList.add('auth__input--error');
    emailError.textContent = error.message;
  }
});

if (window.location.pathname.includes('/register.html')) {
  placeholder(repeatPasswordInput, 'Повторите пароль');
  showHidePassword(repeatPasswordInput);
  // Проверяет валидность данных
  form.addEventListener('input', event => {
    try {
      validationEmail(emailInput.value);
      validationPassword(passwordInput.value);
      if (repeatPasswordInput.value === passwordInput.value) {
        formBtn.disabled = false;
      } else {
        formBtn.disabled = true;
      }
    } catch (error) {
      formBtn.disabled = true;
    }
  });

  passwordInput.addEventListener('input', event => {
    if (repeatPasswordInput.value === passwordInput.value) {
      repeatPasswordError.textContent = '';
      repeatPasswordInput.classList.remove('auth__input--error');
    } else {
      repeatPasswordError.textContent = 'Пароли не совпадают.';
      repeatPasswordInput.classList.add('auth__input--error');
    }
    try {
      validationPassword(passwordInput.value);
      passwordError.textContent = '';
       passwordInput.classList.remove('auth__input--error');
    } catch (error) {
      passwordError.textContent = error.message;
       passwordInput.classList.add('auth__input--error');
    }
  });

  repeatPasswordInput.addEventListener('input', event => {
    if (repeatPasswordInput.value === passwordInput.value) {
      repeatPasswordError.textContent = '';
      repeatPasswordInput.classList.remove('auth__input--error');
    } else {
      repeatPasswordError.textContent = 'Пароли не совпадают.';
      repeatPasswordInput.classList.add('auth__input--error');
    }
  });
} else if (window.location.pathname.includes('/login.html')) {
  const forgotPasswordBtn = document.getElementById('auth-forgot-password');
  forgotPasswordBtn.addEventListener('click', async event => {
    openResetPasswordModal();
  });

  form.addEventListener('input', event => {
    try {
      validationEmail(emailInput.value);
      if (passwordInput.value !== '') {
        formBtn.disabled = false;
      } else {
        formBtn.disabled = true;
      }
    } catch (error) {
      formBtn.disabled = true;
    }
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  formBtn.after(message);

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const loaderBtn = document.createElement('span');

  formBtn.disabled = true;
  formBtn.append(loaderBtn);
  // Если эта страница для регистрации
  if (window.location.pathname.includes('/register.html')) {
    // Кнопка для отмены аутентификации
    const cancelAuthBtn = document.createElement('button');
    cancelAuthBtn.classList.add('auth__descr-btn');
    cancelAuthBtn.textContent = 'Отменить аутентификацию';

    try {
      // Создаем пользователя и добавляем в базу данных
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Присылаем письмо для верификации
      await sendEmailVerification(user);
      message.classList.remove('error');
      message.classList.add('message');
      message.textContent = 'На вашу электронную почту отправлено письмо с подтверждением.';
      message.after(cancelAuthBtn);

      // отменяем регистрацию: удаляем пользователя из базы данных, очищаем input-ы и т.д.
      cancelAuthBtn.addEventListener('click', async event => {
        form.querySelectorAll('input').forEach(input => {input.value = ''});
        await deleteUser(user);
        cancelAuthBtn.remove();
        message.textContent = '';
        message.remove();
        formBtn.disabled = false;
      });
    } catch (error) {
      // ошибки сервера, то бишь firebase и возвращение формы к начальному состоянию
      message.classList.remove('message');
      message.classList.add('error');
      switch (error.message) {
        case 'Firebase: Error (auth/email-already-in-use).':
          message.textContent = 'Данная почта уже зарегистрирована.';
          break;
        default:
          message.textContent = 'Что-то пошло не так...';
      }
      cancelAuthBtn.remove();
      formBtn.disabled = false;
    } finally {
      loaderBtn.remove();
    }
  }

  // Если эта страница для входа
  else if (window.location.pathname.includes('/login.html')) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch(error) {
      // ошибки сервера, то бишь firebase и возвращение формы к начальному состоянию
      message.classList.remove('message');
      message.classList.add('error');
      switch (error.message) {
        case 'Firebase: Error (auth/invalid-login-credentials).':
          message.textContent = 'Неправильно введены почта или пароль.';
          break;
        default:
          message.textContent = 'Что-то пошло не так...';
      }
      formBtn.disabled = false;
    } finally {
      loaderBtn.remove();
    }
  }
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ1c2VyL2F1dGguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFwcCBmcm9tICcuLi91dGlscy9maXJlYmFzZS1pbml0LmpzJztcbmltcG9ydCB7IGdldEF1dGgsIGNyZWF0ZVVzZXJXaXRoRW1haWxBbmRQYXNzd29yZCwgb25BdXRoU3RhdGVDaGFuZ2VkLCBzZW5kRW1haWxWZXJpZmljYXRpb24sIGRlbGV0ZVVzZXIsIHNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkIH0gZnJvbSAnaHR0cHM6Ly93d3cuZ3N0YXRpYy5jb20vZmlyZWJhc2Vqcy85LjEuMS9maXJlYmFzZS1hdXRoLmpzJztcbmltcG9ydCB7IHZhbGlkYXRpb25FbWFpbCwgdmFsaWRhdGlvblBhc3N3b3JkIH0gZnJvbSAnLi92YWxpZGF0aW9uLmpzJztcbmltcG9ydCB7IG9wZW5SZXNldFBhc3N3b3JkTW9kYWwgfSBmcm9tICcuL21vZGFscy5qcyc7XG5pbXBvcnQgeyBzaG93SGlkZVBhc3N3b3JkLCBwbGFjZWhvbGRlciwgd2l0aG91dFNwYWNlIH0gZnJvbSAnLi4vdXRpbHMvaW5wdXQuanMnO1xuY29uc3QgYXV0aCA9IGdldEF1dGgoYXBwKTtcblxubGV0IGNoZWNrRW1haWxWZXJpZmllZCA9IG51bGw7XG5sZXQgaXNFbWFpbE5vdFZlcmlmaWVkID0gdHJ1ZTtcblxub25BdXRoU3RhdGVDaGFuZ2VkKGF1dGgsIGFzeW5jICh1c2VyKSA9PiB7XG4gIGlmICh1c2VyICYmIHVzZXIuZW1haWxWZXJpZmllZCkge1xuICAgIC8vINC10YHQu9C4INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCDQtdGB0YLRjCDQsiDQsdCw0LfQtSDQtNCw0L3QvdGL0YUg0Lgg0L7QvSDQstC10YDQuNGE0LjRhtC40YDQvtCy0LDQuyBlbWFpbCwg0YLQviDQv9GA0L7Qs9C+0L3Rj9C10Lwg0YHQviDRgdGC0YDQsNC90LjRhtGLXG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi9hY2NvdW50Lmh0bWwnO1xuICB9IGVsc2UgaWYgKHVzZXIgJiYgIXVzZXIuZW1haWxWZXJpZmllZCkge1xuICAgIGlmIChpc0VtYWlsTm90VmVyaWZpZWQpIHtcbiAgICAgIC8vINCV0YHQu9C4INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCDQt9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0LvRgdGPLCDQvdC+INC90LUg0L/QvtC00YLQstC10YDQtNC40LsgZW1haWwsINC4INC/0YDQuCDRjdGC0L7QvCDQv9GA0LXRgNCy0LDQuyDQv9GA0L7RhtC10YHRgSDQsNGD0YLQtdC90YLQuNGE0LjQutCw0YbQuNC4LCDRgtCw0LrQuNC80Lgg0LTQtdC50YHRgtCy0LjRj9C80Lgg0LrQsNC6OiDQv9C10YDQtdC30LDQs9GA0YPQt9C60LAg0YLQtdC60YPRidC10Lkg0YHRgtGA0LDQvdC40YbRiywg0L/QtdGA0LXRhdC+0LQg0L3QsCDQtNGA0YPQs9GD0Y4g0YHRgtGA0LDQvdC40YbRgywg0YLQviDQvNGLINGD0LTQsNC70Y/QtdC8INC10LPQviDQuNC3INCx0LDQt9GLINC00LDQvdC90YvRhVxuICAgICAgZGVsZXRlVXNlcih1c2VyKTtcbiAgICAgIGlzRW1haWxOb3RWZXJpZmllZCA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyDQutC+0LPQtNCwINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCDQt9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0LvRgdGPLCBmaXJlYmFzZSDQvtGC0L/RgNCw0LLQu9GP0LXRgiDQtdC80YMg0L/QuNGB0YzQvNC+INC00LvRjyDQstC10YDQuNGE0LjQutCw0YbQuNC4LCDQv9C+0Y3RgtC+0LzRgyDQutCw0LbQtNC+0LUg0L/RgNC+0LjQt9Cy0L7QtNC90L7QtSDQstGA0LXQvNGPINC/0YDQvtCy0LXRgNGP0LXQvCwg0L/QvtC00YLQstC10YDQtNC40Lsg0LvQuCDQvtC9INC40LvQuCDQvdC10YIuINCvINC90LUg0LfQvdCw0LssINC60LDQuiDQtdGJ0LUg0LzQvtC20L3QviDQsdGL0LvQviDRgNC10LDQu9C40LfQvtCy0LDRgtGMINC00LDQvdC90YvQuSDQvNC+0LzQtdC90YIg0LIg0YDQtdCw0LvRjNC90L7QvCDQstGA0LXQvNC10L3QuCDQsdC10Lcg0L7QsdC90L7QstC70LXQvdC40LUg0YHRgtGA0LDQvdC40YbRi1xuICAgIGNoZWNrRW1haWxWZXJpZmllZCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIHVzZXIucmVsb2FkKCk7XG4gICAgICBpZiAodXNlci5lbWFpbFZlcmlmaWVkKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4vYWNjb3VudC5odG1sJztcbiAgICAgIH1cbiAgICB9LCAxMDAwKTtcbiAgfSBlbHNlIHtcbiAgICBjbGVhckludGVydmFsKGNoZWNrRW1haWxWZXJpZmllZCk7XG4gICAgaXNFbWFpbE5vdFZlcmlmaWVkID0gZmFsc2U7XG4gIH1cbn0pO1xuXG5jb25zdCBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dGgnKTtcbmNvbnN0IGZvcm1CdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9ybS1idG4nKTtcblxuY29uc3QgZW1haWxJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRoLWVtYWlsJyk7XG5jb25zdCBwYXNzd29yZElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dGgtcGFzc3dvcmQnKTtcbmNvbnN0IHJlcGVhdFBhc3N3b3JkSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0aC1yZXBlYXQtcGFzc3dvcmQnKTtcblxuY29uc3QgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbmNvbnN0IGVtYWlsRXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0aC1lbWFpbC1lcnJvcicpO1xuY29uc3QgcGFzc3dvcmRFcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRoLXBhc3N3b3JkLWVycm9yJyk7XG5jb25zdCByZXBlYXRQYXNzd29yZEVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dGgtcmVwZWF0LXBhc3N3b3JkLWVycm9yJyk7XG5cbnBsYWNlaG9sZGVyKGVtYWlsSW5wdXQsICfQktCy0LXQtNC40YLQtSDQv9C+0YfRgtGDJyk7XG5wbGFjZWhvbGRlcihwYXNzd29yZElucHV0LCAn0JLQstC10LTQuNGC0LUg0L/QsNGA0L7Qu9GMJyk7XG5zaG93SGlkZVBhc3N3b3JkKHBhc3N3b3JkSW5wdXQpO1xuXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZGVyJykucmVtb3ZlKCk7XG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFpbicpLmNsYXNzTGlzdC5yZW1vdmUoJ21haW4tLWhpZGRlbicpO1xuXG5mb3JtQnRuLmRpc2FibGVkID0gdHJ1ZTtcblxuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGV2ZW50ID0+IHtcbiAgd2l0aG91dFNwYWNlKGV2ZW50LnRhcmdldCk7XG59KTtcblxuZW1haWxJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGV2ZW50ID0+IHtcbiAgdHJ5IHtcbiAgICB2YWxpZGF0aW9uRW1haWwoZW1haWxJbnB1dC52YWx1ZSk7XG4gICAgZW1haWxFcnJvci50ZXh0Q29udGVudCA9ICcnO1xuICAgIGVtYWlsSW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnYXV0aF9faW5wdXQtLWVycm9yJyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZW1haWxJbnB1dC5jbGFzc0xpc3QuYWRkKCdhdXRoX19pbnB1dC0tZXJyb3InKTtcbiAgICBlbWFpbEVycm9yLnRleHRDb250ZW50ID0gZXJyb3IubWVzc2FnZTtcbiAgfVxufSk7XG5cbmlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoJy9yZWdpc3Rlci5odG1sJykpIHtcbiAgcGxhY2Vob2xkZXIocmVwZWF0UGFzc3dvcmRJbnB1dCwgJ9Cf0L7QstGC0L7RgNC40YLQtSDQv9Cw0YDQvtC70YwnKTtcbiAgc2hvd0hpZGVQYXNzd29yZChyZXBlYXRQYXNzd29yZElucHV0KTtcbiAgLy8g0J/RgNC+0LLQtdGA0Y/QtdGCINCy0LDQu9C40LTQvdC+0YHRgtGMINC00LDQvdC90YvRhVxuICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xuICAgIHRyeSB7XG4gICAgICB2YWxpZGF0aW9uRW1haWwoZW1haWxJbnB1dC52YWx1ZSk7XG4gICAgICB2YWxpZGF0aW9uUGFzc3dvcmQocGFzc3dvcmRJbnB1dC52YWx1ZSk7XG4gICAgICBpZiAocmVwZWF0UGFzc3dvcmRJbnB1dC52YWx1ZSA9PT0gcGFzc3dvcmRJbnB1dC52YWx1ZSkge1xuICAgICAgICBmb3JtQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3JtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZm9ybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICBwYXNzd29yZElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xuICAgIGlmIChyZXBlYXRQYXNzd29yZElucHV0LnZhbHVlID09PSBwYXNzd29yZElucHV0LnZhbHVlKSB7XG4gICAgICByZXBlYXRQYXNzd29yZEVycm9yLnRleHRDb250ZW50ID0gJyc7XG4gICAgICByZXBlYXRQYXNzd29yZElucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ2F1dGhfX2lucHV0LS1lcnJvcicpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXBlYXRQYXNzd29yZEVycm9yLnRleHRDb250ZW50ID0gJ9Cf0LDRgNC+0LvQuCDQvdC1INGB0L7QstC/0LDQtNCw0Y7Rgi4nO1xuICAgICAgcmVwZWF0UGFzc3dvcmRJbnB1dC5jbGFzc0xpc3QuYWRkKCdhdXRoX19pbnB1dC0tZXJyb3InKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHZhbGlkYXRpb25QYXNzd29yZChwYXNzd29yZElucHV0LnZhbHVlKTtcbiAgICAgIHBhc3N3b3JkRXJyb3IudGV4dENvbnRlbnQgPSAnJztcbiAgICAgICBwYXNzd29yZElucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ2F1dGhfX2lucHV0LS1lcnJvcicpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBwYXNzd29yZEVycm9yLnRleHRDb250ZW50ID0gZXJyb3IubWVzc2FnZTtcbiAgICAgICBwYXNzd29yZElucHV0LmNsYXNzTGlzdC5hZGQoJ2F1dGhfX2lucHV0LS1lcnJvcicpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmVwZWF0UGFzc3dvcmRJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGV2ZW50ID0+IHtcbiAgICBpZiAocmVwZWF0UGFzc3dvcmRJbnB1dC52YWx1ZSA9PT0gcGFzc3dvcmRJbnB1dC52YWx1ZSkge1xuICAgICAgcmVwZWF0UGFzc3dvcmRFcnJvci50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgcmVwZWF0UGFzc3dvcmRJbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdhdXRoX19pbnB1dC0tZXJyb3InKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVwZWF0UGFzc3dvcmRFcnJvci50ZXh0Q29udGVudCA9ICfQn9Cw0YDQvtC70Lgg0L3QtSDRgdC+0LLQv9Cw0LTQsNGO0YIuJztcbiAgICAgIHJlcGVhdFBhc3N3b3JkSW5wdXQuY2xhc3NMaXN0LmFkZCgnYXV0aF9faW5wdXQtLWVycm9yJyk7XG4gICAgfVxuICB9KTtcbn0gZWxzZSBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKCcvbG9naW4uaHRtbCcpKSB7XG4gIGNvbnN0IGZvcmdvdFBhc3N3b3JkQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dGgtZm9yZ290LXBhc3N3b3JkJyk7XG4gIGZvcmdvdFBhc3N3b3JkQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZXZlbnQgPT4ge1xuICAgIG9wZW5SZXNldFBhc3N3b3JkTW9kYWwoKTtcbiAgfSk7XG5cbiAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGV2ZW50ID0+IHtcbiAgICB0cnkge1xuICAgICAgdmFsaWRhdGlvbkVtYWlsKGVtYWlsSW5wdXQudmFsdWUpO1xuICAgICAgaWYgKHBhc3N3b3JkSW5wdXQudmFsdWUgIT09ICcnKSB7XG4gICAgICAgIGZvcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBmb3JtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xufVxuXG5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGFzeW5jIChldmVudCkgPT4ge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBmb3JtQnRuLmFmdGVyKG1lc3NhZ2UpO1xuXG4gIGNvbnN0IGVtYWlsID0gZW1haWxJbnB1dC52YWx1ZS50cmltKCk7XG4gIGNvbnN0IHBhc3N3b3JkID0gcGFzc3dvcmRJbnB1dC52YWx1ZS50cmltKCk7XG4gIGNvbnN0IGxvYWRlckJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblxuICBmb3JtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgZm9ybUJ0bi5hcHBlbmQobG9hZGVyQnRuKTtcbiAgLy8g0JXRgdC70Lgg0Y3RgtCwINGB0YLRgNCw0L3QuNGG0LAg0LTQu9GPINGA0LXQs9C40YHRgtGA0LDRhtC40LhcbiAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcygnL3JlZ2lzdGVyLmh0bWwnKSkge1xuICAgIC8vINCa0L3QvtC/0LrQsCDQtNC70Y8g0L7RgtC80LXQvdGLINCw0YPRgtC10L3RgtC40YTQuNC60LDRhtC40LhcbiAgICBjb25zdCBjYW5jZWxBdXRoQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY2FuY2VsQXV0aEJ0bi5jbGFzc0xpc3QuYWRkKCdhdXRoX19kZXNjci1idG4nKTtcbiAgICBjYW5jZWxBdXRoQnRuLnRleHRDb250ZW50ID0gJ9Ce0YLQvNC10L3QuNGC0Ywg0LDRg9GC0LXQvdGC0LjRhNC40LrQsNGG0LjRjic7XG5cbiAgICB0cnkge1xuICAgICAgLy8g0KHQvtC30LTQsNC10Lwg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPINC4INC00L7QsdCw0LLQu9GP0LXQvCDQsiDQsdCw0LfRgyDQtNCw0L3QvdGL0YVcbiAgICAgIGNvbnN0IHVzZXJDcmVkZW50aWFsID0gYXdhaXQgY3JlYXRlVXNlcldpdGhFbWFpbEFuZFBhc3N3b3JkKGF1dGgsIGVtYWlsLCBwYXNzd29yZCk7XG4gICAgICBjb25zdCB1c2VyID0gdXNlckNyZWRlbnRpYWwudXNlcjtcblxuICAgICAgLy8g0J/RgNC40YHRi9C70LDQtdC8INC/0LjRgdGM0LzQviDQtNC70Y8g0LLQtdGA0LjRhNC40LrQsNGG0LjQuFxuICAgICAgYXdhaXQgc2VuZEVtYWlsVmVyaWZpY2F0aW9uKHVzZXIpO1xuICAgICAgbWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvcicpO1xuICAgICAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdtZXNzYWdlJyk7XG4gICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9Cd0LAg0LLQsNGI0YMg0Y3Qu9C10LrRgtGA0L7QvdC90YPRjiDQv9C+0YfRgtGDINC+0YLQv9GA0LDQstC70LXQvdC+INC/0LjRgdGM0LzQviDRgSDQv9C+0LTRgtCy0LXRgNC20LTQtdC90LjQtdC8Lic7XG4gICAgICBtZXNzYWdlLmFmdGVyKGNhbmNlbEF1dGhCdG4pO1xuXG4gICAgICAvLyDQvtGC0LzQtdC90Y/QtdC8INGA0LXQs9C40YHRgtGA0LDRhtC40Y46INGD0LTQsNC70Y/QtdC8INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjyDQuNC3INCx0LDQt9GLINC00LDQvdC90YvRhSwg0L7Rh9C40YnQsNC10LwgaW5wdXQt0Ysg0Lgg0YIu0LQuXG4gICAgICBjYW5jZWxBdXRoQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZXZlbnQgPT4ge1xuICAgICAgICBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0JykuZm9yRWFjaChpbnB1dCA9PiB7aW5wdXQudmFsdWUgPSAnJ30pO1xuICAgICAgICBhd2FpdCBkZWxldGVVc2VyKHVzZXIpO1xuICAgICAgICBjYW5jZWxBdXRoQnRuLnJlbW92ZSgpO1xuICAgICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJyc7XG4gICAgICAgIG1lc3NhZ2UucmVtb3ZlKCk7XG4gICAgICAgIGZvcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyDQvtGI0LjQsdC60Lgg0YHQtdGA0LLQtdGA0LAsINGC0L4g0LHQuNGI0YwgZmlyZWJhc2Ug0Lgg0LLQvtC30LLRgNCw0YnQtdC90LjQtSDRhNC+0YDQvNGLINC6INC90LDRh9Cw0LvRjNC90L7QvNGDINGB0L7RgdGC0L7Rj9C90LjRjlxuICAgICAgbWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdtZXNzYWdlJyk7XG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG4gICAgICBzd2l0Y2ggKGVycm9yLm1lc3NhZ2UpIHtcbiAgICAgICAgY2FzZSAnRmlyZWJhc2U6IEVycm9yIChhdXRoL2VtYWlsLWFscmVhZHktaW4tdXNlKS4nOlxuICAgICAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0JTQsNC90L3QsNGPINC/0L7Rh9GC0LAg0YPQttC1INC30LDRgNC10LPQuNGB0YLRgNC40YDQvtCy0LDQvdCwLic7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQp9GC0L4t0YLQviDQv9C+0YjQu9C+INC90LUg0YLQsNC6Li4uJztcbiAgICAgIH1cbiAgICAgIGNhbmNlbEF1dGhCdG4ucmVtb3ZlKCk7XG4gICAgICBmb3JtQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGxvYWRlckJ0bi5yZW1vdmUoKTtcbiAgICB9XG4gIH1cblxuICAvLyDQldGB0LvQuCDRjdGC0LAg0YHRgtGA0LDQvdC40YbQsCDQtNC70Y8g0LLRhdC+0LTQsFxuICBlbHNlIGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoJy9sb2dpbi5odG1sJykpIHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgc2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQoYXV0aCwgZW1haWwsIHBhc3N3b3JkKTtcbiAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAvLyDQvtGI0LjQsdC60Lgg0YHQtdGA0LLQtdGA0LAsINGC0L4g0LHQuNGI0YwgZmlyZWJhc2Ug0Lgg0LLQvtC30LLRgNCw0YnQtdC90LjQtSDRhNC+0YDQvNGLINC6INC90LDRh9Cw0LvRjNC90L7QvNGDINGB0L7RgdGC0L7Rj9C90LjRjlxuICAgICAgbWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdtZXNzYWdlJyk7XG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG4gICAgICBzd2l0Y2ggKGVycm9yLm1lc3NhZ2UpIHtcbiAgICAgICAgY2FzZSAnRmlyZWJhc2U6IEVycm9yIChhdXRoL2ludmFsaWQtbG9naW4tY3JlZGVudGlhbHMpLic6XG4gICAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQndC10L/RgNCw0LLQuNC70YzQvdC+INCy0LLQtdC00LXQvdGLINC/0L7Rh9GC0LAg0LjQu9C4INC/0LDRgNC+0LvRjC4nO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0KfRgtC+LdGC0L4g0L/QvtGI0LvQviDQvdC1INGC0LDQui4uLic7XG4gICAgICB9XG4gICAgICBmb3JtQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGxvYWRlckJ0bi5yZW1vdmUoKTtcbiAgICB9XG4gIH1cbn0pO1xuIl0sImZpbGUiOiJ1c2VyL2F1dGguanMifQ==
