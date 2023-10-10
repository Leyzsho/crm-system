import app from '../firebase.js';
import { getAuth, onAuthStateChanged, reauthenticateWithCredential, updateEmail, sendEmailVerification, EmailAuthProvider } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';
import { openChangePasswordModal, openDeleteAccountModal, openSignOutModal } from './modals.js';
const auth = getAuth(app);

onAuthStateChanged(auth, async (user) => {
  if (user && user.emailVerified) {
    document.getElementById('loader').remove();

    const currentEmail = user.email;
    const accountContainer = document.querySelector('.account');
    const accountEmail = document.getElementById('account-email');

    const changeEmailBtn = document.getElementById('change-email');
    const signOutBtn = document.getElementById('sign-out');
    const changePasswordBtn = document.getElementById('change-password');
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
      currentPasswordInput.type = 'password';
      currentPasswordInput.placeholder = 'Введите пароль';
      confirmBtn.textContent = 'Сменить';
      cancelBtn.textContent = 'Отменить';

      container.classList.add('account__change-data-container');
      newEmailInput.classList.add('account__input');
      currentPasswordInput.classList.add('account__input');
      confirmBtn.classList.add('account__btn', 'account__change-data-confirm-btn');
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

    changePasswordBtn.addEventListener('click', event => {
      openChangePasswordModal(user);
    });

    signOutBtn.addEventListener('click', event => {
      openSignOutModal();
    });

    deleteUserBtn.addEventListener('click', async event => {
      openDeleteAccountModal(user);
    });
  } else {
    window.location.href = './register.html';
  }
});


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhdXRoL2FjY291bnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFwcCBmcm9tICcuLi9maXJlYmFzZS5qcyc7XG5pbXBvcnQgeyBnZXRBdXRoLCBvbkF1dGhTdGF0ZUNoYW5nZWQsIHJlYXV0aGVudGljYXRlV2l0aENyZWRlbnRpYWwsIHVwZGF0ZUVtYWlsLCBzZW5kRW1haWxWZXJpZmljYXRpb24sIEVtYWlsQXV0aFByb3ZpZGVyIH0gZnJvbSAnaHR0cHM6Ly93d3cuZ3N0YXRpYy5jb20vZmlyZWJhc2Vqcy85LjEuMS9maXJlYmFzZS1hdXRoLmpzJztcbmltcG9ydCB7IG9wZW5DaGFuZ2VQYXNzd29yZE1vZGFsLCBvcGVuRGVsZXRlQWNjb3VudE1vZGFsLCBvcGVuU2lnbk91dE1vZGFsIH0gZnJvbSAnLi9tb2RhbHMuanMnO1xuY29uc3QgYXV0aCA9IGdldEF1dGgoYXBwKTtcblxub25BdXRoU3RhdGVDaGFuZ2VkKGF1dGgsIGFzeW5jICh1c2VyKSA9PiB7XG4gIGlmICh1c2VyICYmIHVzZXIuZW1haWxWZXJpZmllZCkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkZXInKS5yZW1vdmUoKTtcblxuICAgIGNvbnN0IGN1cnJlbnRFbWFpbCA9IHVzZXIuZW1haWw7XG4gICAgY29uc3QgYWNjb3VudENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hY2NvdW50Jyk7XG4gICAgY29uc3QgYWNjb3VudEVtYWlsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjY291bnQtZW1haWwnKTtcblxuICAgIGNvbnN0IGNoYW5nZUVtYWlsQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoYW5nZS1lbWFpbCcpO1xuICAgIGNvbnN0IHNpZ25PdXRCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lnbi1vdXQnKTtcbiAgICBjb25zdCBjaGFuZ2VQYXNzd29yZEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGFuZ2UtcGFzc3dvcmQnKTtcbiAgICBjb25zdCBkZWxldGVVc2VyQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbGV0ZS1hY2NvdW50Jyk7XG5cbiAgICBhY2NvdW50Q29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2FjY291bnQtLWhpZGRlbicpO1xuICAgIGFjY291bnRFbWFpbC50ZXh0Q29udGVudCA9IGBlbWFpbDogJHtjdXJyZW50RW1haWx9YDtcblxuXG4gICAgY2hhbmdlRW1haWxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICBjaGFuZ2VFbWFpbEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGNvbnN0IG5ld0VtYWlsSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgY29uc3QgY3VycmVudFBhc3N3b3JkSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgY29uc3QgY29uZmlybUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgY29uc3QgY2FuY2VsQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cbiAgICAgIG5ld0VtYWlsSW5wdXQudHlwZSA9ICdlbWFpbCc7XG4gICAgICBuZXdFbWFpbElucHV0LnBsYWNlaG9sZGVyID0gJ9CS0LLQtdC00LjRgtC1INC90L7QstGL0LkgZW1haWwnO1xuICAgICAgY3VycmVudFBhc3N3b3JkSW5wdXQudHlwZSA9ICdwYXNzd29yZCc7XG4gICAgICBjdXJyZW50UGFzc3dvcmRJbnB1dC5wbGFjZWhvbGRlciA9ICfQktCy0LXQtNC40YLQtSDQv9Cw0YDQvtC70YwnO1xuICAgICAgY29uZmlybUJ0bi50ZXh0Q29udGVudCA9ICfQodC80LXQvdC40YLRjCc7XG4gICAgICBjYW5jZWxCdG4udGV4dENvbnRlbnQgPSAn0J7RgtC80LXQvdC40YLRjCc7XG5cbiAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdhY2NvdW50X19jaGFuZ2UtZGF0YS1jb250YWluZXInKTtcbiAgICAgIG5ld0VtYWlsSW5wdXQuY2xhc3NMaXN0LmFkZCgnYWNjb3VudF9faW5wdXQnKTtcbiAgICAgIGN1cnJlbnRQYXNzd29yZElucHV0LmNsYXNzTGlzdC5hZGQoJ2FjY291bnRfX2lucHV0Jyk7XG4gICAgICBjb25maXJtQnRuLmNsYXNzTGlzdC5hZGQoJ2FjY291bnRfX2J0bicsICdhY2NvdW50X19jaGFuZ2UtZGF0YS1jb25maXJtLWJ0bicpO1xuICAgICAgY2FuY2VsQnRuLmNsYXNzTGlzdC5hZGQoJ2FjY291bnRfX2J0bicsICdhY2NvdW50X19idG4tLXJlZCcpO1xuXG4gICAgICBjb250YWluZXIuYXBwZW5kKG5ld0VtYWlsSW5wdXQpO1xuICAgICAgY29udGFpbmVyLmFwcGVuZChjdXJyZW50UGFzc3dvcmRJbnB1dCk7XG4gICAgICBjb250YWluZXIuYXBwZW5kKGNvbmZpcm1CdG4pO1xuICAgICAgY29udGFpbmVyLmFwcGVuZChjYW5jZWxCdG4pO1xuICAgICAgY2hhbmdlRW1haWxCdG4uYWZ0ZXIoY29udGFpbmVyKTtcblxuICAgICAgY2FuY2VsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgICBjb250YWluZXIucmVtb3ZlKCk7XG4gICAgICAgIGNoYW5nZUVtYWlsQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICB9KTtcblxuICAgICAgY29uZmlybUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGV2ZW50ID0+IHtcbiAgICAgICAgY29uc3QgY3JlZGVudGlhbCA9IEVtYWlsQXV0aFByb3ZpZGVyLmNyZWRlbnRpYWwoY3VycmVudEVtYWlsLCBjdXJyZW50UGFzc3dvcmRJbnB1dC52YWx1ZS50cmltKCkpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXdhaXQgcmVhdXRoZW50aWNhdGVXaXRoQ3JlZGVudGlhbCh1c2VyLCBjcmVkZW50aWFsKTtcblxuICAgICAgICAgIGF3YWl0IHNlbmRFbWFpbFZlcmlmaWNhdGlvbih1c2VyKTtcblxuICAgICAgICAgIGlmICh1c2VyLmlzRW1haWxWZXJpZmllZCkge1xuICAgICAgICAgICAgYXdhaXQgdXBkYXRlRW1haWwodXNlciwgbmV3RW1haWxJbnB1dC52YWx1ZS50cmltKCkpO1xuXG4gICAgICAgICAgICBhY2NvdW50RW1haWwudGV4dENvbnRlbnQgPSBgZW1haWw6ICR7bmV3RW1haWxJbnB1dC52YWx1ZS50cmltKCl9YDtcbiAgICAgICAgICAgIGNoYW5nZUVtYWlsQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICBjb250YWluZXIucmVtb3ZlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQvdC1INC/0L7QtNGC0LLQtdGA0LbQtNC10L3QsCcpXG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgY2hhbmdlUGFzc3dvcmRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICBvcGVuQ2hhbmdlUGFzc3dvcmRNb2RhbCh1c2VyKTtcbiAgICB9KTtcblxuICAgIHNpZ25PdXRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICBvcGVuU2lnbk91dE1vZGFsKCk7XG4gICAgfSk7XG5cbiAgICBkZWxldGVVc2VyQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZXZlbnQgPT4ge1xuICAgICAgb3BlbkRlbGV0ZUFjY291bnRNb2RhbCh1c2VyKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcuL3JlZ2lzdGVyLmh0bWwnO1xuICB9XG59KTtcblxuIl0sImZpbGUiOiJhdXRoL2FjY291bnQuanMifQ==
