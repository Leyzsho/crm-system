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
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const use = document.createElementNS("http://www.w3.org/2000/svg", "use");

        contact.classList.add('client-list__contact');
        tooltip.classList.add('client-list__contact-tooltip');
        svg.classList.add('client-list__contact-svg');

        tooltip.textContent = value;

        if (type.includes('phone')) {
          use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#phone');
        } else if (type.includes('email')) {
          use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#email');
        } else if (type.includes('facebook')) {
          use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#facebook');
        } else if (type.includes('vk')) {
          use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#vk');
        } else {
          use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#other');
        }

        svg.append(use);
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

    deleteClientBtn.addEventListener('click', event => {
      openDeleteClient(this.userId, this.id)
    });
  }
}

onAuthStateChanged(auth, async (user) => {
  let data = null;
  const newClientBtn = document.querySelector('.new-client-btn');
  const clientList = document.getElementById('client-list');

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
    });

    newClientBtn.addEventListener('click', async event => {
      openClientModal('create', user.uid, data);
    });
  } else {
    window.location.href = './register.html';
  }
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcm0vY3JtLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhcHAgZnJvbSAnLi4vdXRpbHMvZmlyZWJhc2UtaW5pdC5qcyc7XG5pbXBvcnQgeyBnZXRBdXRoLCBvbkF1dGhTdGF0ZUNoYW5nZWQgfSBmcm9tICdodHRwczovL3d3dy5nc3RhdGljLmNvbS9maXJlYmFzZWpzLzkuMS4xL2ZpcmViYXNlLWF1dGguanMnO1xuaW1wb3J0IHsgZ2V0RGF0YWJhc2UsIHJlZiwgb25WYWx1ZSB9IGZyb20gJ2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2ZpcmViYXNlanMvOS4xLjEvZmlyZWJhc2UtZGF0YWJhc2UuanMnO1xuaW1wb3J0IHsgb3BlbkNsaWVudE1vZGFsLCBvcGVuRGVsZXRlQ2xpZW50IH0gZnJvbSAnLi9tb2RhbHMuanMnO1xuXG5jb25zdCBhdXRoID0gZ2V0QXV0aChhcHApO1xuY29uc3QgZGIgPSBnZXREYXRhYmFzZSgpO1xuXG5jbGFzcyBDbGllbnQge1xuICBjb25zdHJ1Y3Rvcih1c2VySWQsIGxpc3QsIHtpZCwgbmFtZSwgc2Vjb25kTmFtZSwgbGFzdE5hbWUsIGNvbnRhY3RzLCBjcmVhdGlvbkRhdGUsIGxhc3RDaGFuZ2V9KSB7XG4gICAgdGhpcy51c2VySWQgPSB1c2VySWQ7XG4gICAgdGhpcy5saXN0ID0gbGlzdDtcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnNlY29uZE5hbWUgPSBzZWNvbmROYW1lO1xuICAgIHRoaXMubGFzdE5hbWUgPSBsYXN0TmFtZTtcbiAgICB0aGlzLmNvbnRhY3RzID0gY29udGFjdHM7XG4gICAgdGhpcy5jcmVhdGlvbkRhdGUgPSBjcmVhdGlvbkRhdGU7XG4gICAgdGhpcy5sYXN0Q2hhbmdlID0gbGFzdENoYW5nZTtcbiAgICB0aGlzLmNyZWF0ZUNsaWVudCgpO1xuICB9XG5cbiAgc2V0IGNyZWF0aW9uRGF0ZShkYXRlVmFsdWUpIHtcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoZGF0ZVZhbHVlKTtcbiAgICBjb25zdCBkYXkgPSBTdHJpbmcoZGF0ZS5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgY29uc3QgbW9udGggPSBTdHJpbmcoZGF0ZS5nZXRNb250aCgpICsgMSkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuXG4gICAgY29uc3QgaG91cnMgPSBTdHJpbmcoZGF0ZS5nZXRIb3VycygpKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgIGNvbnN0IG1pbnV0ZXMgPSBTdHJpbmcoZGF0ZS5nZXRNaW51dGVzKCkpLnBhZFN0YXJ0KDIsICcwJyk7XG5cbiAgICB0aGlzLl9jcmVhdGlvbkRhdGUgPSBgJHtkYXl9LiR7bW9udGh9LiR7eWVhcn1gO1xuICAgIHRoaXMuX2NyZWF0aW9uVGltZSA9IGAke2hvdXJzfToke21pbnV0ZXN9YDtcbiAgfVxuXG4gIGdldCBjcmVhdGlvbkRhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNyZWF0aW9uRGF0ZTogdGhpcy5fY3JlYXRpb25EYXRlLFxuICAgICAgY3JlYXRpb25UaW1lOiB0aGlzLl9jcmVhdGlvblRpbWUsXG4gICAgfVxuICB9XG5cbiAgc2V0IGxhc3RDaGFuZ2UoZGF0ZVZhbHVlKSB7XG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGRhdGVWYWx1ZSk7XG4gICAgY29uc3QgZGF5ID0gU3RyaW5nKGRhdGUuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgIGNvbnN0IG1vbnRoID0gU3RyaW5nKGRhdGUuZ2V0TW9udGgoKSArIDEpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgY29uc3QgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcblxuICAgIGNvbnN0IGhvdXJzID0gU3RyaW5nKGRhdGUuZ2V0SG91cnMoKSkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICBjb25zdCBtaW51dGVzID0gU3RyaW5nKGRhdGUuZ2V0TWludXRlcygpKS5wYWRTdGFydCgyLCAnMCcpO1xuXG4gICAgdGhpcy5fbGFzdENoYW5nZURhdGUgPSBgJHtkYXl9LiR7bW9udGh9LiR7eWVhcn1gO1xuICAgIHRoaXMuX2xhc3RDaGFuZ2VUaW1lID0gYCR7aG91cnN9OiR7bWludXRlc31gO1xuICB9XG5cbiAgZ2V0IGxhc3RDaGFuZ2UoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhc3RDaGFuZ2VEYXRlOiB0aGlzLl9sYXN0Q2hhbmdlRGF0ZSxcbiAgICAgIGxhc3RDaGFuZ2VUaW1lOiB0aGlzLl9sYXN0Q2hhbmdlVGltZSxcbiAgICB9XG4gIH1cblxuICBjcmVhdGVDbGllbnQoKSB7XG4gICAgY29uc3QgY2xpZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBjb25zdCBpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb25zdCBmdWxsTmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb25zdCBjcmVhdGlvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IGNyZWF0aW9uRGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb25zdCBjcmVhdGlvblRpbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY29uc3QgbGFzdENoYW5nZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IGxhc3RDaGFuZ2VEYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNvbnN0IGxhc3RDaGFuZ2VUaW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNvbnN0IGNvbnRhY3RDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCBjaGFuZ2VDbGllbnRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBkZWxldGVDbGllbnRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblxuICAgIGNsaWVudC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbGlzdF9fY2xpZW50Jyk7XG4gICAgaWQuY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX2lkJyk7XG4gICAgZnVsbE5hbWUuY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX2Z1bGwtbmFtZScpO1xuICAgIGNyZWF0aW9uQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1saXN0X19kYXRlLWNvbnRhaW5lcicpO1xuICAgIGxhc3RDaGFuZ2VDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX2RhdGUtY29udGFpbmVyJyk7XG4gICAgY3JlYXRpb25EYXRlLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1saXN0X19kYXRlJyk7XG4gICAgY3JlYXRpb25UaW1lLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1saXN0X190aW1lJyk7XG4gICAgbGFzdENoYW5nZURhdGUuY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX2RhdGUnKTtcbiAgICBsYXN0Q2hhbmdlVGltZS5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbGlzdF9fdGltZScpO1xuICAgIGNvbnRhY3RDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX2NvbnRhY3QtY29udGFpbmVyJyk7XG4gICAgY2hhbmdlQ2xpZW50QnRuLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1saXN0X19idG4nLCAnY2xpZW50LWxpc3RfX2NoYW5nZS1idG4nKTtcbiAgICBkZWxldGVDbGllbnRCdG4uY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX2J0bicsICdjbGllbnQtbGlzdF9fZGVsZXRlLWJ0bicpO1xuXG4gICAgaWQudGV4dENvbnRlbnQgPSB0aGlzLmlkO1xuICAgIGZ1bGxOYW1lLnRleHRDb250ZW50ID0gYCR7dGhpcy5zZWNvbmROYW1lfSAke3RoaXMubmFtZX0gJHt0aGlzLmxhc3ROYW1lICE9PSAnbm90IHNwZWNpZmllZCcgPyB0aGlzLmxhc3ROYW1lIDogJyd9YDtcbiAgICBjcmVhdGlvbkRhdGUudGV4dENvbnRlbnQgPSB0aGlzLl9jcmVhdGlvbkRhdGU7XG4gICAgY3JlYXRpb25UaW1lLnRleHRDb250ZW50ID0gdGhpcy5fY3JlYXRpb25UaW1lO1xuICAgIGxhc3RDaGFuZ2VEYXRlLnRleHRDb250ZW50ID0gdGhpcy5fbGFzdENoYW5nZURhdGU7XG4gICAgbGFzdENoYW5nZVRpbWUudGV4dENvbnRlbnQgPSB0aGlzLl9sYXN0Q2hhbmdlVGltZTtcbiAgICBjaGFuZ2VDbGllbnRCdG4udGV4dENvbnRlbnQgPSAn0JjQt9C80LXQvdC40YLRjCc7XG4gICAgZGVsZXRlQ2xpZW50QnRuLnRleHRDb250ZW50ID0gJ9Cj0LTQsNC70LjRgtGMJztcblxuICAgIGNyZWF0aW9uQ29udGFpbmVyLmFwcGVuZChjcmVhdGlvbkRhdGUpO1xuICAgIGNyZWF0aW9uQ29udGFpbmVyLmFwcGVuZChjcmVhdGlvblRpbWUpO1xuICAgIGxhc3RDaGFuZ2VDb250YWluZXIuYXBwZW5kKGxhc3RDaGFuZ2VEYXRlKTtcbiAgICBsYXN0Q2hhbmdlQ29udGFpbmVyLmFwcGVuZChsYXN0Q2hhbmdlVGltZSk7XG4gICAgY2xpZW50LmFwcGVuZChpZCk7XG4gICAgY2xpZW50LmFwcGVuZChmdWxsTmFtZSk7XG4gICAgY2xpZW50LmFwcGVuZChjcmVhdGlvbkNvbnRhaW5lcik7XG4gICAgY2xpZW50LmFwcGVuZChsYXN0Q2hhbmdlQ29udGFpbmVyKTtcbiAgICBjbGllbnQuYXBwZW5kKGNvbnRhY3RDb250YWluZXIpO1xuICAgIGNsaWVudC5hcHBlbmQoY2hhbmdlQ2xpZW50QnRuKTtcbiAgICBjbGllbnQuYXBwZW5kKGRlbGV0ZUNsaWVudEJ0bik7XG4gICAgdGhpcy5saXN0LmFwcGVuZChjbGllbnQpO1xuXG4gICAgaWYgKHRoaXMuY29udGFjdHMpIHtcbiAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuY29udGFjdHMpLmZvckVhY2goKFt0eXBlLCB2YWx1ZV0pID0+IHtcbiAgICAgICAgY29uc3QgY29udGFjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjb25zdCB0b29sdGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwic3ZnXCIpO1xuICAgICAgICBjb25zdCB1c2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcInVzZVwiKTtcblxuICAgICAgICBjb250YWN0LmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1saXN0X19jb250YWN0Jyk7XG4gICAgICAgIHRvb2x0aXAuY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX2NvbnRhY3QtdG9vbHRpcCcpO1xuICAgICAgICBzdmcuY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX2NvbnRhY3Qtc3ZnJyk7XG5cbiAgICAgICAgdG9vbHRpcC50ZXh0Q29udGVudCA9IHZhbHVlO1xuXG4gICAgICAgIGlmICh0eXBlLmluY2x1ZGVzKCdwaG9uZScpKSB7XG4gICAgICAgICAgdXNlLnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgJ3hsaW5rOmhyZWYnLCAnI3Bob25lJyk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZS5pbmNsdWRlcygnZW1haWwnKSkge1xuICAgICAgICAgIHVzZS5zZXRBdHRyaWJ1dGVOUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycsICd4bGluazpocmVmJywgJyNlbWFpbCcpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUuaW5jbHVkZXMoJ2ZhY2Vib29rJykpIHtcbiAgICAgICAgICB1c2Uuc2V0QXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCAneGxpbms6aHJlZicsICcjZmFjZWJvb2snKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlLmluY2x1ZGVzKCd2aycpKSB7XG4gICAgICAgICAgdXNlLnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgJ3hsaW5rOmhyZWYnLCAnI3ZrJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdXNlLnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgJ3hsaW5rOmhyZWYnLCAnI290aGVyJyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcuYXBwZW5kKHVzZSk7XG4gICAgICAgIGNvbnRhY3QuYXBwZW5kKHRvb2x0aXApO1xuICAgICAgICBjb250YWN0LmFwcGVuZChzdmcpO1xuICAgICAgICBjb250YWN0Q29udGFpbmVyLmFwcGVuZChjb250YWN0KTtcblxuICAgICAgICB0b29sdGlwLnN0eWxlLmxlZnQgPSBgLSR7dG9vbHRpcC5vZmZzZXRXaWR0aCAvIDIgLSA3fXB4YDtcblxuICAgICAgICBzdmcuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIGV2ZW50ID0+IHtcbiAgICAgICAgICB0b29sdGlwLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1saXN0X19jb250YWN0LXRvb2x0aXAtLXNob3cnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc3ZnLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBldmVudCA9PiB7XG4gICAgICAgICAgdG9vbHRpcC5jbGFzc0xpc3QucmVtb3ZlKCdjbGllbnQtbGlzdF9fY29udGFjdC10b29sdGlwLS1zaG93Jyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGVsZXRlQ2xpZW50QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgb3BlbkRlbGV0ZUNsaWVudCh0aGlzLnVzZXJJZCwgdGhpcy5pZClcbiAgICB9KTtcbiAgfVxufVxuXG5vbkF1dGhTdGF0ZUNoYW5nZWQoYXV0aCwgYXN5bmMgKHVzZXIpID0+IHtcbiAgbGV0IGRhdGEgPSBudWxsO1xuICBjb25zdCBuZXdDbGllbnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LWNsaWVudC1idG4nKTtcbiAgY29uc3QgY2xpZW50TGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbGllbnQtbGlzdCcpO1xuXG4gIGlmICh1c2VyICYmIHVzZXIuZW1haWxWZXJpZmllZCkge1xuICAgIG9uVmFsdWUocmVmKGRiLCAoJ3VzZXJzLycgKyB1c2VyLnVpZCArICcvY2xpZW50cycpKSwgKHNuYXBzaG90KSA9PiB7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2xpZW50LWNvbnRhaW5lcl9fbG9hZGVyJykuY2xhc3NMaXN0LmFkZCgnY2xpZW50LWNvbnRhaW5lcl9fbG9hZGVyLS1oaWRkZW4nKTtcbiAgICAgIGNsaWVudExpc3QuaW5uZXJIVE1MID0gJyc7XG4gICAgICBkYXRhID0gc25hcHNob3QudmFsKCk7XG5cbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuXG4gICAgICBpZiAoZGF0YSA9PT0gbnVsbCB8fCBkYXRhLnF1YW50aXR5ID09PSAwKSB7XG4gICAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnY2xpZW50LWxpc3RfX21lc3NhZ2UnKTtcbiAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQlNC+0LHQsNCy0YzRgtC1INCy0LDRiNC10LPQviDQv9C10YDQstC+0LPQviDQutC70LjQtdC90YLQsCc7XG4gICAgICAgIGNsaWVudExpc3QuYXBwZW5kKG1lc3NhZ2UpO1xuICAgICAgICBtZXNzYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgICAgIG9wZW5DbGllbnRNb2RhbCgnY3JlYXRlJywgdXNlci51aWQsIGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1lc3NhZ2UucmVtb3ZlKCk7XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGRhdGEpLmZvckVhY2goKFtjbGllbnRJZCwgY2xpZW50RGF0YV0pID0+IHtcbiAgICAgICAgICAgbmV3IENsaWVudCh1c2VyLnVpZCwgY2xpZW50TGlzdCwge1xuICAgICAgICAgICAgaWQ6IGNsaWVudElkLFxuICAgICAgICAgICAgbmFtZTogY2xpZW50RGF0YS5uYW1lLFxuICAgICAgICAgICAgc2Vjb25kTmFtZTogY2xpZW50RGF0YS5zZWNvbmROYW1lLFxuICAgICAgICAgICAgbGFzdE5hbWU6IGNsaWVudERhdGEubGFzdE5hbWUsXG4gICAgICAgICAgICBjb250YWN0czogY2xpZW50RGF0YS5jb250YWN0cyxcbiAgICAgICAgICAgIGNyZWF0aW9uRGF0ZTogY2xpZW50RGF0YS5jcmVhdGlvbkRhdGUsXG4gICAgICAgICAgICBsYXN0Q2hhbmdlOiBjbGllbnREYXRhLmxhc3RDaGFuZ2UsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBuZXdDbGllbnRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9KTtcblxuICAgIG5ld0NsaWVudEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGV2ZW50ID0+IHtcbiAgICAgIG9wZW5DbGllbnRNb2RhbCgnY3JlYXRlJywgdXNlci51aWQsIGRhdGEpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy4vcmVnaXN0ZXIuaHRtbCc7XG4gIH1cbn0pO1xuIl0sImZpbGUiOiJjcm0vY3JtLmpzIn0=
