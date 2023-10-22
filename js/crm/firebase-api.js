import { getDatabase, ref, set, get, update, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js';

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
    contacts[`contact${contactsQuantity}:${type}`] = value;
  });

  return get(ref(db, 'users/' + userId + '/clientsQuantity')).then((snapshot) => {
    const clientsQuantity = snapshot.val() !== null ? snapshot.val() + 1 : 1;

    return set(ref(db, clientsRef + clientsQuantity), {
      name,
      secondName,
      lastName,
      contacts,
      creationDate: serverTimestamp(),
      lastChange: serverTimestamp(),
    })
    .then(() => {
      return update(ref(db, 'users/' + userId), {
        clientsQuantity: clientsQuantity,
      });
    });
  })
  .catch((error) => {
    console.error(error);
  });
}

export async function updateClientData(userId, clientId, {
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
    contacts[`contact${contactsQuantity}:${type}`] = value;
  });

  return update(ref(db, clientsRef + clientId), {
    name,
    secondName,
    lastName,
    contacts,
    lastChange: serverTimestamp(),
  });
}

export async function deleteClient(userId, clientId) {
  const db = getDatabase();
  const clientsRef = 'users/' + userId + '/clients/';

  return get(ref(db, 'users/' + userId)).then(async (snapshot) => {
    const data = snapshot.val();
    const newClients = {};

    Object.keys(data.clients).forEach(key => {
      if (key < clientId) {
        newClients[key] = data.clients[key];
      } else if (key > clientId) {
        newClients[key - 1] = data.clients[key];
      }
    });

    await set(ref(db, clientsRef), newClients);
    await update(ref(db, 'users/' + userId), {clientsQuantity: data.clientsQuantity - 1});
  })
  .catch((error) => {
    console.error(error);
  });
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcm0vZmlyZWJhc2UtYXBpLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldERhdGFiYXNlLCByZWYsIHNldCwgZ2V0LCB1cGRhdGUsIHNlcnZlclRpbWVzdGFtcCB9IGZyb20gJ2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2ZpcmViYXNlanMvOS4xLjEvZmlyZWJhc2UtZGF0YWJhc2UuanMnO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdyaXRlQ2xpZW50RGF0YSh1c2VySWQsIHtcclxuICBuYW1lVmFsdWUsXHJcbiAgc2Vjb25kTmFtZVZhbHVlLFxyXG4gIGxhc3ROYW1lVmFsdWUsXHJcbiAgY29udGFjdHNBcnJheSxcclxufSkge1xyXG4gIGNvbnN0IGRiID0gZ2V0RGF0YWJhc2UoKTtcclxuICBjb25zdCBjbGllbnRzUmVmID0gJ3VzZXJzLycgKyB1c2VySWQgKyAnL2NsaWVudHMvJztcclxuICBjb25zdCBuYW1lID0gbmFtZVZhbHVlO1xyXG4gIGNvbnN0IHNlY29uZE5hbWUgPSBzZWNvbmROYW1lVmFsdWU7XHJcbiAgY29uc3QgbGFzdE5hbWUgPSBsYXN0TmFtZVZhbHVlICE9PSAnJyA/IGxhc3ROYW1lVmFsdWUgOiAnbm90IHNwZWNpZmllZCc7XHJcbiAgY29uc3QgY29udGFjdHMgPSB7fTtcclxuICBsZXQgY29udGFjdHNRdWFudGl0eSA9IDA7XHJcblxyXG4gIGNvbnRhY3RzQXJyYXkuZm9yRWFjaChpbnB1dCA9PiB7XHJcbiAgICBjb250YWN0c1F1YW50aXR5Kys7XHJcbiAgICBjb25zdCB0eXBlID0gaW5wdXQuZGF0YXNldC50eXBlO1xyXG4gICAgY29uc3QgdmFsdWUgPSBpbnB1dC52YWx1ZTtcclxuICAgIGNvbnRhY3RzW2Bjb250YWN0JHtjb250YWN0c1F1YW50aXR5fToke3R5cGV9YF0gPSB2YWx1ZTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIGdldChyZWYoZGIsICd1c2Vycy8nICsgdXNlcklkICsgJy9jbGllbnRzUXVhbnRpdHknKSkudGhlbigoc25hcHNob3QpID0+IHtcclxuICAgIGNvbnN0IGNsaWVudHNRdWFudGl0eSA9IHNuYXBzaG90LnZhbCgpICE9PSBudWxsID8gc25hcHNob3QudmFsKCkgKyAxIDogMTtcclxuXHJcbiAgICByZXR1cm4gc2V0KHJlZihkYiwgY2xpZW50c1JlZiArIGNsaWVudHNRdWFudGl0eSksIHtcclxuICAgICAgbmFtZSxcclxuICAgICAgc2Vjb25kTmFtZSxcclxuICAgICAgbGFzdE5hbWUsXHJcbiAgICAgIGNvbnRhY3RzLFxyXG4gICAgICBjcmVhdGlvbkRhdGU6IHNlcnZlclRpbWVzdGFtcCgpLFxyXG4gICAgICBsYXN0Q2hhbmdlOiBzZXJ2ZXJUaW1lc3RhbXAoKSxcclxuICAgIH0pXHJcbiAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgIHJldHVybiB1cGRhdGUocmVmKGRiLCAndXNlcnMvJyArIHVzZXJJZCksIHtcclxuICAgICAgICBjbGllbnRzUXVhbnRpdHk6IGNsaWVudHNRdWFudGl0eSxcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KVxyXG4gIC5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlQ2xpZW50RGF0YSh1c2VySWQsIGNsaWVudElkLCB7XHJcbiAgbmFtZVZhbHVlLFxyXG4gIHNlY29uZE5hbWVWYWx1ZSxcclxuICBsYXN0TmFtZVZhbHVlLFxyXG4gIGNvbnRhY3RzQXJyYXksXHJcbn0pIHtcclxuICBjb25zdCBkYiA9IGdldERhdGFiYXNlKCk7XHJcbiAgY29uc3QgY2xpZW50c1JlZiA9ICd1c2Vycy8nICsgdXNlcklkICsgJy9jbGllbnRzLyc7XHJcbiAgY29uc3QgbmFtZSA9IG5hbWVWYWx1ZTtcclxuICBjb25zdCBzZWNvbmROYW1lID0gc2Vjb25kTmFtZVZhbHVlO1xyXG4gIGNvbnN0IGxhc3ROYW1lID0gbGFzdE5hbWVWYWx1ZSAhPT0gJycgPyBsYXN0TmFtZVZhbHVlIDogJ25vdCBzcGVjaWZpZWQnO1xyXG4gIGNvbnN0IGNvbnRhY3RzID0ge307XHJcbiAgbGV0IGNvbnRhY3RzUXVhbnRpdHkgPSAwO1xyXG5cclxuICBjb250YWN0c0FycmF5LmZvckVhY2goaW5wdXQgPT4ge1xyXG4gICAgY29udGFjdHNRdWFudGl0eSsrO1xyXG4gICAgY29uc3QgdHlwZSA9IGlucHV0LmRhdGFzZXQudHlwZTtcclxuICAgIGNvbnN0IHZhbHVlID0gaW5wdXQudmFsdWU7XHJcbiAgICBjb250YWN0c1tgY29udGFjdCR7Y29udGFjdHNRdWFudGl0eX06JHt0eXBlfWBdID0gdmFsdWU7XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiB1cGRhdGUocmVmKGRiLCBjbGllbnRzUmVmICsgY2xpZW50SWQpLCB7XHJcbiAgICBuYW1lLFxyXG4gICAgc2Vjb25kTmFtZSxcclxuICAgIGxhc3ROYW1lLFxyXG4gICAgY29udGFjdHMsXHJcbiAgICBsYXN0Q2hhbmdlOiBzZXJ2ZXJUaW1lc3RhbXAoKSxcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUNsaWVudCh1c2VySWQsIGNsaWVudElkKSB7XHJcbiAgY29uc3QgZGIgPSBnZXREYXRhYmFzZSgpO1xyXG4gIGNvbnN0IGNsaWVudHNSZWYgPSAndXNlcnMvJyArIHVzZXJJZCArICcvY2xpZW50cy8nO1xyXG5cclxuICByZXR1cm4gZ2V0KHJlZihkYiwgJ3VzZXJzLycgKyB1c2VySWQpKS50aGVuKGFzeW5jIChzbmFwc2hvdCkgPT4ge1xyXG4gICAgY29uc3QgZGF0YSA9IHNuYXBzaG90LnZhbCgpO1xyXG4gICAgY29uc3QgbmV3Q2xpZW50cyA9IHt9O1xyXG5cclxuICAgIE9iamVjdC5rZXlzKGRhdGEuY2xpZW50cykuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICBpZiAoa2V5IDwgY2xpZW50SWQpIHtcclxuICAgICAgICBuZXdDbGllbnRzW2tleV0gPSBkYXRhLmNsaWVudHNba2V5XTtcclxuICAgICAgfSBlbHNlIGlmIChrZXkgPiBjbGllbnRJZCkge1xyXG4gICAgICAgIG5ld0NsaWVudHNba2V5IC0gMV0gPSBkYXRhLmNsaWVudHNba2V5XTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgYXdhaXQgc2V0KHJlZihkYiwgY2xpZW50c1JlZiksIG5ld0NsaWVudHMpO1xyXG4gICAgYXdhaXQgdXBkYXRlKHJlZihkYiwgJ3VzZXJzLycgKyB1c2VySWQpLCB7Y2xpZW50c1F1YW50aXR5OiBkYXRhLmNsaWVudHNRdWFudGl0eSAtIDF9KTtcclxuICB9KVxyXG4gIC5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gIH0pO1xyXG59XHJcbiJdLCJmaWxlIjoiY3JtL2ZpcmViYXNlLWFwaS5qcyJ9
