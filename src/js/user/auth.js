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
