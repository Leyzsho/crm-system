import app from '../utils/firebase.js';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, deleteUser, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';
import { validationEmail, validationPassword } from './validation.js';
import { openResetPasswordModal } from './modals.js';
import showHidePassword from '../utils/show-hide-password.js';
import placeholder from '../utils/placeholder.js';
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

// общие константы страницы регистрации и входа
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

formBtn.disabled = true;

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

  emailInput.addEventListener('input', event => {
    try {
      validationEmail(emailInput.value);
      emailError.textContent = '';
    } catch (error) {
      emailError.textContent = error.message;
    }
  });

  passwordInput.addEventListener('input', event => {
    if (repeatPasswordInput.value === passwordInput.value) {
      repeatPasswordError.textContent = '';
    } else {
      repeatPasswordError.textContent = 'Пароли не совпадают.';
    }
    try {
      validationPassword(passwordInput.value);
      passwordError.textContent = '';
    } catch (error) {
      passwordError.textContent = error.message;
    }
  });

  repeatPasswordInput.addEventListener('input', event => {
    if (repeatPasswordInput.value === passwordInput.value) {
      repeatPasswordError.textContent = '';
    } else {
      repeatPasswordError.textContent = 'Пароли не совпадают.';;
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

  emailInput.addEventListener('input', event => {
    try {
      validationEmail(emailInput.value);
      emailError.textContent = '';
    } catch (error) {
      emailError.textContent = error.message;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ1c2VyL2F1dGguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFwcCBmcm9tICcuLi91dGlscy9maXJlYmFzZS5qcyc7XG5pbXBvcnQgeyBnZXRBdXRoLCBjcmVhdGVVc2VyV2l0aEVtYWlsQW5kUGFzc3dvcmQsIG9uQXV0aFN0YXRlQ2hhbmdlZCwgc2VuZEVtYWlsVmVyaWZpY2F0aW9uLCBkZWxldGVVc2VyLCBzaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZCB9IGZyb20gJ2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2ZpcmViYXNlanMvOS4xLjEvZmlyZWJhc2UtYXV0aC5qcyc7XG5pbXBvcnQgeyB2YWxpZGF0aW9uRW1haWwsIHZhbGlkYXRpb25QYXNzd29yZCB9IGZyb20gJy4vdmFsaWRhdGlvbi5qcyc7XG5pbXBvcnQgeyBvcGVuUmVzZXRQYXNzd29yZE1vZGFsIH0gZnJvbSAnLi9tb2RhbHMuanMnO1xuaW1wb3J0IHNob3dIaWRlUGFzc3dvcmQgZnJvbSAnLi4vdXRpbHMvc2hvdy1oaWRlLXBhc3N3b3JkLmpzJztcbmltcG9ydCBwbGFjZWhvbGRlciBmcm9tICcuLi91dGlscy9wbGFjZWhvbGRlci5qcyc7XG5jb25zdCBhdXRoID0gZ2V0QXV0aChhcHApO1xuXG5sZXQgY2hlY2tFbWFpbFZlcmlmaWVkID0gbnVsbDtcbmxldCBpc0VtYWlsTm90VmVyaWZpZWQgPSB0cnVlO1xuXG5vbkF1dGhTdGF0ZUNoYW5nZWQoYXV0aCwgYXN5bmMgKHVzZXIpID0+IHtcbiAgaWYgKHVzZXIgJiYgdXNlci5lbWFpbFZlcmlmaWVkKSB7XG4gICAgLy8g0LXRgdC70Lgg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GMINC10YHRgtGMINCyINCx0LDQt9C1INC00LDQvdC90YvRhSDQuCDQvtC9INCy0LXRgNC40YTQuNGG0LjRgNC+0LLQsNC7IGVtYWlsLCDRgtC+INC/0YDQvtCz0L7QvdGP0LXQvCDRgdC+INGB0YLRgNCw0L3QuNGG0YtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuL2FjY291bnQuaHRtbCc7XG4gIH0gZWxzZSBpZiAodXNlciAmJiAhdXNlci5lbWFpbFZlcmlmaWVkKSB7XG4gICAgaWYgKGlzRW1haWxOb3RWZXJpZmllZCkge1xuICAgICAgLy8g0JXRgdC70Lgg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GMINC30LDRgNC10LPQuNGB0YLRgNC40YDQvtCy0LDQu9GB0Y8sINC90L4g0L3QtSDQv9C+0LTRgtCy0LXRgNC00LjQuyBlbWFpbCwg0Lgg0L/RgNC4INGN0YLQvtC8INC/0YDQtdGA0LLQsNC7INC/0YDQvtGG0LXRgdGBINCw0YPRgtC10L3RgtC40YTQuNC60LDRhtC40LgsINGC0LDQutC40LzQuCDQtNC10LnRgdGC0LLQuNGP0LzQuCDQutCw0Lo6INC/0LXRgNC10LfQsNCz0YDRg9C30LrQsCDRgtC10LrRg9GJ0LXQuSDRgdGC0YDQsNC90LjRhtGLLCDQv9C10YDQtdGF0L7QtCDQvdCwINC00YDRg9Cz0YPRjiDRgdGC0YDQsNC90LjRhtGDLCDRgtC+INC80Ysg0YPQtNCw0LvRj9C10Lwg0LXQs9C+INC40Lcg0LHQsNC30Ysg0LTQsNC90L3Ri9GFXG4gICAgICBkZWxldGVVc2VyKHVzZXIpO1xuICAgICAgaXNFbWFpbE5vdFZlcmlmaWVkID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vINC60L7Qs9C00LAg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GMINC30LDRgNC10LPQuNGB0YLRgNC40YDQvtCy0LDQu9GB0Y8sIGZpcmViYXNlINC+0YLQv9GA0LDQstC70Y/QtdGCINC10LzRgyDQv9C40YHRjNC80L4g0LTQu9GPINCy0LXRgNC40YTQuNC60LDRhtC40LgsINC/0L7RjdGC0L7QvNGDINC60LDQttC00L7QtSDQv9GA0L7QuNC30LLQvtC00L3QvtC1INCy0YDQtdC80Y8g0L/RgNC+0LLQtdGA0Y/QtdC8LCDQv9C+0LTRgtCy0LXRgNC00LjQuyDQu9C4INC+0L0g0LjQu9C4INC90LXRgi4g0K8g0L3QtSDQt9C90LDQuywg0LrQsNC6INC10YnQtSDQvNC+0LbQvdC+INCx0YvQu9C+INGA0LXQsNC70LjQt9C+0LLQsNGC0Ywg0LTQsNC90L3Ri9C5INC80L7QvNC10L3RgiDQsiDRgNC10LDQu9GM0L3QvtC8INCy0YDQtdC80LXQvdC4INCx0LXQtyDQvtCx0L3QvtCy0LvQtdC90LjQtSDRgdGC0YDQsNC90LjRhtGLXG4gICAgY2hlY2tFbWFpbFZlcmlmaWVkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgdXNlci5yZWxvYWQoKTtcbiAgICAgIGlmICh1c2VyLmVtYWlsVmVyaWZpZWQpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi9hY2NvdW50Lmh0bWwnO1xuICAgICAgfVxuICAgIH0sIDEwMDApO1xuICB9IGVsc2Uge1xuICAgIGNsZWFySW50ZXJ2YWwoY2hlY2tFbWFpbFZlcmlmaWVkKTtcbiAgICBpc0VtYWlsTm90VmVyaWZpZWQgPSBmYWxzZTtcbiAgfVxufSk7XG5cbi8vINC+0LHRidC40LUg0LrQvtC90YHRgtCw0L3RgtGLINGB0YLRgNCw0L3QuNGG0Ysg0YDQtdCz0LjRgdGC0YDQsNGG0LjQuCDQuCDQstGF0L7QtNCwXG5jb25zdCBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dGgnKTtcbmNvbnN0IGZvcm1CdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9ybS1idG4nKTtcblxuY29uc3QgZW1haWxJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRoLWVtYWlsJyk7XG5jb25zdCBwYXNzd29yZElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dGgtcGFzc3dvcmQnKTtcbmNvbnN0IHJlcGVhdFBhc3N3b3JkSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0aC1yZXBlYXQtcGFzc3dvcmQnKTtcblxuY29uc3QgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbmNvbnN0IGVtYWlsRXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0aC1lbWFpbC1lcnJvcicpO1xuY29uc3QgcGFzc3dvcmRFcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRoLXBhc3N3b3JkLWVycm9yJyk7XG5jb25zdCByZXBlYXRQYXNzd29yZEVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dGgtcmVwZWF0LXBhc3N3b3JkLWVycm9yJyk7XG5cbnBsYWNlaG9sZGVyKGVtYWlsSW5wdXQsICfQktCy0LXQtNC40YLQtSDQv9C+0YfRgtGDJyk7XG5wbGFjZWhvbGRlcihwYXNzd29yZElucHV0LCAn0JLQstC10LTQuNGC0LUg0L/QsNGA0L7Qu9GMJyk7XG5zaG93SGlkZVBhc3N3b3JkKHBhc3N3b3JkSW5wdXQpO1xuXG5mb3JtQnRuLmRpc2FibGVkID0gdHJ1ZTtcblxuaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcygnL3JlZ2lzdGVyLmh0bWwnKSkge1xuICBwbGFjZWhvbGRlcihyZXBlYXRQYXNzd29yZElucHV0LCAn0J/QvtCy0YLQvtGA0LjRgtC1INC/0LDRgNC+0LvRjCcpO1xuICBzaG93SGlkZVBhc3N3b3JkKHJlcGVhdFBhc3N3b3JkSW5wdXQpO1xuICAvLyDQn9GA0L7QstC10YDRj9C10YIg0LLQsNC70LjQtNC90L7RgdGC0Ywg0LTQsNC90L3Ri9GFXG4gIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHZhbGlkYXRpb25FbWFpbChlbWFpbElucHV0LnZhbHVlKTtcbiAgICAgIHZhbGlkYXRpb25QYXNzd29yZChwYXNzd29yZElucHV0LnZhbHVlKTtcbiAgICAgIGlmIChyZXBlYXRQYXNzd29yZElucHV0LnZhbHVlID09PSBwYXNzd29yZElucHV0LnZhbHVlKSB7XG4gICAgICAgIGZvcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBmb3JtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIGVtYWlsSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHZhbGlkYXRpb25FbWFpbChlbWFpbElucHV0LnZhbHVlKTtcbiAgICAgIGVtYWlsRXJyb3IudGV4dENvbnRlbnQgPSAnJztcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZW1haWxFcnJvci50ZXh0Q29udGVudCA9IGVycm9yLm1lc3NhZ2U7XG4gICAgfVxuICB9KTtcblxuICBwYXNzd29yZElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xuICAgIGlmIChyZXBlYXRQYXNzd29yZElucHV0LnZhbHVlID09PSBwYXNzd29yZElucHV0LnZhbHVlKSB7XG4gICAgICByZXBlYXRQYXNzd29yZEVycm9yLnRleHRDb250ZW50ID0gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcGVhdFBhc3N3b3JkRXJyb3IudGV4dENvbnRlbnQgPSAn0J/QsNGA0L7Qu9C4INC90LUg0YHQvtCy0L/QsNC00LDRjtGCLic7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICB2YWxpZGF0aW9uUGFzc3dvcmQocGFzc3dvcmRJbnB1dC52YWx1ZSk7XG4gICAgICBwYXNzd29yZEVycm9yLnRleHRDb250ZW50ID0gJyc7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHBhc3N3b3JkRXJyb3IudGV4dENvbnRlbnQgPSBlcnJvci5tZXNzYWdlO1xuICAgIH1cbiAgfSk7XG5cbiAgcmVwZWF0UGFzc3dvcmRJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGV2ZW50ID0+IHtcbiAgICBpZiAocmVwZWF0UGFzc3dvcmRJbnB1dC52YWx1ZSA9PT0gcGFzc3dvcmRJbnB1dC52YWx1ZSkge1xuICAgICAgcmVwZWF0UGFzc3dvcmRFcnJvci50ZXh0Q29udGVudCA9ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXBlYXRQYXNzd29yZEVycm9yLnRleHRDb250ZW50ID0gJ9Cf0LDRgNC+0LvQuCDQvdC1INGB0L7QstC/0LDQtNCw0Y7Rgi4nOztcbiAgICB9XG4gIH0pO1xufSBlbHNlIGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoJy9sb2dpbi5odG1sJykpIHtcblxuICBjb25zdCBmb3Jnb3RQYXNzd29yZEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRoLWZvcmdvdC1wYXNzd29yZCcpO1xuICBmb3Jnb3RQYXNzd29yZEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGV2ZW50ID0+IHtcbiAgICBvcGVuUmVzZXRQYXNzd29yZE1vZGFsKCk7XG4gIH0pO1xuXG4gIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHZhbGlkYXRpb25FbWFpbChlbWFpbElucHV0LnZhbHVlKTtcbiAgICAgIGlmIChwYXNzd29yZElucHV0LnZhbHVlICE9PSAnJykge1xuICAgICAgICBmb3JtQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3JtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZm9ybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICBlbWFpbElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xuICAgIHRyeSB7XG4gICAgICB2YWxpZGF0aW9uRW1haWwoZW1haWxJbnB1dC52YWx1ZSk7XG4gICAgICBlbWFpbEVycm9yLnRleHRDb250ZW50ID0gJyc7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGVtYWlsRXJyb3IudGV4dENvbnRlbnQgPSBlcnJvci5tZXNzYWdlO1xuICAgIH1cbiAgfSk7XG59XG5cbmZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgYXN5bmMgKGV2ZW50KSA9PiB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIGZvcm1CdG4uYWZ0ZXIobWVzc2FnZSk7XG5cbiAgY29uc3QgZW1haWwgPSBlbWFpbElucHV0LnZhbHVlLnRyaW0oKTtcbiAgY29uc3QgcGFzc3dvcmQgPSBwYXNzd29yZElucHV0LnZhbHVlLnRyaW0oKTtcbiAgY29uc3QgbG9hZGVyQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXG4gIGZvcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuICBmb3JtQnRuLmFwcGVuZChsb2FkZXJCdG4pO1xuICAvLyDQldGB0LvQuCDRjdGC0LAg0YHRgtGA0LDQvdC40YbQsCDQtNC70Y8g0YDQtdCz0LjRgdGC0YDQsNGG0LjQuFxuICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKCcvcmVnaXN0ZXIuaHRtbCcpKSB7XG4gICAgLy8g0JrQvdC+0L/QutCwINC00LvRjyDQvtGC0LzQtdC90Ysg0LDRg9GC0LXQvdGC0LjRhNC40LrQsNGG0LjQuFxuICAgIGNvbnN0IGNhbmNlbEF1dGhCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjYW5jZWxBdXRoQnRuLmNsYXNzTGlzdC5hZGQoJ2F1dGhfX2Rlc2NyLWJ0bicpO1xuICAgIGNhbmNlbEF1dGhCdG4udGV4dENvbnRlbnQgPSAn0J7RgtC80LXQvdC40YLRjCDQsNGD0YLQtdC90YLQuNGE0LjQutCw0YbQuNGOJztcblxuICAgIHRyeSB7XG4gICAgICAvLyDQodC+0LfQtNCw0LXQvCDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y8g0Lgg0LTQvtCx0LDQstC70Y/QtdC8INCyINCx0LDQt9GDINC00LDQvdC90YvRhVxuICAgICAgY29uc3QgdXNlckNyZWRlbnRpYWwgPSBhd2FpdCBjcmVhdGVVc2VyV2l0aEVtYWlsQW5kUGFzc3dvcmQoYXV0aCwgZW1haWwsIHBhc3N3b3JkKTtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyQ3JlZGVudGlhbC51c2VyO1xuXG4gICAgICAvLyDQn9GA0LjRgdGL0LvQsNC10Lwg0L/QuNGB0YzQvNC+INC00LvRjyDQstC10YDQuNGE0LjQutCw0YbQuNC4XG4gICAgICBhd2FpdCBzZW5kRW1haWxWZXJpZmljYXRpb24odXNlcik7XG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2Vycm9yJyk7XG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ21lc3NhZ2UnKTtcbiAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0J3QsCDQstCw0YjRgyDRjdC70LXQutGC0YDQvtC90L3Rg9GOINC/0L7Rh9GC0YMg0L7RgtC/0YDQsNCy0LvQtdC90L4g0L/QuNGB0YzQvNC+INGBINC/0L7QtNGC0LLQtdGA0LbQtNC10L3QuNC10LwuJztcbiAgICAgIG1lc3NhZ2UuYWZ0ZXIoY2FuY2VsQXV0aEJ0bik7XG5cbiAgICAgIC8vINC+0YLQvNC10L3Rj9C10Lwg0YDQtdCz0LjRgdGC0YDQsNGG0LjRjjog0YPQtNCw0LvRj9C10Lwg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPINC40Lcg0LHQsNC30Ysg0LTQsNC90L3Ri9GFLCDQvtGH0LjRidCw0LXQvCBpbnB1dC3RiyDQuCDRgi7QtC5cbiAgICAgIGNhbmNlbEF1dGhCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBldmVudCA9PiB7XG4gICAgICAgIGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKS5mb3JFYWNoKGlucHV0ID0+IHtpbnB1dC52YWx1ZSA9ICcnfSk7XG4gICAgICAgIGF3YWl0IGRlbGV0ZVVzZXIodXNlcik7XG4gICAgICAgIGNhbmNlbEF1dGhCdG4ucmVtb3ZlKCk7XG4gICAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgbWVzc2FnZS5yZW1vdmUoKTtcbiAgICAgICAgZm9ybUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8vINC+0YjQuNCx0LrQuCDRgdC10YDQstC10YDQsCwg0YLQviDQsdC40YjRjCBmaXJlYmFzZSDQuCDQstC+0LfQstGA0LDRidC10L3QuNC1INGE0L7RgNC80Ysg0Log0L3QsNGH0LDQu9GM0L3QvtC80YMg0YHQvtGB0YLQvtGP0L3QuNGOXG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ21lc3NhZ2UnKTtcbiAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcbiAgICAgIHN3aXRjaCAoZXJyb3IubWVzc2FnZSkge1xuICAgICAgICBjYXNlICdGaXJlYmFzZTogRXJyb3IgKGF1dGgvZW1haWwtYWxyZWFkeS1pbi11c2UpLic6XG4gICAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQlNCw0L3QvdCw0Y8g0L/QvtGH0YLQsCDRg9C20LUg0LfQsNGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNC90LAuJztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9Cn0YLQvi3RgtC+INC/0L7RiNC70L4g0L3QtSDRgtCw0LouLi4nO1xuICAgICAgfVxuICAgICAgY2FuY2VsQXV0aEJ0bi5yZW1vdmUoKTtcbiAgICAgIGZvcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgbG9hZGVyQnRuLnJlbW92ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8vINCV0YHQu9C4INGN0YLQsCDRgdGC0YDQsNC90LjRhtCwINC00LvRjyDQstGF0L7QtNCwXG4gIGVsc2UgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcygnL2xvZ2luLmh0bWwnKSkge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBzaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZChhdXRoLCBlbWFpbCwgcGFzc3dvcmQpO1xuICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgIC8vINC+0YjQuNCx0LrQuCDRgdC10YDQstC10YDQsCwg0YLQviDQsdC40YjRjCBmaXJlYmFzZSDQuCDQstC+0LfQstGA0LDRidC10L3QuNC1INGE0L7RgNC80Ysg0Log0L3QsNGH0LDQu9GM0L3QvtC80YMg0YHQvtGB0YLQvtGP0L3QuNGOXG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ21lc3NhZ2UnKTtcbiAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcbiAgICAgIHN3aXRjaCAoZXJyb3IubWVzc2FnZSkge1xuICAgICAgICBjYXNlICdGaXJlYmFzZTogRXJyb3IgKGF1dGgvaW52YWxpZC1sb2dpbi1jcmVkZW50aWFscykuJzpcbiAgICAgICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9Cd0LXQv9GA0LDQstC40LvRjNC90L4g0LLQstC10LTQtdC90Ysg0L/QvtGH0YLQsCDQuNC70Lgg0L/QsNGA0L7Qu9GMLic7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQp9GC0L4t0YLQviDQv9C+0YjQu9C+INC90LUg0YLQsNC6Li4uJztcbiAgICAgIH1cbiAgICAgIGZvcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgbG9hZGVyQnRuLnJlbW92ZSgpO1xuICAgIH1cbiAgfVxufSk7XG4iXSwiZmlsZSI6InVzZXIvYXV0aC5qcyJ9
