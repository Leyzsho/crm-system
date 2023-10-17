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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcm0vZmlyZWJhc2UtYXBpLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldERhdGFiYXNlLCByZWYsIHNldCwgZ2V0LCB1cGRhdGUsIHNlcnZlclRpbWVzdGFtcCB9IGZyb20gJ2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2ZpcmViYXNlanMvOS4xLjEvZmlyZWJhc2UtZGF0YWJhc2UuanMnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd3JpdGVDbGllbnREYXRhKHVzZXJJZCwge1xuICBuYW1lVmFsdWUsXG4gIHNlY29uZE5hbWVWYWx1ZSxcbiAgbGFzdE5hbWVWYWx1ZSxcbiAgY29udGFjdHNBcnJheSxcbn0pIHtcbiAgY29uc3QgZGIgPSBnZXREYXRhYmFzZSgpO1xuICBjb25zdCBjbGllbnRzUmVmID0gJ3VzZXJzLycgKyB1c2VySWQgKyAnL2NsaWVudHMvJztcbiAgY29uc3QgbmFtZSA9IG5hbWVWYWx1ZTtcbiAgY29uc3Qgc2Vjb25kTmFtZSA9IHNlY29uZE5hbWVWYWx1ZTtcbiAgY29uc3QgbGFzdE5hbWUgPSBsYXN0TmFtZVZhbHVlICE9PSAnJyA/IGxhc3ROYW1lVmFsdWUgOiAnbm90IHNwZWNpZmllZCc7XG4gIGNvbnN0IGNvbnRhY3RzID0ge307XG4gIGxldCBjb250YWN0c1F1YW50aXR5ID0gMDtcblxuICBjb250YWN0c0FycmF5LmZvckVhY2goaW5wdXQgPT4ge1xuICAgIGNvbnRhY3RzUXVhbnRpdHkrKztcbiAgICBjb25zdCB0eXBlID0gaW5wdXQuZGF0YXNldC50eXBlO1xuICAgIGNvbnN0IHZhbHVlID0gaW5wdXQudmFsdWU7XG4gICAgY29udGFjdHNbYGNvbnRhY3Qke2NvbnRhY3RzUXVhbnRpdHl9OiR7dHlwZX1gXSA9IHZhbHVlO1xuICB9KTtcblxuICByZXR1cm4gZ2V0KHJlZihkYiwgJ3VzZXJzLycgKyB1c2VySWQgKyAnL2NsaWVudHNRdWFudGl0eScpKS50aGVuKChzbmFwc2hvdCkgPT4ge1xuICAgIGNvbnN0IGNsaWVudHNRdWFudGl0eSA9IHNuYXBzaG90LnZhbCgpICE9PSBudWxsID8gc25hcHNob3QudmFsKCkgKyAxIDogMTtcblxuICAgIHJldHVybiBzZXQocmVmKGRiLCBjbGllbnRzUmVmICsgY2xpZW50c1F1YW50aXR5KSwge1xuICAgICAgbmFtZSxcbiAgICAgIHNlY29uZE5hbWUsXG4gICAgICBsYXN0TmFtZSxcbiAgICAgIGNvbnRhY3RzLFxuICAgICAgY3JlYXRpb25EYXRlOiBzZXJ2ZXJUaW1lc3RhbXAoKSxcbiAgICAgIGxhc3RDaGFuZ2U6IHNlcnZlclRpbWVzdGFtcCgpLFxuICAgIH0pXG4gICAgLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIHVwZGF0ZShyZWYoZGIsICd1c2Vycy8nICsgdXNlcklkKSwge1xuICAgICAgICBjbGllbnRzUXVhbnRpdHk6IGNsaWVudHNRdWFudGl0eSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KVxuICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlQ2xpZW50RGF0YSh1c2VySWQsIGNsaWVudElkLCB7XG4gIG5hbWVWYWx1ZSxcbiAgc2Vjb25kTmFtZVZhbHVlLFxuICBsYXN0TmFtZVZhbHVlLFxuICBjb250YWN0c0FycmF5LFxufSkge1xuICBjb25zdCBkYiA9IGdldERhdGFiYXNlKCk7XG4gIGNvbnN0IGNsaWVudHNSZWYgPSAndXNlcnMvJyArIHVzZXJJZCArICcvY2xpZW50cy8nO1xuICBjb25zdCBuYW1lID0gbmFtZVZhbHVlO1xuICBjb25zdCBzZWNvbmROYW1lID0gc2Vjb25kTmFtZVZhbHVlO1xuICBjb25zdCBsYXN0TmFtZSA9IGxhc3ROYW1lVmFsdWUgIT09ICcnID8gbGFzdE5hbWVWYWx1ZSA6ICdub3Qgc3BlY2lmaWVkJztcbiAgY29uc3QgY29udGFjdHMgPSB7fTtcbiAgbGV0IGNvbnRhY3RzUXVhbnRpdHkgPSAwO1xuXG4gIGNvbnRhY3RzQXJyYXkuZm9yRWFjaChpbnB1dCA9PiB7XG4gICAgY29udGFjdHNRdWFudGl0eSsrO1xuICAgIGNvbnN0IHR5cGUgPSBpbnB1dC5kYXRhc2V0LnR5cGU7XG4gICAgY29uc3QgdmFsdWUgPSBpbnB1dC52YWx1ZTtcbiAgICBjb250YWN0c1tgY29udGFjdCR7Y29udGFjdHNRdWFudGl0eX06JHt0eXBlfWBdID0gdmFsdWU7XG4gIH0pO1xuXG4gIHJldHVybiB1cGRhdGUocmVmKGRiLCBjbGllbnRzUmVmICsgY2xpZW50SWQpLCB7XG4gICAgbmFtZSxcbiAgICBzZWNvbmROYW1lLFxuICAgIGxhc3ROYW1lLFxuICAgIGNvbnRhY3RzLFxuICAgIGxhc3RDaGFuZ2U6IHNlcnZlclRpbWVzdGFtcCgpLFxuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUNsaWVudCh1c2VySWQsIGNsaWVudElkKSB7XG4gIGNvbnN0IGRiID0gZ2V0RGF0YWJhc2UoKTtcbiAgY29uc3QgY2xpZW50c1JlZiA9ICd1c2Vycy8nICsgdXNlcklkICsgJy9jbGllbnRzLyc7XG5cbiAgcmV0dXJuIGdldChyZWYoZGIsICd1c2Vycy8nICsgdXNlcklkKSkudGhlbihhc3luYyAoc25hcHNob3QpID0+IHtcbiAgICBjb25zdCBkYXRhID0gc25hcHNob3QudmFsKCk7XG4gICAgY29uc3QgbmV3Q2xpZW50cyA9IHt9O1xuXG4gICAgT2JqZWN0LmtleXMoZGF0YS5jbGllbnRzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAoa2V5IDwgY2xpZW50SWQpIHtcbiAgICAgICAgbmV3Q2xpZW50c1trZXldID0gZGF0YS5jbGllbnRzW2tleV07XG4gICAgICB9IGVsc2UgaWYgKGtleSA+IGNsaWVudElkKSB7XG4gICAgICAgIG5ld0NsaWVudHNba2V5IC0gMV0gPSBkYXRhLmNsaWVudHNba2V5XTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGF3YWl0IHNldChyZWYoZGIsIGNsaWVudHNSZWYpLCBuZXdDbGllbnRzKTtcbiAgICBhd2FpdCB1cGRhdGUocmVmKGRiLCAndXNlcnMvJyArIHVzZXJJZCksIHtjbGllbnRzUXVhbnRpdHk6IGRhdGEuY2xpZW50c1F1YW50aXR5IC0gMX0pO1xuICB9KVxuICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gIH0pO1xufVxuIl0sImZpbGUiOiJjcm0vZmlyZWJhc2UtYXBpLmpzIn0=
