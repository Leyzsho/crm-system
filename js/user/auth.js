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

if (window.location.pathname.includes('/register')) {
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
} else if (window.location.pathname.includes('/login')) {
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
  if (window.location.pathname.includes('/register')) {
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
  else if (window.location.pathname.includes('/login')) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ1c2VyL2F1dGguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFwcCBmcm9tICcuLi91dGlscy9maXJlYmFzZS1pbml0LmpzJztcclxuaW1wb3J0IHsgZ2V0QXV0aCwgY3JlYXRlVXNlcldpdGhFbWFpbEFuZFBhc3N3b3JkLCBvbkF1dGhTdGF0ZUNoYW5nZWQsIHNlbmRFbWFpbFZlcmlmaWNhdGlvbiwgZGVsZXRlVXNlciwgc2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQgfSBmcm9tICdodHRwczovL3d3dy5nc3RhdGljLmNvbS9maXJlYmFzZWpzLzkuMS4xL2ZpcmViYXNlLWF1dGguanMnO1xyXG5pbXBvcnQgeyB2YWxpZGF0aW9uRW1haWwsIHZhbGlkYXRpb25QYXNzd29yZCB9IGZyb20gJy4vdmFsaWRhdGlvbi5qcyc7XHJcbmltcG9ydCB7IG9wZW5SZXNldFBhc3N3b3JkTW9kYWwgfSBmcm9tICcuL21vZGFscy5qcyc7XHJcbmltcG9ydCB7IHNob3dIaWRlUGFzc3dvcmQsIHBsYWNlaG9sZGVyLCB3aXRob3V0U3BhY2UgfSBmcm9tICcuLi91dGlscy9pbnB1dC5qcyc7XHJcbmNvbnN0IGF1dGggPSBnZXRBdXRoKGFwcCk7XHJcblxyXG5sZXQgY2hlY2tFbWFpbFZlcmlmaWVkID0gbnVsbDtcclxubGV0IGlzRW1haWxOb3RWZXJpZmllZCA9IHRydWU7XHJcblxyXG5vbkF1dGhTdGF0ZUNoYW5nZWQoYXV0aCwgYXN5bmMgKHVzZXIpID0+IHtcclxuICBpZiAodXNlciAmJiB1c2VyLmVtYWlsVmVyaWZpZWQpIHtcclxuICAgIC8vINC10YHQu9C4INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCDQtdGB0YLRjCDQsiDQsdCw0LfQtSDQtNCw0L3QvdGL0YUg0Lgg0L7QvSDQstC10YDQuNGE0LjRhtC40YDQvtCy0LDQuyBlbWFpbCwg0YLQviDQv9GA0L7Qs9C+0L3Rj9C10Lwg0YHQviDRgdGC0YDQsNC90LjRhtGLXHJcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuL2FjY291bnQuaHRtbCc7XHJcbiAgfSBlbHNlIGlmICh1c2VyICYmICF1c2VyLmVtYWlsVmVyaWZpZWQpIHtcclxuICAgIGlmIChpc0VtYWlsTm90VmVyaWZpZWQpIHtcclxuICAgICAgLy8g0JXRgdC70Lgg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GMINC30LDRgNC10LPQuNGB0YLRgNC40YDQvtCy0LDQu9GB0Y8sINC90L4g0L3QtSDQv9C+0LTRgtCy0LXRgNC00LjQuyBlbWFpbCwg0Lgg0L/RgNC4INGN0YLQvtC8INC/0YDQtdGA0LLQsNC7INC/0YDQvtGG0LXRgdGBINCw0YPRgtC10L3RgtC40YTQuNC60LDRhtC40LgsINGC0LDQutC40LzQuCDQtNC10LnRgdGC0LLQuNGP0LzQuCDQutCw0Lo6INC/0LXRgNC10LfQsNCz0YDRg9C30LrQsCDRgtC10LrRg9GJ0LXQuSDRgdGC0YDQsNC90LjRhtGLLCDQv9C10YDQtdGF0L7QtCDQvdCwINC00YDRg9Cz0YPRjiDRgdGC0YDQsNC90LjRhtGDLCDRgtC+INC80Ysg0YPQtNCw0LvRj9C10Lwg0LXQs9C+INC40Lcg0LHQsNC30Ysg0LTQsNC90L3Ri9GFXHJcbiAgICAgIGRlbGV0ZVVzZXIodXNlcik7XHJcbiAgICAgIGlzRW1haWxOb3RWZXJpZmllZCA9IGZhbHNlO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvLyDQutC+0LPQtNCwINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCDQt9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0LvRgdGPLCBmaXJlYmFzZSDQvtGC0L/RgNCw0LLQu9GP0LXRgiDQtdC80YMg0L/QuNGB0YzQvNC+INC00LvRjyDQstC10YDQuNGE0LjQutCw0YbQuNC4LCDQv9C+0Y3RgtC+0LzRgyDQutCw0LbQtNC+0LUg0L/RgNC+0LjQt9Cy0L7QtNC90L7QtSDQstGA0LXQvNGPINC/0YDQvtCy0LXRgNGP0LXQvCwg0L/QvtC00YLQstC10YDQtNC40Lsg0LvQuCDQvtC9INC40LvQuCDQvdC10YIuINCvINC90LUg0LfQvdCw0LssINC60LDQuiDQtdGJ0LUg0LzQvtC20L3QviDQsdGL0LvQviDRgNC10LDQu9C40LfQvtCy0LDRgtGMINC00LDQvdC90YvQuSDQvNC+0LzQtdC90YIg0LIg0YDQtdCw0LvRjNC90L7QvCDQstGA0LXQvNC10L3QuCDQsdC10Lcg0L7QsdC90L7QstC70LXQvdC40LUg0YHRgtGA0LDQvdC40YbRi1xyXG4gICAgY2hlY2tFbWFpbFZlcmlmaWVkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICB1c2VyLnJlbG9hZCgpO1xyXG4gICAgICBpZiAodXNlci5lbWFpbFZlcmlmaWVkKSB7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi9hY2NvdW50Lmh0bWwnO1xyXG4gICAgICB9XHJcbiAgICB9LCAxMDAwKTtcclxuICB9IGVsc2Uge1xyXG4gICAgY2xlYXJJbnRlcnZhbChjaGVja0VtYWlsVmVyaWZpZWQpO1xyXG4gICAgaXNFbWFpbE5vdFZlcmlmaWVkID0gZmFsc2U7XHJcbiAgfVxyXG59KTtcclxuXHJcbmNvbnN0IGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0aCcpO1xyXG5jb25zdCBmb3JtQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zvcm0tYnRuJyk7XHJcblxyXG5jb25zdCBlbWFpbElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dGgtZW1haWwnKTtcclxuY29uc3QgcGFzc3dvcmRJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRoLXBhc3N3b3JkJyk7XHJcbmNvbnN0IHJlcGVhdFBhc3N3b3JkSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0aC1yZXBlYXQtcGFzc3dvcmQnKTtcclxuXHJcbmNvbnN0IG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbmNvbnN0IGVtYWlsRXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0aC1lbWFpbC1lcnJvcicpO1xyXG5jb25zdCBwYXNzd29yZEVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dGgtcGFzc3dvcmQtZXJyb3InKTtcclxuY29uc3QgcmVwZWF0UGFzc3dvcmRFcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRoLXJlcGVhdC1wYXNzd29yZC1lcnJvcicpO1xyXG5cclxucGxhY2Vob2xkZXIoZW1haWxJbnB1dCwgJ9CS0LLQtdC00LjRgtC1INC/0L7Rh9GC0YMnKTtcclxucGxhY2Vob2xkZXIocGFzc3dvcmRJbnB1dCwgJ9CS0LLQtdC00LjRgtC1INC/0LDRgNC+0LvRjCcpO1xyXG5zaG93SGlkZVBhc3N3b3JkKHBhc3N3b3JkSW5wdXQpO1xyXG5cclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWRlcicpLnJlbW92ZSgpO1xyXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFpbicpLmNsYXNzTGlzdC5yZW1vdmUoJ21haW4tLWhpZGRlbicpO1xyXG5cclxuZm9ybUJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcblxyXG5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xyXG4gIHdpdGhvdXRTcGFjZShldmVudC50YXJnZXQpO1xyXG59KTtcclxuXHJcbmVtYWlsSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIHZhbGlkYXRpb25FbWFpbChlbWFpbElucHV0LnZhbHVlKTtcclxuICAgIGVtYWlsRXJyb3IudGV4dENvbnRlbnQgPSAnJztcclxuICAgIGVtYWlsSW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnYXV0aF9faW5wdXQtLWVycm9yJyk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGVtYWlsSW5wdXQuY2xhc3NMaXN0LmFkZCgnYXV0aF9faW5wdXQtLWVycm9yJyk7XHJcbiAgICBlbWFpbEVycm9yLnRleHRDb250ZW50ID0gZXJyb3IubWVzc2FnZTtcclxuICB9XHJcbn0pO1xyXG5cclxuaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcygnL3JlZ2lzdGVyJykpIHtcclxuICBwbGFjZWhvbGRlcihyZXBlYXRQYXNzd29yZElucHV0LCAn0J/QvtCy0YLQvtGA0LjRgtC1INC/0LDRgNC+0LvRjCcpO1xyXG4gIHNob3dIaWRlUGFzc3dvcmQocmVwZWF0UGFzc3dvcmRJbnB1dCk7XHJcbiAgLy8g0J/RgNC+0LLQtdGA0Y/QtdGCINCy0LDQu9C40LTQvdC+0YHRgtGMINC00LDQvdC90YvRhVxyXG4gIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICB2YWxpZGF0aW9uRW1haWwoZW1haWxJbnB1dC52YWx1ZSk7XHJcbiAgICAgIHZhbGlkYXRpb25QYXNzd29yZChwYXNzd29yZElucHV0LnZhbHVlKTtcclxuICAgICAgaWYgKHJlcGVhdFBhc3N3b3JkSW5wdXQudmFsdWUgPT09IHBhc3N3b3JkSW5wdXQudmFsdWUpIHtcclxuICAgICAgICBmb3JtQnRuLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZm9ybUJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGZvcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBwYXNzd29yZElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xyXG4gICAgaWYgKHJlcGVhdFBhc3N3b3JkSW5wdXQudmFsdWUgPT09IHBhc3N3b3JkSW5wdXQudmFsdWUpIHtcclxuICAgICAgcmVwZWF0UGFzc3dvcmRFcnJvci50ZXh0Q29udGVudCA9ICcnO1xyXG4gICAgICByZXBlYXRQYXNzd29yZElucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ2F1dGhfX2lucHV0LS1lcnJvcicpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVwZWF0UGFzc3dvcmRFcnJvci50ZXh0Q29udGVudCA9ICfQn9Cw0YDQvtC70Lgg0L3QtSDRgdC+0LLQv9Cw0LTQsNGO0YIuJztcclxuICAgICAgcmVwZWF0UGFzc3dvcmRJbnB1dC5jbGFzc0xpc3QuYWRkKCdhdXRoX19pbnB1dC0tZXJyb3InKTtcclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgIHZhbGlkYXRpb25QYXNzd29yZChwYXNzd29yZElucHV0LnZhbHVlKTtcclxuICAgICAgcGFzc3dvcmRFcnJvci50ZXh0Q29udGVudCA9ICcnO1xyXG4gICAgICAgcGFzc3dvcmRJbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdhdXRoX19pbnB1dC0tZXJyb3InKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHBhc3N3b3JkRXJyb3IudGV4dENvbnRlbnQgPSBlcnJvci5tZXNzYWdlO1xyXG4gICAgICAgcGFzc3dvcmRJbnB1dC5jbGFzc0xpc3QuYWRkKCdhdXRoX19pbnB1dC0tZXJyb3InKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgcmVwZWF0UGFzc3dvcmRJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGV2ZW50ID0+IHtcclxuICAgIGlmIChyZXBlYXRQYXNzd29yZElucHV0LnZhbHVlID09PSBwYXNzd29yZElucHV0LnZhbHVlKSB7XHJcbiAgICAgIHJlcGVhdFBhc3N3b3JkRXJyb3IudGV4dENvbnRlbnQgPSAnJztcclxuICAgICAgcmVwZWF0UGFzc3dvcmRJbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdhdXRoX19pbnB1dC0tZXJyb3InKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlcGVhdFBhc3N3b3JkRXJyb3IudGV4dENvbnRlbnQgPSAn0J/QsNGA0L7Qu9C4INC90LUg0YHQvtCy0L/QsNC00LDRjtGCLic7XHJcbiAgICAgIHJlcGVhdFBhc3N3b3JkSW5wdXQuY2xhc3NMaXN0LmFkZCgnYXV0aF9faW5wdXQtLWVycm9yJyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn0gZWxzZSBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKCcvbG9naW4nKSkge1xyXG4gIGNvbnN0IGZvcmdvdFBhc3N3b3JkQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dGgtZm9yZ290LXBhc3N3b3JkJyk7XHJcbiAgZm9yZ290UGFzc3dvcmRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBldmVudCA9PiB7XHJcbiAgICBvcGVuUmVzZXRQYXNzd29yZE1vZGFsKCk7XHJcbiAgfSk7XHJcblxyXG4gIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICB2YWxpZGF0aW9uRW1haWwoZW1haWxJbnB1dC52YWx1ZSk7XHJcbiAgICAgIGlmIChwYXNzd29yZElucHV0LnZhbHVlICE9PSAnJykge1xyXG4gICAgICAgIGZvcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBmb3JtQnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgZm9ybUJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgYXN5bmMgKGV2ZW50KSA9PiB7XHJcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICBmb3JtQnRuLmFmdGVyKG1lc3NhZ2UpO1xyXG5cclxuICBjb25zdCBlbWFpbCA9IGVtYWlsSW5wdXQudmFsdWUudHJpbSgpO1xyXG4gIGNvbnN0IHBhc3N3b3JkID0gcGFzc3dvcmRJbnB1dC52YWx1ZS50cmltKCk7XHJcbiAgY29uc3QgbG9hZGVyQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG5cclxuICBmb3JtQnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuICBmb3JtQnRuLmFwcGVuZChsb2FkZXJCdG4pO1xyXG4gIC8vINCV0YHQu9C4INGN0YLQsCDRgdGC0YDQsNC90LjRhtCwINC00LvRjyDRgNC10LPQuNGB0YLRgNCw0YbQuNC4XHJcbiAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcygnL3JlZ2lzdGVyJykpIHtcclxuICAgIC8vINCa0L3QvtC/0LrQsCDQtNC70Y8g0L7RgtC80LXQvdGLINCw0YPRgtC10L3RgtC40YTQuNC60LDRhtC40LhcclxuICAgIGNvbnN0IGNhbmNlbEF1dGhCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgIGNhbmNlbEF1dGhCdG4uY2xhc3NMaXN0LmFkZCgnYXV0aF9fZGVzY3ItYnRuJyk7XHJcbiAgICBjYW5jZWxBdXRoQnRuLnRleHRDb250ZW50ID0gJ9Ce0YLQvNC10L3QuNGC0Ywg0LDRg9GC0LXQvdGC0LjRhNC40LrQsNGG0LjRjic7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgLy8g0KHQvtC30LTQsNC10Lwg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPINC4INC00L7QsdCw0LLQu9GP0LXQvCDQsiDQsdCw0LfRgyDQtNCw0L3QvdGL0YVcclxuICAgICAgY29uc3QgdXNlckNyZWRlbnRpYWwgPSBhd2FpdCBjcmVhdGVVc2VyV2l0aEVtYWlsQW5kUGFzc3dvcmQoYXV0aCwgZW1haWwsIHBhc3N3b3JkKTtcclxuICAgICAgY29uc3QgdXNlciA9IHVzZXJDcmVkZW50aWFsLnVzZXI7XHJcblxyXG4gICAgICAvLyDQn9GA0LjRgdGL0LvQsNC10Lwg0L/QuNGB0YzQvNC+INC00LvRjyDQstC10YDQuNGE0LjQutCw0YbQuNC4XHJcbiAgICAgIGF3YWl0IHNlbmRFbWFpbFZlcmlmaWNhdGlvbih1c2VyKTtcclxuICAgICAgbWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvcicpO1xyXG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ21lc3NhZ2UnKTtcclxuICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQndCwINCy0LDRiNGDINGN0LvQtdC60YLRgNC+0L3QvdGD0Y4g0L/QvtGH0YLRgyDQvtGC0L/RgNCw0LLQu9C10L3QviDQv9C40YHRjNC80L4g0YEg0L/QvtC00YLQstC10YDQttC00LXQvdC40LXQvC4nO1xyXG4gICAgICBtZXNzYWdlLmFmdGVyKGNhbmNlbEF1dGhCdG4pO1xyXG5cclxuICAgICAgLy8g0L7RgtC80LXQvdGP0LXQvCDRgNC10LPQuNGB0YLRgNCw0YbQuNGOOiDRg9C00LDQu9GP0LXQvCDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y8g0LjQtyDQsdCw0LfRiyDQtNCw0L3QvdGL0YUsINC+0YfQuNGJ0LDQtdC8IGlucHV0LdGLINC4INGCLtC0LlxyXG4gICAgICBjYW5jZWxBdXRoQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZXZlbnQgPT4ge1xyXG4gICAgICAgIGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKS5mb3JFYWNoKGlucHV0ID0+IHtpbnB1dC52YWx1ZSA9ICcnfSk7XHJcbiAgICAgICAgYXdhaXQgZGVsZXRlVXNlcih1c2VyKTtcclxuICAgICAgICBjYW5jZWxBdXRoQnRuLnJlbW92ZSgpO1xyXG4gICAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAnJztcclxuICAgICAgICBtZXNzYWdlLnJlbW92ZSgpO1xyXG4gICAgICAgIGZvcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAvLyDQvtGI0LjQsdC60Lgg0YHQtdGA0LLQtdGA0LAsINGC0L4g0LHQuNGI0YwgZmlyZWJhc2Ug0Lgg0LLQvtC30LLRgNCw0YnQtdC90LjQtSDRhNC+0YDQvNGLINC6INC90LDRh9Cw0LvRjNC90L7QvNGDINGB0L7RgdGC0L7Rj9C90LjRjlxyXG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ21lc3NhZ2UnKTtcclxuICAgICAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xyXG4gICAgICBzd2l0Y2ggKGVycm9yLm1lc3NhZ2UpIHtcclxuICAgICAgICBjYXNlICdGaXJlYmFzZTogRXJyb3IgKGF1dGgvZW1haWwtYWxyZWFkeS1pbi11c2UpLic6XHJcbiAgICAgICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9CU0LDQvdC90LDRjyDQv9C+0YfRgtCwINGD0LbQtSDQt9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0L3QsC4nO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0KfRgtC+LdGC0L4g0L/QvtGI0LvQviDQvdC1INGC0LDQui4uLic7XHJcbiAgICAgIH1cclxuICAgICAgY2FuY2VsQXV0aEJ0bi5yZW1vdmUoKTtcclxuICAgICAgZm9ybUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgbG9hZGVyQnRuLnJlbW92ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8g0JXRgdC70Lgg0Y3RgtCwINGB0YLRgNCw0L3QuNGG0LAg0LTQu9GPINCy0YXQvtC00LBcclxuICBlbHNlIGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoJy9sb2dpbicpKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBhd2FpdCBzaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZChhdXRoLCBlbWFpbCwgcGFzc3dvcmQpO1xyXG4gICAgfSBjYXRjaChlcnJvcikge1xyXG4gICAgICAvLyDQvtGI0LjQsdC60Lgg0YHQtdGA0LLQtdGA0LAsINGC0L4g0LHQuNGI0YwgZmlyZWJhc2Ug0Lgg0LLQvtC30LLRgNCw0YnQtdC90LjQtSDRhNC+0YDQvNGLINC6INC90LDRh9Cw0LvRjNC90L7QvNGDINGB0L7RgdGC0L7Rj9C90LjRjlxyXG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ21lc3NhZ2UnKTtcclxuICAgICAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xyXG4gICAgICBzd2l0Y2ggKGVycm9yLm1lc3NhZ2UpIHtcclxuICAgICAgICBjYXNlICdGaXJlYmFzZTogRXJyb3IgKGF1dGgvaW52YWxpZC1sb2dpbi1jcmVkZW50aWFscykuJzpcclxuICAgICAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0J3QtdC/0YDQsNCy0LjQu9GM0L3QviDQstCy0LXQtNC10L3RiyDQv9C+0YfRgtCwINC40LvQuCDQv9Cw0YDQvtC70YwuJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9Cn0YLQvi3RgtC+INC/0L7RiNC70L4g0L3QtSDRgtCw0LouLi4nO1xyXG4gICAgICB9XHJcbiAgICAgIGZvcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIGxvYWRlckJ0bi5yZW1vdmUoKTtcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG4iXSwiZmlsZSI6InVzZXIvYXV0aC5qcyJ9
