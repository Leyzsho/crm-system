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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcm0vY3JtLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhcHAgZnJvbSAnLi4vdXRpbHMvZmlyZWJhc2UtaW5pdC5qcyc7XHJcbmltcG9ydCB7IGdldEF1dGgsIG9uQXV0aFN0YXRlQ2hhbmdlZCB9IGZyb20gJ2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2ZpcmViYXNlanMvOS4xLjEvZmlyZWJhc2UtYXV0aC5qcyc7XHJcbmltcG9ydCB7IGdldERhdGFiYXNlLCByZWYsIG9uVmFsdWUgfSBmcm9tICdodHRwczovL3d3dy5nc3RhdGljLmNvbS9maXJlYmFzZWpzLzkuMS4xL2ZpcmViYXNlLWRhdGFiYXNlLmpzJztcclxuaW1wb3J0IHsgb3BlbkNsaWVudE1vZGFsLCBvcGVuRGVsZXRlQ2xpZW50IH0gZnJvbSAnLi9tb2RhbHMuanMnO1xyXG5cclxuY29uc3QgYXV0aCA9IGdldEF1dGgoYXBwKTtcclxuY29uc3QgZGIgPSBnZXREYXRhYmFzZSgpO1xyXG5cclxuY2xhc3MgQ2xpZW50IHtcclxuICBjb25zdHJ1Y3Rvcih1c2VySWQsIGxpc3QsIHtpZCwgbmFtZSwgc2Vjb25kTmFtZSwgbGFzdE5hbWUsIGNvbnRhY3RzLCBjcmVhdGlvbkRhdGUsIGxhc3RDaGFuZ2V9KSB7XHJcbiAgICB0aGlzLnVzZXJJZCA9IHVzZXJJZDtcclxuICAgIHRoaXMubGlzdCA9IGxpc3Q7XHJcbiAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgdGhpcy5zZWNvbmROYW1lID0gc2Vjb25kTmFtZTtcclxuICAgIHRoaXMubGFzdE5hbWUgPSBsYXN0TmFtZTtcclxuICAgIHRoaXMuY29udGFjdHMgPSBjb250YWN0cztcclxuICAgIHRoaXMuY3JlYXRpb25EYXRlID0gY3JlYXRpb25EYXRlO1xyXG4gICAgdGhpcy5sYXN0Q2hhbmdlID0gbGFzdENoYW5nZTtcclxuICAgIHRoaXMuY3JlYXRlQ2xpZW50KCk7XHJcbiAgfVxyXG5cclxuICBzZXQgY3JlYXRpb25EYXRlKGRhdGVWYWx1ZSkge1xyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGRhdGVWYWx1ZSk7XHJcbiAgICBjb25zdCBkYXkgPSBTdHJpbmcoZGF0ZS5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgICBjb25zdCBtb250aCA9IFN0cmluZyhkYXRlLmdldE1vbnRoKCkgKyAxKS5wYWRTdGFydCgyLCAnMCcpO1xyXG4gICAgY29uc3QgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcclxuXHJcbiAgICBjb25zdCBob3VycyA9IFN0cmluZyhkYXRlLmdldEhvdXJzKCkpLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgICBjb25zdCBtaW51dGVzID0gU3RyaW5nKGRhdGUuZ2V0TWludXRlcygpKS5wYWRTdGFydCgyLCAnMCcpO1xyXG5cclxuICAgIHRoaXMuX2NyZWF0aW9uRGF0ZSA9IGAke2RheX0uJHttb250aH0uJHt5ZWFyfWA7XHJcbiAgICB0aGlzLl9jcmVhdGlvblRpbWUgPSBgJHtob3Vyc306JHttaW51dGVzfWA7XHJcbiAgfVxyXG5cclxuICBnZXQgY3JlYXRpb25EYXRlKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgY3JlYXRpb25EYXRlOiB0aGlzLl9jcmVhdGlvbkRhdGUsXHJcbiAgICAgIGNyZWF0aW9uVGltZTogdGhpcy5fY3JlYXRpb25UaW1lLFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0IGxhc3RDaGFuZ2UoZGF0ZVZhbHVlKSB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoZGF0ZVZhbHVlKTtcclxuICAgIGNvbnN0IGRheSA9IFN0cmluZyhkYXRlLmdldERhdGUoKSkucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgIGNvbnN0IG1vbnRoID0gU3RyaW5nKGRhdGUuZ2V0TW9udGgoKSArIDEpLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xyXG5cclxuICAgIGNvbnN0IGhvdXJzID0gU3RyaW5nKGRhdGUuZ2V0SG91cnMoKSkucGFkU3RhcnQoMiwgJzAnKTtcclxuICAgIGNvbnN0IG1pbnV0ZXMgPSBTdHJpbmcoZGF0ZS5nZXRNaW51dGVzKCkpLnBhZFN0YXJ0KDIsICcwJyk7XHJcblxyXG4gICAgdGhpcy5fbGFzdENoYW5nZURhdGUgPSBgJHtkYXl9LiR7bW9udGh9LiR7eWVhcn1gO1xyXG4gICAgdGhpcy5fbGFzdENoYW5nZVRpbWUgPSBgJHtob3Vyc306JHttaW51dGVzfWA7XHJcbiAgfVxyXG5cclxuICBnZXQgbGFzdENoYW5nZSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGxhc3RDaGFuZ2VEYXRlOiB0aGlzLl9sYXN0Q2hhbmdlRGF0ZSxcclxuICAgICAgbGFzdENoYW5nZVRpbWU6IHRoaXMuX2xhc3RDaGFuZ2VUaW1lLFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY3JlYXRlQ2xpZW50KCkge1xyXG4gICAgY29uc3QgY2xpZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgIGNvbnN0IGlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgY29uc3QgZnVsbE5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICBjb25zdCBjcmVhdGlvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgY29uc3QgY3JlYXRpb25EYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgY29uc3QgY3JlYXRpb25UaW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgY29uc3QgbGFzdENoYW5nZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgY29uc3QgbGFzdENoYW5nZURhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICBjb25zdCBsYXN0Q2hhbmdlVGltZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgIGNvbnN0IGNvbnRhY3RDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGNvbnN0IGNoYW5nZUNsaWVudEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgY29uc3QgZGVsZXRlQ2xpZW50QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcblxyXG4gICAgY2xpZW50LmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1saXN0X19jbGllbnQnKTtcclxuICAgIGlkLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1saXN0X19pZCcpO1xyXG4gICAgZnVsbE5hbWUuY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX2Z1bGwtbmFtZScpO1xyXG4gICAgY3JlYXRpb25Db250YWluZXIuY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX2RhdGUtY29udGFpbmVyJyk7XHJcbiAgICBsYXN0Q2hhbmdlQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1saXN0X19kYXRlLWNvbnRhaW5lcicpO1xyXG4gICAgY3JlYXRpb25EYXRlLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1saXN0X19kYXRlJyk7XHJcbiAgICBjcmVhdGlvblRpbWUuY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX3RpbWUnKTtcclxuICAgIGxhc3RDaGFuZ2VEYXRlLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1saXN0X19kYXRlJyk7XHJcbiAgICBsYXN0Q2hhbmdlVGltZS5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbGlzdF9fdGltZScpO1xyXG4gICAgY29udGFjdENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbGlzdF9fY29udGFjdC1jb250YWluZXInKTtcclxuICAgIGNoYW5nZUNsaWVudEJ0bi5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbGlzdF9fYnRuJywgJ2NsaWVudC1saXN0X19jaGFuZ2UtYnRuJyk7XHJcbiAgICBkZWxldGVDbGllbnRCdG4uY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX2J0bicsICdjbGllbnQtbGlzdF9fZGVsZXRlLWJ0bicpO1xyXG5cclxuICAgIGlkLnRleHRDb250ZW50ID0gdGhpcy5pZDtcclxuICAgIGZ1bGxOYW1lLnRleHRDb250ZW50ID0gYCR7dGhpcy5zZWNvbmROYW1lfSAke3RoaXMubmFtZX0gJHt0aGlzLmxhc3ROYW1lICE9PSAnbm90IHNwZWNpZmllZCcgPyB0aGlzLmxhc3ROYW1lIDogJyd9YDtcclxuICAgIGNyZWF0aW9uRGF0ZS50ZXh0Q29udGVudCA9IHRoaXMuX2NyZWF0aW9uRGF0ZTtcclxuICAgIGNyZWF0aW9uVGltZS50ZXh0Q29udGVudCA9IHRoaXMuX2NyZWF0aW9uVGltZTtcclxuICAgIGxhc3RDaGFuZ2VEYXRlLnRleHRDb250ZW50ID0gdGhpcy5fbGFzdENoYW5nZURhdGU7XHJcbiAgICBsYXN0Q2hhbmdlVGltZS50ZXh0Q29udGVudCA9IHRoaXMuX2xhc3RDaGFuZ2VUaW1lO1xyXG4gICAgY2hhbmdlQ2xpZW50QnRuLnRleHRDb250ZW50ID0gJ9CY0LfQvNC10L3QuNGC0YwnO1xyXG4gICAgZGVsZXRlQ2xpZW50QnRuLnRleHRDb250ZW50ID0gJ9Cj0LTQsNC70LjRgtGMJztcclxuXHJcbiAgICBjcmVhdGlvbkNvbnRhaW5lci5hcHBlbmQoY3JlYXRpb25EYXRlKTtcclxuICAgIGNyZWF0aW9uQ29udGFpbmVyLmFwcGVuZChjcmVhdGlvblRpbWUpO1xyXG4gICAgbGFzdENoYW5nZUNvbnRhaW5lci5hcHBlbmQobGFzdENoYW5nZURhdGUpO1xyXG4gICAgbGFzdENoYW5nZUNvbnRhaW5lci5hcHBlbmQobGFzdENoYW5nZVRpbWUpO1xyXG4gICAgY2xpZW50LmFwcGVuZChpZCk7XHJcbiAgICBjbGllbnQuYXBwZW5kKGZ1bGxOYW1lKTtcclxuICAgIGNsaWVudC5hcHBlbmQoY3JlYXRpb25Db250YWluZXIpO1xyXG4gICAgY2xpZW50LmFwcGVuZChsYXN0Q2hhbmdlQ29udGFpbmVyKTtcclxuICAgIGNsaWVudC5hcHBlbmQoY29udGFjdENvbnRhaW5lcik7XHJcbiAgICBjbGllbnQuYXBwZW5kKGNoYW5nZUNsaWVudEJ0bik7XHJcbiAgICBjbGllbnQuYXBwZW5kKGRlbGV0ZUNsaWVudEJ0bik7XHJcbiAgICB0aGlzLmxpc3QuYXBwZW5kKGNsaWVudCk7XHJcblxyXG4gICAgaWYgKHRoaXMuY29udGFjdHMpIHtcclxuICAgICAgT2JqZWN0LmVudHJpZXModGhpcy5jb250YWN0cykuZm9yRWFjaCgoW3R5cGUsIHZhbHVlXSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNvbnRhY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb25zdCB0b29sdGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29uc3QgdG9vbHRpcFR5cGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgY29uc3QgdG9vbHRpcFZhbHVlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwic3ZnXCIpO1xyXG4gICAgICAgIGNvbnN0IHVzZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwidXNlXCIpO1xyXG5cclxuICAgICAgICBjb250YWN0LmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1saXN0X19jb250YWN0Jyk7XHJcbiAgICAgICAgdG9vbHRpcC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbGlzdF9fY29udGFjdC10b29sdGlwJyk7XHJcbiAgICAgICAgdG9vbHRpcFR5cGUuY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX2NvbnRhY3QtdG9vbHRpcC10eXBlJylcclxuICAgICAgICB0b29sdGlwVmFsdWUuY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX2NvbnRhY3QtdG9vbHRpcC12YWx1ZScpO1xyXG4gICAgICAgIHN2Zy5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbGlzdF9fY29udGFjdC1zdmcnKTtcclxuXHJcbiAgICAgICAgdG9vbHRpcFZhbHVlLnRleHRDb250ZW50ID0gJyAnICsgdmFsdWU7XHJcblxyXG4gICAgICAgIGlmICh0eXBlLmluY2x1ZGVzKCdwaG9uZScpKSB7XHJcbiAgICAgICAgICB1c2Uuc2V0QXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCAneGxpbms6aHJlZicsICcjcGhvbmUnKTtcclxuICAgICAgICAgIHRvb2x0aXBUeXBlLnRleHRDb250ZW50ID0gJ9GC0LXQu9C10YTQvtC9Oic7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlLmluY2x1ZGVzKCdlbWFpbCcpKSB7XHJcbiAgICAgICAgICB1c2Uuc2V0QXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCAneGxpbms6aHJlZicsICcjZW1haWwnKTtcclxuICAgICAgICAgIHRvb2x0aXBUeXBlLnRleHRDb250ZW50ID0gJ2VtYWlsOic7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlLmluY2x1ZGVzKCdmYWNlYm9vaycpKSB7XHJcbiAgICAgICAgICB1c2Uuc2V0QXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCAneGxpbms6aHJlZicsICcjZmFjZWJvb2snKTtcclxuICAgICAgICAgIHRvb2x0aXBUeXBlLnRleHRDb250ZW50ID0gJ2ZhY2Vib29rOic7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlLmluY2x1ZGVzKCd2aycpKSB7XHJcbiAgICAgICAgICB1c2Uuc2V0QXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCAneGxpbms6aHJlZicsICcjdmsnKTtcclxuICAgICAgICAgIHRvb2x0aXBUeXBlLnRleHRDb250ZW50ID0gJ3ZrOic7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHVzZS5zZXRBdHRyaWJ1dGVOUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycsICd4bGluazpocmVmJywgJyNvdGhlcicpO1xyXG4gICAgICAgICAgdG9vbHRpcFR5cGUudGV4dENvbnRlbnQgPSAn0LTRgNGD0LPQvtC1Oic7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdmcuYXBwZW5kKHVzZSk7XHJcbiAgICAgICAgdG9vbHRpcC5hcHBlbmQodG9vbHRpcFR5cGUpO1xyXG4gICAgICAgIHRvb2x0aXAuYXBwZW5kKHRvb2x0aXBWYWx1ZSk7XHJcbiAgICAgICAgY29udGFjdC5hcHBlbmQodG9vbHRpcCk7XHJcbiAgICAgICAgY29udGFjdC5hcHBlbmQoc3ZnKTtcclxuICAgICAgICBjb250YWN0Q29udGFpbmVyLmFwcGVuZChjb250YWN0KTtcclxuXHJcbiAgICAgICAgdG9vbHRpcC5zdHlsZS5sZWZ0ID0gYC0ke3Rvb2x0aXAub2Zmc2V0V2lkdGggLyAyIC0gN31weGA7XHJcblxyXG4gICAgICAgIHN2Zy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgdG9vbHRpcC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbGlzdF9fY29udGFjdC10b29sdGlwLS1zaG93Jyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHN2Zy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgZXZlbnQgPT4ge1xyXG4gICAgICAgICAgdG9vbHRpcC5jbGFzc0xpc3QucmVtb3ZlKCdjbGllbnQtbGlzdF9fY29udGFjdC10b29sdGlwLS1zaG93Jyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZUNsaWVudEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcclxuICAgICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgICBpZDogdGhpcy5pZCxcclxuICAgICAgICBuYW1lOiB0aGlzLm5hbWUsXHJcbiAgICAgICAgc2Vjb25kTmFtZTogdGhpcy5zZWNvbmROYW1lLFxyXG4gICAgICAgIGxhc3ROYW1lOiB0aGlzLmxhc3ROYW1lLFxyXG4gICAgICAgIGNvbnRhY3RzOiB0aGlzLmNvbnRhY3RzLFxyXG4gICAgICB9XHJcblxyXG4gICAgICBvcGVuQ2xpZW50TW9kYWwoJ2NoYW5nZScsIHRoaXMudXNlcklkLCBkYXRhKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlbGV0ZUNsaWVudEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcclxuICAgICAgb3BlbkRlbGV0ZUNsaWVudCh0aGlzLnVzZXJJZCwgdGhpcy5pZClcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxub25BdXRoU3RhdGVDaGFuZ2VkKGF1dGgsIGFzeW5jICh1c2VyKSA9PiB7XHJcbiAgLy8gZGF0YSDQuNC30LzQtdC90Y/QtdGC0YHRjyDRgtC+0LvRjNC60L4g0LIgb25WYWx1ZSwg0LLQv9C+0YHQu9C10LTRgdGC0LLQuNC4IGRhdGEg0L3QtSDQtNC+0LvQttC90LAg0LHRi9GC0Ywg0LjQt9C80LXQvdC10L3QvdC+0LkuXHJcbiAgbGV0IGRhdGEgPSBudWxsO1xyXG4gIGxldCBzZWFyY2hEYXRhID0gbnVsbDtcclxuXHJcbiAgY29uc3QgbmV3Q2xpZW50QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy1jbGllbnQtYnRuJyk7XHJcbiAgY29uc3QgY2xpZW50TGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGllbnQtbGlzdCcpO1xyXG4gIGNvbnN0IGNsaWVudFNlYXJjaCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGllbnQtc2VhcmNoJyk7XHJcblxyXG4gIGNvbnN0IGlkQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NvcnQtYnktaWQnKTtcclxuICBjb25zdCBmdWxsTmFtZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzb3J0LWJ5LWZ1bGwtbmFtZScpO1xyXG4gIGNvbnN0IGNyZWF0aW9uRGF0ZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzb3J0LWJ5LWNyZWF0aW9uLWRhdGUnKTtcclxuICBjb25zdCBsYXN0Q2hhbmdlQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NvcnQtYnktbGFzdC1jaGFuZ2UnKTtcclxuICBsZXQgYWN0aXZlQ2F0ZWdvcnkgPSAnaWQnO1xyXG5cclxuICBpZiAodXNlciAmJiB1c2VyLmVtYWlsVmVyaWZpZWQpIHtcclxuICAgIG9uVmFsdWUocmVmKGRiLCAoJ3VzZXJzLycgKyB1c2VyLnVpZCArICcvY2xpZW50cycpKSwgKHNuYXBzaG90KSA9PiB7XHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbGllbnQtY29udGFpbmVyX19sb2FkZXInKS5jbGFzc0xpc3QuYWRkKCdjbGllbnQtY29udGFpbmVyX19sb2FkZXItLWhpZGRlbicpO1xyXG4gICAgICBjbGllbnRMaXN0LmlubmVySFRNTCA9ICcnO1xyXG4gICAgICBkYXRhID0gc25hcHNob3QudmFsKCk7XHJcblxyXG4gICAgICBjb25zdCBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuXHJcbiAgICAgIGlmIChkYXRhID09PSBudWxsIHx8IGRhdGEucXVhbnRpdHkgPT09IDApIHtcclxuICAgICAgICBzZWFyY2hEYXRhID0gbnVsbDtcclxuICAgICAgICBjbGllbnRTZWFyY2guZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIGlkQnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICBmdWxsTmFtZUJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgY3JlYXRpb25EYXRlQnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICBsYXN0Q2hhbmdlQnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgY2xpZW50U2VhcmNoLnBsYWNlaG9sZGVyID0gJ9CS0LLQtdC00LjRgtC1INC30LDQv9GA0L7RgSAo0LTQvtC70LbQtdC9INCx0YvRgtGMINGF0L7RgtGPINCx0Ysg0L7QtNC40L0g0LrQu9C40LXQvdGCKSc7XHJcbiAgICAgICAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbGlzdF9fbWVzc2FnZScpO1xyXG4gICAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0JTQvtCx0LDQstGM0YLQtSDQstCw0YjQtdCz0L4g0L/QtdGA0LLQvtCz0L4g0LrQu9C40LXQvdGC0LAnO1xyXG4gICAgICAgIGNsaWVudExpc3QuYXBwZW5kKG1lc3NhZ2UpO1xyXG4gICAgICAgIG1lc3NhZ2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAgICAgICBvcGVuQ2xpZW50TW9kYWwoJ2NyZWF0ZScsIHVzZXIudWlkLCBkYXRhKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBtZXNzYWdlLnJlbW92ZSgpO1xyXG4gICAgICAgIGNsaWVudFNlYXJjaC5wbGFjZWhvbGRlciA9ICfQktCy0LXQtNC40YLQtSDQt9Cw0L/RgNC+0YEnO1xyXG5cclxuICAgICAgICBzZWFyY2hEYXRhID0gZmlsdGVyQ2xpZW50c0J5U2VhcmNoVmFsdWUoZGF0YSk7XHJcbiAgICAgICAgZmlsdGVyQnlDYXRlZ29yeUFuZFNob3dDbGllbnRzKHNlYXJjaERhdGEsIGFjdGl2ZUNhdGVnb3J5KTtcclxuXHJcbiAgICAgICAgY2xpZW50U2VhcmNoLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgaWRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICBmdWxsTmFtZUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIGNyZWF0aW9uRGF0ZUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIGxhc3RDaGFuZ2VCdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICBuZXdDbGllbnRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIGZpbHRlckJ5Q2F0ZWdvcnlBbmRTaG93Q2xpZW50cyhkYXRhLCB3YXkpIHtcclxuICAgICAgY2xpZW50TGlzdC5pbm5lckhUTUwgPSAnJztcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNsaWVudC1jYXRlZ29yaWVzX19jYXRlZ29yeS0tYWN0aXZlJykuY2xhc3NMaXN0LnJlbW92ZShcImNsaWVudC1jYXRlZ29yaWVzX19jYXRlZ29yeS0tYWN0aXZlXCIpO1xyXG5cclxuICAgICAgaWYgKHdheSA9PT0gJ2lkJykge1xyXG4gICAgICAgIGlkQnRuLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1jYXRlZ29yaWVzX19jYXRlZ29yeS0tYWN0aXZlJyk7XHJcblxyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGRhdGEpLmZvckVhY2goKFtjbGllbnRJZCwgY2xpZW50RGF0YV0pID0+IHtcclxuICAgICAgICAgIG5ldyBDbGllbnQodXNlci51aWQsIGNsaWVudExpc3QsIHtcclxuICAgICAgICAgICAgaWQ6IGNsaWVudElkLFxyXG4gICAgICAgICAgICBuYW1lOiBjbGllbnREYXRhLm5hbWUsXHJcbiAgICAgICAgICAgIHNlY29uZE5hbWU6IGNsaWVudERhdGEuc2Vjb25kTmFtZSxcclxuICAgICAgICAgICAgbGFzdE5hbWU6IGNsaWVudERhdGEubGFzdE5hbWUsXHJcbiAgICAgICAgICAgIGNvbnRhY3RzOiBjbGllbnREYXRhLmNvbnRhY3RzLFxyXG4gICAgICAgICAgICBjcmVhdGlvbkRhdGU6IGNsaWVudERhdGEuY3JlYXRpb25EYXRlLFxyXG4gICAgICAgICAgICBsYXN0Q2hhbmdlOiBjbGllbnREYXRhLmxhc3RDaGFuZ2UsXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIGlmICh3YXkgPT09ICdmdWxsLW5hbWUnKSB7XHJcbiAgICAgICAgZnVsbE5hbWVCdG4uY2xhc3NMaXN0LmFkZCgnY2xpZW50LWNhdGVnb3JpZXNfX2NhdGVnb3J5LS1hY3RpdmUnKTtcclxuXHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoZGF0YSlcclxuICAgICAgICAuc29ydCgoWyxhXSwgWyxiXSkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgZnVsbE5hbWVBID0gYS5zZWNvbmROYW1lICsgYS5uYW1lICsgKGEubGFzdE5hbWUgIT09ICdub3Qgc3BlY2lmaWVkJyA/IGEubGFzdE5hbWUgOiAnJyk7XHJcbiAgICAgICAgICBjb25zdCBmdWxsTmFtZUIgPSBiLnNlY29uZE5hbWUgKyBiLm5hbWUgKyAoYi5sYXN0TmFtZSAhPT0gJ25vdCBzcGVjaWZpZWQnID8gYi5sYXN0TmFtZSA6ICcnKTtcclxuICAgICAgICAgIHJldHVybiBmdWxsTmFtZUEudG9Mb3dlckNhc2UoKS5sb2NhbGVDb21wYXJlKGZ1bGxOYW1lQi50b0xvd2VyQ2FzZSgpKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5mb3JFYWNoKChbY2xpZW50SWQsIGNsaWVudERhdGFdKSA9PiB7XHJcbiAgICAgICAgICBuZXcgQ2xpZW50KHVzZXIudWlkLCBjbGllbnRMaXN0LCB7XHJcbiAgICAgICAgICAgIGlkOiBjbGllbnRJZCxcclxuICAgICAgICAgICAgbmFtZTogY2xpZW50RGF0YS5uYW1lLFxyXG4gICAgICAgICAgICBzZWNvbmROYW1lOiBjbGllbnREYXRhLnNlY29uZE5hbWUsXHJcbiAgICAgICAgICAgIGxhc3ROYW1lOiBjbGllbnREYXRhLmxhc3ROYW1lLFxyXG4gICAgICAgICAgICBjb250YWN0czogY2xpZW50RGF0YS5jb250YWN0cyxcclxuICAgICAgICAgICAgY3JlYXRpb25EYXRlOiBjbGllbnREYXRhLmNyZWF0aW9uRGF0ZSxcclxuICAgICAgICAgICAgbGFzdENoYW5nZTogY2xpZW50RGF0YS5sYXN0Q2hhbmdlLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSBpZiAod2F5ID09PSAnY3JlYXRpb24tZGF0ZScpIHtcclxuICAgICAgICBjcmVhdGlvbkRhdGVCdG4uY2xhc3NMaXN0LmFkZCgnY2xpZW50LWNhdGVnb3JpZXNfX2NhdGVnb3J5LS1hY3RpdmUnKTtcclxuXHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoZGF0YSlcclxuICAgICAgICAuc29ydCgoWyxhXSwgWyxiXSkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIGEuY3JlYXRpb25EYXRlIC0gYi5jcmVhdGlvbkRhdGU7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuZm9yRWFjaCgoW2NsaWVudElkLCBjbGllbnREYXRhXSkgPT4ge1xyXG4gICAgICAgICAgbmV3IENsaWVudCh1c2VyLnVpZCwgY2xpZW50TGlzdCwge1xyXG4gICAgICAgICAgICBpZDogY2xpZW50SWQsXHJcbiAgICAgICAgICAgIG5hbWU6IGNsaWVudERhdGEubmFtZSxcclxuICAgICAgICAgICAgc2Vjb25kTmFtZTogY2xpZW50RGF0YS5zZWNvbmROYW1lLFxyXG4gICAgICAgICAgICBsYXN0TmFtZTogY2xpZW50RGF0YS5sYXN0TmFtZSxcclxuICAgICAgICAgICAgY29udGFjdHM6IGNsaWVudERhdGEuY29udGFjdHMsXHJcbiAgICAgICAgICAgIGNyZWF0aW9uRGF0ZTogY2xpZW50RGF0YS5jcmVhdGlvbkRhdGUsXHJcbiAgICAgICAgICAgIGxhc3RDaGFuZ2U6IGNsaWVudERhdGEubGFzdENoYW5nZSxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2UgaWYgKHdheSA9PT0gJ2xhc3QtY2hhbmdlJykge1xyXG4gICAgICAgIGxhc3RDaGFuZ2VCdG4uY2xhc3NMaXN0LmFkZCgnY2xpZW50LWNhdGVnb3JpZXNfX2NhdGVnb3J5LS1hY3RpdmUnKTtcclxuXHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoZGF0YSlcclxuICAgICAgICAuc29ydCgoWyxhXSwgWyxiXSkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIGEubGFzdENoYW5nZSAtIGIubGFzdENoYW5nZTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5mb3JFYWNoKChbY2xpZW50SWQsIGNsaWVudERhdGFdKSA9PiB7XHJcbiAgICAgICAgICBuZXcgQ2xpZW50KHVzZXIudWlkLCBjbGllbnRMaXN0LCB7XHJcbiAgICAgICAgICAgIGlkOiBjbGllbnRJZCxcclxuICAgICAgICAgICAgbmFtZTogY2xpZW50RGF0YS5uYW1lLFxyXG4gICAgICAgICAgICBzZWNvbmROYW1lOiBjbGllbnREYXRhLnNlY29uZE5hbWUsXHJcbiAgICAgICAgICAgIGxhc3ROYW1lOiBjbGllbnREYXRhLmxhc3ROYW1lLFxyXG4gICAgICAgICAgICBjb250YWN0czogY2xpZW50RGF0YS5jb250YWN0cyxcclxuICAgICAgICAgICAgY3JlYXRpb25EYXRlOiBjbGllbnREYXRhLmNyZWF0aW9uRGF0ZSxcclxuICAgICAgICAgICAgbGFzdENoYW5nZTogY2xpZW50RGF0YS5sYXN0Q2hhbmdlLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBmaWx0ZXJDbGllbnRzQnlTZWFyY2hWYWx1ZShkYXRhKSB7XHJcbiAgICAgIGNvbnN0IHN1aXRhYmxlRGF0YSA9IHt9O1xyXG5cclxuICAgICAgT2JqZWN0LmVudHJpZXMoZGF0YSkuZm9yRWFjaCgoW2NsaWVudElkLCBjbGllbnREYXRhXSkgPT4ge1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldERhdGUgKGRhdGVWYWx1ZSkge1xyXG4gICAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGRhdGVWYWx1ZSk7XHJcbiAgICAgICAgICBjb25zdCBkYXkgPSBTdHJpbmcoZGF0ZS5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgICAgICAgICBjb25zdCBtb250aCA9IFN0cmluZyhkYXRlLmdldE1vbnRoKCkgKyAxKS5wYWRTdGFydCgyLCAnMCcpO1xyXG4gICAgICAgICAgY29uc3QgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcclxuXHJcbiAgICAgICAgICBjb25zdCBob3VycyA9IFN0cmluZyhkYXRlLmdldEhvdXJzKCkpLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgICAgICAgICBjb25zdCBtaW51dGVzID0gU3RyaW5nKGRhdGUuZ2V0TWludXRlcygpKS5wYWRTdGFydCgyLCAnMCcpO1xyXG5cclxuICAgICAgICAgIHJldHVybiBgJHtkYXl9LiR7bW9udGh9LiR7eWVhcn0gJHtob3Vyc306JHttaW51dGVzfWA7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgY3JlYXRpb25EYXRlID0gZ2V0RGF0ZShjbGllbnREYXRhLmNyZWF0aW9uRGF0ZSk7XHJcbiAgICAgICAgY29uc3QgbGFzdENoYW5nZSA9IGdldERhdGUoY2xpZW50RGF0YS5sYXN0Q2hhbmdlKTtcclxuICAgICAgICBjb25zdCBhbGxEYXRhID0gYCR7Y2xpZW50SWR9ICR7Y2xpZW50RGF0YS5zZWNvbmROYW1lLnRvTG93ZXJDYXNlKCl9ICR7Y2xpZW50RGF0YS5uYW1lLnRvTG93ZXJDYXNlKCl9ICR7Y2xpZW50RGF0YS5sYXN0TmFtZS50b0xvd2VyQ2FzZSgpfSAke2NyZWF0aW9uRGF0ZX0gJHtsYXN0Q2hhbmdlfSAke2NsaWVudERhdGEuY29udGFjdHMgPyBPYmplY3QudmFsdWVzKGNsaWVudERhdGEuY29udGFjdHMpLmpvaW4oJycpLnRvTG93ZXJDYXNlKCkgOiAnJ31gO1xyXG5cclxuICAgICAgICBpZiAoYWxsRGF0YS5pbmNsdWRlcyhjbGllbnRTZWFyY2gudmFsdWUudG9Mb3dlckNhc2UoKS50cmltKCkpKSB7XHJcbiAgICAgICAgICBzdWl0YWJsZURhdGFbY2xpZW50SWRdID0gZGF0YVtjbGllbnRJZF07XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGZpbHRlckJ5Q2F0ZWdvcnlBbmRTaG93Q2xpZW50cyhzdWl0YWJsZURhdGEsIGFjdGl2ZUNhdGVnb3J5KTtcclxuICAgICAgcmV0dXJuIHN1aXRhYmxlRGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBuZXdDbGllbnRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBldmVudCA9PiB7XHJcbiAgICAgIG9wZW5DbGllbnRNb2RhbCgnY3JlYXRlJywgdXNlci51aWQsIGRhdGEpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY2xpZW50U2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xyXG4gICAgICBzZWFyY2hEYXRhID0gZmlsdGVyQ2xpZW50c0J5U2VhcmNoVmFsdWUoZGF0YSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcclxuICAgICAgYWN0aXZlQ2F0ZWdvcnkgPSAnaWQnO1xyXG4gICAgICBmaWx0ZXJCeUNhdGVnb3J5QW5kU2hvd0NsaWVudHMoc2VhcmNoRGF0YSwgYWN0aXZlQ2F0ZWdvcnkpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZnVsbE5hbWVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAgIGFjdGl2ZUNhdGVnb3J5ID0gJ2Z1bGwtbmFtZSc7XHJcbiAgICAgIGZpbHRlckJ5Q2F0ZWdvcnlBbmRTaG93Q2xpZW50cyhzZWFyY2hEYXRhLCBhY3RpdmVDYXRlZ29yeSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjcmVhdGlvbkRhdGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAgIGFjdGl2ZUNhdGVnb3J5ID0gJ2NyZWF0aW9uLWRhdGUnO1xyXG4gICAgICBmaWx0ZXJCeUNhdGVnb3J5QW5kU2hvd0NsaWVudHMoc2VhcmNoRGF0YSwgYWN0aXZlQ2F0ZWdvcnkpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgbGFzdENoYW5nZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcclxuICAgICAgYWN0aXZlQ2F0ZWdvcnkgPSAnbGFzdC1jaGFuZ2UnO1xyXG4gICAgICBmaWx0ZXJCeUNhdGVnb3J5QW5kU2hvd0NsaWVudHMoc2VhcmNoRGF0YSwgYWN0aXZlQ2F0ZWdvcnkpO1xyXG4gICAgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4vcmVnaXN0ZXIuaHRtbCc7XHJcbiAgfVxyXG59KTtcclxuIl0sImZpbGUiOiJjcm0vY3JtLmpzIn0=
