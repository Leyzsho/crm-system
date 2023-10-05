import app from './firebase.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';
const auth = getAuth(app);


// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     const newClientBtn = document.querySelector('.new-client-btn');

//     newClientBtn.addEventListener('click', async event => {
//       const module = await import('./createFormModal.js');
//       module.default();
//       // document.body.append(module.default());
//     });
//   } else {
//     window.location.href = './account.html';
//   }
// });



//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFwcCBmcm9tICcuL2ZpcmViYXNlLmpzJztcbmltcG9ydCB7IGdldEF1dGgsIG9uQXV0aFN0YXRlQ2hhbmdlZCB9IGZyb20gJ2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2ZpcmViYXNlanMvOS4xLjEvZmlyZWJhc2UtYXV0aC5qcyc7XG5jb25zdCBhdXRoID0gZ2V0QXV0aChhcHApO1xuXG5cbi8vIG9uQXV0aFN0YXRlQ2hhbmdlZChhdXRoLCAodXNlcikgPT4ge1xuLy8gICBpZiAodXNlcikge1xuLy8gICAgIGNvbnN0IG5ld0NsaWVudEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctY2xpZW50LWJ0bicpO1xuXG4vLyAgICAgbmV3Q2xpZW50QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZXZlbnQgPT4ge1xuLy8gICAgICAgY29uc3QgbW9kdWxlID0gYXdhaXQgaW1wb3J0KCcuL2NyZWF0ZUZvcm1Nb2RhbC5qcycpO1xuLy8gICAgICAgbW9kdWxlLmRlZmF1bHQoKTtcbi8vICAgICAgIC8vIGRvY3VtZW50LmJvZHkuYXBwZW5kKG1vZHVsZS5kZWZhdWx0KCkpO1xuLy8gICAgIH0pO1xuLy8gICB9IGVsc2Uge1xuLy8gICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4vYWNjb3VudC5odG1sJztcbi8vICAgfVxuLy8gfSk7XG5cblxuIl0sImZpbGUiOiJhcHAuanMifQ==
