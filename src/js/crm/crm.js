import app from '../utils/firebase-init.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js';
import { openClientModal, openDeleteClient } from './modals.js';

const auth = getAuth(app);
const db = getDatabase();

class Client {
  constructor(userId, list, {id, name, secondName, lastName, contacts, creationDate, lastChange}) {
    this.userId = userId;
    this.list = list;
    this.id = id;
    this.name = name;
    this.secondName = secondName;
    this.lastName = lastName;
    this.contacts = contacts;
    this.creationDate = creationDate;
    this.lastChange = lastChange;
    this.createClient();
  }

  set creationDate(dateValue) {
    const date = new Date(dateValue);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    this._creationDate = `${day}.${month}.${year}`;
    this._creationTime = `${hours}:${minutes}`;
  }

  get creationDate() {
    return {
      creationDate: this._creationDate,
      creationTime: this._creationTime,
    }
  }

  set lastChange(dateValue) {
    const date = new Date(dateValue);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    this._lastChangeDate = `${day}.${month}.${year}`;
    this._lastChangeTime = `${hours}:${minutes}`;
  }

  get lastChange() {
    return {
      lastChangeDate: this._lastChangeDate,
      lastChangeTime: this._lastChangeTime,
    }
  }

  createClient() {
    const client = document.createElement('li');
    const id = document.createElement('span');
    const fullName = document.createElement('span');
    const creationContainer = document.createElement('div');
    const creationDate = document.createElement('span');
    const creationTime = document.createElement('span');
    const lastChangeContainer = document.createElement('div');
    const lastChangeDate = document.createElement('span');
    const lastChangeTime = document.createElement('span');
    const contactContainer = document.createElement('div');
    const changeClientBtn = document.createElement('button');
    const deleteClientBtn = document.createElement('button');

    client.classList.add('client-list__client');
    id.classList.add('client-list__id');
    fullName.classList.add('client-list__full-name');
    creationContainer.classList.add('client-list__date-container');
    lastChangeContainer.classList.add('client-list__date-container');
    creationDate.classList.add('client-list__date');
    creationTime.classList.add('client-list__time');
    lastChangeDate.classList.add('client-list__date');
    lastChangeTime.classList.add('client-list__time');
    contactContainer.classList.add('client-list__contact-container');
    changeClientBtn.classList.add('client-list__btn', 'client-list__change-btn');
    deleteClientBtn.classList.add('client-list__btn', 'client-list__delete-btn');

    id.textContent = this.id;
    fullName.textContent = `${this.secondName} ${this.name} ${this.lastName !== 'not specified' ? this.lastName : ''}`;
    creationDate.textContent = this._creationDate;
    creationTime.textContent = this._creationTime;
    lastChangeDate.textContent = this._lastChangeDate;
    lastChangeTime.textContent = this._lastChangeTime;
    changeClientBtn.textContent = 'Изменить';
    deleteClientBtn.textContent = 'Удалить';

    creationContainer.append(creationDate);
    creationContainer.append(creationTime);
    lastChangeContainer.append(lastChangeDate);
    lastChangeContainer.append(lastChangeTime);
    client.append(id);
    client.append(fullName);
    client.append(creationContainer);
    client.append(lastChangeContainer);
    client.append(contactContainer);
    client.append(changeClientBtn);
    client.append(deleteClientBtn);
    this.list.append(client);

    if (this.contacts) {
      Object.entries(this.contacts).forEach(([type, value]) => {
        const contact = document.createElement('div');
        const tooltip = document.createElement('div');
        const tooltipType = document.createElement('span');
        const tooltipValue = document.createElement('span');
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const use = document.createElementNS("http://www.w3.org/2000/svg", "use");

        contact.classList.add('client-list__contact');
        tooltip.classList.add('client-list__contact-tooltip');
        tooltipType.classList.add('client-list__contact-tooltip-type')
        tooltipValue.classList.add('client-list__contact-tooltip-value');
        svg.classList.add('client-list__contact-svg');

        tooltipValue.textContent = ' ' + value;

        if (type.includes('phone')) {
          use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#phone');
          tooltipType.textContent = 'телефон:';
        } else if (type.includes('email')) {
          use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#email');
          tooltipType.textContent = 'email:';
        } else if (type.includes('facebook')) {
          use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#facebook');
          tooltipType.textContent = 'facebook:';
        } else if (type.includes('vk')) {
          use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#vk');
          tooltipType.textContent = 'vk:';
        } else {
          use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#other');
          tooltipType.textContent = 'другое:';
        }

        svg.append(use);
        tooltip.append(tooltipType);
        tooltip.append(tooltipValue);
        contact.append(tooltip);
        contact.append(svg);
        contactContainer.append(contact);

        tooltip.style.left = `-${tooltip.offsetWidth / 2 - 7}px`;

        svg.addEventListener('mouseenter', event => {
          tooltip.classList.add('client-list__contact-tooltip--show');
        });

        svg.addEventListener('mouseleave', event => {
          tooltip.classList.remove('client-list__contact-tooltip--show');
        });
      });
    }

    changeClientBtn.addEventListener('click', event => {
      const data = {
        id: this.id,
        name: this.name,
        secondName: this.secondName,
        lastName: this.lastName,
        contacts: this.contacts,
      }

      openClientModal('change', this.userId, data);
    });

    deleteClientBtn.addEventListener('click', event => {
      openDeleteClient(this.userId, this.id)
    });
  }
}

onAuthStateChanged(auth, async (user) => {
  // data изменяется только в onValue, впоследствии data не должна быть измененной.
  let data = null;
  let searchData = null;

  const newClientBtn = document.querySelector('.new-client-btn');
  const clientList = document.getElementById('client-list');
  const clientSearch = document.getElementById('client-search');

  const idBtn = document.getElementById('sort-by-id');
  const fullNameBtn = document.getElementById('sort-by-full-name');
  const creationDateBtn = document.getElementById('sort-by-creation-date');
  const lastChangeBtn = document.getElementById('sort-by-last-change');
  let activeCategory = 'id';

  if (user && user.emailVerified) {
    onValue(ref(db, ('users/' + user.uid + '/clients')), (snapshot) => {
      document.querySelector('.client-container__loader').classList.add('client-container__loader--hidden');
      clientList.innerHTML = '';
      data = snapshot.val();

      const message = document.createElement('li');

      if (data === null || data.quantity === 0) {
        searchData = null;
        clientSearch.disabled = true;
        idBtn.disabled = true;
        fullNameBtn.disabled = true;
        creationDateBtn.disabled = true;
        lastChangeBtn.disabled = true;

        clientSearch.placeholder = 'Введите запрос (должен быть хотя бы один клиент)';
        message.classList.add('client-list__message');
        message.textContent = 'Добавьте вашего первого клиента';
        clientList.append(message);
        message.addEventListener('click', event => {
          openClientModal('create', user.uid, data);
        });
      } else {
        message.remove();
        clientSearch.placeholder = 'Введите запрос';

        searchData = filterClientsBySearchValue(data);
        filterByCategoryAndShowClients(searchData, activeCategory);

        clientSearch.disabled = false;
        idBtn.disabled = false;
        fullNameBtn.disabled = false;
        creationDateBtn.disabled = false;
        lastChangeBtn.disabled = false;
      }
      newClientBtn.disabled = false;
    });

    function filterByCategoryAndShowClients(data, way) {
      clientList.innerHTML = '';
      document.querySelector('.client-categories__category--active').classList.remove("client-categories__category--active");

      if (way === 'id') {
        idBtn.classList.add('client-categories__category--active');

        Object.entries(data).forEach(([clientId, clientData]) => {
          new Client(user.uid, clientList, {
            id: clientId,
            name: clientData.name,
            secondName: clientData.secondName,
            lastName: clientData.lastName,
            contacts: clientData.contacts,
            creationDate: clientData.creationDate,
            lastChange: clientData.lastChange,
          });
        });
      } else if (way === 'full-name') {
        fullNameBtn.classList.add('client-categories__category--active');

        Object.entries(data)
        .sort(([,a], [,b]) => {
          const fullNameA = a.secondName + a.name + (a.lastName !== 'not specified' ? a.lastName : '');
          const fullNameB = b.secondName + b.name + (b.lastName !== 'not specified' ? b.lastName : '');
          return fullNameA.toLowerCase().localeCompare(fullNameB.toLowerCase());
        })
        .forEach(([clientId, clientData]) => {
          new Client(user.uid, clientList, {
            id: clientId,
            name: clientData.name,
            secondName: clientData.secondName,
            lastName: clientData.lastName,
            contacts: clientData.contacts,
            creationDate: clientData.creationDate,
            lastChange: clientData.lastChange,
          });
        });
      } else if (way === 'creation-date') {
        creationDateBtn.classList.add('client-categories__category--active');

        Object.entries(data)
        .sort(([,a], [,b]) => {
          return a.creationDate - b.creationDate;
        })
        .forEach(([clientId, clientData]) => {
          new Client(user.uid, clientList, {
            id: clientId,
            name: clientData.name,
            secondName: clientData.secondName,
            lastName: clientData.lastName,
            contacts: clientData.contacts,
            creationDate: clientData.creationDate,
            lastChange: clientData.lastChange,
          });
        });
      } else if (way === 'last-change') {
        lastChangeBtn.classList.add('client-categories__category--active');

        Object.entries(data)
        .sort(([,a], [,b]) => {
          return a.lastChange - b.lastChange;
        })
        .forEach(([clientId, clientData]) => {
          new Client(user.uid, clientList, {
            id: clientId,
            name: clientData.name,
            secondName: clientData.secondName,
            lastName: clientData.lastName,
            contacts: clientData.contacts,
            creationDate: clientData.creationDate,
            lastChange: clientData.lastChange,
          });
        });
      }
    }

    function filterClientsBySearchValue(data) {
      const suitableData = {};

      Object.entries(data).forEach(([clientId, clientData]) => {
        function getDate (dateValue) {
          const date = new Date(dateValue);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();

          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');

          return `${day}.${month}.${year} ${hours}:${minutes}`;
        };

        const creationDate = getDate(clientData.creationDate);
        const lastChange = getDate(clientData.lastChange);
        const allData = `${clientId} ${clientData.secondName.toLowerCase()} ${clientData.name.toLowerCase()} ${clientData.lastName.toLowerCase()} ${creationDate} ${lastChange} ${clientData.contacts ? Object.values(clientData.contacts).join('').toLowerCase() : ''}`;

        if (allData.includes(clientSearch.value.toLowerCase().trim())) {
          suitableData[clientId] = data[clientId];
        }
      });

      filterByCategoryAndShowClients(suitableData, activeCategory);
      return suitableData;
    }

    newClientBtn.addEventListener('click', async event => {
      openClientModal('create', user.uid, data);
    });

    clientSearch.addEventListener('input', event => {
      searchData = filterClientsBySearchValue(data);
    });

    idBtn.addEventListener('click', event => {
      activeCategory = 'id';
      filterByCategoryAndShowClients(searchData, activeCategory);
    });

    fullNameBtn.addEventListener('click', event => {
      activeCategory = 'full-name';
      filterByCategoryAndShowClients(searchData, activeCategory);
    });

    creationDateBtn.addEventListener('click', event => {
      activeCategory = 'creation-date';
      filterByCategoryAndShowClients(searchData, activeCategory);
    });

    lastChangeBtn.addEventListener('click', event => {
      activeCategory = 'last-change';
      filterByCategoryAndShowClients(searchData, activeCategory);
    });
  } else {
    window.location.href = './register.html';
  }
});
