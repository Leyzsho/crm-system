import app from '../firebase.js';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, deleteUser, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';
import { validationEmail, validationPassword } from './validation.js';
import { openResetPasswordModal } from './modals.js';
const auth = getAuth(app);

// Небольшое пояснение:
// Так как в данном приложение аутентификация обязательна, все страницы (кроме самой регистрации и входа) отправляют пользователя обратно на страницу регистрации, если у него нет аккаунта или если его email не является верифицированным,
// я не буду в комментариях подчеркивать тот факт, что пользователя перенаправили на страницу регистрации.

function showHidePassword(input) {
  const container = input.parentElement;
  const btn = container.querySelector('svg');
  const useElement = container.querySelector('use');
  if (!btn) {
    throw new Error('Отсуствует кнопка для показа/скрытия пароля');
  }

  btn.addEventListener('click', event => {
    event.preventDefault();
    if (input.type === 'password') {
      input.type = 'text';
      useElement.setAttribute('xlink:href', '#hide-password');
    } else {
      input.type = 'password';
      useElement.setAttribute('xlink:href', '#show-password');
    }
  });
}

let checkEmailVerified;
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

formBtn.disabled = true;

if (window.location.pathname.includes('/register.html')) {
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
  showHidePassword(passwordInput);

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhdXRoL3JlZ2lzdGVyT3JMb2dpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXBwIGZyb20gJy4uL2ZpcmViYXNlLmpzJztcbmltcG9ydCB7IGdldEF1dGgsIGNyZWF0ZVVzZXJXaXRoRW1haWxBbmRQYXNzd29yZCwgb25BdXRoU3RhdGVDaGFuZ2VkLCBzZW5kRW1haWxWZXJpZmljYXRpb24sIGRlbGV0ZVVzZXIsIHNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkIH0gZnJvbSAnaHR0cHM6Ly93d3cuZ3N0YXRpYy5jb20vZmlyZWJhc2Vqcy85LjEuMS9maXJlYmFzZS1hdXRoLmpzJztcbmltcG9ydCB7IHZhbGlkYXRpb25FbWFpbCwgdmFsaWRhdGlvblBhc3N3b3JkIH0gZnJvbSAnLi92YWxpZGF0aW9uLmpzJztcbmltcG9ydCB7IG9wZW5SZXNldFBhc3N3b3JkTW9kYWwgfSBmcm9tICcuL21vZGFscy5qcyc7XG5jb25zdCBhdXRoID0gZ2V0QXV0aChhcHApO1xuXG4vLyDQndC10LHQvtC70YzRiNC+0LUg0L/QvtGP0YHQvdC10L3QuNC1OlxuLy8g0KLQsNC6INC60LDQuiDQsiDQtNCw0L3QvdC+0Lwg0L/RgNC40LvQvtC20LXQvdC40LUg0LDRg9GC0LXQvdGC0LjRhNC40LrQsNGG0LjRjyDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdCwLCDQstGB0LUg0YHRgtGA0LDQvdC40YbRiyAo0LrRgNC+0LzQtSDRgdCw0LzQvtC5INGA0LXQs9C40YHRgtGA0LDRhtC40Lgg0Lgg0LLRhdC+0LTQsCkg0L7RgtC/0YDQsNCy0LvRj9GO0YIg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPINC+0LHRgNCw0YLQvdC+INC90LAg0YHRgtGA0LDQvdC40YbRgyDRgNC10LPQuNGB0YLRgNCw0YbQuNC4LCDQtdGB0LvQuCDRgyDQvdC10LPQviDQvdC10YIg0LDQutC60LDRg9C90YLQsCDQuNC70Lgg0LXRgdC70Lgg0LXQs9C+IGVtYWlsINC90LUg0Y/QstC70Y/QtdGC0YHRjyDQstC10YDQuNGE0LjRhtC40YDQvtCy0LDQvdC90YvQvCxcbi8vINGPINC90LUg0LHRg9C00YMg0LIg0LrQvtC80LzQtdC90YLQsNGA0LjRj9GFINC/0L7QtNGH0LXRgNC60LjQstCw0YLRjCDRgtC+0YIg0YTQsNC60YIsINGH0YLQviDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y8g0L/QtdGA0LXQvdCw0L/RgNCw0LLQuNC70Lgg0L3QsCDRgdGC0YDQsNC90LjRhtGDINGA0LXQs9C40YHRgtGA0LDRhtC40LguXG5cbmZ1bmN0aW9uIHNob3dIaWRlUGFzc3dvcmQoaW5wdXQpIHtcbiAgY29uc3QgY29udGFpbmVyID0gaW5wdXQucGFyZW50RWxlbWVudDtcbiAgY29uc3QgYnRuID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xuICBjb25zdCB1c2VFbGVtZW50ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3VzZScpO1xuICBpZiAoIWJ0bikge1xuICAgIHRocm93IG5ldyBFcnJvcign0J7RgtGB0YPRgdGC0LLRg9C10YIg0LrQvdC+0L/QutCwINC00LvRjyDQv9C+0LrQsNC30LAv0YHQutGA0YvRgtC40Y8g0L/QsNGA0L7Qu9GPJyk7XG4gIH1cblxuICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAoaW5wdXQudHlwZSA9PT0gJ3Bhc3N3b3JkJykge1xuICAgICAgaW5wdXQudHlwZSA9ICd0ZXh0JztcbiAgICAgIHVzZUVsZW1lbnQuc2V0QXR0cmlidXRlKCd4bGluazpocmVmJywgJyNoaWRlLXBhc3N3b3JkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlucHV0LnR5cGUgPSAncGFzc3dvcmQnO1xuICAgICAgdXNlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3hsaW5rOmhyZWYnLCAnI3Nob3ctcGFzc3dvcmQnKTtcbiAgICB9XG4gIH0pO1xufVxuXG5sZXQgY2hlY2tFbWFpbFZlcmlmaWVkO1xubGV0IGlzRW1haWxOb3RWZXJpZmllZCA9IHRydWU7XG5cbm9uQXV0aFN0YXRlQ2hhbmdlZChhdXRoLCBhc3luYyAodXNlcikgPT4ge1xuICBpZiAodXNlciAmJiB1c2VyLmVtYWlsVmVyaWZpZWQpIHtcbiAgICAvLyDQtdGB0LvQuCDQv9C+0LvRjNC30L7QstCw0YLQtdC70Ywg0LXRgdGC0Ywg0LIg0LHQsNC30LUg0LTQsNC90L3Ri9GFINC4INC+0L0g0LLQtdGA0LjRhNC40YbQuNGA0L7QstCw0LsgZW1haWwsINGC0L4g0L/RgNC+0LPQvtC90Y/QtdC8INGB0L4g0YHRgtGA0LDQvdC40YbRi1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4vYWNjb3VudC5odG1sJztcbiAgfSBlbHNlIGlmICh1c2VyICYmICF1c2VyLmVtYWlsVmVyaWZpZWQpIHtcbiAgICBpZiAoaXNFbWFpbE5vdFZlcmlmaWVkKSB7XG4gICAgICAvLyDQldGB0LvQuCDQv9C+0LvRjNC30L7QstCw0YLQtdC70Ywg0LfQsNGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNC70YHRjywg0L3QviDQvdC1INC/0L7QtNGC0LLQtdGA0LTQuNC7IGVtYWlsLCDQuCDQv9GA0Lgg0Y3RgtC+0Lwg0L/RgNC10YDQstCw0Lsg0L/RgNC+0YbQtdGB0YEg0LDRg9GC0LXQvdGC0LjRhNC40LrQsNGG0LjQuCwg0YLQsNC60LjQvNC4INC00LXQudGB0YLQstC40Y/QvNC4INC60LDQujog0L/QtdGA0LXQt9Cw0LPRgNGD0LfQutCwINGC0LXQutGD0YnQtdC5INGB0YLRgNCw0L3QuNGG0YssINC/0LXRgNC10YXQvtC0INC90LAg0LTRgNGD0LPRg9GOINGB0YLRgNCw0L3QuNGG0YMsINGC0L4g0LzRiyDRg9C00LDQu9GP0LXQvCDQtdCz0L4g0LjQtyDQsdCw0LfRiyDQtNCw0L3QvdGL0YVcbiAgICAgIGRlbGV0ZVVzZXIodXNlcik7XG4gICAgICBpc0VtYWlsTm90VmVyaWZpZWQgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8g0LrQvtCz0LTQsCDQv9C+0LvRjNC30L7QstCw0YLQtdC70Ywg0LfQsNGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNC70YHRjywgZmlyZWJhc2Ug0L7RgtC/0YDQsNCy0LvRj9C10YIg0LXQvNGDINC/0LjRgdGM0LzQviDQtNC70Y8g0LLQtdGA0LjRhNC40LrQsNGG0LjQuCwg0L/QvtGN0YLQvtC80YMg0LrQsNC20LTQvtC1INC/0YDQvtC40LfQstC+0LTQvdC+0LUg0LLRgNC10LzRjyDQv9GA0L7QstC10YDRj9C10LwsINC/0L7QtNGC0LLQtdGA0LTQuNC7INC70Lgg0L7QvSDQuNC70Lgg0L3QtdGCLiDQryDQvdC1INC30L3QsNC7LCDQutCw0Log0LXRidC1INC80L7QttC90L4g0LHRi9C70L4g0YDQtdCw0LvQuNC30L7QstCw0YLRjCDQtNCw0L3QvdGL0Lkg0LzQvtC80LXQvdGCINCyINGA0LXQsNC70YzQvdC+0Lwg0LLRgNC10LzQtdC90Lgg0LHQtdC3INC+0LHQvdC+0LLQu9C10L3QuNC1INGB0YLRgNCw0L3QuNGG0YtcbiAgICBjaGVja0VtYWlsVmVyaWZpZWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICB1c2VyLnJlbG9hZCgpO1xuICAgICAgaWYgKHVzZXIuZW1haWxWZXJpZmllZCkge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuL2FjY291bnQuaHRtbCc7XG4gICAgICB9XG4gICAgfSwgMTAwMCk7XG4gIH0gZWxzZSB7XG4gICAgY2xlYXJJbnRlcnZhbChjaGVja0VtYWlsVmVyaWZpZWQpO1xuICAgIGlzRW1haWxOb3RWZXJpZmllZCA9IGZhbHNlO1xuICB9XG59KTtcblxuLy8g0L7QsdGJ0LjQtSDQutC+0L3RgdGC0LDQvdGC0Ysg0YHRgtGA0LDQvdC40YbRiyDRgNC10LPQuNGB0YLRgNCw0YbQuNC4INC4INCy0YXQvtC00LBcbmNvbnN0IGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0aCcpO1xuY29uc3QgZm9ybUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb3JtLWJ0bicpO1xuXG5jb25zdCBlbWFpbElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dGgtZW1haWwnKTtcbmNvbnN0IHBhc3N3b3JkSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0aC1wYXNzd29yZCcpO1xuY29uc3QgcmVwZWF0UGFzc3dvcmRJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRoLXJlcGVhdC1wYXNzd29yZCcpO1xuXG5jb25zdCBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuY29uc3QgZW1haWxFcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRoLWVtYWlsLWVycm9yJyk7XG5jb25zdCBwYXNzd29yZEVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dGgtcGFzc3dvcmQtZXJyb3InKTtcbmNvbnN0IHJlcGVhdFBhc3N3b3JkRXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0aC1yZXBlYXQtcGFzc3dvcmQtZXJyb3InKTtcblxuZm9ybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG5cbmlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoJy9yZWdpc3Rlci5odG1sJykpIHtcbiAgLy8g0J/RgNC+0LLQtdGA0Y/QtdGCINCy0LDQu9C40LTQvdC+0YHRgtGMINC00LDQvdC90YvRhVxuICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xuICAgIHRyeSB7XG4gICAgICB2YWxpZGF0aW9uRW1haWwoZW1haWxJbnB1dC52YWx1ZSk7XG4gICAgICB2YWxpZGF0aW9uUGFzc3dvcmQocGFzc3dvcmRJbnB1dC52YWx1ZSk7XG4gICAgICBpZiAocmVwZWF0UGFzc3dvcmRJbnB1dC52YWx1ZSA9PT0gcGFzc3dvcmRJbnB1dC52YWx1ZSkge1xuICAgICAgICBmb3JtQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3JtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZm9ybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICBlbWFpbElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xuICAgIHRyeSB7XG4gICAgICB2YWxpZGF0aW9uRW1haWwoZW1haWxJbnB1dC52YWx1ZSk7XG4gICAgICBlbWFpbEVycm9yLnRleHRDb250ZW50ID0gJyc7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGVtYWlsRXJyb3IudGV4dENvbnRlbnQgPSBlcnJvci5tZXNzYWdlO1xuICAgIH1cbiAgfSk7XG5cbiAgcGFzc3dvcmRJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGV2ZW50ID0+IHtcbiAgICBpZiAocmVwZWF0UGFzc3dvcmRJbnB1dC52YWx1ZSA9PT0gcGFzc3dvcmRJbnB1dC52YWx1ZSkge1xuICAgICAgcmVwZWF0UGFzc3dvcmRFcnJvci50ZXh0Q29udGVudCA9ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXBlYXRQYXNzd29yZEVycm9yLnRleHRDb250ZW50ID0gJ9Cf0LDRgNC+0LvQuCDQvdC1INGB0L7QstC/0LDQtNCw0Y7Rgi4nO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgdmFsaWRhdGlvblBhc3N3b3JkKHBhc3N3b3JkSW5wdXQudmFsdWUpO1xuICAgICAgcGFzc3dvcmRFcnJvci50ZXh0Q29udGVudCA9ICcnO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBwYXNzd29yZEVycm9yLnRleHRDb250ZW50ID0gZXJyb3IubWVzc2FnZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJlcGVhdFBhc3N3b3JkSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XG4gICAgaWYgKHJlcGVhdFBhc3N3b3JkSW5wdXQudmFsdWUgPT09IHBhc3N3b3JkSW5wdXQudmFsdWUpIHtcbiAgICAgIHJlcGVhdFBhc3N3b3JkRXJyb3IudGV4dENvbnRlbnQgPSAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmVwZWF0UGFzc3dvcmRFcnJvci50ZXh0Q29udGVudCA9ICfQn9Cw0YDQvtC70Lgg0L3QtSDRgdC+0LLQv9Cw0LTQsNGO0YIuJzs7XG4gICAgfVxuICB9KTtcbn0gZWxzZSBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKCcvbG9naW4uaHRtbCcpKSB7XG4gIHNob3dIaWRlUGFzc3dvcmQocGFzc3dvcmRJbnB1dCk7XG5cbiAgY29uc3QgZm9yZ290UGFzc3dvcmRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0aC1mb3Jnb3QtcGFzc3dvcmQnKTtcbiAgZm9yZ290UGFzc3dvcmRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBldmVudCA9PiB7XG4gICAgb3BlblJlc2V0UGFzc3dvcmRNb2RhbCgpO1xuICB9KTtcblxuICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xuICAgIHRyeSB7XG4gICAgICB2YWxpZGF0aW9uRW1haWwoZW1haWxJbnB1dC52YWx1ZSk7XG4gICAgICBpZiAocGFzc3dvcmRJbnB1dC52YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgZm9ybUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9ybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGZvcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgZW1haWxJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGV2ZW50ID0+IHtcbiAgICB0cnkge1xuICAgICAgdmFsaWRhdGlvbkVtYWlsKGVtYWlsSW5wdXQudmFsdWUpO1xuICAgICAgZW1haWxFcnJvci50ZXh0Q29udGVudCA9ICcnO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBlbWFpbEVycm9yLnRleHRDb250ZW50ID0gZXJyb3IubWVzc2FnZTtcbiAgICB9XG4gIH0pO1xufVxuXG5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGFzeW5jIChldmVudCkgPT4ge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBmb3JtQnRuLmFmdGVyKG1lc3NhZ2UpO1xuXG4gIGNvbnN0IGVtYWlsID0gZW1haWxJbnB1dC52YWx1ZS50cmltKCk7XG4gIGNvbnN0IHBhc3N3b3JkID0gcGFzc3dvcmRJbnB1dC52YWx1ZS50cmltKCk7XG4gIGNvbnN0IGxvYWRlckJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblxuICBmb3JtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgZm9ybUJ0bi5hcHBlbmQobG9hZGVyQnRuKTtcbiAgLy8g0JXRgdC70Lgg0Y3RgtCwINGB0YLRgNCw0L3QuNGG0LAg0LTQu9GPINGA0LXQs9C40YHRgtGA0LDRhtC40LhcbiAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcygnL3JlZ2lzdGVyLmh0bWwnKSkge1xuICAgIC8vINCa0L3QvtC/0LrQsCDQtNC70Y8g0L7RgtC80LXQvdGLINCw0YPRgtC10L3RgtC40YTQuNC60LDRhtC40LhcbiAgICBjb25zdCBjYW5jZWxBdXRoQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY2FuY2VsQXV0aEJ0bi5jbGFzc0xpc3QuYWRkKCdhdXRoX19kZXNjci1idG4nKTtcbiAgICBjYW5jZWxBdXRoQnRuLnRleHRDb250ZW50ID0gJ9Ce0YLQvNC10L3QuNGC0Ywg0LDRg9GC0LXQvdGC0LjRhNC40LrQsNGG0LjRjic7XG5cbiAgICB0cnkge1xuICAgICAgLy8g0KHQvtC30LTQsNC10Lwg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPINC4INC00L7QsdCw0LLQu9GP0LXQvCDQsiDQsdCw0LfRgyDQtNCw0L3QvdGL0YVcbiAgICAgIGNvbnN0IHVzZXJDcmVkZW50aWFsID0gYXdhaXQgY3JlYXRlVXNlcldpdGhFbWFpbEFuZFBhc3N3b3JkKGF1dGgsIGVtYWlsLCBwYXNzd29yZCk7XG4gICAgICBjb25zdCB1c2VyID0gdXNlckNyZWRlbnRpYWwudXNlcjtcblxuICAgICAgLy8g0J/RgNC40YHRi9C70LDQtdC8INC/0LjRgdGM0LzQviDQtNC70Y8g0LLQtdGA0LjRhNC40LrQsNGG0LjQuFxuICAgICAgYXdhaXQgc2VuZEVtYWlsVmVyaWZpY2F0aW9uKHVzZXIpO1xuICAgICAgbWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvcicpO1xuICAgICAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdtZXNzYWdlJyk7XG4gICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9Cd0LAg0LLQsNGI0YMg0Y3Qu9C10LrRgtGA0L7QvdC90YPRjiDQv9C+0YfRgtGDINC+0YLQv9GA0LDQstC70LXQvdC+INC/0LjRgdGM0LzQviDRgSDQv9C+0LTRgtCy0LXRgNC20LTQtdC90LjQtdC8Lic7XG4gICAgICBtZXNzYWdlLmFmdGVyKGNhbmNlbEF1dGhCdG4pO1xuXG4gICAgICAvLyDQvtGC0LzQtdC90Y/QtdC8INGA0LXQs9C40YHRgtGA0LDRhtC40Y46INGD0LTQsNC70Y/QtdC8INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjyDQuNC3INCx0LDQt9GLINC00LDQvdC90YvRhSwg0L7Rh9C40YnQsNC10LwgaW5wdXQt0Ysg0Lgg0YIu0LQuXG4gICAgICBjYW5jZWxBdXRoQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZXZlbnQgPT4ge1xuICAgICAgICBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0JykuZm9yRWFjaChpbnB1dCA9PiB7aW5wdXQudmFsdWUgPSAnJ30pO1xuICAgICAgICBhd2FpdCBkZWxldGVVc2VyKHVzZXIpO1xuICAgICAgICBjYW5jZWxBdXRoQnRuLnJlbW92ZSgpO1xuICAgICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJyc7XG4gICAgICAgIG1lc3NhZ2UucmVtb3ZlKCk7XG4gICAgICAgIGZvcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyDQvtGI0LjQsdC60Lgg0YHQtdGA0LLQtdGA0LAsINGC0L4g0LHQuNGI0YwgZmlyZWJhc2Ug0Lgg0LLQvtC30LLRgNCw0YnQtdC90LjQtSDRhNC+0YDQvNGLINC6INC90LDRh9Cw0LvRjNC90L7QvNGDINGB0L7RgdGC0L7Rj9C90LjRjlxuICAgICAgbWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdtZXNzYWdlJyk7XG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG4gICAgICBzd2l0Y2ggKGVycm9yLm1lc3NhZ2UpIHtcbiAgICAgICAgY2FzZSAnRmlyZWJhc2U6IEVycm9yIChhdXRoL2VtYWlsLWFscmVhZHktaW4tdXNlKS4nOlxuICAgICAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0JTQsNC90L3QsNGPINC/0L7Rh9GC0LAg0YPQttC1INC30LDRgNC10LPQuNGB0YLRgNC40YDQvtCy0LDQvdCwLic7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQp9GC0L4t0YLQviDQv9C+0YjQu9C+INC90LUg0YLQsNC6Li4uJztcbiAgICAgIH1cbiAgICAgIGNhbmNlbEF1dGhCdG4ucmVtb3ZlKCk7XG4gICAgICBmb3JtQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGxvYWRlckJ0bi5yZW1vdmUoKTtcbiAgICB9XG4gIH1cblxuICAvLyDQldGB0LvQuCDRjdGC0LAg0YHRgtGA0LDQvdC40YbQsCDQtNC70Y8g0LLRhdC+0LTQsFxuICBlbHNlIGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoJy9sb2dpbi5odG1sJykpIHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgc2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQoYXV0aCwgZW1haWwsIHBhc3N3b3JkKTtcbiAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAvLyDQvtGI0LjQsdC60Lgg0YHQtdGA0LLQtdGA0LAsINGC0L4g0LHQuNGI0YwgZmlyZWJhc2Ug0Lgg0LLQvtC30LLRgNCw0YnQtdC90LjQtSDRhNC+0YDQvNGLINC6INC90LDRh9Cw0LvRjNC90L7QvNGDINGB0L7RgdGC0L7Rj9C90LjRjlxuICAgICAgbWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdtZXNzYWdlJyk7XG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG4gICAgICBzd2l0Y2ggKGVycm9yLm1lc3NhZ2UpIHtcbiAgICAgICAgY2FzZSAnRmlyZWJhc2U6IEVycm9yIChhdXRoL2ludmFsaWQtbG9naW4tY3JlZGVudGlhbHMpLic6XG4gICAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQndC10L/RgNCw0LLQuNC70YzQvdC+INCy0LLQtdC00LXQvdGLINC/0L7Rh9GC0LAg0LjQu9C4INC/0LDRgNC+0LvRjC4nO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0KfRgtC+LdGC0L4g0L/QvtGI0LvQviDQvdC1INGC0LDQui4uLic7XG4gICAgICB9XG4gICAgICBmb3JtQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGxvYWRlckJ0bi5yZW1vdmUoKTtcbiAgICB9XG4gIH1cbn0pO1xuIl0sImZpbGUiOiJhdXRoL3JlZ2lzdGVyT3JMb2dpbi5qcyJ9
