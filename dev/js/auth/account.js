import app from '../firebase.js';
import { getAuth, onAuthStateChanged, reauthenticateWithCredential, updateEmail, sendEmailVerification, deleteUser, EmailAuthProvider } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';
const auth = getAuth(app);

onAuthStateChanged(auth, async (user) => {
  if (user && user.emailVerified) {
    document.getElementById('loader').remove();

    const currentEmail = user.email;
    const accountContainer = document.querySelector('.account');
    const accountEmail = document.getElementById('account-email');
    const changeEmailBtn = document.getElementById('change-email');
    const deleteUserBtn = document.getElementById('delete-account');

    accountContainer.classList.remove('account--hidden');
    accountEmail.textContent = `email: ${currentEmail}`;


    changeEmailBtn.addEventListener('click', event => {
      changeEmailBtn.disabled = true;
      const container = document.createElement('div');
      const newEmailInput = document.createElement('input');
      const currentPasswordInput = document.createElement('input');
      const confirmBtn = document.createElement('button');
      const cancelBtn = document.createElement('button');

      newEmailInput.type = 'email';
      newEmailInput.placeholder = 'Введите новый email';
      newEmailInput.required = true;
      currentPasswordInput.type = 'password';
      currentPasswordInput.placeholder = 'Введите ваш пароль';
      currentPasswordInput.required = true;
      confirmBtn.textContent = 'Сменить';
      cancelBtn.textContent = 'Отменить';

      container.classList.add('account__change-email-container');
      newEmailInput.classList.add('account__input');
      currentPasswordInput.classList.add('account__input');
      confirmBtn.classList.add('account__btn');
      cancelBtn.classList.add('account__btn', 'account__btn--red');

      container.append(newEmailInput);
      container.append(currentPasswordInput);
      container.append(confirmBtn);
      container.append(cancelBtn);
      changeEmailBtn.after(container);

      cancelBtn.addEventListener('click', event => {
        container.remove();
        changeEmailBtn.disabled = false;
      });

      confirmBtn.addEventListener('click', async event => {
        const credential = EmailAuthProvider.credential(currentEmail, currentPasswordInput.value.trim());

        try {
          await reauthenticateWithCredential(user, credential);

          await sendEmailVerification(user);

          if (user.isEmailVerified) {
            await updateEmail(user, newEmailInput.value.trim());

            accountEmail.textContent = `email: ${newEmailInput.value.trim()}`;
            changeEmailBtn.disabled = false;
            container.remove();
          } else {
            console.log('не подтверждена')
          }
        } catch (error) {
          console.log(error.message)
        }
      });
    });

    deleteUserBtn.addEventListener('click', async event => {
      const darkBackground = document.createElement('div');
      const modal = document.createElement('div');
      const currentPasswordInput = document.createElement('input');
      const title = document.createElement('h2');
      const confirmBtn = document.createElement('button');

      darkBackground.classList.add('dark-background');
      modal.classList.add('account__delete-modal');
      currentPasswordInput.classList.add('account__input');
      title.classList.add('account__title');
      confirmBtn.classList.add('account__btn', 'account__btn--red');

      currentPasswordInput.type = 'password';
      currentPasswordInput.placeholder = 'Введите ваш пароль';
      currentPasswordInput.required = true;
      title.textContent = 'Удаление аккаунта';
      confirmBtn.textContent = 'Удалить аккаунт';

      modal.append(title);
      modal.append(currentPasswordInput);
      modal.append(confirmBtn);
      document.body.append(darkBackground);
      document.body.append(modal);

      confirmBtn.addEventListener('click', async event => {
        const credential = EmailAuthProvider.credential(currentEmail, currentPasswordInput.value.trim());
        await reauthenticateWithCredential(user, credential);
        await deleteUser(user);
      });
    });
  } else {
    window.location.href = './register.html';
  }
});


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhdXRoL2FjY291bnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFwcCBmcm9tICcuLi9maXJlYmFzZS5qcyc7XG5pbXBvcnQgeyBnZXRBdXRoLCBvbkF1dGhTdGF0ZUNoYW5nZWQsIHJlYXV0aGVudGljYXRlV2l0aENyZWRlbnRpYWwsIHVwZGF0ZUVtYWlsLCBzZW5kRW1haWxWZXJpZmljYXRpb24sIGRlbGV0ZVVzZXIsIEVtYWlsQXV0aFByb3ZpZGVyIH0gZnJvbSAnaHR0cHM6Ly93d3cuZ3N0YXRpYy5jb20vZmlyZWJhc2Vqcy85LjEuMS9maXJlYmFzZS1hdXRoLmpzJztcbmNvbnN0IGF1dGggPSBnZXRBdXRoKGFwcCk7XG5cbm9uQXV0aFN0YXRlQ2hhbmdlZChhdXRoLCBhc3luYyAodXNlcikgPT4ge1xuICBpZiAodXNlciAmJiB1c2VyLmVtYWlsVmVyaWZpZWQpIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZGVyJykucmVtb3ZlKCk7XG5cbiAgICBjb25zdCBjdXJyZW50RW1haWwgPSB1c2VyLmVtYWlsO1xuICAgIGNvbnN0IGFjY291bnRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWNjb3VudCcpO1xuICAgIGNvbnN0IGFjY291bnRFbWFpbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhY2NvdW50LWVtYWlsJyk7XG4gICAgY29uc3QgY2hhbmdlRW1haWxCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hhbmdlLWVtYWlsJyk7XG4gICAgY29uc3QgZGVsZXRlVXNlckJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZWxldGUtYWNjb3VudCcpO1xuXG4gICAgYWNjb3VudENvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdhY2NvdW50LS1oaWRkZW4nKTtcbiAgICBhY2NvdW50RW1haWwudGV4dENvbnRlbnQgPSBgZW1haWw6ICR7Y3VycmVudEVtYWlsfWA7XG5cblxuICAgIGNoYW5nZUVtYWlsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgY2hhbmdlRW1haWxCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBjb25zdCBuZXdFbWFpbElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRQYXNzd29yZElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgIGNvbnN0IGNvbmZpcm1CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGNvbnN0IGNhbmNlbEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXG4gICAgICBuZXdFbWFpbElucHV0LnR5cGUgPSAnZW1haWwnO1xuICAgICAgbmV3RW1haWxJbnB1dC5wbGFjZWhvbGRlciA9ICfQktCy0LXQtNC40YLQtSDQvdC+0LLRi9C5IGVtYWlsJztcbiAgICAgIG5ld0VtYWlsSW5wdXQucmVxdWlyZWQgPSB0cnVlO1xuICAgICAgY3VycmVudFBhc3N3b3JkSW5wdXQudHlwZSA9ICdwYXNzd29yZCc7XG4gICAgICBjdXJyZW50UGFzc3dvcmRJbnB1dC5wbGFjZWhvbGRlciA9ICfQktCy0LXQtNC40YLQtSDQstCw0Ygg0L/QsNGA0L7Qu9GMJztcbiAgICAgIGN1cnJlbnRQYXNzd29yZElucHV0LnJlcXVpcmVkID0gdHJ1ZTtcbiAgICAgIGNvbmZpcm1CdG4udGV4dENvbnRlbnQgPSAn0KHQvNC10L3QuNGC0YwnO1xuICAgICAgY2FuY2VsQnRuLnRleHRDb250ZW50ID0gJ9Ce0YLQvNC10L3QuNGC0YwnO1xuXG4gICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnYWNjb3VudF9fY2hhbmdlLWVtYWlsLWNvbnRhaW5lcicpO1xuICAgICAgbmV3RW1haWxJbnB1dC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50X19pbnB1dCcpO1xuICAgICAgY3VycmVudFBhc3N3b3JkSW5wdXQuY2xhc3NMaXN0LmFkZCgnYWNjb3VudF9faW5wdXQnKTtcbiAgICAgIGNvbmZpcm1CdG4uY2xhc3NMaXN0LmFkZCgnYWNjb3VudF9fYnRuJyk7XG4gICAgICBjYW5jZWxCdG4uY2xhc3NMaXN0LmFkZCgnYWNjb3VudF9fYnRuJywgJ2FjY291bnRfX2J0bi0tcmVkJyk7XG5cbiAgICAgIGNvbnRhaW5lci5hcHBlbmQobmV3RW1haWxJbnB1dCk7XG4gICAgICBjb250YWluZXIuYXBwZW5kKGN1cnJlbnRQYXNzd29yZElucHV0KTtcbiAgICAgIGNvbnRhaW5lci5hcHBlbmQoY29uZmlybUJ0bik7XG4gICAgICBjb250YWluZXIuYXBwZW5kKGNhbmNlbEJ0bik7XG4gICAgICBjaGFuZ2VFbWFpbEJ0bi5hZnRlcihjb250YWluZXIpO1xuXG4gICAgICBjYW5jZWxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICAgIGNvbnRhaW5lci5yZW1vdmUoKTtcbiAgICAgICAgY2hhbmdlRW1haWxCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25maXJtQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZXZlbnQgPT4ge1xuICAgICAgICBjb25zdCBjcmVkZW50aWFsID0gRW1haWxBdXRoUHJvdmlkZXIuY3JlZGVudGlhbChjdXJyZW50RW1haWwsIGN1cnJlbnRQYXNzd29yZElucHV0LnZhbHVlLnRyaW0oKSk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhd2FpdCByZWF1dGhlbnRpY2F0ZVdpdGhDcmVkZW50aWFsKHVzZXIsIGNyZWRlbnRpYWwpO1xuXG4gICAgICAgICAgYXdhaXQgc2VuZEVtYWlsVmVyaWZpY2F0aW9uKHVzZXIpO1xuXG4gICAgICAgICAgaWYgKHVzZXIuaXNFbWFpbFZlcmlmaWVkKSB7XG4gICAgICAgICAgICBhd2FpdCB1cGRhdGVFbWFpbCh1c2VyLCBuZXdFbWFpbElucHV0LnZhbHVlLnRyaW0oKSk7XG5cbiAgICAgICAgICAgIGFjY291bnRFbWFpbC50ZXh0Q29udGVudCA9IGBlbWFpbDogJHtuZXdFbWFpbElucHV0LnZhbHVlLnRyaW0oKX1gO1xuICAgICAgICAgICAgY2hhbmdlRW1haWxCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5yZW1vdmUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ9C90LUg0L/QvtC00YLQstC10YDQttC00LXQvdCwJylcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZXJyb3IubWVzc2FnZSlcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZWxldGVVc2VyQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZXZlbnQgPT4ge1xuICAgICAgY29uc3QgZGFya0JhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBjb25zdCBjdXJyZW50UGFzc3dvcmRJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gICAgICBjb25zdCBjb25maXJtQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cbiAgICAgIGRhcmtCYWNrZ3JvdW5kLmNsYXNzTGlzdC5hZGQoJ2RhcmstYmFja2dyb3VuZCcpO1xuICAgICAgbW9kYWwuY2xhc3NMaXN0LmFkZCgnYWNjb3VudF9fZGVsZXRlLW1vZGFsJyk7XG4gICAgICBjdXJyZW50UGFzc3dvcmRJbnB1dC5jbGFzc0xpc3QuYWRkKCdhY2NvdW50X19pbnB1dCcpO1xuICAgICAgdGl0bGUuY2xhc3NMaXN0LmFkZCgnYWNjb3VudF9fdGl0bGUnKTtcbiAgICAgIGNvbmZpcm1CdG4uY2xhc3NMaXN0LmFkZCgnYWNjb3VudF9fYnRuJywgJ2FjY291bnRfX2J0bi0tcmVkJyk7XG5cbiAgICAgIGN1cnJlbnRQYXNzd29yZElucHV0LnR5cGUgPSAncGFzc3dvcmQnO1xuICAgICAgY3VycmVudFBhc3N3b3JkSW5wdXQucGxhY2Vob2xkZXIgPSAn0JLQstC10LTQuNGC0LUg0LLQsNGIINC/0LDRgNC+0LvRjCc7XG4gICAgICBjdXJyZW50UGFzc3dvcmRJbnB1dC5yZXF1aXJlZCA9IHRydWU7XG4gICAgICB0aXRsZS50ZXh0Q29udGVudCA9ICfQo9C00LDQu9C10L3QuNC1INCw0LrQutCw0YPQvdGC0LAnO1xuICAgICAgY29uZmlybUJ0bi50ZXh0Q29udGVudCA9ICfQo9C00LDQu9C40YLRjCDQsNC60LrQsNGD0L3Rgic7XG5cbiAgICAgIG1vZGFsLmFwcGVuZCh0aXRsZSk7XG4gICAgICBtb2RhbC5hcHBlbmQoY3VycmVudFBhc3N3b3JkSW5wdXQpO1xuICAgICAgbW9kYWwuYXBwZW5kKGNvbmZpcm1CdG4pO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZGFya0JhY2tncm91bmQpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmQobW9kYWwpO1xuXG4gICAgICBjb25maXJtQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZXZlbnQgPT4ge1xuICAgICAgICBjb25zdCBjcmVkZW50aWFsID0gRW1haWxBdXRoUHJvdmlkZXIuY3JlZGVudGlhbChjdXJyZW50RW1haWwsIGN1cnJlbnRQYXNzd29yZElucHV0LnZhbHVlLnRyaW0oKSk7XG4gICAgICAgIGF3YWl0IHJlYXV0aGVudGljYXRlV2l0aENyZWRlbnRpYWwodXNlciwgY3JlZGVudGlhbCk7XG4gICAgICAgIGF3YWl0IGRlbGV0ZVVzZXIodXNlcik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuL3JlZ2lzdGVyLmh0bWwnO1xuICB9XG59KTtcblxuIl0sImZpbGUiOiJhdXRoL2FjY291bnQuanMifQ==
