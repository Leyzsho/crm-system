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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcm0vZmlyZWJhc2UtYXBpLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldERhdGFiYXNlLCByZWYsIHNldCwgZ2V0LCB1cGRhdGUsIHNlcnZlclRpbWVzdGFtcCB9IGZyb20gJ2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2ZpcmViYXNlanMvOS4xLjEvZmlyZWJhc2UtZGF0YWJhc2UuanMnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd3JpdGVDbGllbnREYXRhKHVzZXJJZCwge1xuICBuYW1lVmFsdWUsXG4gIHNlY29uZE5hbWVWYWx1ZSxcbiAgbGFzdE5hbWVWYWx1ZSxcbiAgY29udGFjdHNBcnJheSxcbn0pIHtcbiAgY29uc3QgZGIgPSBnZXREYXRhYmFzZSgpO1xuICBjb25zdCBjbGllbnRzUmVmID0gJ3VzZXJzLycgKyB1c2VySWQgKyAnL2NsaWVudHMvJztcbiAgY29uc3QgbmFtZSA9IG5hbWVWYWx1ZTtcbiAgY29uc3Qgc2Vjb25kTmFtZSA9IHNlY29uZE5hbWVWYWx1ZTtcbiAgY29uc3QgbGFzdE5hbWUgPSBsYXN0TmFtZVZhbHVlICE9PSAnJyA/IGxhc3ROYW1lVmFsdWUgOiAnbm90IHNwZWNpZmllZCc7XG5cbiAgY29uc3QgY29udGFjdHMgPSB7fTtcbiAgbGV0IGNvbnRhY3RzUXVhbnRpdHkgPSAwO1xuXG4gIGNvbnRhY3RzQXJyYXkuZm9yRWFjaChpbnB1dCA9PiB7XG4gICAgY29udGFjdHNRdWFudGl0eSsrO1xuICAgIGNvbnN0IHR5cGUgPSBpbnB1dC5kYXRhc2V0LnR5cGU7XG4gICAgY29uc3QgdmFsdWUgPSBpbnB1dC52YWx1ZTtcbiAgICBjb250YWN0c1tgY29udGFjdCR7Y29udGFjdHNRdWFudGl0eX06JHt0eXBlfWBdID0gdmFsdWU7XG4gIH0pO1xuXG4gIHJldHVybiBnZXQocmVmKGRiLCAndXNlcnMvJyArIHVzZXJJZCArICcvY2xpZW50c1F1YW50aXR5JykpLnRoZW4oKHNuYXBzaG90KSA9PiB7XG4gICAgY29uc3QgY2xpZW50c1F1YW50aXR5ID0gc25hcHNob3QudmFsKCkgIT09IG51bGwgPyBzbmFwc2hvdC52YWwoKSArIDEgOiAxO1xuXG4gICAgcmV0dXJuIHNldChyZWYoZGIsIGNsaWVudHNSZWYgKyBjbGllbnRzUXVhbnRpdHkpLCB7XG4gICAgICBuYW1lLFxuICAgICAgc2Vjb25kTmFtZSxcbiAgICAgIGxhc3ROYW1lLFxuICAgICAgY29udGFjdHMsXG4gICAgICBjcmVhdGlvbkRhdGU6IHNlcnZlclRpbWVzdGFtcCgpLFxuICAgICAgbGFzdENoYW5nZTogc2VydmVyVGltZXN0YW1wKCksXG4gICAgfSlcbiAgICAudGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gdXBkYXRlKHJlZihkYiwgJ3VzZXJzLycgKyB1c2VySWQpLCB7XG4gICAgICAgIGNsaWVudHNRdWFudGl0eTogY2xpZW50c1F1YW50aXR5LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pXG4gIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVDbGllbnQodXNlcklkLCBjbGllbnRJZCkge1xuICBjb25zdCBkYiA9IGdldERhdGFiYXNlKCk7XG4gIGNvbnN0IGNsaWVudHNSZWYgPSAndXNlcnMvJyArIHVzZXJJZCArICcvY2xpZW50cy8nO1xuXG4gIHJldHVybiBnZXQocmVmKGRiLCAndXNlcnMvJyArIHVzZXJJZCkpLnRoZW4oYXN5bmMgKHNuYXBzaG90KSA9PiB7XG4gICAgY29uc3QgZGF0YSA9IHNuYXBzaG90LnZhbCgpO1xuICAgIGNvbnN0IG5ld0NsaWVudHMgPSB7fTtcblxuICAgIE9iamVjdC5rZXlzKGRhdGEuY2xpZW50cykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgaWYgKGtleSA8IGNsaWVudElkKSB7XG4gICAgICAgIG5ld0NsaWVudHNba2V5XSA9IGRhdGEuY2xpZW50c1trZXldO1xuICAgICAgfSBlbHNlIGlmIChrZXkgPiBjbGllbnRJZCkge1xuICAgICAgICBuZXdDbGllbnRzW2tleSAtIDFdID0gZGF0YS5jbGllbnRzW2tleV07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhd2FpdCBzZXQocmVmKGRiLCBjbGllbnRzUmVmKSwgbmV3Q2xpZW50cyk7XG4gICAgYXdhaXQgdXBkYXRlKHJlZihkYiwgJ3VzZXJzLycgKyB1c2VySWQpLCB7Y2xpZW50c1F1YW50aXR5OiBkYXRhLmNsaWVudHNRdWFudGl0eSAtIDF9KTtcbiAgfSlcbiAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICB9KTtcbn1cbiJdLCJmaWxlIjoiY3JtL2ZpcmViYXNlLWFwaS5qcyJ9
