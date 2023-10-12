import app from '../utils/firebase.js';
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ1c2VyL2F1dGguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFwcCBmcm9tICcuLi91dGlscy9maXJlYmFzZS5qcyc7XG5pbXBvcnQgeyBnZXRBdXRoLCBjcmVhdGVVc2VyV2l0aEVtYWlsQW5kUGFzc3dvcmQsIG9uQXV0aFN0YXRlQ2hhbmdlZCwgc2VuZEVtYWlsVmVyaWZpY2F0aW9uLCBkZWxldGVVc2VyLCBzaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZCB9IGZyb20gJ2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2ZpcmViYXNlanMvOS4xLjEvZmlyZWJhc2UtYXV0aC5qcyc7XG5pbXBvcnQgeyB2YWxpZGF0aW9uRW1haWwsIHZhbGlkYXRpb25QYXNzd29yZCB9IGZyb20gJy4vdmFsaWRhdGlvbi5qcyc7XG5pbXBvcnQgeyBvcGVuUmVzZXRQYXNzd29yZE1vZGFsIH0gZnJvbSAnLi9tb2RhbHMuanMnO1xuaW1wb3J0IHsgc2hvd0hpZGVQYXNzd29yZCwgcGxhY2Vob2xkZXIsIHdpdGhvdXRTcGFjZSB9IGZyb20gJy4uL3V0aWxzL2lucHV0LmpzJztcbmNvbnN0IGF1dGggPSBnZXRBdXRoKGFwcCk7XG5cbmxldCBjaGVja0VtYWlsVmVyaWZpZWQgPSBudWxsO1xubGV0IGlzRW1haWxOb3RWZXJpZmllZCA9IHRydWU7XG5cbm9uQXV0aFN0YXRlQ2hhbmdlZChhdXRoLCBhc3luYyAodXNlcikgPT4ge1xuICBpZiAodXNlciAmJiB1c2VyLmVtYWlsVmVyaWZpZWQpIHtcbiAgICAvLyDQtdGB0LvQuCDQv9C+0LvRjNC30L7QstCw0YLQtdC70Ywg0LXRgdGC0Ywg0LIg0LHQsNC30LUg0LTQsNC90L3Ri9GFINC4INC+0L0g0LLQtdGA0LjRhNC40YbQuNGA0L7QstCw0LsgZW1haWwsINGC0L4g0L/RgNC+0LPQvtC90Y/QtdC8INGB0L4g0YHRgtGA0LDQvdC40YbRi1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4vYWNjb3VudC5odG1sJztcbiAgfSBlbHNlIGlmICh1c2VyICYmICF1c2VyLmVtYWlsVmVyaWZpZWQpIHtcbiAgICBpZiAoaXNFbWFpbE5vdFZlcmlmaWVkKSB7XG4gICAgICAvLyDQldGB0LvQuCDQv9C+0LvRjNC30L7QstCw0YLQtdC70Ywg0LfQsNGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNC70YHRjywg0L3QviDQvdC1INC/0L7QtNGC0LLQtdGA0LTQuNC7IGVtYWlsLCDQuCDQv9GA0Lgg0Y3RgtC+0Lwg0L/RgNC10YDQstCw0Lsg0L/RgNC+0YbQtdGB0YEg0LDRg9GC0LXQvdGC0LjRhNC40LrQsNGG0LjQuCwg0YLQsNC60LjQvNC4INC00LXQudGB0YLQstC40Y/QvNC4INC60LDQujog0L/QtdGA0LXQt9Cw0LPRgNGD0LfQutCwINGC0LXQutGD0YnQtdC5INGB0YLRgNCw0L3QuNGG0YssINC/0LXRgNC10YXQvtC0INC90LAg0LTRgNGD0LPRg9GOINGB0YLRgNCw0L3QuNGG0YMsINGC0L4g0LzRiyDRg9C00LDQu9GP0LXQvCDQtdCz0L4g0LjQtyDQsdCw0LfRiyDQtNCw0L3QvdGL0YVcbiAgICAgIGRlbGV0ZVVzZXIodXNlcik7XG4gICAgICBpc0VtYWlsTm90VmVyaWZpZWQgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8g0LrQvtCz0LTQsCDQv9C+0LvRjNC30L7QstCw0YLQtdC70Ywg0LfQsNGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNC70YHRjywgZmlyZWJhc2Ug0L7RgtC/0YDQsNCy0LvRj9C10YIg0LXQvNGDINC/0LjRgdGM0LzQviDQtNC70Y8g0LLQtdGA0LjRhNC40LrQsNGG0LjQuCwg0L/QvtGN0YLQvtC80YMg0LrQsNC20LTQvtC1INC/0YDQvtC40LfQstC+0LTQvdC+0LUg0LLRgNC10LzRjyDQv9GA0L7QstC10YDRj9C10LwsINC/0L7QtNGC0LLQtdGA0LTQuNC7INC70Lgg0L7QvSDQuNC70Lgg0L3QtdGCLiDQryDQvdC1INC30L3QsNC7LCDQutCw0Log0LXRidC1INC80L7QttC90L4g0LHRi9C70L4g0YDQtdCw0LvQuNC30L7QstCw0YLRjCDQtNCw0L3QvdGL0Lkg0LzQvtC80LXQvdGCINCyINGA0LXQsNC70YzQvdC+0Lwg0LLRgNC10LzQtdC90Lgg0LHQtdC3INC+0LHQvdC+0LLQu9C10L3QuNC1INGB0YLRgNCw0L3QuNGG0YtcbiAgICBjaGVja0VtYWlsVmVyaWZpZWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICB1c2VyLnJlbG9hZCgpO1xuICAgICAgaWYgKHVzZXIuZW1haWxWZXJpZmllZCkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuL2FjY291bnQuaHRtbCc7XG4gICAgICB9XG4gICAgfSwgMTAwMCk7XG4gIH0gZWxzZSB7XG4gICAgY2xlYXJJbnRlcnZhbChjaGVja0VtYWlsVmVyaWZpZWQpO1xuICAgIGlzRW1haWxOb3RWZXJpZmllZCA9IGZhbHNlO1xuICB9XG59KTtcblxuY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRoJyk7XG5jb25zdCBmb3JtQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zvcm0tYnRuJyk7XG5cbmNvbnN0IGVtYWlsSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0aC1lbWFpbCcpO1xuY29uc3QgcGFzc3dvcmRJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRoLXBhc3N3b3JkJyk7XG5jb25zdCByZXBlYXRQYXNzd29yZElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dGgtcmVwZWF0LXBhc3N3b3JkJyk7XG5cbmNvbnN0IG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5jb25zdCBlbWFpbEVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dGgtZW1haWwtZXJyb3InKTtcbmNvbnN0IHBhc3N3b3JkRXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0aC1wYXNzd29yZC1lcnJvcicpO1xuY29uc3QgcmVwZWF0UGFzc3dvcmRFcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRoLXJlcGVhdC1wYXNzd29yZC1lcnJvcicpO1xuXG5wbGFjZWhvbGRlcihlbWFpbElucHV0LCAn0JLQstC10LTQuNGC0LUg0L/QvtGH0YLRgycpO1xucGxhY2Vob2xkZXIocGFzc3dvcmRJbnB1dCwgJ9CS0LLQtdC00LjRgtC1INC/0LDRgNC+0LvRjCcpO1xuc2hvd0hpZGVQYXNzd29yZChwYXNzd29yZElucHV0KTtcblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWRlcicpLnJlbW92ZSgpO1xuZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1haW4nKS5jbGFzc0xpc3QucmVtb3ZlKCdtYWluLS1oaWRkZW4nKTtcblxuZm9ybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG5cbmZvcm0uYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XG4gIHdpdGhvdXRTcGFjZShldmVudC50YXJnZXQpO1xufSk7XG5cbmVtYWlsSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XG4gIHRyeSB7XG4gICAgdmFsaWRhdGlvbkVtYWlsKGVtYWlsSW5wdXQudmFsdWUpO1xuICAgIGVtYWlsRXJyb3IudGV4dENvbnRlbnQgPSAnJztcbiAgICBlbWFpbElucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ2F1dGhfX2lucHV0LS1lcnJvcicpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGVtYWlsSW5wdXQuY2xhc3NMaXN0LmFkZCgnYXV0aF9faW5wdXQtLWVycm9yJyk7XG4gICAgZW1haWxFcnJvci50ZXh0Q29udGVudCA9IGVycm9yLm1lc3NhZ2U7XG4gIH1cbn0pO1xuXG5pZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKCcvcmVnaXN0ZXIuaHRtbCcpKSB7XG4gIHBsYWNlaG9sZGVyKHJlcGVhdFBhc3N3b3JkSW5wdXQsICfQn9C+0LLRgtC+0YDQuNGC0LUg0L/QsNGA0L7Qu9GMJyk7XG4gIHNob3dIaWRlUGFzc3dvcmQocmVwZWF0UGFzc3dvcmRJbnB1dCk7XG4gIC8vINCf0YDQvtCy0LXRgNGP0LXRgiDQstCw0LvQuNC00L3QvtGB0YLRjCDQtNCw0L3QvdGL0YVcbiAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGV2ZW50ID0+IHtcbiAgICB0cnkge1xuICAgICAgdmFsaWRhdGlvbkVtYWlsKGVtYWlsSW5wdXQudmFsdWUpO1xuICAgICAgdmFsaWRhdGlvblBhc3N3b3JkKHBhc3N3b3JkSW5wdXQudmFsdWUpO1xuICAgICAgaWYgKHJlcGVhdFBhc3N3b3JkSW5wdXQudmFsdWUgPT09IHBhc3N3b3JkSW5wdXQudmFsdWUpIHtcbiAgICAgICAgZm9ybUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9ybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGZvcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgcGFzc3dvcmRJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGV2ZW50ID0+IHtcbiAgICBpZiAocmVwZWF0UGFzc3dvcmRJbnB1dC52YWx1ZSA9PT0gcGFzc3dvcmRJbnB1dC52YWx1ZSkge1xuICAgICAgcmVwZWF0UGFzc3dvcmRFcnJvci50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgcmVwZWF0UGFzc3dvcmRJbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdhdXRoX19pbnB1dC0tZXJyb3InKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVwZWF0UGFzc3dvcmRFcnJvci50ZXh0Q29udGVudCA9ICfQn9Cw0YDQvtC70Lgg0L3QtSDRgdC+0LLQv9Cw0LTQsNGO0YIuJztcbiAgICAgIHJlcGVhdFBhc3N3b3JkSW5wdXQuY2xhc3NMaXN0LmFkZCgnYXV0aF9faW5wdXQtLWVycm9yJyk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICB2YWxpZGF0aW9uUGFzc3dvcmQocGFzc3dvcmRJbnB1dC52YWx1ZSk7XG4gICAgICBwYXNzd29yZEVycm9yLnRleHRDb250ZW50ID0gJyc7XG4gICAgICAgcGFzc3dvcmRJbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdhdXRoX19pbnB1dC0tZXJyb3InKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcGFzc3dvcmRFcnJvci50ZXh0Q29udGVudCA9IGVycm9yLm1lc3NhZ2U7XG4gICAgICAgcGFzc3dvcmRJbnB1dC5jbGFzc0xpc3QuYWRkKCdhdXRoX19pbnB1dC0tZXJyb3InKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJlcGVhdFBhc3N3b3JkSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XG4gICAgaWYgKHJlcGVhdFBhc3N3b3JkSW5wdXQudmFsdWUgPT09IHBhc3N3b3JkSW5wdXQudmFsdWUpIHtcbiAgICAgIHJlcGVhdFBhc3N3b3JkRXJyb3IudGV4dENvbnRlbnQgPSAnJztcbiAgICAgIHJlcGVhdFBhc3N3b3JkSW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnYXV0aF9faW5wdXQtLWVycm9yJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcGVhdFBhc3N3b3JkRXJyb3IudGV4dENvbnRlbnQgPSAn0J/QsNGA0L7Qu9C4INC90LUg0YHQvtCy0L/QsNC00LDRjtGCLic7XG4gICAgICByZXBlYXRQYXNzd29yZElucHV0LmNsYXNzTGlzdC5hZGQoJ2F1dGhfX2lucHV0LS1lcnJvcicpO1xuICAgIH1cbiAgfSk7XG59IGVsc2UgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcygnL2xvZ2luLmh0bWwnKSkge1xuICBjb25zdCBmb3Jnb3RQYXNzd29yZEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRoLWZvcmdvdC1wYXNzd29yZCcpO1xuICBmb3Jnb3RQYXNzd29yZEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGV2ZW50ID0+IHtcbiAgICBvcGVuUmVzZXRQYXNzd29yZE1vZGFsKCk7XG4gIH0pO1xuXG4gIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHZhbGlkYXRpb25FbWFpbChlbWFpbElucHV0LnZhbHVlKTtcbiAgICAgIGlmIChwYXNzd29yZElucHV0LnZhbHVlICE9PSAnJykge1xuICAgICAgICBmb3JtQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3JtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZm9ybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuICB9KTtcbn1cblxuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBhc3luYyAoZXZlbnQpID0+IHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgZm9ybUJ0bi5hZnRlcihtZXNzYWdlKTtcblxuICBjb25zdCBlbWFpbCA9IGVtYWlsSW5wdXQudmFsdWUudHJpbSgpO1xuICBjb25zdCBwYXNzd29yZCA9IHBhc3N3b3JkSW5wdXQudmFsdWUudHJpbSgpO1xuICBjb25zdCBsb2FkZXJCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cbiAgZm9ybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gIGZvcm1CdG4uYXBwZW5kKGxvYWRlckJ0bik7XG4gIC8vINCV0YHQu9C4INGN0YLQsCDRgdGC0YDQsNC90LjRhtCwINC00LvRjyDRgNC10LPQuNGB0YLRgNCw0YbQuNC4XG4gIGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoJy9yZWdpc3Rlci5odG1sJykpIHtcbiAgICAvLyDQmtC90L7Qv9C60LAg0LTQu9GPINC+0YLQvNC10L3RiyDQsNGD0YLQtdC90YLQuNGE0LjQutCw0YbQuNC4XG4gICAgY29uc3QgY2FuY2VsQXV0aEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNhbmNlbEF1dGhCdG4uY2xhc3NMaXN0LmFkZCgnYXV0aF9fZGVzY3ItYnRuJyk7XG4gICAgY2FuY2VsQXV0aEJ0bi50ZXh0Q29udGVudCA9ICfQntGC0LzQtdC90LjRgtGMINCw0YPRgtC10L3RgtC40YTQuNC60LDRhtC40Y4nO1xuXG4gICAgdHJ5IHtcbiAgICAgIC8vINCh0L7Qt9C00LDQtdC8INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjyDQuCDQtNC+0LHQsNCy0LvRj9C10Lwg0LIg0LHQsNC30YMg0LTQsNC90L3Ri9GFXG4gICAgICBjb25zdCB1c2VyQ3JlZGVudGlhbCA9IGF3YWl0IGNyZWF0ZVVzZXJXaXRoRW1haWxBbmRQYXNzd29yZChhdXRoLCBlbWFpbCwgcGFzc3dvcmQpO1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJDcmVkZW50aWFsLnVzZXI7XG5cbiAgICAgIC8vINCf0YDQuNGB0YvQu9Cw0LXQvCDQv9C40YHRjNC80L4g0LTQu9GPINCy0LXRgNC40YTQuNC60LDRhtC40LhcbiAgICAgIGF3YWl0IHNlbmRFbWFpbFZlcmlmaWNhdGlvbih1c2VyKTtcbiAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnZXJyb3InKTtcbiAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnbWVzc2FnZScpO1xuICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQndCwINCy0LDRiNGDINGN0LvQtdC60YLRgNC+0L3QvdGD0Y4g0L/QvtGH0YLRgyDQvtGC0L/RgNCw0LLQu9C10L3QviDQv9C40YHRjNC80L4g0YEg0L/QvtC00YLQstC10YDQttC00LXQvdC40LXQvC4nO1xuICAgICAgbWVzc2FnZS5hZnRlcihjYW5jZWxBdXRoQnRuKTtcblxuICAgICAgLy8g0L7RgtC80LXQvdGP0LXQvCDRgNC10LPQuNGB0YLRgNCw0YbQuNGOOiDRg9C00LDQu9GP0LXQvCDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y8g0LjQtyDQsdCw0LfRiyDQtNCw0L3QvdGL0YUsINC+0YfQuNGJ0LDQtdC8IGlucHV0LdGLINC4INGCLtC0LlxuICAgICAgY2FuY2VsQXV0aEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGV2ZW50ID0+IHtcbiAgICAgICAgZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpLmZvckVhY2goaW5wdXQgPT4ge2lucHV0LnZhbHVlID0gJyd9KTtcbiAgICAgICAgYXdhaXQgZGVsZXRlVXNlcih1c2VyKTtcbiAgICAgICAgY2FuY2VsQXV0aEJ0bi5yZW1vdmUoKTtcbiAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICBtZXNzYWdlLnJlbW92ZSgpO1xuICAgICAgICBmb3JtQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgLy8g0L7RiNC40LHQutC4INGB0LXRgNCy0LXRgNCwLCDRgtC+INCx0LjRiNGMIGZpcmViYXNlINC4INCy0L7Qt9Cy0YDQsNGJ0LXQvdC40LUg0YTQvtGA0LzRiyDQuiDQvdCw0YfQsNC70YzQvdC+0LzRgyDRgdC+0YHRgtC+0Y/QvdC40Y5cbiAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnbWVzc2FnZScpO1xuICAgICAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xuICAgICAgc3dpdGNoIChlcnJvci5tZXNzYWdlKSB7XG4gICAgICAgIGNhc2UgJ0ZpcmViYXNlOiBFcnJvciAoYXV0aC9lbWFpbC1hbHJlYWR5LWluLXVzZSkuJzpcbiAgICAgICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9CU0LDQvdC90LDRjyDQv9C+0YfRgtCwINGD0LbQtSDQt9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0L3QsC4nO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0KfRgtC+LdGC0L4g0L/QvtGI0LvQviDQvdC1INGC0LDQui4uLic7XG4gICAgICB9XG4gICAgICBjYW5jZWxBdXRoQnRuLnJlbW92ZSgpO1xuICAgICAgZm9ybUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBsb2FkZXJCdG4ucmVtb3ZlKCk7XG4gICAgfVxuICB9XG5cbiAgLy8g0JXRgdC70Lgg0Y3RgtCwINGB0YLRgNCw0L3QuNGG0LAg0LTQu9GPINCy0YXQvtC00LBcbiAgZWxzZSBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKCcvbG9naW4uaHRtbCcpKSB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkKGF1dGgsIGVtYWlsLCBwYXNzd29yZCk7XG4gICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgLy8g0L7RiNC40LHQutC4INGB0LXRgNCy0LXRgNCwLCDRgtC+INCx0LjRiNGMIGZpcmViYXNlINC4INCy0L7Qt9Cy0YDQsNGJ0LXQvdC40LUg0YTQvtGA0LzRiyDQuiDQvdCw0YfQsNC70YzQvdC+0LzRgyDRgdC+0YHRgtC+0Y/QvdC40Y5cbiAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnbWVzc2FnZScpO1xuICAgICAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xuICAgICAgc3dpdGNoIChlcnJvci5tZXNzYWdlKSB7XG4gICAgICAgIGNhc2UgJ0ZpcmViYXNlOiBFcnJvciAoYXV0aC9pbnZhbGlkLWxvZ2luLWNyZWRlbnRpYWxzKS4nOlxuICAgICAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0J3QtdC/0YDQsNCy0LjQu9GM0L3QviDQstCy0LXQtNC10L3RiyDQv9C+0YfRgtCwINC40LvQuCDQv9Cw0YDQvtC70YwuJztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9Cn0YLQvi3RgtC+INC/0L7RiNC70L4g0L3QtSDRgtCw0LouLi4nO1xuICAgICAgfVxuICAgICAgZm9ybUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBsb2FkZXJCdG4ucmVtb3ZlKCk7XG4gICAgfVxuICB9XG59KTtcbiJdLCJmaWxlIjoidXNlci9hdXRoLmpzIn0=
