import { onlyLetters, placeholder, withoutSpace } from '../utils/input.js';
import { deleteClient, writeClientData, updateClientData } from './firebase-api.js';

export function openClientModal(way, userId, data) {
  class Contact {
    static count = 0;
    static inputs = [];

    constructor (list, {nameInput, secondNameInput, confirmBtn}, {startType, inputValue}) {
      this.list = list;
      this.nameInput = nameInput;
      this.secondNameInput = secondNameInput;
      this.confirmBtn = confirmBtn;
      this.startType = startType;
      this.inputValue = inputValue;

      Contact.count++;
      this.createContact();

      if (Contact.count >= 10) {
        document.getElementById('create-contact').classList.add('client-modal__contact-btn--hidden');
      }
    }

    static inputsHaveContent() {
      const allValuesNotEmpty = Contact.inputs.every(input => input.value !== '');

      if (!allValuesNotEmpty) {
        throw new Error('У каких-то контактов нет значения.');
      }
    }

    createContact() {
      this.contactItem = document.createElement('li');
      this.contactSelect = document.createElement('select');
      this.contactInput = document.createElement('input');
      this.contactDeleteBtn = document.createElement('button');

      this.phoneOption = document.createElement('option');
      this.emailOption = document.createElement('option');
      this.vkOption = document.createElement('option');
      this.facebookOption = document.createElement('option');
      this.otherOption = document.createElement('option');

      this.contactItem.classList.add('client-modal__contact-item');
      this.contactSelect.classList.add('client-modal__contact-select');
      this.contactInput.classList.add('client-modal__contact-input');
      this.contactDeleteBtn.classList.add('client-modal__contact-delete-btn');

      this.phoneOption.value = 'phone';
      this.phoneOption.textContent = 'телефон';
      this.emailOption.value = 'email';
      this.emailOption.textContent = 'email';
      this.vkOption.value = 'vk';
      this.vkOption.textContent = 'vk';
      this.facebookOption.value = 'facebook';
      this.facebookOption.textContent = 'facebook';
      this.otherOption.value = 'other';
      this.otherOption.textContent = 'другое';
      this.contactSelect.append(this.phoneOption);
      this.contactSelect.append(this.emailOption);
      this.contactSelect.append(this.vkOption);
      this.contactSelect.append(this.facebookOption);
      this.contactSelect.append(this.otherOption);
      this.contactItem.append(this.contactSelect);
      this.contactItem.append(this.contactInput);
      this.contactItem.append(this.contactDeleteBtn);
      this.list.append(this.contactItem);

      console.log(this.startType)

      if (this.startType.includes('phone')) {
        this.contactSelect.value = this.phoneOption.value;
      } else if (this.startType.includes('email')) {
        this.contactSelect.value = this.emailOption.value;
      } else if (this.startType.includes('facebook')) {
        this.contactSelect.value = this.facebookOption.value;
      } else if (this.startType.includes('vk')) {
        this.contactSelect.value = this.vkOption.value;
      } else {
        this.contactSelect.value = this.otherOption.value;
      }

      this.contactInput.dataset.type = this.contactSelect.value;
      this.contactInput.value = this.inputValue;

      this.changePlaceholder();

      Contact.inputs.push(this.contactInput);

      this.contactDeleteBtn.addEventListener('click', event => {
        this.deleteContact();
      });

      this.contactSelect.addEventListener('change', event => {
        this.contactInput.dataset.type = event.currentTarget.value;
        this.changePlaceholder();
      });

      new Choices(this.contactSelect, {
        searchEnabled: false,
        itemSelectText: '',
        position: 'bottom',
      });
    }

    deleteContact() {
      const index = Contact.inputs.indexOf(this.contactInput);
      if (index !== -1) {
          Contact.inputs.splice(index, 1);
      }

      checkInputsContent(this.nameInput, this.secondNameInput, this.confirmBtn);

      Contact.count--;
      if (Contact.count === 0) {
        this.list.remove();
      } else if (Contact.count >= 9) {
        document.getElementById('create-contact').classList.remove('client-modal__contact-btn--hidden');
      }

      this.contactItem.remove();
    }

    changePlaceholder() {
      if (this.contactInput.dataset.type === 'phone') {
        this.contactInput.placeholder = '+79221110500';
      } else if (this.contactInput.dataset.type === 'email') {
        this.contactInput.placeholder = 'example@mail.com';
      } else if (this.contactInput.dataset.type === 'vk') {
        this.contactInput.placeholder = '@vk.com/vk';
      } else if (this.contactInput.dataset.type === 'facebook') {
        this.contactInput.placeholder = '@facebook';
      } else if (this.contactInput.dataset.type === 'other') {
        this.contactInput.placeholder = '';
      }
    }
  }

  function checkInputsContent(nameInput, secondNameInput, confirmBtn) {
    try {
      Contact.inputsHaveContent();
      if (nameInput.value !== '' && secondNameInput.value !== '') {
        confirmBtn.disabled = false;
      } else {
        confirmBtn.disabled = true;
      }
    } catch (error) {
      confirmBtn.disabled = true;
    }
  }

  const darkBackground = document.createElement('div');
  const closeBtn = document.createElement('button');
  const modal = document.createElement('div');
  const titleContainer = document.createElement('div');
  const title = document.createElement('h2');
  const clientId = document.createElement('span');
  const nameLabel = document.createElement('label');
  const secondNameLabel = document.createElement('label');
  const lastNameLabel = document.createElement('label');
  const nameInput = document.createElement('input');
  const secondNameInput = document.createElement('input');
  const lastNameInput = document.createElement('input');
  const contactContainer = document.createElement('div');
  const contactList = document.createElement('ul');
  const contactBtn = document.createElement('button');
  const message = document.createElement('p');
  const confirmBtn = document.createElement('button');
  const cancelBtn = document.createElement('button');

  darkBackground.classList.add('dark-background');
  closeBtn.classList.add('close-modal-btn');
  modal.classList.add('client-modal');
  titleContainer.classList.add('client-modal__title-container');
  title.classList.add('client-modal__title');
  clientId.classList.add('client-modal__id');
  nameLabel.classList.add('client-modal__label');
  secondNameLabel.classList.add('client-modal__label');
  lastNameLabel.classList.add('client-modal__label');
  nameInput.classList.add('client-modal__input');
  secondNameInput.classList.add('client-modal__input');
  lastNameInput.classList.add('client-modal__input');
  contactContainer.classList.add('client-modal__contact-container');
  contactList.classList.add('client-modal__contact-list');
  contactBtn.classList.add('client-modal__contact-btn');
  confirmBtn.classList.add('client-modal__btn');
  cancelBtn.classList.add('client-modal__descr-btn');

  contactBtn.id = 'create-contact';

  nameInput.type = 'text';
  secondNameInput.type = 'text';
  lastNameInput.type = 'text';
  contactBtn.textContent = 'Добавить контакт';
  contactBtn.setAttribute('tabindex', '0');

  titleContainer.append(title);
  nameLabel.append(nameInput);
  secondNameLabel.append(secondNameInput);
  lastNameLabel.append(lastNameInput);;
  contactContainer.append(contactBtn);
  modal.append(closeBtn);
  modal.append(titleContainer);
  modal.append(secondNameLabel);
  modal.append(nameLabel);
  modal.append(lastNameLabel);
  modal.append(contactContainer);
  modal.append(message);
  modal.append(confirmBtn);
  modal.append(cancelBtn);

  modal.addEventListener('input', event => {
    withoutSpace(event.target);
    if (!event.target.classList.contains('client-modal__contact-input')) {
      onlyLetters(event.target);
    }
    checkInputsContent(nameInput, secondNameInput, confirmBtn);
  });

  closeBtn.addEventListener('click', event => {
    modal.remove();
    darkBackground.remove();
  });

  contactBtn.addEventListener('click', event => {
    contactContainer.prepend(contactList);
    new Contact(contactList, {nameInput, secondNameInput, confirmBtn}, {startType: 'phone', inputValue: ''});
    confirmBtn.disabled = true;
  });

  if (way === 'create') {
    title.textContent = 'Новый клиент';
    confirmBtn.textContent = 'Сохранить';
    cancelBtn.textContent = 'Отмена';

    confirmBtn.disabled = true;

    cancelBtn.addEventListener('click', event => {
      modal.remove();
      darkBackground.remove();
    });

    confirmBtn.addEventListener('click', async event => {
      const loader = document.createElement('span');
      event.currentTarget.append(loader);

      event.currentTarget.disabled = true;
      nameInput.disabled = true;
      secondNameInput.disabled = true;
      lastNameInput.disabled = true;
      Contact.inputs.forEach(input => input.disabled = true);
      closeBtn.disabled = true;
      cancelBtn.disabled = true;

      writeClientData(userId, {
        nameValue: nameInput.value,
        secondNameValue: secondNameInput.value,
        lastNameValue: lastNameInput.value,
        contactsArray: Contact.inputs,
      })
      .then(() => {
        modal.remove();
        darkBackground.remove();
      })
      .catch(() => {
        message.classList.remove('message');
        message.classList.add('error');
        message.textContent = 'Что-то пошло не так...';
        loader.remove();

        event.currentTarget.disabled = false;
        nameInput.disabled = false;
        secondNameInput.disabled = false;
        lastNameInput.disabled = false;
        closeBtn.disabled = false;
        cancelBtn.disabled = false;
        Contact.inputs.forEach(input => input.disabled = false);
      });
    });
  } else if (way === 'change') {
    if (data === null) {
      throw new Error('Данного клиента не существует.');
    }

    clientId.textContent = `ID: ${data.id}`;
    titleContainer.append(clientId);

    title.textContent = 'Изменить данные';
    confirmBtn.textContent = 'Сохранить';
    cancelBtn.textContent = 'Удалить клиента';
    nameInput.value = data.name;
    secondNameInput.value = data.secondName;
    lastNameInput.value = data.lastName !== 'not specified' ? data.lastName : '';

    if (data.contacts) {
      Object.entries(data.contacts).forEach(([key, value]) => {
        contactContainer.prepend(contactList);
        new Contact(contactList, {nameInput, secondNameInput, confirmBtn}, {startType: key, inputValue: value});
      });
    }

    cancelBtn.addEventListener('click',  event => {
      modal.remove();
      darkBackground.remove();
      openDeleteClient(userId, data.id);
    });

    confirmBtn.addEventListener('click', async event => {
      const loader = document.createElement('span');
      event.currentTarget.append(loader);

      event.currentTarget.disabled = true;
      nameInput.disabled = true;
      secondNameInput.disabled = true;
      lastNameInput.disabled = true;
      Contact.inputs.forEach(input => input.disabled = true);
      closeBtn.disabled = true;
      cancelBtn.disabled = true;

      updateClientData(userId, data.id, {
        nameValue: nameInput.value,
        secondNameValue: secondNameInput.value,
        lastNameValue: lastNameInput.value,
        contactsArray: Contact.inputs,
      })
      .then(() => {
        modal.remove();
        darkBackground.remove();
      })
      .catch(() => {
        message.classList.remove('message');
        message.classList.add('error');
        message.textContent = 'Что-то пошло не так...';
        loader.remove();

        event.currentTarget.disabled = false;
        nameInput.disabled = false;
        secondNameInput.disabled = false;
        lastNameInput.disabled = false;
        closeBtn.disabled = false;
        cancelBtn.disabled = false;
        Contact.inputs.forEach(input => input.disabled = false);
      });
    });
  }

  document.body.append(darkBackground);
  document.body.append(modal);

  placeholder(secondNameInput, 'Фамилия*');
  placeholder(nameInput, 'Имя*');
  placeholder(lastNameInput, 'Отчество');
}

export function openDeleteClient(userId, clientId) {
  const darkBackground = document.createElement('div');
  const modal = document.createElement('div');
  const title = document.createElement('h2');
  const descr = document.createElement('p');
  const closeBtn = document.createElement('button');
  const deleteBtn = document.createElement('button');
  const cancelBtn = document.createElement('button');

  darkBackground.classList.add('dark-background');
  modal.classList.add('client-modal');
  title.classList.add('client-modal__title');
  descr.classList.add('client-modal__descr');
  closeBtn.classList.add('close-modal-btn');
  deleteBtn.classList.add('client-modal__btn');
  cancelBtn.classList.add('client-modal__descr-btn');

  title.textContent = 'Удалить клиента';
  descr.textContent = 'Вы действительно хотите удалить данного клиента?';
  deleteBtn.textContent = 'Удалить';
  cancelBtn.textContent = 'Отмена';

  modal.append(closeBtn);
  modal.append(title);
  modal.append(descr);
  modal.append(deleteBtn);
  modal.append(cancelBtn);
  document.body.append(darkBackground);
  document.body.append(modal);

  closeBtn.addEventListener('click', event => {
    modal.remove();
    darkBackground.remove();
  });

  cancelBtn.addEventListener('click', event => {
    modal.remove();
    darkBackground.remove();
  });

  deleteBtn.addEventListener('click', event => {
    const loader = document.createElement('span');
    deleteBtn.append(loader);

    closeBtn.disabled = true;
    cancelBtn.disabled = true;
    deleteBtn.disabled = true;

      deleteClient(userId, clientId)
      .then(() => {
        modal.remove();
        darkBackground.remove();
      })
      .catch((error) => {
        console.log(error);
        loader.remove();

        closeBtn.disabled = false;
        cancelBtn.disabled = false;
        deleteBtn.disabled = false;
      });
  });
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcm0vbW9kYWxzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG9ubHlMZXR0ZXJzLCBwbGFjZWhvbGRlciwgd2l0aG91dFNwYWNlIH0gZnJvbSAnLi4vdXRpbHMvaW5wdXQuanMnO1xuaW1wb3J0IHsgZGVsZXRlQ2xpZW50LCB3cml0ZUNsaWVudERhdGEsIHVwZGF0ZUNsaWVudERhdGEgfSBmcm9tICcuL2ZpcmViYXNlLWFwaS5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuQ2xpZW50TW9kYWwod2F5LCB1c2VySWQsIGRhdGEpIHtcbiAgY2xhc3MgQ29udGFjdCB7XG4gICAgc3RhdGljIGNvdW50ID0gMDtcbiAgICBzdGF0aWMgaW5wdXRzID0gW107XG5cbiAgICBjb25zdHJ1Y3RvciAobGlzdCwge25hbWVJbnB1dCwgc2Vjb25kTmFtZUlucHV0LCBjb25maXJtQnRufSwge3N0YXJ0VHlwZSwgaW5wdXRWYWx1ZX0pIHtcbiAgICAgIHRoaXMubGlzdCA9IGxpc3Q7XG4gICAgICB0aGlzLm5hbWVJbnB1dCA9IG5hbWVJbnB1dDtcbiAgICAgIHRoaXMuc2Vjb25kTmFtZUlucHV0ID0gc2Vjb25kTmFtZUlucHV0O1xuICAgICAgdGhpcy5jb25maXJtQnRuID0gY29uZmlybUJ0bjtcbiAgICAgIHRoaXMuc3RhcnRUeXBlID0gc3RhcnRUeXBlO1xuICAgICAgdGhpcy5pbnB1dFZhbHVlID0gaW5wdXRWYWx1ZTtcblxuICAgICAgQ29udGFjdC5jb3VudCsrO1xuICAgICAgdGhpcy5jcmVhdGVDb250YWN0KCk7XG5cbiAgICAgIGlmIChDb250YWN0LmNvdW50ID49IDEwKSB7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjcmVhdGUtY29udGFjdCcpLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fY29udGFjdC1idG4tLWhpZGRlbicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBpbnB1dHNIYXZlQ29udGVudCgpIHtcbiAgICAgIGNvbnN0IGFsbFZhbHVlc05vdEVtcHR5ID0gQ29udGFjdC5pbnB1dHMuZXZlcnkoaW5wdXQgPT4gaW5wdXQudmFsdWUgIT09ICcnKTtcblxuICAgICAgaWYgKCFhbGxWYWx1ZXNOb3RFbXB0eSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ9CjINC60LDQutC40YUt0YLQviDQutC+0L3RgtCw0LrRgtC+0LIg0L3QtdGCINC30L3QsNGH0LXQvdC40Y8uJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlQ29udGFjdCgpIHtcbiAgICAgIHRoaXMuY29udGFjdEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgdGhpcy5jb250YWN0U2VsZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG4gICAgICB0aGlzLmNvbnRhY3RJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICB0aGlzLmNvbnRhY3REZWxldGVCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblxuICAgICAgdGhpcy5waG9uZU9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgdGhpcy5lbWFpbE9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgdGhpcy52a09wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgdGhpcy5mYWNlYm9va09wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgdGhpcy5vdGhlck9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuXG4gICAgICB0aGlzLmNvbnRhY3RJdGVtLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fY29udGFjdC1pdGVtJyk7XG4gICAgICB0aGlzLmNvbnRhY3RTZWxlY3QuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LXNlbGVjdCcpO1xuICAgICAgdGhpcy5jb250YWN0SW5wdXQuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LWlucHV0Jyk7XG4gICAgICB0aGlzLmNvbnRhY3REZWxldGVCdG4uY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LWRlbGV0ZS1idG4nKTtcblxuICAgICAgdGhpcy5waG9uZU9wdGlvbi52YWx1ZSA9ICdwaG9uZSc7XG4gICAgICB0aGlzLnBob25lT3B0aW9uLnRleHRDb250ZW50ID0gJ9GC0LXQu9C10YTQvtC9JztcbiAgICAgIHRoaXMuZW1haWxPcHRpb24udmFsdWUgPSAnZW1haWwnO1xuICAgICAgdGhpcy5lbWFpbE9wdGlvbi50ZXh0Q29udGVudCA9ICdlbWFpbCc7XG4gICAgICB0aGlzLnZrT3B0aW9uLnZhbHVlID0gJ3ZrJztcbiAgICAgIHRoaXMudmtPcHRpb24udGV4dENvbnRlbnQgPSAndmsnO1xuICAgICAgdGhpcy5mYWNlYm9va09wdGlvbi52YWx1ZSA9ICdmYWNlYm9vayc7XG4gICAgICB0aGlzLmZhY2Vib29rT3B0aW9uLnRleHRDb250ZW50ID0gJ2ZhY2Vib29rJztcbiAgICAgIHRoaXMub3RoZXJPcHRpb24udmFsdWUgPSAnb3RoZXInO1xuICAgICAgdGhpcy5vdGhlck9wdGlvbi50ZXh0Q29udGVudCA9ICfQtNGA0YPQs9C+0LUnO1xuICAgICAgdGhpcy5jb250YWN0U2VsZWN0LmFwcGVuZCh0aGlzLnBob25lT3B0aW9uKTtcbiAgICAgIHRoaXMuY29udGFjdFNlbGVjdC5hcHBlbmQodGhpcy5lbWFpbE9wdGlvbik7XG4gICAgICB0aGlzLmNvbnRhY3RTZWxlY3QuYXBwZW5kKHRoaXMudmtPcHRpb24pO1xuICAgICAgdGhpcy5jb250YWN0U2VsZWN0LmFwcGVuZCh0aGlzLmZhY2Vib29rT3B0aW9uKTtcbiAgICAgIHRoaXMuY29udGFjdFNlbGVjdC5hcHBlbmQodGhpcy5vdGhlck9wdGlvbik7XG4gICAgICB0aGlzLmNvbnRhY3RJdGVtLmFwcGVuZCh0aGlzLmNvbnRhY3RTZWxlY3QpO1xuICAgICAgdGhpcy5jb250YWN0SXRlbS5hcHBlbmQodGhpcy5jb250YWN0SW5wdXQpO1xuICAgICAgdGhpcy5jb250YWN0SXRlbS5hcHBlbmQodGhpcy5jb250YWN0RGVsZXRlQnRuKTtcbiAgICAgIHRoaXMubGlzdC5hcHBlbmQodGhpcy5jb250YWN0SXRlbSk7XG5cbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhcnRUeXBlKVxuXG4gICAgICBpZiAodGhpcy5zdGFydFR5cGUuaW5jbHVkZXMoJ3Bob25lJykpIHtcbiAgICAgICAgdGhpcy5jb250YWN0U2VsZWN0LnZhbHVlID0gdGhpcy5waG9uZU9wdGlvbi52YWx1ZTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGFydFR5cGUuaW5jbHVkZXMoJ2VtYWlsJykpIHtcbiAgICAgICAgdGhpcy5jb250YWN0U2VsZWN0LnZhbHVlID0gdGhpcy5lbWFpbE9wdGlvbi52YWx1ZTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGFydFR5cGUuaW5jbHVkZXMoJ2ZhY2Vib29rJykpIHtcbiAgICAgICAgdGhpcy5jb250YWN0U2VsZWN0LnZhbHVlID0gdGhpcy5mYWNlYm9va09wdGlvbi52YWx1ZTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGFydFR5cGUuaW5jbHVkZXMoJ3ZrJykpIHtcbiAgICAgICAgdGhpcy5jb250YWN0U2VsZWN0LnZhbHVlID0gdGhpcy52a09wdGlvbi52YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29udGFjdFNlbGVjdC52YWx1ZSA9IHRoaXMub3RoZXJPcHRpb24udmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY29udGFjdElucHV0LmRhdGFzZXQudHlwZSA9IHRoaXMuY29udGFjdFNlbGVjdC52YWx1ZTtcbiAgICAgIHRoaXMuY29udGFjdElucHV0LnZhbHVlID0gdGhpcy5pbnB1dFZhbHVlO1xuXG4gICAgICB0aGlzLmNoYW5nZVBsYWNlaG9sZGVyKCk7XG5cbiAgICAgIENvbnRhY3QuaW5wdXRzLnB1c2godGhpcy5jb250YWN0SW5wdXQpO1xuXG4gICAgICB0aGlzLmNvbnRhY3REZWxldGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICAgIHRoaXMuZGVsZXRlQ29udGFjdCgpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuY29udGFjdFNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBldmVudCA9PiB7XG4gICAgICAgIHRoaXMuY29udGFjdElucHV0LmRhdGFzZXQudHlwZSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWU7XG4gICAgICAgIHRoaXMuY2hhbmdlUGxhY2Vob2xkZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgQ2hvaWNlcyh0aGlzLmNvbnRhY3RTZWxlY3QsIHtcbiAgICAgICAgc2VhcmNoRW5hYmxlZDogZmFsc2UsXG4gICAgICAgIGl0ZW1TZWxlY3RUZXh0OiAnJyxcbiAgICAgICAgcG9zaXRpb246ICdib3R0b20nLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGVsZXRlQ29udGFjdCgpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gQ29udGFjdC5pbnB1dHMuaW5kZXhPZih0aGlzLmNvbnRhY3RJbnB1dCk7XG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgQ29udGFjdC5pbnB1dHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cblxuICAgICAgY2hlY2tJbnB1dHNDb250ZW50KHRoaXMubmFtZUlucHV0LCB0aGlzLnNlY29uZE5hbWVJbnB1dCwgdGhpcy5jb25maXJtQnRuKTtcblxuICAgICAgQ29udGFjdC5jb3VudC0tO1xuICAgICAgaWYgKENvbnRhY3QuY291bnQgPT09IDApIHtcbiAgICAgICAgdGhpcy5saXN0LnJlbW92ZSgpO1xuICAgICAgfSBlbHNlIGlmIChDb250YWN0LmNvdW50ID49IDkpIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NyZWF0ZS1jb250YWN0JykuY2xhc3NMaXN0LnJlbW92ZSgnY2xpZW50LW1vZGFsX19jb250YWN0LWJ0bi0taGlkZGVuJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY29udGFjdEl0ZW0ucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgY2hhbmdlUGxhY2Vob2xkZXIoKSB7XG4gICAgICBpZiAodGhpcy5jb250YWN0SW5wdXQuZGF0YXNldC50eXBlID09PSAncGhvbmUnKSB7XG4gICAgICAgIHRoaXMuY29udGFjdElucHV0LnBsYWNlaG9sZGVyID0gJys3OTIyMTExMDUwMCc7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY29udGFjdElucHV0LmRhdGFzZXQudHlwZSA9PT0gJ2VtYWlsJykge1xuICAgICAgICB0aGlzLmNvbnRhY3RJbnB1dC5wbGFjZWhvbGRlciA9ICdleGFtcGxlQG1haWwuY29tJztcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jb250YWN0SW5wdXQuZGF0YXNldC50eXBlID09PSAndmsnKSB7XG4gICAgICAgIHRoaXMuY29udGFjdElucHV0LnBsYWNlaG9sZGVyID0gJ0B2ay5jb20vdmsnO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbnRhY3RJbnB1dC5kYXRhc2V0LnR5cGUgPT09ICdmYWNlYm9vaycpIHtcbiAgICAgICAgdGhpcy5jb250YWN0SW5wdXQucGxhY2Vob2xkZXIgPSAnQGZhY2Vib29rJztcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jb250YWN0SW5wdXQuZGF0YXNldC50eXBlID09PSAnb3RoZXInKSB7XG4gICAgICAgIHRoaXMuY29udGFjdElucHV0LnBsYWNlaG9sZGVyID0gJyc7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2tJbnB1dHNDb250ZW50KG5hbWVJbnB1dCwgc2Vjb25kTmFtZUlucHV0LCBjb25maXJtQnRuKSB7XG4gICAgdHJ5IHtcbiAgICAgIENvbnRhY3QuaW5wdXRzSGF2ZUNvbnRlbnQoKTtcbiAgICAgIGlmIChuYW1lSW5wdXQudmFsdWUgIT09ICcnICYmIHNlY29uZE5hbWVJbnB1dC52YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGRhcmtCYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IGNsb3NlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IHRpdGxlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgY29uc3QgY2xpZW50SWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIGNvbnN0IG5hbWVMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gIGNvbnN0IHNlY29uZE5hbWVMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gIGNvbnN0IGxhc3ROYW1lTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICBjb25zdCBuYW1lSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICBjb25zdCBzZWNvbmROYW1lSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICBjb25zdCBsYXN0TmFtZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgY29uc3QgY29udGFjdENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCBjb250YWN0TGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gIGNvbnN0IGNvbnRhY3RCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgY29uc3QgY29uZmlybUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBjb25zdCBjYW5jZWxCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblxuICBkYXJrQmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCdkYXJrLWJhY2tncm91bmQnKTtcbiAgY2xvc2VCdG4uY2xhc3NMaXN0LmFkZCgnY2xvc2UtbW9kYWwtYnRuJyk7XG4gIG1vZGFsLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbCcpO1xuICB0aXRsZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX3RpdGxlLWNvbnRhaW5lcicpO1xuICB0aXRsZS5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX3RpdGxlJyk7XG4gIGNsaWVudElkLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9faWQnKTtcbiAgbmFtZUxhYmVsLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fbGFiZWwnKTtcbiAgc2Vjb25kTmFtZUxhYmVsLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fbGFiZWwnKTtcbiAgbGFzdE5hbWVMYWJlbC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2xhYmVsJyk7XG4gIG5hbWVJbnB1dC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2lucHV0Jyk7XG4gIHNlY29uZE5hbWVJbnB1dC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2lucHV0Jyk7XG4gIGxhc3ROYW1lSW5wdXQuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19pbnB1dCcpO1xuICBjb250YWN0Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fY29udGFjdC1jb250YWluZXInKTtcbiAgY29udGFjdExpc3QuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LWxpc3QnKTtcbiAgY29udGFjdEJ0bi5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2NvbnRhY3QtYnRuJyk7XG4gIGNvbmZpcm1CdG4uY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19idG4nKTtcbiAgY2FuY2VsQnRuLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fZGVzY3ItYnRuJyk7XG5cbiAgY29udGFjdEJ0bi5pZCA9ICdjcmVhdGUtY29udGFjdCc7XG5cbiAgbmFtZUlucHV0LnR5cGUgPSAndGV4dCc7XG4gIHNlY29uZE5hbWVJbnB1dC50eXBlID0gJ3RleHQnO1xuICBsYXN0TmFtZUlucHV0LnR5cGUgPSAndGV4dCc7XG4gIGNvbnRhY3RCdG4udGV4dENvbnRlbnQgPSAn0JTQvtCx0LDQstC40YLRjCDQutC+0L3RgtCw0LrRgic7XG4gIGNvbnRhY3RCdG4uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJyk7XG5cbiAgdGl0bGVDb250YWluZXIuYXBwZW5kKHRpdGxlKTtcbiAgbmFtZUxhYmVsLmFwcGVuZChuYW1lSW5wdXQpO1xuICBzZWNvbmROYW1lTGFiZWwuYXBwZW5kKHNlY29uZE5hbWVJbnB1dCk7XG4gIGxhc3ROYW1lTGFiZWwuYXBwZW5kKGxhc3ROYW1lSW5wdXQpOztcbiAgY29udGFjdENvbnRhaW5lci5hcHBlbmQoY29udGFjdEJ0bik7XG4gIG1vZGFsLmFwcGVuZChjbG9zZUJ0bik7XG4gIG1vZGFsLmFwcGVuZCh0aXRsZUNvbnRhaW5lcik7XG4gIG1vZGFsLmFwcGVuZChzZWNvbmROYW1lTGFiZWwpO1xuICBtb2RhbC5hcHBlbmQobmFtZUxhYmVsKTtcbiAgbW9kYWwuYXBwZW5kKGxhc3ROYW1lTGFiZWwpO1xuICBtb2RhbC5hcHBlbmQoY29udGFjdENvbnRhaW5lcik7XG4gIG1vZGFsLmFwcGVuZChtZXNzYWdlKTtcbiAgbW9kYWwuYXBwZW5kKGNvbmZpcm1CdG4pO1xuICBtb2RhbC5hcHBlbmQoY2FuY2VsQnRuKTtcblxuICBtb2RhbC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGV2ZW50ID0+IHtcbiAgICB3aXRob3V0U3BhY2UoZXZlbnQudGFyZ2V0KTtcbiAgICBpZiAoIWV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2NsaWVudC1tb2RhbF9fY29udGFjdC1pbnB1dCcpKSB7XG4gICAgICBvbmx5TGV0dGVycyhldmVudC50YXJnZXQpO1xuICAgIH1cbiAgICBjaGVja0lucHV0c0NvbnRlbnQobmFtZUlucHV0LCBzZWNvbmROYW1lSW5wdXQsIGNvbmZpcm1CdG4pO1xuICB9KTtcblxuICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcbiAgfSk7XG5cbiAgY29udGFjdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICBjb250YWN0Q29udGFpbmVyLnByZXBlbmQoY29udGFjdExpc3QpO1xuICAgIG5ldyBDb250YWN0KGNvbnRhY3RMaXN0LCB7bmFtZUlucHV0LCBzZWNvbmROYW1lSW5wdXQsIGNvbmZpcm1CdG59LCB7c3RhcnRUeXBlOiAncGhvbmUnLCBpbnB1dFZhbHVlOiAnJ30pO1xuICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuICB9KTtcblxuICBpZiAod2F5ID09PSAnY3JlYXRlJykge1xuICAgIHRpdGxlLnRleHRDb250ZW50ID0gJ9Cd0L7QstGL0Lkg0LrQu9C40LXQvdGCJztcbiAgICBjb25maXJtQnRuLnRleHRDb250ZW50ID0gJ9Ch0L7RhdGA0LDQvdC40YLRjCc7XG4gICAgY2FuY2VsQnRuLnRleHRDb250ZW50ID0gJ9Ce0YLQvNC10L3QsCc7XG5cbiAgICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcblxuICAgIGNhbmNlbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICAgIG1vZGFsLnJlbW92ZSgpO1xuICAgICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XG4gICAgfSk7XG5cbiAgICBjb25maXJtQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZXZlbnQgPT4ge1xuICAgICAgY29uc3QgbG9hZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgZXZlbnQuY3VycmVudFRhcmdldC5hcHBlbmQobG9hZGVyKTtcblxuICAgICAgZXZlbnQuY3VycmVudFRhcmdldC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBuYW1lSW5wdXQuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgc2Vjb25kTmFtZUlucHV0LmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIGxhc3ROYW1lSW5wdXQuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgQ29udGFjdC5pbnB1dHMuZm9yRWFjaChpbnB1dCA9PiBpbnB1dC5kaXNhYmxlZCA9IHRydWUpO1xuICAgICAgY2xvc2VCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgY2FuY2VsQnRuLmRpc2FibGVkID0gdHJ1ZTtcblxuICAgICAgd3JpdGVDbGllbnREYXRhKHVzZXJJZCwge1xuICAgICAgICBuYW1lVmFsdWU6IG5hbWVJbnB1dC52YWx1ZSxcbiAgICAgICAgc2Vjb25kTmFtZVZhbHVlOiBzZWNvbmROYW1lSW5wdXQudmFsdWUsXG4gICAgICAgIGxhc3ROYW1lVmFsdWU6IGxhc3ROYW1lSW5wdXQudmFsdWUsXG4gICAgICAgIGNvbnRhY3RzQXJyYXk6IENvbnRhY3QuaW5wdXRzLFxuICAgICAgfSlcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgbW9kYWwucmVtb3ZlKCk7XG4gICAgICAgIGRhcmtCYWNrZ3JvdW5kLnJlbW92ZSgpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnbWVzc2FnZScpO1xuICAgICAgICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG4gICAgICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAn0KfRgtC+LdGC0L4g0L/QvtGI0LvQviDQvdC1INGC0LDQui4uLic7XG4gICAgICAgIGxvYWRlci5yZW1vdmUoKTtcblxuICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0LmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIG5hbWVJbnB1dC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBzZWNvbmROYW1lSW5wdXQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgbGFzdE5hbWVJbnB1dC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBjbG9zZUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBjYW5jZWxCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgQ29udGFjdC5pbnB1dHMuZm9yRWFjaChpbnB1dCA9PiBpbnB1dC5kaXNhYmxlZCA9IGZhbHNlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKHdheSA9PT0gJ2NoYW5nZScpIHtcbiAgICBpZiAoZGF0YSA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQlNCw0L3QvdC+0LPQviDQutC70LjQtdC90YLQsCDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCLicpO1xuICAgIH1cblxuICAgIGNsaWVudElkLnRleHRDb250ZW50ID0gYElEOiAke2RhdGEuaWR9YDtcbiAgICB0aXRsZUNvbnRhaW5lci5hcHBlbmQoY2xpZW50SWQpO1xuXG4gICAgdGl0bGUudGV4dENvbnRlbnQgPSAn0JjQt9C80LXQvdC40YLRjCDQtNCw0L3QvdGL0LUnO1xuICAgIGNvbmZpcm1CdG4udGV4dENvbnRlbnQgPSAn0KHQvtGF0YDQsNC90LjRgtGMJztcbiAgICBjYW5jZWxCdG4udGV4dENvbnRlbnQgPSAn0KPQtNCw0LvQuNGC0Ywg0LrQu9C40LXQvdGC0LAnO1xuICAgIG5hbWVJbnB1dC52YWx1ZSA9IGRhdGEubmFtZTtcbiAgICBzZWNvbmROYW1lSW5wdXQudmFsdWUgPSBkYXRhLnNlY29uZE5hbWU7XG4gICAgbGFzdE5hbWVJbnB1dC52YWx1ZSA9IGRhdGEubGFzdE5hbWUgIT09ICdub3Qgc3BlY2lmaWVkJyA/IGRhdGEubGFzdE5hbWUgOiAnJztcblxuICAgIGlmIChkYXRhLmNvbnRhY3RzKSB7XG4gICAgICBPYmplY3QuZW50cmllcyhkYXRhLmNvbnRhY3RzKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgY29udGFjdENvbnRhaW5lci5wcmVwZW5kKGNvbnRhY3RMaXN0KTtcbiAgICAgICAgbmV3IENvbnRhY3QoY29udGFjdExpc3QsIHtuYW1lSW5wdXQsIHNlY29uZE5hbWVJbnB1dCwgY29uZmlybUJ0bn0sIHtzdGFydFR5cGU6IGtleSwgaW5wdXRWYWx1ZTogdmFsdWV9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNhbmNlbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICBldmVudCA9PiB7XG4gICAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICAgIGRhcmtCYWNrZ3JvdW5kLnJlbW92ZSgpO1xuICAgICAgb3BlbkRlbGV0ZUNsaWVudCh1c2VySWQsIGRhdGEuaWQpO1xuICAgIH0pO1xuXG4gICAgY29uZmlybUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGV2ZW50ID0+IHtcbiAgICAgIGNvbnN0IGxvYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQuYXBwZW5kKGxvYWRlcik7XG5cbiAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgbmFtZUlucHV0LmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHNlY29uZE5hbWVJbnB1dC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBsYXN0TmFtZUlucHV0LmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIENvbnRhY3QuaW5wdXRzLmZvckVhY2goaW5wdXQgPT4gaW5wdXQuZGlzYWJsZWQgPSB0cnVlKTtcbiAgICAgIGNsb3NlQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIGNhbmNlbEJ0bi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICAgIHVwZGF0ZUNsaWVudERhdGEodXNlcklkLCBkYXRhLmlkLCB7XG4gICAgICAgIG5hbWVWYWx1ZTogbmFtZUlucHV0LnZhbHVlLFxuICAgICAgICBzZWNvbmROYW1lVmFsdWU6IHNlY29uZE5hbWVJbnB1dC52YWx1ZSxcbiAgICAgICAgbGFzdE5hbWVWYWx1ZTogbGFzdE5hbWVJbnB1dC52YWx1ZSxcbiAgICAgICAgY29udGFjdHNBcnJheTogQ29udGFjdC5pbnB1dHMsXG4gICAgICB9KVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICAgICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgbWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdtZXNzYWdlJyk7XG4gICAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcbiAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQp9GC0L4t0YLQviDQv9C+0YjQu9C+INC90LUg0YLQsNC6Li4uJztcbiAgICAgICAgbG9hZGVyLnJlbW92ZSgpO1xuXG4gICAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgbmFtZUlucHV0LmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHNlY29uZE5hbWVJbnB1dC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBsYXN0TmFtZUlucHV0LmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIGNsb3NlQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIGNhbmNlbEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBDb250YWN0LmlucHV0cy5mb3JFYWNoKGlucHV0ID0+IGlucHV0LmRpc2FibGVkID0gZmFsc2UpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBkb2N1bWVudC5ib2R5LmFwcGVuZChkYXJrQmFja2dyb3VuZCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKG1vZGFsKTtcblxuICBwbGFjZWhvbGRlcihzZWNvbmROYW1lSW5wdXQsICfQpNCw0LzQuNC70LjRjyonKTtcbiAgcGxhY2Vob2xkZXIobmFtZUlucHV0LCAn0JjQvNGPKicpO1xuICBwbGFjZWhvbGRlcihsYXN0TmFtZUlucHV0LCAn0J7RgtGH0LXRgdGC0LLQvicpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3BlbkRlbGV0ZUNsaWVudCh1c2VySWQsIGNsaWVudElkKSB7XG4gIGNvbnN0IGRhcmtCYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgY29uc3QgZGVzY3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIGNvbnN0IGNsb3NlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IGRlbGV0ZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBjb25zdCBjYW5jZWxCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblxuICBkYXJrQmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCdkYXJrLWJhY2tncm91bmQnKTtcbiAgbW9kYWwuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsJyk7XG4gIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fdGl0bGUnKTtcbiAgZGVzY3IuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19kZXNjcicpO1xuICBjbG9zZUJ0bi5jbGFzc0xpc3QuYWRkKCdjbG9zZS1tb2RhbC1idG4nKTtcbiAgZGVsZXRlQnRuLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fYnRuJyk7XG4gIGNhbmNlbEJ0bi5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2Rlc2NyLWJ0bicpO1xuXG4gIHRpdGxlLnRleHRDb250ZW50ID0gJ9Cj0LTQsNC70LjRgtGMINC60LvQuNC10L3RgtCwJztcbiAgZGVzY3IudGV4dENvbnRlbnQgPSAn0JLRiyDQtNC10LnRgdGC0LLQuNGC0LXQu9GM0L3QviDRhdC+0YLQuNGC0LUg0YPQtNCw0LvQuNGC0Ywg0LTQsNC90L3QvtCz0L4g0LrQu9C40LXQvdGC0LA/JztcbiAgZGVsZXRlQnRuLnRleHRDb250ZW50ID0gJ9Cj0LTQsNC70LjRgtGMJztcbiAgY2FuY2VsQnRuLnRleHRDb250ZW50ID0gJ9Ce0YLQvNC10L3QsCc7XG5cbiAgbW9kYWwuYXBwZW5kKGNsb3NlQnRuKTtcbiAgbW9kYWwuYXBwZW5kKHRpdGxlKTtcbiAgbW9kYWwuYXBwZW5kKGRlc2NyKTtcbiAgbW9kYWwuYXBwZW5kKGRlbGV0ZUJ0bik7XG4gIG1vZGFsLmFwcGVuZChjYW5jZWxCdG4pO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChkYXJrQmFja2dyb3VuZCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKG1vZGFsKTtcblxuICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcbiAgfSk7XG5cbiAgY2FuY2VsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgIG1vZGFsLnJlbW92ZSgpO1xuICAgIGRhcmtCYWNrZ3JvdW5kLnJlbW92ZSgpO1xuICB9KTtcblxuICBkZWxldGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgY29uc3QgbG9hZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGRlbGV0ZUJ0bi5hcHBlbmQobG9hZGVyKTtcblxuICAgIGNsb3NlQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICBjYW5jZWxCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgIGRlbGV0ZUJ0bi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICAgIGRlbGV0ZUNsaWVudCh1c2VySWQsIGNsaWVudElkKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICAgICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIGxvYWRlci5yZW1vdmUoKTtcblxuICAgICAgICBjbG9zZUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBjYW5jZWxCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgZGVsZXRlQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICB9KTtcbiAgfSk7XG59XG4iXSwiZmlsZSI6ImNybS9tb2RhbHMuanMifQ==
