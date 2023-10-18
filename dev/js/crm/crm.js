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
  let data = null;
  const newClientBtn = document.querySelector('.new-client-btn');
  const clientList = document.getElementById('client-list');

  const idBtn = document.getElementById('sort-by-id');
  const fullNameBtn = document.getElementById('sort-by-full-name');
  const creationDateBtn = document.getElementById('sort-by-creation-date');
  const lastChangeBtn = document.getElementById('sort-by-last-change');
  let activeCategoryBtn = idBtn;

  if (user && user.emailVerified) {
    onValue(ref(db, ('users/' + user.uid + '/clients')), (snapshot) => {
      document.querySelector('.client-container__loader').classList.add('client-container__loader--hidden');
      clientList.innerHTML = '';
      data = snapshot.val();

      const message = document.createElement('li');

      if (data === null || data.quantity === 0) {
        message.classList.add('client-list__message');
        message.textContent = 'Добавьте вашего первого клиента';
        clientList.append(message);
        message.addEventListener('click', event => {
          openClientModal('create', user.uid, data);
        });
      } else {
        message.remove();
        activeCategoryBtn.classList.remove('client-categories__category--active');
        activeCategoryBtn = idBtn;
        activeCategoryBtn.classList.add('client-categories__category--active');

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
      }

      newClientBtn.disabled = false;
      idBtn.disabled = false;
      fullNameBtn.disabled = false;
      creationDateBtn.disabled = false;
      lastChangeBtn.disabled = false;
    });

    newClientBtn.addEventListener('click', async event => {
      openClientModal('create', user.uid, data);
    });

    idBtn.addEventListener('click', event => {
      clientList.innerHTML = '';
      activeCategoryBtn.classList.remove('client-categories__category--active');
      activeCategoryBtn = event.currentTarget;
      activeCategoryBtn.classList.add('client-categories__category--active');

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
    });

    fullNameBtn.addEventListener('click', event => {
      clientList.innerHTML = '';
      activeCategoryBtn.classList.remove('client-categories__category--active');
      activeCategoryBtn = event.currentTarget;
      activeCategoryBtn.classList.add('client-categories__category--active');

      Object.entries(data)
      .sort(([,a], [,b]) => {
        const fullNameA = a.name + a.secondName + (a.lastName !== 'not specified' ? a.lastName : '');
        const fullNameB = b.name + b.secondName + (b.lastName !== 'not specified' ? b.lastName : '');
        return fullNameA.localeCompare(fullNameB);
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
    });

    creationDateBtn.addEventListener('click', event => {
      clientList.innerHTML = '';
      activeCategoryBtn.classList.remove('client-categories__category--active');
      activeCategoryBtn = event.currentTarget;
      activeCategoryBtn.classList.add('client-categories__category--active');

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
    });

    lastChangeBtn.addEventListener('click', event => {
      clientList.innerHTML = '';
      activeCategoryBtn.classList.remove('client-categories__category--active');
      activeCategoryBtn = event.currentTarget;
      activeCategoryBtn.classList.add('client-categories__category--active');

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
    });
  } else {
    window.location.href = './register.html';
  }
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcm0vY3JtLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhcHAgZnJvbSAnLi4vdXRpbHMvZmlyZWJhc2UtaW5pdC5qcyc7XG5pbXBvcnQgeyBnZXRBdXRoLCBvbkF1dGhTdGF0ZUNoYW5nZWQgfSBmcm9tICdodHRwczovL3d3dy5nc3RhdGljLmNvbS9maXJlYmFzZWpzLzkuMS4xL2ZpcmViYXNlLWF1dGguanMnO1xuaW1wb3J0IHsgZ2V0RGF0YWJhc2UsIHJlZiwgb25WYWx1ZSB9IGZyb20gJ2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2ZpcmViYXNlanMvOS4xLjEvZmlyZWJhc2UtZGF0YWJhc2UuanMnO1xuaW1wb3J0IHsgb3BlbkNsaWVudE1vZGFsLCBvcGVuRGVsZXRlQ2xpZW50IH0gZnJvbSAnLi9tb2RhbHMuanMnO1xuXG5jb25zdCBhdXRoID0gZ2V0QXV0aChhcHApO1xuY29uc3QgZGIgPSBnZXREYXRhYmFzZSgpO1xuXG5jbGFzcyBDbGllbnQge1xuICBjb25zdHJ1Y3Rvcih1c2VySWQsIGxpc3QsIHtpZCwgbmFtZSwgc2Vjb25kTmFtZSwgbGFzdE5hbWUsIGNvbnRhY3RzLCBjcmVhdGlvbkRhdGUsIGxhc3RDaGFuZ2V9KSB7XG4gICAgdGhpcy51c2VySWQgPSB1c2VySWQ7XG4gICAgdGhpcy5saXN0ID0gbGlzdDtcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnNlY29uZE5hbWUgPSBzZWNvbmROYW1lO1xuICAgIHRoaXMubGFzdE5hbWUgPSBsYXN0TmFtZTtcbiAgICB0aGlzLmNvbnRhY3RzID0gY29udGFjdHM7XG4gICAgdGhpcy5jcmVhdGlvbkRhdGUgPSBjcmVhdGlvbkRhdGU7XG4gICAgdGhpcy5sYXN0Q2hhbmdlID0gbGFzdENoYW5nZTtcbiAgICB0aGlzLmNyZWF0ZUNsaWVudCgpO1xuICB9XG5cbiAgc2V0IGNyZWF0aW9uRGF0ZShkYXRlVmFsdWUpIHtcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoZGF0ZVZhbHVlKTtcbiAgICBjb25zdCBkYXkgPSBTdHJpbmcoZGF0ZS5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgY29uc3QgbW9udGggPSBTdHJpbmcoZGF0ZS5nZXRNb250aCgpICsgMSkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuXG4gICAgY29uc3QgaG91cnMgPSBTdHJpbmcoZGF0ZS5nZXRIb3VycygpKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgIGNvbnN0IG1pbnV0ZXMgPSBTdHJpbmcoZGF0ZS5nZXRNaW51dGVzKCkpLnBhZFN0YXJ0KDIsICcwJyk7XG5cbiAgICB0aGlzLl9jcmVhdGlvbkRhdGUgPSBgJHtkYXl9LiR7bW9udGh9LiR7eWVhcn1gO1xuICAgIHRoaXMuX2NyZWF0aW9uVGltZSA9IGAke2hvdXJzfToke21pbnV0ZXN9YDtcbiAgfVxuXG4gIGdldCBjcmVhdGlvbkRhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNyZWF0aW9uRGF0ZTogdGhpcy5fY3JlYXRpb25EYXRlLFxuICAgICAgY3JlYXRpb25UaW1lOiB0aGlzLl9jcmVhdGlvblRpbWUsXG4gICAgfVxuICB9XG5cbiAgc2V0IGxhc3RDaGFuZ2UoZGF0ZVZhbHVlKSB7XG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGRhdGVWYWx1ZSk7XG4gICAgY29uc3QgZGF5ID0gU3RyaW5nKGRhdGUuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgIGNvbnN0IG1vbnRoID0gU3RyaW5nKGRhdGUuZ2V0TW9udGgoKSArIDEpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgY29uc3QgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcblxuICAgIGNvbnN0IGhvdXJzID0gU3RyaW5nKGRhdGUuZ2V0SG91cnMoKSkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICBjb25zdCBtaW51dGVzID0gU3RyaW5nKGRhdGUuZ2V0TWludXRlcygpKS5wYWRTdGFydCgyLCAnMCcpO1xuXG4gICAgdGhpcy5fbGFzdENoYW5nZURhdGUgPSBgJHtkYXl9LiR7bW9udGh9LiR7eWVhcn1gO1xuICAgIHRoaXMuX2xhc3RDaGFuZ2VUaW1lID0gYCR7aG91cnN9OiR7bWludXRlc31gO1xuICB9XG5cbiAgZ2V0IGxhc3RDaGFuZ2UoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhc3RDaGFuZ2VEYXRlOiB0aGlzLl9sYXN0Q2hhbmdlRGF0ZSxcbiAgICAgIGxhc3RDaGFuZ2VUaW1lOiB0aGlzLl9sYXN0Q2hhbmdlVGltZSxcbiAgICB9XG4gIH1cblxuICBjcmVhdGVDbGllbnQoKSB7XG4gICAgY29uc3QgY2xpZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBjb25zdCBpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb25zdCBmdWxsTmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb25zdCBjcmVhdGlvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IGNyZWF0aW9uRGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb25zdCBjcmVhdGlvblRpbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY29uc3QgbGFzdENoYW5nZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IGxhc3RDaGFuZ2VEYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNvbnN0IGxhc3RDaGFuZ2VUaW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNvbnN0IGNvbnRhY3RDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCBjaGFuZ2VDbGllbnRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBkZWxldGVDbGllbnRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblxuICAgIGNsaWVudC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbGlzdF9fY2xpZW50Jyk7XG4gICAgaWQuY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX2lkJyk7XG4gICAgZnVsbE5hbWUuY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX2Z1bGwtbmFtZScpO1xuICAgIGNyZWF0aW9uQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1saXN0X19kYXRlLWNvbnRhaW5lcicpO1xuICAgIGxhc3RDaGFuZ2VDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX2RhdGUtY29udGFpbmVyJyk7XG4gICAgY3JlYXRpb25EYXRlLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1saXN0X19kYXRlJyk7XG4gICAgY3JlYXRpb25UaW1lLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1saXN0X190aW1lJyk7XG4gICAgbGFzdENoYW5nZURhdGUuY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX2RhdGUnKTtcbiAgICBsYXN0Q2hhbmdlVGltZS5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbGlzdF9fdGltZScpO1xuICAgIGNvbnRhY3RDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX2NvbnRhY3QtY29udGFpbmVyJyk7XG4gICAgY2hhbmdlQ2xpZW50QnRuLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1saXN0X19idG4nLCAnY2xpZW50LWxpc3RfX2NoYW5nZS1idG4nKTtcbiAgICBkZWxldGVDbGllbnRCdG4uY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX2J0bicsICdjbGllbnQtbGlzdF9fZGVsZXRlLWJ0bicpO1xuXG4gICAgaWQudGV4dENvbnRlbnQgPSB0aGlzLmlkO1xuICAgIGZ1bGxOYW1lLnRleHRDb250ZW50ID0gYCR7dGhpcy5zZWNvbmROYW1lfSAke3RoaXMubmFtZX0gJHt0aGlzLmxhc3ROYW1lICE9PSAnbm90IHNwZWNpZmllZCcgPyB0aGlzLmxhc3ROYW1lIDogJyd9YDtcbiAgICBjcmVhdGlvbkRhdGUudGV4dENvbnRlbnQgPSB0aGlzLl9jcmVhdGlvbkRhdGU7XG4gICAgY3JlYXRpb25UaW1lLnRleHRDb250ZW50ID0gdGhpcy5fY3JlYXRpb25UaW1lO1xuICAgIGxhc3RDaGFuZ2VEYXRlLnRleHRDb250ZW50ID0gdGhpcy5fbGFzdENoYW5nZURhdGU7XG4gICAgbGFzdENoYW5nZVRpbWUudGV4dENvbnRlbnQgPSB0aGlzLl9sYXN0Q2hhbmdlVGltZTtcbiAgICBjaGFuZ2VDbGllbnRCdG4udGV4dENvbnRlbnQgPSAn0JjQt9C80LXQvdC40YLRjCc7XG4gICAgZGVsZXRlQ2xpZW50QnRuLnRleHRDb250ZW50ID0gJ9Cj0LTQsNC70LjRgtGMJztcblxuICAgIGNyZWF0aW9uQ29udGFpbmVyLmFwcGVuZChjcmVhdGlvbkRhdGUpO1xuICAgIGNyZWF0aW9uQ29udGFpbmVyLmFwcGVuZChjcmVhdGlvblRpbWUpO1xuICAgIGxhc3RDaGFuZ2VDb250YWluZXIuYXBwZW5kKGxhc3RDaGFuZ2VEYXRlKTtcbiAgICBsYXN0Q2hhbmdlQ29udGFpbmVyLmFwcGVuZChsYXN0Q2hhbmdlVGltZSk7XG4gICAgY2xpZW50LmFwcGVuZChpZCk7XG4gICAgY2xpZW50LmFwcGVuZChmdWxsTmFtZSk7XG4gICAgY2xpZW50LmFwcGVuZChjcmVhdGlvbkNvbnRhaW5lcik7XG4gICAgY2xpZW50LmFwcGVuZChsYXN0Q2hhbmdlQ29udGFpbmVyKTtcbiAgICBjbGllbnQuYXBwZW5kKGNvbnRhY3RDb250YWluZXIpO1xuICAgIGNsaWVudC5hcHBlbmQoY2hhbmdlQ2xpZW50QnRuKTtcbiAgICBjbGllbnQuYXBwZW5kKGRlbGV0ZUNsaWVudEJ0bik7XG4gICAgdGhpcy5saXN0LmFwcGVuZChjbGllbnQpO1xuXG4gICAgaWYgKHRoaXMuY29udGFjdHMpIHtcbiAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuY29udGFjdHMpLmZvckVhY2goKFt0eXBlLCB2YWx1ZV0pID0+IHtcbiAgICAgICAgY29uc3QgY29udGFjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjb25zdCB0b29sdGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGNvbnN0IHRvb2x0aXBUeXBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICBjb25zdCB0b29sdGlwVmFsdWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwic3ZnXCIpO1xuICAgICAgICBjb25zdCB1c2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcInVzZVwiKTtcblxuICAgICAgICBjb250YWN0LmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1saXN0X19jb250YWN0Jyk7XG4gICAgICAgIHRvb2x0aXAuY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX2NvbnRhY3QtdG9vbHRpcCcpO1xuICAgICAgICB0b29sdGlwVHlwZS5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbGlzdF9fY29udGFjdC10b29sdGlwLXR5cGUnKVxuICAgICAgICB0b29sdGlwVmFsdWUuY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX2NvbnRhY3QtdG9vbHRpcC12YWx1ZScpO1xuICAgICAgICBzdmcuY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX2NvbnRhY3Qtc3ZnJyk7XG5cbiAgICAgICAgdG9vbHRpcFZhbHVlLnRleHRDb250ZW50ID0gJyAnICsgdmFsdWU7XG5cbiAgICAgICAgaWYgKHR5cGUuaW5jbHVkZXMoJ3Bob25lJykpIHtcbiAgICAgICAgICB1c2Uuc2V0QXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCAneGxpbms6aHJlZicsICcjcGhvbmUnKTtcbiAgICAgICAgICB0b29sdGlwVHlwZS50ZXh0Q29udGVudCA9ICfRgtC10LvQtdGE0L7QvTonO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUuaW5jbHVkZXMoJ2VtYWlsJykpIHtcbiAgICAgICAgICB1c2Uuc2V0QXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCAneGxpbms6aHJlZicsICcjZW1haWwnKTtcbiAgICAgICAgICB0b29sdGlwVHlwZS50ZXh0Q29udGVudCA9ICdlbWFpbDonO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUuaW5jbHVkZXMoJ2ZhY2Vib29rJykpIHtcbiAgICAgICAgICB1c2Uuc2V0QXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCAneGxpbms6aHJlZicsICcjZmFjZWJvb2snKTtcbiAgICAgICAgICB0b29sdGlwVHlwZS50ZXh0Q29udGVudCA9ICdmYWNlYm9vazonO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUuaW5jbHVkZXMoJ3ZrJykpIHtcbiAgICAgICAgICB1c2Uuc2V0QXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCAneGxpbms6aHJlZicsICcjdmsnKTtcbiAgICAgICAgICB0b29sdGlwVHlwZS50ZXh0Q29udGVudCA9ICd2azonO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVzZS5zZXRBdHRyaWJ1dGVOUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycsICd4bGluazpocmVmJywgJyNvdGhlcicpO1xuICAgICAgICAgIHRvb2x0aXBUeXBlLnRleHRDb250ZW50ID0gJ9C00YDRg9Cz0L7QtTonO1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnLmFwcGVuZCh1c2UpO1xuICAgICAgICB0b29sdGlwLmFwcGVuZCh0b29sdGlwVHlwZSk7XG4gICAgICAgIHRvb2x0aXAuYXBwZW5kKHRvb2x0aXBWYWx1ZSk7XG4gICAgICAgIGNvbnRhY3QuYXBwZW5kKHRvb2x0aXApO1xuICAgICAgICBjb250YWN0LmFwcGVuZChzdmcpO1xuICAgICAgICBjb250YWN0Q29udGFpbmVyLmFwcGVuZChjb250YWN0KTtcblxuICAgICAgICB0b29sdGlwLnN0eWxlLmxlZnQgPSBgLSR7dG9vbHRpcC5vZmZzZXRXaWR0aCAvIDIgLSA3fXB4YDtcblxuICAgICAgICBzdmcuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIGV2ZW50ID0+IHtcbiAgICAgICAgICB0b29sdGlwLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1saXN0X19jb250YWN0LXRvb2x0aXAtLXNob3cnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc3ZnLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBldmVudCA9PiB7XG4gICAgICAgICAgdG9vbHRpcC5jbGFzc0xpc3QucmVtb3ZlKCdjbGllbnQtbGlzdF9fY29udGFjdC10b29sdGlwLS1zaG93Jyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY2hhbmdlQ2xpZW50QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgICAgc2Vjb25kTmFtZTogdGhpcy5zZWNvbmROYW1lLFxuICAgICAgICBsYXN0TmFtZTogdGhpcy5sYXN0TmFtZSxcbiAgICAgICAgY29udGFjdHM6IHRoaXMuY29udGFjdHMsXG4gICAgICB9XG5cbiAgICAgIG9wZW5DbGllbnRNb2RhbCgnY2hhbmdlJywgdGhpcy51c2VySWQsIGRhdGEpO1xuICAgIH0pO1xuXG4gICAgZGVsZXRlQ2xpZW50QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgb3BlbkRlbGV0ZUNsaWVudCh0aGlzLnVzZXJJZCwgdGhpcy5pZClcbiAgICB9KTtcbiAgfVxufVxuXG5vbkF1dGhTdGF0ZUNoYW5nZWQoYXV0aCwgYXN5bmMgKHVzZXIpID0+IHtcbiAgbGV0IGRhdGEgPSBudWxsO1xuICBjb25zdCBuZXdDbGllbnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LWNsaWVudC1idG4nKTtcbiAgY29uc3QgY2xpZW50TGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGllbnQtbGlzdCcpO1xuXG4gIGNvbnN0IGlkQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NvcnQtYnktaWQnKTtcbiAgY29uc3QgZnVsbE5hbWVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc29ydC1ieS1mdWxsLW5hbWUnKTtcbiAgY29uc3QgY3JlYXRpb25EYXRlQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NvcnQtYnktY3JlYXRpb24tZGF0ZScpO1xuICBjb25zdCBsYXN0Q2hhbmdlQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NvcnQtYnktbGFzdC1jaGFuZ2UnKTtcbiAgbGV0IGFjdGl2ZUNhdGVnb3J5QnRuID0gaWRCdG47XG5cbiAgaWYgKHVzZXIgJiYgdXNlci5lbWFpbFZlcmlmaWVkKSB7XG4gICAgb25WYWx1ZShyZWYoZGIsICgndXNlcnMvJyArIHVzZXIudWlkICsgJy9jbGllbnRzJykpLCAoc25hcHNob3QpID0+IHtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbGllbnQtY29udGFpbmVyX19sb2FkZXInKS5jbGFzc0xpc3QuYWRkKCdjbGllbnQtY29udGFpbmVyX19sb2FkZXItLWhpZGRlbicpO1xuICAgICAgY2xpZW50TGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGRhdGEgPSBzbmFwc2hvdC52YWwoKTtcblxuICAgICAgY29uc3QgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG5cbiAgICAgIGlmIChkYXRhID09PSBudWxsIHx8IGRhdGEucXVhbnRpdHkgPT09IDApIHtcbiAgICAgICAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbGlzdF9fbWVzc2FnZScpO1xuICAgICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9CU0L7QsdCw0LLRjNGC0LUg0LLQsNGI0LXQs9C+INC/0LXRgNCy0L7Qs9C+INC60LvQuNC10L3RgtCwJztcbiAgICAgICAgY2xpZW50TGlzdC5hcHBlbmQobWVzc2FnZSk7XG4gICAgICAgIG1lc3NhZ2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICAgICAgb3BlbkNsaWVudE1vZGFsKCdjcmVhdGUnLCB1c2VyLnVpZCwgZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWVzc2FnZS5yZW1vdmUoKTtcbiAgICAgICAgYWN0aXZlQ2F0ZWdvcnlCdG4uY2xhc3NMaXN0LnJlbW92ZSgnY2xpZW50LWNhdGVnb3JpZXNfX2NhdGVnb3J5LS1hY3RpdmUnKTtcbiAgICAgICAgYWN0aXZlQ2F0ZWdvcnlCdG4gPSBpZEJ0bjtcbiAgICAgICAgYWN0aXZlQ2F0ZWdvcnlCdG4uY2xhc3NMaXN0LmFkZCgnY2xpZW50LWNhdGVnb3JpZXNfX2NhdGVnb3J5LS1hY3RpdmUnKTtcblxuICAgICAgICBPYmplY3QuZW50cmllcyhkYXRhKS5mb3JFYWNoKChbY2xpZW50SWQsIGNsaWVudERhdGFdKSA9PiB7XG4gICAgICAgICAgbmV3IENsaWVudCh1c2VyLnVpZCwgY2xpZW50TGlzdCwge1xuICAgICAgICAgICAgaWQ6IGNsaWVudElkLFxuICAgICAgICAgICAgbmFtZTogY2xpZW50RGF0YS5uYW1lLFxuICAgICAgICAgICAgc2Vjb25kTmFtZTogY2xpZW50RGF0YS5zZWNvbmROYW1lLFxuICAgICAgICAgICAgbGFzdE5hbWU6IGNsaWVudERhdGEubGFzdE5hbWUsXG4gICAgICAgICAgICBjb250YWN0czogY2xpZW50RGF0YS5jb250YWN0cyxcbiAgICAgICAgICAgIGNyZWF0aW9uRGF0ZTogY2xpZW50RGF0YS5jcmVhdGlvbkRhdGUsXG4gICAgICAgICAgICBsYXN0Q2hhbmdlOiBjbGllbnREYXRhLmxhc3RDaGFuZ2UsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBuZXdDbGllbnRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIGlkQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICBmdWxsTmFtZUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgY3JlYXRpb25EYXRlQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICBsYXN0Q2hhbmdlQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfSk7XG5cbiAgICBuZXdDbGllbnRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBldmVudCA9PiB7XG4gICAgICBvcGVuQ2xpZW50TW9kYWwoJ2NyZWF0ZScsIHVzZXIudWlkLCBkYXRhKTtcbiAgICB9KTtcblxuICAgIGlkQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgY2xpZW50TGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGFjdGl2ZUNhdGVnb3J5QnRuLmNsYXNzTGlzdC5yZW1vdmUoJ2NsaWVudC1jYXRlZ29yaWVzX19jYXRlZ29yeS0tYWN0aXZlJyk7XG4gICAgICBhY3RpdmVDYXRlZ29yeUJ0biA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgICBhY3RpdmVDYXRlZ29yeUJ0bi5jbGFzc0xpc3QuYWRkKCdjbGllbnQtY2F0ZWdvcmllc19fY2F0ZWdvcnktLWFjdGl2ZScpO1xuXG4gICAgICBPYmplY3QuZW50cmllcyhkYXRhKS5mb3JFYWNoKChbY2xpZW50SWQsIGNsaWVudERhdGFdKSA9PiB7XG4gICAgICAgIG5ldyBDbGllbnQodXNlci51aWQsIGNsaWVudExpc3QsIHtcbiAgICAgICAgICBpZDogY2xpZW50SWQsXG4gICAgICAgICAgbmFtZTogY2xpZW50RGF0YS5uYW1lLFxuICAgICAgICAgIHNlY29uZE5hbWU6IGNsaWVudERhdGEuc2Vjb25kTmFtZSxcbiAgICAgICAgICBsYXN0TmFtZTogY2xpZW50RGF0YS5sYXN0TmFtZSxcbiAgICAgICAgICBjb250YWN0czogY2xpZW50RGF0YS5jb250YWN0cyxcbiAgICAgICAgICBjcmVhdGlvbkRhdGU6IGNsaWVudERhdGEuY3JlYXRpb25EYXRlLFxuICAgICAgICAgIGxhc3RDaGFuZ2U6IGNsaWVudERhdGEubGFzdENoYW5nZSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGZ1bGxOYW1lQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgY2xpZW50TGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGFjdGl2ZUNhdGVnb3J5QnRuLmNsYXNzTGlzdC5yZW1vdmUoJ2NsaWVudC1jYXRlZ29yaWVzX19jYXRlZ29yeS0tYWN0aXZlJyk7XG4gICAgICBhY3RpdmVDYXRlZ29yeUJ0biA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgICBhY3RpdmVDYXRlZ29yeUJ0bi5jbGFzc0xpc3QuYWRkKCdjbGllbnQtY2F0ZWdvcmllc19fY2F0ZWdvcnktLWFjdGl2ZScpO1xuXG4gICAgICBPYmplY3QuZW50cmllcyhkYXRhKVxuICAgICAgLnNvcnQoKFssYV0sIFssYl0pID0+IHtcbiAgICAgICAgY29uc3QgZnVsbE5hbWVBID0gYS5uYW1lICsgYS5zZWNvbmROYW1lICsgKGEubGFzdE5hbWUgIT09ICdub3Qgc3BlY2lmaWVkJyA/IGEubGFzdE5hbWUgOiAnJyk7XG4gICAgICAgIGNvbnN0IGZ1bGxOYW1lQiA9IGIubmFtZSArIGIuc2Vjb25kTmFtZSArIChiLmxhc3ROYW1lICE9PSAnbm90IHNwZWNpZmllZCcgPyBiLmxhc3ROYW1lIDogJycpO1xuICAgICAgICByZXR1cm4gZnVsbE5hbWVBLmxvY2FsZUNvbXBhcmUoZnVsbE5hbWVCKTtcbiAgICAgIH0pXG4gICAgICAuZm9yRWFjaCgoW2NsaWVudElkLCBjbGllbnREYXRhXSkgPT4ge1xuICAgICAgICBuZXcgQ2xpZW50KHVzZXIudWlkLCBjbGllbnRMaXN0LCB7XG4gICAgICAgICAgaWQ6IGNsaWVudElkLFxuICAgICAgICAgIG5hbWU6IGNsaWVudERhdGEubmFtZSxcbiAgICAgICAgICBzZWNvbmROYW1lOiBjbGllbnREYXRhLnNlY29uZE5hbWUsXG4gICAgICAgICAgbGFzdE5hbWU6IGNsaWVudERhdGEubGFzdE5hbWUsXG4gICAgICAgICAgY29udGFjdHM6IGNsaWVudERhdGEuY29udGFjdHMsXG4gICAgICAgICAgY3JlYXRpb25EYXRlOiBjbGllbnREYXRhLmNyZWF0aW9uRGF0ZSxcbiAgICAgICAgICBsYXN0Q2hhbmdlOiBjbGllbnREYXRhLmxhc3RDaGFuZ2UsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBjcmVhdGlvbkRhdGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICBjbGllbnRMaXN0LmlubmVySFRNTCA9ICcnO1xuICAgICAgYWN0aXZlQ2F0ZWdvcnlCdG4uY2xhc3NMaXN0LnJlbW92ZSgnY2xpZW50LWNhdGVnb3JpZXNfX2NhdGVnb3J5LS1hY3RpdmUnKTtcbiAgICAgIGFjdGl2ZUNhdGVnb3J5QnRuID0gZXZlbnQuY3VycmVudFRhcmdldDtcbiAgICAgIGFjdGl2ZUNhdGVnb3J5QnRuLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1jYXRlZ29yaWVzX19jYXRlZ29yeS0tYWN0aXZlJyk7XG5cbiAgICAgIE9iamVjdC5lbnRyaWVzKGRhdGEpXG4gICAgICAuc29ydCgoWyxhXSwgWyxiXSkgPT4ge1xuICAgICAgICByZXR1cm4gYS5jcmVhdGlvbkRhdGUgLSBiLmNyZWF0aW9uRGF0ZTtcbiAgICAgIH0pXG4gICAgICAuZm9yRWFjaCgoW2NsaWVudElkLCBjbGllbnREYXRhXSkgPT4ge1xuICAgICAgICBuZXcgQ2xpZW50KHVzZXIudWlkLCBjbGllbnRMaXN0LCB7XG4gICAgICAgICAgaWQ6IGNsaWVudElkLFxuICAgICAgICAgIG5hbWU6IGNsaWVudERhdGEubmFtZSxcbiAgICAgICAgICBzZWNvbmROYW1lOiBjbGllbnREYXRhLnNlY29uZE5hbWUsXG4gICAgICAgICAgbGFzdE5hbWU6IGNsaWVudERhdGEubGFzdE5hbWUsXG4gICAgICAgICAgY29udGFjdHM6IGNsaWVudERhdGEuY29udGFjdHMsXG4gICAgICAgICAgY3JlYXRpb25EYXRlOiBjbGllbnREYXRhLmNyZWF0aW9uRGF0ZSxcbiAgICAgICAgICBsYXN0Q2hhbmdlOiBjbGllbnREYXRhLmxhc3RDaGFuZ2UsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBsYXN0Q2hhbmdlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgY2xpZW50TGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICAgIGFjdGl2ZUNhdGVnb3J5QnRuLmNsYXNzTGlzdC5yZW1vdmUoJ2NsaWVudC1jYXRlZ29yaWVzX19jYXRlZ29yeS0tYWN0aXZlJyk7XG4gICAgICBhY3RpdmVDYXRlZ29yeUJ0biA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgICBhY3RpdmVDYXRlZ29yeUJ0bi5jbGFzc0xpc3QuYWRkKCdjbGllbnQtY2F0ZWdvcmllc19fY2F0ZWdvcnktLWFjdGl2ZScpO1xuXG4gICAgICBPYmplY3QuZW50cmllcyhkYXRhKVxuICAgICAgLnNvcnQoKFssYV0sIFssYl0pID0+IHtcbiAgICAgICAgcmV0dXJuIGEubGFzdENoYW5nZSAtIGIubGFzdENoYW5nZTtcbiAgICAgIH0pXG4gICAgICAuZm9yRWFjaCgoW2NsaWVudElkLCBjbGllbnREYXRhXSkgPT4ge1xuICAgICAgICBuZXcgQ2xpZW50KHVzZXIudWlkLCBjbGllbnRMaXN0LCB7XG4gICAgICAgICAgaWQ6IGNsaWVudElkLFxuICAgICAgICAgIG5hbWU6IGNsaWVudERhdGEubmFtZSxcbiAgICAgICAgICBzZWNvbmROYW1lOiBjbGllbnREYXRhLnNlY29uZE5hbWUsXG4gICAgICAgICAgbGFzdE5hbWU6IGNsaWVudERhdGEubGFzdE5hbWUsXG4gICAgICAgICAgY29udGFjdHM6IGNsaWVudERhdGEuY29udGFjdHMsXG4gICAgICAgICAgY3JlYXRpb25EYXRlOiBjbGllbnREYXRhLmNyZWF0aW9uRGF0ZSxcbiAgICAgICAgICBsYXN0Q2hhbmdlOiBjbGllbnREYXRhLmxhc3RDaGFuZ2UsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLi9yZWdpc3Rlci5odG1sJztcbiAgfVxufSk7XG4iXSwiZmlsZSI6ImNybS9jcm0uanMifQ==
