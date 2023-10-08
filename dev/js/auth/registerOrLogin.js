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

  message.classList.add('descr-error');

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
          repeatPasswordError.textContent = 'Пароли не совдадают.';
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
        repeatPasswordError.textContent = 'Пароли не совдадают.';
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

    // если есть ошибки в валидации, отменяем регистрацию, при этом если эта страница входа, значения итак будут пустыми
    if (emailError.textContent !== '' && passwordError.textContent !== '' && repeatPasswordError.textContent !== '') return;
    console.log('ok')
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
        switch (error.message) {
          case 'Firebase: Error (auth/email-already-in-use).':
            message.textContent = 'Данная почта уже зарегистрирована.';
            break;
          default:
            message.textContent = 'Что-то пошло не так...';
        }
        cancelAuthBtn.remove();
        formBtn.disabled = false;
        console.log(error.message)
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
        switch (error.message) {
          case 'Firebase: Error (auth/invalid-login-credentials).':
            message.textContent = 'Неправильно введены почта или пароль.';
            break;
          default:
            message.textContent = 'Что-то пошло не так...';
        }
        console.log(error.message)
        formBtn.disabled = false;
      } finally {
        loaderBtn.remove();
      }
    }
  });
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhdXRoL3JlZ2lzdGVyT3JMb2dpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXBwIGZyb20gJy4uL2ZpcmViYXNlLmpzJztcbmltcG9ydCB7IGdldEF1dGgsIGNyZWF0ZVVzZXJXaXRoRW1haWxBbmRQYXNzd29yZCwgb25BdXRoU3RhdGVDaGFuZ2VkLCBzZW5kRW1haWxWZXJpZmljYXRpb24sIGRlbGV0ZVVzZXIsIHNpZ25JbldpdGhFbWFpbEFuZFBhc3N3b3JkIH0gZnJvbSAnaHR0cHM6Ly93d3cuZ3N0YXRpYy5jb20vZmlyZWJhc2Vqcy85LjEuMS9maXJlYmFzZS1hdXRoLmpzJztcbmltcG9ydCB7IHZhbGlkYXRpb25FbWFpbCwgdmFsaWRhdGlvblBhc3N3b3JkIH0gZnJvbSAnLi92YWxpZGF0aW9uLmpzJztcbmltcG9ydCB7IG9wZW5SZXNldFBhc3N3b3JkTW9kYWwgfSBmcm9tICcuL21vZGFscy5qcyc7XG5jb25zdCBhdXRoID0gZ2V0QXV0aChhcHApO1xuXG4vLyDQndC10LHQvtC70YzRiNC+0LUg0L/QvtGP0YHQvdC10L3QuNC1OlxuLy8g0KLQsNC6INC60LDQuiDQsiDQtNCw0L3QvdC+0Lwg0L/RgNC40LvQvtC20LXQvdC40LUg0LDRg9GC0LXQvdGC0LjRhNC40LrQsNGG0LjRjyDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdCwLCDQstGB0LUg0YHRgtGA0LDQvdC40YbRiyAo0LrRgNC+0LzQtSDRgdCw0LzQvtC5INGA0LXQs9C40YHRgtGA0LDRhtC40Lgg0Lgg0LLRhdC+0LTQsCkg0L7RgtC/0YDQsNCy0LvRj9GO0YIg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPINC+0LHRgNCw0YLQvdC+INC90LAg0YHRgtGA0LDQvdC40YbRgyDRgNC10LPQuNGB0YLRgNCw0YbQuNC4LCDQtdGB0LvQuCDRgyDQvdC10LPQviDQvdC10YIg0LDQutC60LDRg9C90YLQsCDQuNC70Lgg0LXRgdC70Lgg0LXQs9C+IGVtYWlsINC90LUg0Y/QstC70Y/QtdGC0YHRjyDQstC10YDQuNGE0LjRhtC40YDQvtCy0LDQvdC90YvQvCxcbi8vINGPINC90LUg0LHRg9C00YMg0LIg0LrQvtC80LzQtdC90YLQsNGA0LjRj9GFINC/0L7QtNGH0LXRgNC60LjQstCw0YLRjCDRgtC+0YIg0YTQsNC60YIsINGH0YLQviDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y8g0L/QtdGA0LXQvdCw0L/RgNCw0LLQuNC70Lgg0L3QsCDRgdGC0YDQsNC90LjRhtGDINGA0LXQs9C40YHRgtGA0LDRhtC40LguXG5cbmZ1bmN0aW9uIHNob3dIaWRlUGFzc3dvcmQoaW5wdXQpIHtcbiAgY29uc3QgY29udGFpbmVyID0gaW5wdXQucGFyZW50RWxlbWVudDtcbiAgY29uc3QgYnRuID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xuICBjb25zdCB1c2VFbGVtZW50ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3VzZScpO1xuICBpZiAoIWJ0bikge1xuICAgIHRocm93IG5ldyBFcnJvcign0J7RgtGB0YPRgdGC0LLRg9C10YIg0LrQvdC+0L/QutCwINC00LvRjyDQv9C+0LrQsNC30LAv0YHQutGA0YvRgtC40Y8g0L/QsNGA0L7Qu9GPJyk7XG4gIH1cblxuICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAoaW5wdXQudHlwZSA9PT0gJ3Bhc3N3b3JkJykge1xuICAgICAgaW5wdXQudHlwZSA9ICd0ZXh0JztcbiAgICAgIHVzZUVsZW1lbnQuc2V0QXR0cmlidXRlKCd4bGluazpocmVmJywgJyNoaWRlLXBhc3N3b3JkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlucHV0LnR5cGUgPSAncGFzc3dvcmQnO1xuICAgICAgdXNlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3hsaW5rOmhyZWYnLCAnI3Nob3ctcGFzc3dvcmQnKTtcbiAgICB9XG4gIH0pO1xufVxuXG4oYXN5bmMgKCkgPT4ge1xuICBsZXQgY2hlY2tFbWFpbFZlcmlmaWVkO1xuICBsZXQgaXNFbWFpbE5vdFZlcmlmaWVkID0gdHJ1ZTtcblxuICBhd2FpdCBvbkF1dGhTdGF0ZUNoYW5nZWQoYXV0aCwgYXN5bmMgKHVzZXIpID0+IHtcbiAgICBpZiAodXNlciAmJiB1c2VyLmVtYWlsVmVyaWZpZWQpIHtcbiAgICAgIC8vINC10YHQu9C4INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCDQtdGB0YLRjCDQsiDQsdCw0LfQtSDQtNCw0L3QvdGL0YUg0Lgg0L7QvSDQstC10YDQuNGE0LjRhtC40YDQvtCy0LDQuyBlbWFpbCwg0YLQviDQv9GA0L7Qs9C+0L3Rj9C10Lwg0YHQviDRgdGC0YDQsNC90LjRhtGLXG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuL2FjY291bnQuaHRtbCc7XG4gICAgfSBlbHNlIGlmICh1c2VyICYmICF1c2VyLmVtYWlsVmVyaWZpZWQpIHtcbiAgICAgIGlmIChpc0VtYWlsTm90VmVyaWZpZWQpIHtcbiAgICAgICAgLy8g0JXRgdC70Lgg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GMINC30LDRgNC10LPQuNGB0YLRgNC40YDQvtCy0LDQu9GB0Y8sINC90L4g0L3QtSDQv9C+0LTRgtCy0LXRgNC00LjQuyBlbWFpbCwg0Lgg0L/RgNC4INGN0YLQvtC8INC/0YDQtdGA0LLQsNC7INC/0YDQvtGG0LXRgdGBINCw0YPRgtC10L3RgtC40YTQuNC60LDRhtC40LgsINGC0LDQutC40LzQuCDQtNC10LnRgdGC0LLQuNGP0LzQuCDQutCw0Lo6INC/0LXRgNC10LfQsNCz0YDRg9C30LrQsCDRgtC10LrRg9GJ0LXQuSDRgdGC0YDQsNC90LjRhtGLLCDQv9C10YDQtdGF0L7QtCDQvdCwINC00YDRg9Cz0YPRjiDRgdGC0YDQsNC90LjRhtGDLCDRgtC+INC80Ysg0YPQtNCw0LvRj9C10Lwg0LXQs9C+INC40Lcg0LHQsNC30Ysg0LTQsNC90L3Ri9GFXG4gICAgICAgIGRlbGV0ZVVzZXIodXNlcik7XG4gICAgICAgIGlzRW1haWxOb3RWZXJpZmllZCA9IGZhbHNlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyDQutC+0LPQtNCwINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCDQt9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0LvRgdGPLCBmaXJlYmFzZSDQvtGC0L/RgNCw0LLQu9GP0LXRgiDQtdC80YMg0L/QuNGB0YzQvNC+INC00LvRjyDQstC10YDQuNGE0LjQutCw0YbQuNC4LCDQv9C+0Y3RgtC+0LzRgyDQutCw0LbQtNGL0LUgM9GB0LXQuiDQv9GA0L7QstC10YDRj9C10LwsINC/0L7QtNGC0LLQtdGA0LTQuNC7INC70Lgg0L7QvSDQuNC70Lgg0L3QtdGCLiDQryDQvdC1INC30L3QsNC7LCDQutCw0Log0LXRidC1INC80L7QttC90L4g0LHRi9C70L4g0YDQtdCw0LvQuNC30L7QstCw0YLRjCDQtNCw0L3QvdGL0Lkg0LzQvtC80LXQvdGCINCyINGA0LXQsNC70YzQvdC+0Lwg0LLRgNC10LzQtdC90Lgg0LHQtdC3INC+0LHQvdC+0LLQu9C10L3QuNC1INGB0YLRgNCw0L3QuNGG0YtcbiAgICAgIGNoZWNrRW1haWxWZXJpZmllZCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgdXNlci5yZWxvYWQoKTtcbiAgICAgICAgaWYgKHVzZXIuZW1haWxWZXJpZmllZCkge1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4vYWNjb3VudC5odG1sJztcbiAgICAgICAgfVxuICAgICAgfSwgMzAwMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwoY2hlY2tFbWFpbFZlcmlmaWVkKTtcbiAgICAgIGlzRW1haWxOb3RWZXJpZmllZCA9IGZhbHNlO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8g0L7QsdGJ0LjQtSDQutC+0L3RgdGC0LDQvdGC0Ysg0YHRgtGA0LDQvdC40YbRiyDRgNC10LPQuNGB0YLRgNCw0YbQuNC4INC4INCy0YXQvtC00LBcbiAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRoJyk7XG4gIGNvbnN0IGZvcm1CdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9ybS1idG4nKTtcblxuICBjb25zdCBlbWFpbElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dGgtZW1haWwnKTtcbiAgY29uc3QgcGFzc3dvcmRJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRoLXBhc3N3b3JkJyk7XG4gIGNvbnN0IHJlcGVhdFBhc3N3b3JkSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0aC1yZXBlYXQtcGFzc3dvcmQnKTtcblxuICBjb25zdCBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBjb25zdCBlbWFpbEVycm9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dGgtZW1haWwtZXJyb3InKTtcbiAgY29uc3QgcGFzc3dvcmRFcnJvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRoLXBhc3N3b3JkLWVycm9yJyk7XG4gIGNvbnN0IHJlcGVhdFBhc3N3b3JkRXJyb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0aC1yZXBlYXQtcGFzc3dvcmQtZXJyb3InKTtcblxuICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2Rlc2NyLWVycm9yJyk7XG5cbiAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcygnL3JlZ2lzdGVyLmh0bWwnKSkge1xuICAgIC8vINCU0LXQu9Cw0LXQvCDQstCw0LvQuNC00LDRhtC40Y4gZW1haWxcbiAgICBlbWFpbElucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsaWRhdGlvbkVtYWlsKGVtYWlsSW5wdXQudmFsdWUpO1xuICAgICAgICBlbWFpbEVycm9yLnRleHRDb250ZW50ID0gJyc7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlbWFpbEVycm9yLnRleHRDb250ZW50ID0gZXJyb3IubWVzc2FnZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vINCU0LXQu9Cw0LXQvCDQstCw0LvQuNC00LDRhtC40Y4g0L/QsNGA0L7Qu9GPXG4gICAgcGFzc3dvcmRJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGV2ZW50ID0+IHtcbiAgICAgIGlmICh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoJy9yZWdpc3Rlci5odG1sJykpIHtcbiAgICAgICAgaWYgKHJlcGVhdFBhc3N3b3JkSW5wdXQudmFsdWUgPT09IHBhc3N3b3JkSW5wdXQudmFsdWUpIHtcbiAgICAgICAgICByZXBlYXRQYXNzd29yZEVycm9yLnRleHRDb250ZW50ID0gJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVwZWF0UGFzc3dvcmRFcnJvci50ZXh0Q29udGVudCA9ICfQn9Cw0YDQvtC70Lgg0L3QtSDRgdC+0LLQtNCw0LTQsNGO0YIuJztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICB2YWxpZGF0aW9uUGFzc3dvcmQocGFzc3dvcmRJbnB1dC52YWx1ZSk7XG4gICAgICAgIHBhc3N3b3JkRXJyb3IudGV4dENvbnRlbnQgPSAnJztcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHBhc3N3b3JkRXJyb3IudGV4dENvbnRlbnQgPSBlcnJvci5tZXNzYWdlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmVwZWF0UGFzc3dvcmRJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGV2ZW50ID0+IHtcbiAgICAgIGlmIChyZXBlYXRQYXNzd29yZElucHV0LnZhbHVlID09PSBwYXNzd29yZElucHV0LnZhbHVlKSB7XG4gICAgICAgIHJlcGVhdFBhc3N3b3JkRXJyb3IudGV4dENvbnRlbnQgPSAnJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcGVhdFBhc3N3b3JkRXJyb3IudGV4dENvbnRlbnQgPSAn0J/QsNGA0L7Qu9C4INC90LUg0YHQvtCy0LTQsNC00LDRjtGCLic7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKCcvbG9naW4uaHRtbCcpKSB7XG4gICAgc2hvd0hpZGVQYXNzd29yZChwYXNzd29yZElucHV0KTtcblxuICAgIGNvbnN0IGZvcmdvdFBhc3N3b3JkQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dGgtZm9yZ290LXBhc3N3b3JkJyk7XG5cbiAgICBmb3Jnb3RQYXNzd29yZEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGV2ZW50ID0+IHtcbiAgICAgIG9wZW5SZXNldFBhc3N3b3JkTW9kYWwoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIC8vINC10YHQu9C4INC10YHRgtGMINC+0YjQuNCx0LrQuCDQsiDQstCw0LvQuNC00LDRhtC40LgsINC+0YLQvNC10L3Rj9C10Lwg0YDQtdCz0LjRgdGC0YDQsNGG0LjRjiwg0L/RgNC4INGN0YLQvtC8INC10YHQu9C4INGN0YLQsCDRgdGC0YDQsNC90LjRhtCwINCy0YXQvtC00LAsINC30L3QsNGH0LXQvdC40Y8g0LjRgtCw0Log0LHRg9C00YPRgiDQv9GD0YHRgtGL0LzQuFxuICAgIGlmIChlbWFpbEVycm9yLnRleHRDb250ZW50ICE9PSAnJyAmJiBwYXNzd29yZEVycm9yLnRleHRDb250ZW50ICE9PSAnJyAmJiByZXBlYXRQYXNzd29yZEVycm9yLnRleHRDb250ZW50ICE9PSAnJykgcmV0dXJuO1xuICAgIGNvbnNvbGUubG9nKCdvaycpXG4gICAgY29uc3QgZW1haWwgPSBlbWFpbElucHV0LnZhbHVlLnRyaW0oKTtcbiAgICBjb25zdCBwYXNzd29yZCA9IHBhc3N3b3JkSW5wdXQudmFsdWUudHJpbSgpO1xuICAgIGNvbnN0IGxvYWRlckJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblxuICAgIGZvcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgIGZvcm1CdG4uYXBwZW5kKGxvYWRlckJ0bik7XG4gICAgZm9ybUJ0bi5hZnRlcihtZXNzYWdlKTtcblxuICAgIC8vINCV0YHQu9C4INGN0YLQsCDRgdGC0YDQsNC90LjRhtCwINC00LvRjyDRgNC10LPQuNGB0YLRgNCw0YbQuNC4XG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcygnL3JlZ2lzdGVyLmh0bWwnKSkge1xuICAgICAgLy8g0JrQvdC+0L/QutCwINC00LvRjyDQvtGC0LzQtdC90Ysg0LDRg9GC0LXQvdGC0LjRhNC40LrQsNGG0LjQuFxuICAgICAgY29uc3QgY2FuY2VsQXV0aEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgY2FuY2VsQXV0aEJ0bi5jbGFzc0xpc3QuYWRkKCdhdXRoX19kZXNjci1idG4nKTtcbiAgICAgIGNhbmNlbEF1dGhCdG4udGV4dENvbnRlbnQgPSAn0J7RgtC80LXQvdC40YLRjCDQsNGD0YLQtdC90YLQuNGE0LjQutCw0YbQuNGOJztcblxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8g0KHQvtC30LTQsNC10Lwg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPINC4INC00L7QsdCw0LLQu9GP0LXQvCDQsiDQsdCw0LfRgyDQtNCw0L3QvdGL0YVcbiAgICAgICAgY29uc3QgdXNlckNyZWRlbnRpYWwgPSBhd2FpdCBjcmVhdGVVc2VyV2l0aEVtYWlsQW5kUGFzc3dvcmQoYXV0aCwgZW1haWwsIHBhc3N3b3JkKTtcbiAgICAgICAgY29uc3QgdXNlciA9IHVzZXJDcmVkZW50aWFsLnVzZXI7XG5cbiAgICAgICAgLy8g0J/RgNC40YHRi9C70LDQtdC8INC/0LjRgdGM0LzQviDQtNC70Y8g0LLQtdGA0LjRhNC40LrQsNGG0LjQuFxuICAgICAgICBhd2FpdCBzZW5kRW1haWxWZXJpZmljYXRpb24odXNlcik7XG4gICAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0J3QsCDQstCw0YjRgyDRjdC70LXQutGC0YDQvtC90L3Rg9GOINC/0L7Rh9GC0YMg0L7RgtC/0YDQsNCy0LvQtdC90L4g0L/QuNGB0YzQvNC+INGBINC/0L7QtNGC0LLQtdGA0LbQtNC10L3QuNC10LwuINCf0L7QttCw0LvRg9C50YHRgtCwLCDQv9C+0LTRgtCy0LXRgNC00LjRgtC1INGB0LLQvtGOINC/0L7Rh9GC0YMsINC/0YDQtdC20LTQtSDRh9C10Lwg0LLQvtC50YLQuC4nO1xuICAgICAgICBtZXNzYWdlLmFmdGVyKGNhbmNlbEF1dGhCdG4pO1xuXG4gICAgICAgIC8vINC+0YLQvNC10L3Rj9C10Lwg0YDQtdCz0LjRgdGC0YDQsNGG0LjRjjog0YPQtNCw0LvRj9C10Lwg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPINC40Lcg0LHQsNC30Ysg0LTQsNC90L3Ri9GFLCDQvtGH0LjRidCw0LXQvCBpbnB1dC3RiyDQuCDRgi7QtC5cbiAgICAgICAgY2FuY2VsQXV0aEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGV2ZW50ID0+IHtcbiAgICAgICAgICBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0JykuZm9yRWFjaChpbnB1dCA9PiB7aW5wdXQudmFsdWUgPSAnJ30pO1xuICAgICAgICAgIGF3YWl0IGRlbGV0ZVVzZXIodXNlcik7XG4gICAgICAgICAgY2FuY2VsQXV0aEJ0bi5yZW1vdmUoKTtcbiAgICAgICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJyc7XG4gICAgICAgICAgbWVzc2FnZS5yZW1vdmUoKTtcbiAgICAgICAgICBmb3JtQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgLy8g0L7RiNC40LHQutC4INGB0LXRgNCy0LXRgNCwLCDRgtC+INCx0LjRiNGMIGZpcmViYXNlINC4INCy0L7Qt9Cy0YDQsNGJ0LXQvdC40LUg0YTQvtGA0LzRiyDQuiDQvdCw0YfQsNC70YzQvdC+0LzRgyDRgdC+0YHRgtC+0Y/QvdC40Y5cbiAgICAgICAgc3dpdGNoIChlcnJvci5tZXNzYWdlKSB7XG4gICAgICAgICAgY2FzZSAnRmlyZWJhc2U6IEVycm9yIChhdXRoL2VtYWlsLWFscmVhZHktaW4tdXNlKS4nOlxuICAgICAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQlNCw0L3QvdCw0Y8g0L/QvtGH0YLQsCDRg9C20LUg0LfQsNGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNC90LAuJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9Cn0YLQvi3RgtC+INC/0L7RiNC70L4g0L3QtSDRgtCw0LouLi4nO1xuICAgICAgICB9XG4gICAgICAgIGNhbmNlbEF1dGhCdG4ucmVtb3ZlKCk7XG4gICAgICAgIGZvcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSlcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGxvYWRlckJ0bi5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDQldGB0LvQuCDRjdGC0LAg0YHRgtGA0LDQvdC40YbQsCDQtNC70Y8g0LLRhdC+0LTQsFxuICAgIGVsc2UgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcygnL2xvZ2luLmh0bWwnKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgc2lnbkluV2l0aEVtYWlsQW5kUGFzc3dvcmQoYXV0aCwgZW1haWwsIHBhc3N3b3JkKTtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgLy8g0L7RiNC40LHQutC4INGB0LXRgNCy0LXRgNCwLCDRgtC+INCx0LjRiNGMIGZpcmViYXNlINC4INCy0L7Qt9Cy0YDQsNGJ0LXQvdC40LUg0YTQvtGA0LzRiyDQuiDQvdCw0YfQsNC70YzQvdC+0LzRgyDRgdC+0YHRgtC+0Y/QvdC40Y5cbiAgICAgICAgc3dpdGNoIChlcnJvci5tZXNzYWdlKSB7XG4gICAgICAgICAgY2FzZSAnRmlyZWJhc2U6IEVycm9yIChhdXRoL2ludmFsaWQtbG9naW4tY3JlZGVudGlhbHMpLic6XG4gICAgICAgICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9Cd0LXQv9GA0LDQstC40LvRjNC90L4g0LLQstC10LTQtdC90Ysg0L/QvtGH0YLQsCDQuNC70Lgg0L/QsNGA0L7Qu9GMLic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQp9GC0L4t0YLQviDQv9C+0YjQu9C+INC90LUg0YLQsNC6Li4uJztcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKVxuICAgICAgICBmb3JtQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBsb2FkZXJCdG4ucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn0pKCk7XG4iXSwiZmlsZSI6ImF1dGgvcmVnaXN0ZXJPckxvZ2luLmpzIn0=
