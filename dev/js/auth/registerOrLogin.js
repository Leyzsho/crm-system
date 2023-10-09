import app from '../firebase.js';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, deleteUser, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';
import { validationEmail, validationPassword } from './validation.js';
import { openResetPasswordModal } from './modals.js';
const auth = getAuth(app);

// Небольшое пояснение:
// Так как в данном приложение аутентификация обязательна, все страницы (кроме самой регистрации и входа) отправляют пользователя обратно на страницу регистрации, если у него нет аккаунта или если его email не является верифицированным,
// я не буду в комментариях подчеркивать тот факт, что пользователя перенаправили на страницу регистрации.

export function showHidePassword(input) {
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

(async () => {
  let checkEmailVerified;
  let isEmailNotVerified = true;

  await onAuthStateChanged(auth, async (user) => {
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
      // когда пользователь зарегистрировался, firebase отправляет ему письмо для верификации, поэтому каждые 3сек проверяем, подтвердил ли он или нет. Я не знал, как еще можно было реализовать данный момент в реальном времени без обновление страницы
      checkEmailVerified = setInterval(() => {
        user.reload();
        if (user.emailVerified) {
          window.location.href = './account.html';
        }
      }, 3000);
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

  if (window.location.pathname.includes('/register.html')) {
    // Делаем валидацию email
    emailInput.addEventListener('input', event => {
      try {
        validationEmail(emailInput.value);
        emailError.textContent = '';
      } catch (error) {
        emailError.textContent = error.message;
      }
    });

    // Делаем валидацию пароля
    passwordInput.addEventListener('input', event => {
      if (window.location.pathname.includes('/register.html')) {
        if (repeatPasswordInput.value === passwordInput.value) {
          repeatPasswordError.textContent = '';
        } else {
          repeatPasswordError.textContent = 'Пароли не совпадают.';
        }
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
        repeatPasswordError.textContent = 'Пароли не совпадают.';
      }
    });
  } else if (window.location.pathname.includes('/login.html')) {
    showHidePassword(passwordInput);

    const forgotPasswordBtn = document.getElementById('auth-forgot-password');

    forgotPasswordBtn.addEventListener('click', async event => {
      openResetPasswordModal();
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // если есть ошибки в валидации, отменяем регистрацию
    if (window.location.pathname.includes('/register.html')) {
      if (emailError.textContent !== '' ||
      passwordError.textContent !== '' ||
      repeatPasswordInput.value !== passwordInput.value) {
        return;
      }
    }
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const loaderBtn = document.createElement('span');

    formBtn.disabled = true;
    formBtn.append(loaderBtn);
    formBtn.after(message);

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
        message.textContent = 'На вашу электронную почту отправлено письмо с подтверждением. Пожалуйста, подтвердите свою почту, прежде чем войти.';
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
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhdXRoL3JlZ2lzdGVyT3JMb2dpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXBwIGZyb20gJy4uL2ZpcmViYXNlLmpzJztcbmltcG9ydCB7IGdldEF1dGgsIGNyZWF0ZVVzZXJXaXRoRW1haWxBbmRQYXNzd29yZCwgb25BdXRoU3RhdGVDaGFuZ2VkLCBzZW5kRW1haWxWZXJpZmljYXRpb24sIGRlbGV0ZVVzZXIsIHNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkIH0gZnJvbSAnaHR0cHM6Ly93d3cuZ3N0YXRpYy5jb20vZmlyZWJhc2Vqcy85LjEuMS9maXJlYmFzZS1hdXRoLmpzJztcbmltcG9ydCB7IHZhbGlkYXRpb25FbWFpbCwgdmFsaWRhdGlvblBhc3N3b3JkIH0gZnJvbSAnLi92YWxpZGF0aW9uLmpzJztcbmltcG9ydCB7IG9wZW5SZXNldFBhc3N3b3JkTW9kYWwgfSBmcm9tICcuL21vZGFscy5qcyc7XG5jb25zdCBhdXRoID0gZ2V0QXV0aChhcHApO1xuXG4vLyDQndC10LHQvtC70YzRiNC+0LUg0L/QvtGP0YHQvdC10L3QuNC1OlxuLy8g0KLQsNC6INC60LDQuiDQsiDQtNCw0L3QvdC+0Lwg0L/RgNC40LvQvtC20LXQvdC40LUg0LDRg9GC0LXQvdGC0LjRhNC40LrQsNGG0LjRjyDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdCwLCDQstGB0LUg0YHRgtGA0LDQvdC40YbRiyAo0LrRgNC+0LzQtSDRgdCw0LzQvtC5INGA0LXQs9C40YHRgtGA0LDRhtC40Lgg0Lgg0LLRhdC+0LTQsCkg0L7RgtC/0YDQsNCy0LvRj9GO0YIg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPINC+0LHRgNCw0YLQvdC+INC90LAg0YHRgtGA0LDQvdC40YbRgyDRgNC10LPQuNGB0YLRgNCw0YbQuNC4LCDQtdGB0LvQuCDRgyDQvdC10LPQviDQvdC10YIg0LDQutC60LDRg9C90YLQsCDQuNC70Lgg0LXRgdC70Lgg0LXQs9C+IGVtYWlsINC90LUg0Y/QstC70Y/QtdGC0YHRjyDQstC10YDQuNGE0LjRhtC40YDQvtCy0LDQvdC90YvQvCxcbi8vINGPINC90LUg0LHRg9C00YMg0LIg0LrQvtC80LzQtdC90YLQsNGA0LjRj9GFINC/0L7QtNGH0LXRgNC60LjQstCw0YLRjCDRgtC+0YIg0YTQsNC60YIsINGH0YLQviDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y8g0L/QtdGA0LXQvdCw0L/RgNCw0LLQuNC70Lgg0L3QsCDRgdGC0YDQsNC90LjRhtGDINGA0LXQs9C40YHRgtGA0LDRhtC40LguXG5cbmZ1bmN0aW9uIHNob3dIaWRlUGFzc3dvcmQoaW5wdXQpIHtcbiAgY29uc3QgY29udGFpbmVyID0gaW5wdXQucGFyZW50RWxlbWVudDtcbiAgY29uc3QgYnRuID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xuICBjb25zdCB1c2VFbGVtZW50ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3VzZScpO1xuICBpZiAoIWJ0bikge1xuICAgIHRocm93IG5ldyBFcnJvcign0J7RgtGB0YPRgdGC0LLRg9C10YIg0LrQvdC+0L/QutCwINC00LvRjyDQv9C+0LrQsNC30LAv0YHQutGA0YvRgtC40Y8g0L/QsNGA0L7Qu9GPJyk7XG4gIH1cblxuICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAoaW5wdXQudHlwZSA9PT0gJ3Bhc3N3b3JkJykge1xuICAgICAgaW5wdXQudHlwZSA9ICd0ZXh0JztcbiAgICAgIHVzZUVsZW1lbnQuc2V0QXR0cmlidXRlKCd4bGluazpocmVmJywgJyNoaWRlLXBhc3N3b3JkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlucHV0LnR5cGUgPSAncGFzc3dvcmQnO1xuICAgICAgdXNlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3hsaW5rOmhyZWYnLCAnI3Nob3ctcGFzc3dvcmQnKTtcbiAgICB9XG4gIH0pO1xufVxuXG4oYXN5bmMgKCkgPT4ge1xuICBsZXQgY2hlY2tFbWFpbFZlcmlmaWVkO1xuICBsZXQgaXNFbWFpbE5vdFZlcmlmaWVkID0gdHJ1ZTtcblxuICBhd2FpdCBvbkF1dGhTdGF0ZUNoYW5nZWQoYXV0aCwgYXN5bmMgKHVzZXIpID0+IHtcbiAgICBpZiAodXNlciAmJiB1c2VyLmVtYWlsVmVyaWZpZWQpIHtcbiAgICAgIC8vINC10YHQu9C4INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCDQtdGB0YLRjCDQsiDQsdCw0LfQtSDQtNCw0L3QvdGL0YUg0Lgg0L7QvSDQstC10YDQuNGE0LjRhtC40YDQvtCy0LDQuyBlbWFpbCwg0YLQviDQv9GA0L7Qs9C+0L3Rj9C10Lwg0YHQviDRgdGC0YDQsNC90LjRhtGLXG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuL2FjY291bnQuaHRtbCc7XG4gICAgfSBlbHNlIGlmICh1c2VyICYmICF1c2VyLmVtYWlsVmVyaWZpZWQpIHtcbiAgICAgIGlmIChpc0VtYWlsTm90VmVyaWZpZWQpIHtcbiAgICAgICAgLy8g0JXRgdC70Lgg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GMINC30LDRgNC10LPQuNGB0YLRgNC40YDQvtCy0LDQu9GB0Y8sINC90L4g0L3QtSDQv9C+0LTRgtCy0LXRgNC00LjQuyBlbWFpbCwg0Lgg0L/RgNC4INGN0YLQvtC8INC/0YDQtdGA0LLQsNC7INC/0YDQvtGG0LXRgdGBINCw0YPRgtC10L3RgtC40YTQuNC60LDRhtC40LgsINGC0LDQutC40LzQuCDQtNC10LnRgdGC0LLQuNGP0LzQuCDQutCw0Lo6INC/0LXRgNC10LfQsNCz0YDRg9C30LrQsCDRgtC10LrRg9GJ0LXQuSDRgdGC0YDQsNC90LjRhtGLLCDQv9C10YDQtdGF0L7QtCDQvdCwINC00YDRg9Cz0YPRjiDRgdGC0YDQsNC90LjRhtGDLCDRgtC+INC80Ysg0YPQtNCw0LvRj9C10Lwg0LXQs9C+INC40Lcg0LHQsNC30Ysg0LTQsNC90L3Ri9GFXG4gICAgICAgIGRlbGV0ZVVzZXIodXNlcik7XG4gICAgICAgIGlzRW1haWxOb3RWZXJpZmllZCA9IGZhbHNlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyDQutC+0LPQtNCwINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCDQt9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0LvRgdGPLCBmaXJlYmFzZSDQvtGC0L/RgNCw0LLQu9GP0LXRgiDQtdC80YMg0L/QuNGB0YzQvNC+INC00LvRjyDQstC10YDQuNGE0LjQutCw0YbQuNC4LCDQv9C+0Y3RgtC+0LzRgyDQutCw0LbQtNGL0LUgM9GB0LXQuiDQv9GA0L7QstC10YDRj9C10LwsINC/0L7QtNGC0LLQtdGA0LTQuNC7INC70Lgg0L7QvSDQuNC70Lgg0L3QtdGCLiDQryDQvdC1INC30L3QsNC7LCDQutCw0Log0LXRidC1INC80L7QttC90L4g0LHRi9C70L4g0YDQtdCw0LvQuNC30L7QstCw0YLRjCDQtNCw0L3QvdGL0Lkg0LzQvtC80LXQvdGCINCyINGA0LXQsNC70YzQvdC+0Lwg0LLRgNC10LzQtdC90Lgg0LHQtdC3INC+0LHQvdC+0LLQu9C10L3QuNC1INGB0YLRgNCw0L3QuNGG0YtcbiAgICAgIGNoZWNrRW1haWxWZXJpZmllZCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgdXNlci5yZWxvYWQoKTtcbiAgICAgICAgaWYgKHVzZXIuZW1haWxWZXJpZmllZCkge1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4vYWNjb3VudC5odG1sJztcbiAgICAgICAgfVxuICAgICAgfSwgMzAwMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwoY2hlY2tFbWFpbFZlcmlmaWVkKTtcbiAgICAgIGlzRW1haWxOb3RWZXJpZmllZCA9IGZhbHNlO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8g0L7QsdGJ0LjQtSDQutC+0L3RgdGC0LDQvdGC0Ysg0YHRgtGA0LDQvdC40YbRiyDRgNC10LPQuNGB0YLRgNCw0YbQuNC4INC4INCy0YXQvtC00LBcbiAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRoJyk7XG4gIGNvbnN0IGZvcm1CdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9ybS1idG4nKTtcblxuICBjb25zdCBlbWFpbElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dGgtZW1haWwnKTtcbiAgY29uc3QgcGFzc3dvcmRJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRoLXBhc3N3b3JkJyk7XG4gIGNvbnN0IHJlcGVhdFBhc3N3b3JkSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0aC1yZXBlYXQtcGFzc3dvcmQnKTtcblxuICBjb25zdCBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBjb25zdCBlbWFpbEVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dGgtZW1haWwtZXJyb3InKTtcbiAgY29uc3QgcGFzc3dvcmRFcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRoLXBhc3N3b3JkLWVycm9yJyk7XG4gIGNvbnN0IHJlcGVhdFBhc3N3b3JkRXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0aC1yZXBlYXQtcGFzc3dvcmQtZXJyb3InKTtcblxuICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKCcvcmVnaXN0ZXIuaHRtbCcpKSB7XG4gICAgLy8g0JTQtdC70LDQtdC8INCy0LDQu9C40LTQsNGG0LjRjiBlbWFpbFxuICAgIGVtYWlsSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICB2YWxpZGF0aW9uRW1haWwoZW1haWxJbnB1dC52YWx1ZSk7XG4gICAgICAgIGVtYWlsRXJyb3IudGV4dENvbnRlbnQgPSAnJztcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGVtYWlsRXJyb3IudGV4dENvbnRlbnQgPSBlcnJvci5tZXNzYWdlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g0JTQtdC70LDQtdC8INCy0LDQu9C40LTQsNGG0LjRjiDQv9Cw0YDQvtC70Y9cbiAgICBwYXNzd29yZElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xuICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcygnL3JlZ2lzdGVyLmh0bWwnKSkge1xuICAgICAgICBpZiAocmVwZWF0UGFzc3dvcmRJbnB1dC52YWx1ZSA9PT0gcGFzc3dvcmRJbnB1dC52YWx1ZSkge1xuICAgICAgICAgIHJlcGVhdFBhc3N3b3JkRXJyb3IudGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXBlYXRQYXNzd29yZEVycm9yLnRleHRDb250ZW50ID0gJ9Cf0LDRgNC+0LvQuCDQvdC1INGB0L7QstC00LDQtNCw0Y7Rgi4nO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbGlkYXRpb25QYXNzd29yZChwYXNzd29yZElucHV0LnZhbHVlKTtcbiAgICAgICAgcGFzc3dvcmRFcnJvci50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcGFzc3dvcmRFcnJvci50ZXh0Q29udGVudCA9IGVycm9yLm1lc3NhZ2U7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXBlYXRQYXNzd29yZElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xuICAgICAgaWYgKHJlcGVhdFBhc3N3b3JkSW5wdXQudmFsdWUgPT09IHBhc3N3b3JkSW5wdXQudmFsdWUpIHtcbiAgICAgICAgcmVwZWF0UGFzc3dvcmRFcnJvci50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVwZWF0UGFzc3dvcmRFcnJvci50ZXh0Q29udGVudCA9ICfQn9Cw0YDQvtC70Lgg0L3QtSDRgdC+0LLQtNCw0LTQsNGO0YIuJztcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoJy9sb2dpbi5odG1sJykpIHtcbiAgICBzaG93SGlkZVBhc3N3b3JkKHBhc3N3b3JkSW5wdXQpO1xuXG4gICAgY29uc3QgZm9yZ290UGFzc3dvcmRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0aC1mb3Jnb3QtcGFzc3dvcmQnKTtcblxuICAgIGZvcmdvdFBhc3N3b3JkQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZXZlbnQgPT4ge1xuICAgICAgb3BlblJlc2V0UGFzc3dvcmRNb2RhbCgpO1xuICAgIH0pO1xuICB9XG5cbiAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBhc3luYyAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgLy8g0LXRgdC70Lgg0LXRgdGC0Ywg0L7RiNC40LHQutC4INCyINCy0LDQu9C40LTQsNGG0LjQuCwg0L7RgtC80LXQvdGP0LXQvCDRgNC10LPQuNGB0YLRgNCw0YbQuNGOLCDQv9GA0Lgg0Y3RgtC+0Lwg0LXRgdC70Lgg0Y3RgtCwINGB0YLRgNCw0L3QuNGG0LAg0LLRhdC+0LTQsCwg0LfQvdCw0YfQtdC90LjRjyDQuNGC0LDQuiDQsdGD0LTRg9GCINC/0YPRgdGC0YvQvNC4XG4gICAgaWYgKGVtYWlsRXJyb3IudGV4dENvbnRlbnQgIT09ICcnICYmIHBhc3N3b3JkRXJyb3IudGV4dENvbnRlbnQgIT09ICcnICYmIHJlcGVhdFBhc3N3b3JkRXJyb3IudGV4dENvbnRlbnQgIT09ICcnKSByZXR1cm47XG5cbiAgICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKCcvcmVnaXN0ZXIuaHRtbCcpICYmIHJlcGVhdFBhc3N3b3JkSW5wdXQudmFsdWUgIT09IHBhc3N3b3JkSW5wdXQudmFsdWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBlbWFpbCA9IGVtYWlsSW5wdXQudmFsdWUudHJpbSgpO1xuICAgIGNvbnN0IHBhc3N3b3JkID0gcGFzc3dvcmRJbnB1dC52YWx1ZS50cmltKCk7XG4gICAgY29uc3QgbG9hZGVyQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXG4gICAgZm9ybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgZm9ybUJ0bi5hcHBlbmQobG9hZGVyQnRuKTtcbiAgICBmb3JtQnRuLmFmdGVyKG1lc3NhZ2UpO1xuXG4gICAgLy8g0JXRgdC70Lgg0Y3RgtCwINGB0YLRgNCw0L3QuNGG0LAg0LTQu9GPINGA0LXQs9C40YHRgtGA0LDRhtC40LhcbiAgICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKCcvcmVnaXN0ZXIuaHRtbCcpKSB7XG4gICAgICAvLyDQmtC90L7Qv9C60LAg0LTQu9GPINC+0YLQvNC10L3RiyDQsNGD0YLQtdC90YLQuNGE0LjQutCw0YbQuNC4XG4gICAgICBjb25zdCBjYW5jZWxBdXRoQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICBjYW5jZWxBdXRoQnRuLmNsYXNzTGlzdC5hZGQoJ2F1dGhfX2Rlc2NyLWJ0bicpO1xuICAgICAgY2FuY2VsQXV0aEJ0bi50ZXh0Q29udGVudCA9ICfQntGC0LzQtdC90LjRgtGMINCw0YPRgtC10L3RgtC40YTQuNC60LDRhtC40Y4nO1xuXG4gICAgICB0cnkge1xuICAgICAgICAvLyDQodC+0LfQtNCw0LXQvCDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y8g0Lgg0LTQvtCx0LDQstC70Y/QtdC8INCyINCx0LDQt9GDINC00LDQvdC90YvRhVxuICAgICAgICBjb25zdCB1c2VyQ3JlZGVudGlhbCA9IGF3YWl0IGNyZWF0ZVVzZXJXaXRoRW1haWxBbmRQYXNzd29yZChhdXRoLCBlbWFpbCwgcGFzc3dvcmQpO1xuICAgICAgICBjb25zdCB1c2VyID0gdXNlckNyZWRlbnRpYWwudXNlcjtcblxuICAgICAgICAvLyDQn9GA0LjRgdGL0LvQsNC10Lwg0L/QuNGB0YzQvNC+INC00LvRjyDQstC10YDQuNGE0LjQutCw0YbQuNC4XG4gICAgICAgIGF3YWl0IHNlbmRFbWFpbFZlcmlmaWNhdGlvbih1c2VyKTtcbiAgICAgICAgbWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvcicpO1xuICAgICAgICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ21lc3NhZ2UnKTtcbiAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQndCwINCy0LDRiNGDINGN0LvQtdC60YLRgNC+0L3QvdGD0Y4g0L/QvtGH0YLRgyDQvtGC0L/RgNCw0LLQu9C10L3QviDQv9C40YHRjNC80L4g0YEg0L/QvtC00YLQstC10YDQttC00LXQvdC40LXQvC4g0J/QvtC20LDQu9GD0LnRgdGC0LAsINC/0L7QtNGC0LLQtdGA0LTQuNGC0LUg0YHQstC+0Y4g0L/QvtGH0YLRgywg0L/RgNC10LbQtNC1INGH0LXQvCDQstC+0LnRgtC4Lic7XG4gICAgICAgIG1lc3NhZ2UuYWZ0ZXIoY2FuY2VsQXV0aEJ0bik7XG5cbiAgICAgICAgLy8g0L7RgtC80LXQvdGP0LXQvCDRgNC10LPQuNGB0YLRgNCw0YbQuNGOOiDRg9C00LDQu9GP0LXQvCDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y8g0LjQtyDQsdCw0LfRiyDQtNCw0L3QvdGL0YUsINC+0YfQuNGJ0LDQtdC8IGlucHV0LdGLINC4INGCLtC0LlxuICAgICAgICBjYW5jZWxBdXRoQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZXZlbnQgPT4ge1xuICAgICAgICAgIGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKS5mb3JFYWNoKGlucHV0ID0+IHtpbnB1dC52YWx1ZSA9ICcnfSk7XG4gICAgICAgICAgYXdhaXQgZGVsZXRlVXNlcih1c2VyKTtcbiAgICAgICAgICBjYW5jZWxBdXRoQnRuLnJlbW92ZSgpO1xuICAgICAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgICBtZXNzYWdlLnJlbW92ZSgpO1xuICAgICAgICAgIGZvcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyDQvtGI0LjQsdC60Lgg0YHQtdGA0LLQtdGA0LAsINGC0L4g0LHQuNGI0YwgZmlyZWJhc2Ug0Lgg0LLQvtC30LLRgNCw0YnQtdC90LjQtSDRhNC+0YDQvNGLINC6INC90LDRh9Cw0LvRjNC90L7QvNGDINGB0L7RgdGC0L7Rj9C90LjRjlxuICAgICAgICBtZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ21lc3NhZ2UnKTtcbiAgICAgICAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xuICAgICAgICBzd2l0Y2ggKGVycm9yLm1lc3NhZ2UpIHtcbiAgICAgICAgICBjYXNlICdGaXJlYmFzZTogRXJyb3IgKGF1dGgvZW1haWwtYWxyZWFkeS1pbi11c2UpLic6XG4gICAgICAgICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9CU0LDQvdC90LDRjyDQv9C+0YfRgtCwINGD0LbQtSDQt9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0L3QsC4nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0KfRgtC+LdGC0L4g0L/QvtGI0LvQviDQvdC1INGC0LDQui4uLic7XG4gICAgICAgIH1cbiAgICAgICAgY2FuY2VsQXV0aEJ0bi5yZW1vdmUoKTtcbiAgICAgICAgZm9ybUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgbG9hZGVyQnRuLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vINCV0YHQu9C4INGN0YLQsCDRgdGC0YDQsNC90LjRhtCwINC00LvRjyDQstGF0L7QtNCwXG4gICAgZWxzZSBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKCcvbG9naW4uaHRtbCcpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBzaWduSW5XaXRoRW1haWxBbmRQYXNzd29yZChhdXRoLCBlbWFpbCwgcGFzc3dvcmQpO1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAvLyDQvtGI0LjQsdC60Lgg0YHQtdGA0LLQtdGA0LAsINGC0L4g0LHQuNGI0YwgZmlyZWJhc2Ug0Lgg0LLQvtC30LLRgNCw0YnQtdC90LjQtSDRhNC+0YDQvNGLINC6INC90LDRh9Cw0LvRjNC90L7QvNGDINGB0L7RgdGC0L7Rj9C90LjRjlxuICAgICAgICBtZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ21lc3NhZ2UnKTtcbiAgICAgICAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdlcnJvcicpO1xuICAgICAgICBzd2l0Y2ggKGVycm9yLm1lc3NhZ2UpIHtcbiAgICAgICAgICBjYXNlICdGaXJlYmFzZTogRXJyb3IgKGF1dGgvaW52YWxpZC1sb2dpbi1jcmVkZW50aWFscykuJzpcbiAgICAgICAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0J3QtdC/0YDQsNCy0LjQu9GM0L3QviDQstCy0LXQtNC10L3RiyDQv9C+0YfRgtCwINC40LvQuCDQv9Cw0YDQvtC70YwuJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9Cn0YLQvi3RgtC+INC/0L7RiNC70L4g0L3QtSDRgtCw0LouLi4nO1xuICAgICAgICB9XG4gICAgICAgIGZvcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGxvYWRlckJ0bi5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufSkoKTtcbiJdLCJmaWxlIjoiYXV0aC9yZWdpc3Rlck9yTG9naW4uanMifQ==
