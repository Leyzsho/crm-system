import { getDatabase, ref, set, get, update } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js';

export async function writeClientData(userId, {
  nameValue,
  secondNameValue,
  lastNameValue,
  contactsArray,
}) {
  const db = getDatabase();
  const clientsRef = 'users/' + userId + '/clients/';
  const name = nameValue;
  const secondName = secondNameValue;
  const lastName = lastNameValue !== '' ? lastNameValue : 'not specified';

  const contacts = {};
  let contactsQuantity = 0;

  contactsArray.forEach(input => {
    contactsQuantity++;
    const type = input.dataset.type;
    const value = input.value;
    if (contacts[type]) {
    }
    contacts[`contact${contactsQuantity}:${type}`] = value;
  });

  get(ref(db, clientsRef + 'quantity')).then((snapshot) => {
    const clientsQuantity = snapshot.val() !== null ? snapshot.val() + 1 : 1;

    set(ref(db, clientsRef + clientsQuantity), {
      name,
      secondName,
      lastName,
      contacts,
    }).then(() => {
      update(ref(db, clientsRef), {
        quantity: clientsQuantity,
      });
    });
  }).catch((error) => {
    console.error(error);
  });
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcm0vZmlyZWJhc2UtYXBpLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldERhdGFiYXNlLCByZWYsIHNldCwgZ2V0LCB1cGRhdGUgfSBmcm9tICdodHRwczovL3d3dy5nc3RhdGljLmNvbS9maXJlYmFzZWpzLzkuMS4xL2ZpcmViYXNlLWRhdGFiYXNlLmpzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdyaXRlQ2xpZW50RGF0YSh1c2VySWQsIHtcbiAgbmFtZVZhbHVlLFxuICBzZWNvbmROYW1lVmFsdWUsXG4gIGxhc3ROYW1lVmFsdWUsXG4gIGNvbnRhY3RzQXJyYXksXG59KSB7XG4gIGNvbnN0IGRiID0gZ2V0RGF0YWJhc2UoKTtcbiAgY29uc3QgY2xpZW50c1JlZiA9ICd1c2Vycy8nICsgdXNlcklkICsgJy9jbGllbnRzLyc7XG4gIGNvbnN0IG5hbWUgPSBuYW1lVmFsdWU7XG4gIGNvbnN0IHNlY29uZE5hbWUgPSBzZWNvbmROYW1lVmFsdWU7XG4gIGNvbnN0IGxhc3ROYW1lID0gbGFzdE5hbWVWYWx1ZSAhPT0gJycgPyBsYXN0TmFtZVZhbHVlIDogJ25vdCBzcGVjaWZpZWQnO1xuXG4gIGNvbnN0IGNvbnRhY3RzID0ge307XG4gIGxldCBjb250YWN0c1F1YW50aXR5ID0gMDtcblxuICBjb250YWN0c0FycmF5LmZvckVhY2goaW5wdXQgPT4ge1xuICAgIGNvbnRhY3RzUXVhbnRpdHkrKztcbiAgICBjb25zdCB0eXBlID0gaW5wdXQuZGF0YXNldC50eXBlO1xuICAgIGNvbnN0IHZhbHVlID0gaW5wdXQudmFsdWU7XG4gICAgaWYgKGNvbnRhY3RzW3R5cGVdKSB7XG4gICAgfVxuICAgIGNvbnRhY3RzW2Bjb250YWN0JHtjb250YWN0c1F1YW50aXR5fToke3R5cGV9YF0gPSB2YWx1ZTtcbiAgfSk7XG5cbiAgZ2V0KHJlZihkYiwgY2xpZW50c1JlZiArICdxdWFudGl0eScpKS50aGVuKChzbmFwc2hvdCkgPT4ge1xuICAgIGNvbnN0IGNsaWVudHNRdWFudGl0eSA9IHNuYXBzaG90LnZhbCgpICE9PSBudWxsID8gc25hcHNob3QudmFsKCkgKyAxIDogMTtcblxuICAgIHNldChyZWYoZGIsIGNsaWVudHNSZWYgKyBjbGllbnRzUXVhbnRpdHkpLCB7XG4gICAgICBuYW1lLFxuICAgICAgc2Vjb25kTmFtZSxcbiAgICAgIGxhc3ROYW1lLFxuICAgICAgY29udGFjdHMsXG4gICAgfSkudGhlbigoKSA9PiB7XG4gICAgICB1cGRhdGUocmVmKGRiLCBjbGllbnRzUmVmKSwge1xuICAgICAgICBxdWFudGl0eTogY2xpZW50c1F1YW50aXR5LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICB9KTtcbn1cbiJdLCJmaWxlIjoiY3JtL2ZpcmViYXNlLWFwaS5qcyJ9
