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
