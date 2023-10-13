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
