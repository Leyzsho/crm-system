import app from './firebase.js';
import { getAuth, onAuthStateChanged, deleteUser } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';
const auth = getAuth(app);


onAuthStateChanged(auth, async (user) => {
  if (user && user.emailVerified) {

  } else {
    window.location.href = './register.html';
  }
});

const newClientBtn = document.querySelector('.new-client-btn');

newClientBtn.addEventListener('click', async event => {
  const module = await import('./createFormModal.js');
  module.default();
  // document.body.append(module.default());
});



//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFwcCBmcm9tICcuL2ZpcmViYXNlLmpzJztcbmltcG9ydCB7IGdldEF1dGgsIG9uQXV0aFN0YXRlQ2hhbmdlZCwgZGVsZXRlVXNlciB9IGZyb20gJ2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2ZpcmViYXNlanMvOS4xLjEvZmlyZWJhc2UtYXV0aC5qcyc7XG5jb25zdCBhdXRoID0gZ2V0QXV0aChhcHApO1xuXG5cbm9uQXV0aFN0YXRlQ2hhbmdlZChhdXRoLCBhc3luYyAodXNlcikgPT4ge1xuICBpZiAodXNlciAmJiB1c2VyLmVtYWlsVmVyaWZpZWQpIHtcblxuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4vcmVnaXN0ZXIuaHRtbCc7XG4gIH1cbn0pO1xuXG5jb25zdCBuZXdDbGllbnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LWNsaWVudC1idG4nKTtcblxubmV3Q2xpZW50QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZXZlbnQgPT4ge1xuICBjb25zdCBtb2R1bGUgPSBhd2FpdCBpbXBvcnQoJy4vY3JlYXRlRm9ybU1vZGFsLmpzJyk7XG4gIG1vZHVsZS5kZWZhdWx0KCk7XG4gIC8vIGRvY3VtZW50LmJvZHkuYXBwZW5kKG1vZHVsZS5kZWZhdWx0KCkpO1xufSk7XG5cblxuIl0sImZpbGUiOiJhcHAuanMifQ==
