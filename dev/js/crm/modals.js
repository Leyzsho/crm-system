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
    if (Contact.count >= 10) {
      contactBtn.classList.add('client-modal__contact-btn--hidden');
    }
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
      if (Contact.count >= 10) {
        contactBtn.classList.add('client-modal__contact-btn--hidden');
      }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcm0vbW9kYWxzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG9ubHlMZXR0ZXJzLCBwbGFjZWhvbGRlciwgd2l0aG91dFNwYWNlIH0gZnJvbSAnLi4vdXRpbHMvaW5wdXQuanMnO1xyXG5pbXBvcnQgeyBkZWxldGVDbGllbnQsIHdyaXRlQ2xpZW50RGF0YSwgdXBkYXRlQ2xpZW50RGF0YSB9IGZyb20gJy4vZmlyZWJhc2UtYXBpLmpzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBvcGVuQ2xpZW50TW9kYWwod2F5LCB1c2VySWQsIGRhdGEpIHtcclxuICBjbGFzcyBDb250YWN0IHtcclxuICAgIHN0YXRpYyBjb3VudCA9IDA7XHJcbiAgICBzdGF0aWMgaW5wdXRzID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGxpc3QsIHtuYW1lSW5wdXQsIHNlY29uZE5hbWVJbnB1dCwgY29uZmlybUJ0bn0sIHtzdGFydFR5cGUsIGlucHV0VmFsdWV9KSB7XHJcbiAgICAgIHRoaXMubGlzdCA9IGxpc3Q7XHJcbiAgICAgIHRoaXMubmFtZUlucHV0ID0gbmFtZUlucHV0O1xyXG4gICAgICB0aGlzLnNlY29uZE5hbWVJbnB1dCA9IHNlY29uZE5hbWVJbnB1dDtcclxuICAgICAgdGhpcy5jb25maXJtQnRuID0gY29uZmlybUJ0bjtcclxuICAgICAgdGhpcy5zdGFydFR5cGUgPSBzdGFydFR5cGU7XHJcbiAgICAgIHRoaXMuaW5wdXRWYWx1ZSA9IGlucHV0VmFsdWU7XHJcblxyXG4gICAgICBDb250YWN0LmNvdW50Kys7XHJcbiAgICAgIHRoaXMuY3JlYXRlQ29udGFjdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpbnB1dHNIYXZlQ29udGVudCgpIHtcclxuICAgICAgY29uc3QgYWxsVmFsdWVzTm90RW1wdHkgPSBDb250YWN0LmlucHV0cy5ldmVyeShpbnB1dCA9PiBpbnB1dC52YWx1ZSAhPT0gJycpO1xyXG5cclxuICAgICAgaWYgKCFhbGxWYWx1ZXNOb3RFbXB0eSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcign0KMg0LrQsNC60LjRhS3RgtC+INC60L7QvdGC0LDQutGC0L7QsiDQvdC10YIg0LfQvdCw0YfQtdC90LjRjy4nKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUNvbnRhY3QoKSB7XHJcbiAgICAgIHRoaXMuY29udGFjdEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG4gICAgICB0aGlzLmNvbnRhY3RTZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcclxuICAgICAgdGhpcy5jb250YWN0SW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgICB0aGlzLmNvbnRhY3REZWxldGVCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuXHJcbiAgICAgIHRoaXMucGhvbmVPcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgdGhpcy5lbWFpbE9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICB0aGlzLnZrT3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgIHRoaXMuZmFjZWJvb2tPcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgdGhpcy5vdGhlck9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG5cclxuICAgICAgdGhpcy5jb250YWN0SXRlbS5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2NvbnRhY3QtaXRlbScpO1xyXG4gICAgICB0aGlzLmNvbnRhY3RTZWxlY3QuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LXNlbGVjdCcpO1xyXG4gICAgICB0aGlzLmNvbnRhY3RJbnB1dC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2NvbnRhY3QtaW5wdXQnKTtcclxuICAgICAgdGhpcy5jb250YWN0RGVsZXRlQnRuLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fY29udGFjdC1kZWxldGUtYnRuJyk7XHJcblxyXG4gICAgICB0aGlzLnBob25lT3B0aW9uLnZhbHVlID0gJ3Bob25lJztcclxuICAgICAgdGhpcy5waG9uZU9wdGlvbi50ZXh0Q29udGVudCA9ICfRgtC10LvQtdGE0L7QvSc7XHJcbiAgICAgIHRoaXMuZW1haWxPcHRpb24udmFsdWUgPSAnZW1haWwnO1xyXG4gICAgICB0aGlzLmVtYWlsT3B0aW9uLnRleHRDb250ZW50ID0gJ2VtYWlsJztcclxuICAgICAgdGhpcy52a09wdGlvbi52YWx1ZSA9ICd2ayc7XHJcbiAgICAgIHRoaXMudmtPcHRpb24udGV4dENvbnRlbnQgPSAndmsnO1xyXG4gICAgICB0aGlzLmZhY2Vib29rT3B0aW9uLnZhbHVlID0gJ2ZhY2Vib29rJztcclxuICAgICAgdGhpcy5mYWNlYm9va09wdGlvbi50ZXh0Q29udGVudCA9ICdmYWNlYm9vayc7XHJcbiAgICAgIHRoaXMub3RoZXJPcHRpb24udmFsdWUgPSAnb3RoZXInO1xyXG4gICAgICB0aGlzLm90aGVyT3B0aW9uLnRleHRDb250ZW50ID0gJ9C00YDRg9Cz0L7QtSc7XHJcbiAgICAgIHRoaXMuY29udGFjdFNlbGVjdC5hcHBlbmQodGhpcy5waG9uZU9wdGlvbik7XHJcbiAgICAgIHRoaXMuY29udGFjdFNlbGVjdC5hcHBlbmQodGhpcy5lbWFpbE9wdGlvbik7XHJcbiAgICAgIHRoaXMuY29udGFjdFNlbGVjdC5hcHBlbmQodGhpcy52a09wdGlvbik7XHJcbiAgICAgIHRoaXMuY29udGFjdFNlbGVjdC5hcHBlbmQodGhpcy5mYWNlYm9va09wdGlvbik7XHJcbiAgICAgIHRoaXMuY29udGFjdFNlbGVjdC5hcHBlbmQodGhpcy5vdGhlck9wdGlvbik7XHJcbiAgICAgIHRoaXMuY29udGFjdEl0ZW0uYXBwZW5kKHRoaXMuY29udGFjdFNlbGVjdCk7XHJcbiAgICAgIHRoaXMuY29udGFjdEl0ZW0uYXBwZW5kKHRoaXMuY29udGFjdElucHV0KTtcclxuICAgICAgdGhpcy5jb250YWN0SXRlbS5hcHBlbmQodGhpcy5jb250YWN0RGVsZXRlQnRuKTtcclxuICAgICAgdGhpcy5saXN0LmFwcGVuZCh0aGlzLmNvbnRhY3RJdGVtKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLnN0YXJ0VHlwZS5pbmNsdWRlcygncGhvbmUnKSkge1xyXG4gICAgICAgIHRoaXMuY29udGFjdFNlbGVjdC52YWx1ZSA9IHRoaXMucGhvbmVPcHRpb24udmFsdWU7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGFydFR5cGUuaW5jbHVkZXMoJ2VtYWlsJykpIHtcclxuICAgICAgICB0aGlzLmNvbnRhY3RTZWxlY3QudmFsdWUgPSB0aGlzLmVtYWlsT3B0aW9uLnZhbHVlO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhcnRUeXBlLmluY2x1ZGVzKCdmYWNlYm9vaycpKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWN0U2VsZWN0LnZhbHVlID0gdGhpcy5mYWNlYm9va09wdGlvbi52YWx1ZTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXJ0VHlwZS5pbmNsdWRlcygndmsnKSkge1xyXG4gICAgICAgIHRoaXMuY29udGFjdFNlbGVjdC52YWx1ZSA9IHRoaXMudmtPcHRpb24udmFsdWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jb250YWN0U2VsZWN0LnZhbHVlID0gdGhpcy5vdGhlck9wdGlvbi52YWx1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jb250YWN0SW5wdXQuZGF0YXNldC50eXBlID0gdGhpcy5jb250YWN0U2VsZWN0LnZhbHVlO1xyXG4gICAgICB0aGlzLmNvbnRhY3RJbnB1dC52YWx1ZSA9IHRoaXMuaW5wdXRWYWx1ZTtcclxuXHJcbiAgICAgIHRoaXMuY2hhbmdlUGxhY2Vob2xkZXIoKTtcclxuXHJcbiAgICAgIENvbnRhY3QuaW5wdXRzLnB1c2godGhpcy5jb250YWN0SW5wdXQpO1xyXG5cclxuICAgICAgdGhpcy5jb250YWN0RGVsZXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgICAgIHRoaXMuZGVsZXRlQ29udGFjdCgpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuY29udGFjdFNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBldmVudCA9PiB7XHJcbiAgICAgICAgdGhpcy5jb250YWN0SW5wdXQuZGF0YXNldC50eXBlID0gZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZTtcclxuICAgICAgICB0aGlzLmNoYW5nZVBsYWNlaG9sZGVyKCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgbmV3IENob2ljZXModGhpcy5jb250YWN0U2VsZWN0LCB7XHJcbiAgICAgICAgc2VhcmNoRW5hYmxlZDogZmFsc2UsXHJcbiAgICAgICAgaXRlbVNlbGVjdFRleHQ6ICcnLFxyXG4gICAgICAgIHBvc2l0aW9uOiAnYm90dG9tJyxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlQ29udGFjdCgpIHtcclxuICAgICAgY29uc3QgaW5kZXggPSBDb250YWN0LmlucHV0cy5pbmRleE9mKHRoaXMuY29udGFjdElucHV0KTtcclxuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgQ29udGFjdC5pbnB1dHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY2hlY2tJbnB1dHNDb250ZW50KHRoaXMubmFtZUlucHV0LCB0aGlzLnNlY29uZE5hbWVJbnB1dCwgdGhpcy5jb25maXJtQnRuKTtcclxuXHJcbiAgICAgIENvbnRhY3QuY291bnQtLTtcclxuICAgICAgaWYgKENvbnRhY3QuY291bnQgPT09IDApIHtcclxuICAgICAgICB0aGlzLmxpc3QucmVtb3ZlKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoQ29udGFjdC5jb3VudCA+PSA5KSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NyZWF0ZS1jb250YWN0JykuY2xhc3NMaXN0LnJlbW92ZSgnY2xpZW50LW1vZGFsX19jb250YWN0LWJ0bi0taGlkZGVuJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY29udGFjdEl0ZW0ucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlUGxhY2Vob2xkZXIoKSB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRhY3RJbnB1dC5kYXRhc2V0LnR5cGUgPT09ICdwaG9uZScpIHtcclxuICAgICAgICB0aGlzLmNvbnRhY3RJbnB1dC5wbGFjZWhvbGRlciA9ICcrNzkyMjExMTA1MDAnO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY29udGFjdElucHV0LmRhdGFzZXQudHlwZSA9PT0gJ2VtYWlsJykge1xyXG4gICAgICAgIHRoaXMuY29udGFjdElucHV0LnBsYWNlaG9sZGVyID0gJ2V4YW1wbGVAbWFpbC5jb20nO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY29udGFjdElucHV0LmRhdGFzZXQudHlwZSA9PT0gJ3ZrJykge1xyXG4gICAgICAgIHRoaXMuY29udGFjdElucHV0LnBsYWNlaG9sZGVyID0gJ0B2ay5jb20vdmsnO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY29udGFjdElucHV0LmRhdGFzZXQudHlwZSA9PT0gJ2ZhY2Vib29rJykge1xyXG4gICAgICAgIHRoaXMuY29udGFjdElucHV0LnBsYWNlaG9sZGVyID0gJ0BmYWNlYm9vayc7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jb250YWN0SW5wdXQuZGF0YXNldC50eXBlID09PSAnb3RoZXInKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWN0SW5wdXQucGxhY2Vob2xkZXIgPSAnJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY2hlY2tJbnB1dHNDb250ZW50KG5hbWVJbnB1dCwgc2Vjb25kTmFtZUlucHV0LCBjb25maXJtQnRuKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBDb250YWN0LmlucHV0c0hhdmVDb250ZW50KCk7XHJcbiAgICAgIGlmIChuYW1lSW5wdXQudmFsdWUgIT09ICcnICYmIHNlY29uZE5hbWVJbnB1dC52YWx1ZSAhPT0gJycpIHtcclxuICAgICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29uc3QgZGFya0JhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBjb25zdCBjbG9zZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgY29uc3QgdGl0bGVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XHJcbiAgY29uc3QgY2xpZW50SWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgY29uc3QgbmFtZUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcclxuICBjb25zdCBzZWNvbmROYW1lTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xyXG4gIGNvbnN0IGxhc3ROYW1lTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xyXG4gIGNvbnN0IG5hbWVJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgY29uc3Qgc2Vjb25kTmFtZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICBjb25zdCBsYXN0TmFtZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICBjb25zdCBjb250YWN0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgY29uc3QgY29udGFjdExpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xyXG4gIGNvbnN0IGNvbnRhY3RCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICBjb25zdCBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gIGNvbnN0IGNvbmZpcm1CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICBjb25zdCBjYW5jZWxCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuXHJcbiAgZGFya0JhY2tncm91bmQuY2xhc3NMaXN0LmFkZCgnZGFyay1iYWNrZ3JvdW5kJyk7XHJcbiAgY2xvc2VCdG4uY2xhc3NMaXN0LmFkZCgnY2xvc2UtbW9kYWwtYnRuJyk7XHJcbiAgbW9kYWwuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsJyk7XHJcbiAgdGl0bGVDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX190aXRsZS1jb250YWluZXInKTtcclxuICB0aXRsZS5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX3RpdGxlJyk7XHJcbiAgY2xpZW50SWQuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19pZCcpO1xyXG4gIG5hbWVMYWJlbC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2xhYmVsJyk7XHJcbiAgc2Vjb25kTmFtZUxhYmVsLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fbGFiZWwnKTtcclxuICBsYXN0TmFtZUxhYmVsLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fbGFiZWwnKTtcclxuICBuYW1lSW5wdXQuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19pbnB1dCcpO1xyXG4gIHNlY29uZE5hbWVJbnB1dC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2lucHV0Jyk7XHJcbiAgbGFzdE5hbWVJbnB1dC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2lucHV0Jyk7XHJcbiAgY29udGFjdENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2NvbnRhY3QtY29udGFpbmVyJyk7XHJcbiAgY29udGFjdExpc3QuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LWxpc3QnKTtcclxuICBjb250YWN0QnRuLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fY29udGFjdC1idG4nKTtcclxuICBjb25maXJtQnRuLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fYnRuJyk7XHJcbiAgY2FuY2VsQnRuLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fZGVzY3ItYnRuJyk7XHJcblxyXG4gIGNvbnRhY3RCdG4uaWQgPSAnY3JlYXRlLWNvbnRhY3QnO1xyXG5cclxuICBuYW1lSW5wdXQudHlwZSA9ICd0ZXh0JztcclxuICBzZWNvbmROYW1lSW5wdXQudHlwZSA9ICd0ZXh0JztcclxuICBsYXN0TmFtZUlucHV0LnR5cGUgPSAndGV4dCc7XHJcbiAgY29udGFjdEJ0bi50ZXh0Q29udGVudCA9ICfQlNC+0LHQsNCy0LjRgtGMINC60L7QvdGC0LDQutGCJztcclxuICBjb250YWN0QnRuLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xyXG5cclxuICB0aXRsZUNvbnRhaW5lci5hcHBlbmQodGl0bGUpO1xyXG4gIG5hbWVMYWJlbC5hcHBlbmQobmFtZUlucHV0KTtcclxuICBzZWNvbmROYW1lTGFiZWwuYXBwZW5kKHNlY29uZE5hbWVJbnB1dCk7XHJcbiAgbGFzdE5hbWVMYWJlbC5hcHBlbmQobGFzdE5hbWVJbnB1dCk7O1xyXG4gIGNvbnRhY3RDb250YWluZXIuYXBwZW5kKGNvbnRhY3RCdG4pO1xyXG4gIG1vZGFsLmFwcGVuZChjbG9zZUJ0bik7XHJcbiAgbW9kYWwuYXBwZW5kKHRpdGxlQ29udGFpbmVyKTtcclxuICBtb2RhbC5hcHBlbmQoc2Vjb25kTmFtZUxhYmVsKTtcclxuICBtb2RhbC5hcHBlbmQobmFtZUxhYmVsKTtcclxuICBtb2RhbC5hcHBlbmQobGFzdE5hbWVMYWJlbCk7XHJcbiAgbW9kYWwuYXBwZW5kKGNvbnRhY3RDb250YWluZXIpO1xyXG4gIG1vZGFsLmFwcGVuZChtZXNzYWdlKTtcclxuICBtb2RhbC5hcHBlbmQoY29uZmlybUJ0bik7XHJcbiAgbW9kYWwuYXBwZW5kKGNhbmNlbEJ0bik7XHJcblxyXG4gIG1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xyXG4gICAgd2l0aG91dFNwYWNlKGV2ZW50LnRhcmdldCk7XHJcbiAgICBpZiAoIWV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2NsaWVudC1tb2RhbF9fY29udGFjdC1pbnB1dCcpKSB7XHJcbiAgICAgIG9ubHlMZXR0ZXJzKGV2ZW50LnRhcmdldCk7XHJcbiAgICB9XHJcbiAgICBjaGVja0lucHV0c0NvbnRlbnQobmFtZUlucHV0LCBzZWNvbmROYW1lSW5wdXQsIGNvbmZpcm1CdG4pO1xyXG4gIH0pO1xyXG5cclxuICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcclxuICAgIG1vZGFsLnJlbW92ZSgpO1xyXG4gICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XHJcbiAgfSk7XHJcblxyXG4gIGNvbnRhY3RCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICBjb250YWN0Q29udGFpbmVyLnByZXBlbmQoY29udGFjdExpc3QpO1xyXG4gICAgbmV3IENvbnRhY3QoY29udGFjdExpc3QsIHtuYW1lSW5wdXQsIHNlY29uZE5hbWVJbnB1dCwgY29uZmlybUJ0bn0sIHtzdGFydFR5cGU6ICdwaG9uZScsIGlucHV0VmFsdWU6ICcnfSk7XHJcbiAgICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgIGlmIChDb250YWN0LmNvdW50ID49IDEwKSB7XHJcbiAgICAgIGNvbnRhY3RCdG4uY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LWJ0bi0taGlkZGVuJyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGlmICh3YXkgPT09ICdjcmVhdGUnKSB7XHJcbiAgICB0aXRsZS50ZXh0Q29udGVudCA9ICfQndC+0LLRi9C5INC60LvQuNC10L3Rgic7XHJcbiAgICBjb25maXJtQnRuLnRleHRDb250ZW50ID0gJ9Ch0L7RhdGA0LDQvdC40YLRjCc7XHJcbiAgICBjYW5jZWxCdG4udGV4dENvbnRlbnQgPSAn0J7RgtC80LXQvdCwJztcclxuXHJcbiAgICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuXHJcbiAgICBjYW5jZWxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcbiAgICAgIG1vZGFsLnJlbW92ZSgpO1xyXG4gICAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbmZpcm1CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBldmVudCA9PiB7XHJcbiAgICAgIGNvbnN0IGxvYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgZXZlbnQuY3VycmVudFRhcmdldC5hcHBlbmQobG9hZGVyKTtcclxuXHJcbiAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICBuYW1lSW5wdXQuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICBzZWNvbmROYW1lSW5wdXQuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICBsYXN0TmFtZUlucHV0LmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgQ29udGFjdC5pbnB1dHMuZm9yRWFjaChpbnB1dCA9PiBpbnB1dC5kaXNhYmxlZCA9IHRydWUpO1xyXG4gICAgICBjbG9zZUJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgIGNhbmNlbEJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcblxyXG4gICAgICB3cml0ZUNsaWVudERhdGEodXNlcklkLCB7XHJcbiAgICAgICAgbmFtZVZhbHVlOiBuYW1lSW5wdXQudmFsdWUsXHJcbiAgICAgICAgc2Vjb25kTmFtZVZhbHVlOiBzZWNvbmROYW1lSW5wdXQudmFsdWUsXHJcbiAgICAgICAgbGFzdE5hbWVWYWx1ZTogbGFzdE5hbWVJbnB1dC52YWx1ZSxcclxuICAgICAgICBjb250YWN0c0FycmF5OiBDb250YWN0LmlucHV0cyxcclxuICAgICAgfSlcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIG1vZGFsLnJlbW92ZSgpO1xyXG4gICAgICAgIGRhcmtCYWNrZ3JvdW5kLnJlbW92ZSgpO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goKCkgPT4ge1xyXG4gICAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnbWVzc2FnZScpO1xyXG4gICAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcclxuICAgICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9Cn0YLQvi3RgtC+INC/0L7RiNC70L4g0L3QtSDRgtCw0LouLi4nO1xyXG4gICAgICAgIGxvYWRlci5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgZXZlbnQuY3VycmVudFRhcmdldC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIG5hbWVJbnB1dC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHNlY29uZE5hbWVJbnB1dC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIGxhc3ROYW1lSW5wdXQuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICBjbG9zZUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIGNhbmNlbEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIENvbnRhY3QuaW5wdXRzLmZvckVhY2goaW5wdXQgPT4gaW5wdXQuZGlzYWJsZWQgPSBmYWxzZSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSBlbHNlIGlmICh3YXkgPT09ICdjaGFuZ2UnKSB7XHJcbiAgICBpZiAoZGF0YSA9PT0gbnVsbCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9CU0LDQvdC90L7Qs9C+INC60LvQuNC10L3RgtCwINC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xpZW50SWQudGV4dENvbnRlbnQgPSBgSUQ6ICR7ZGF0YS5pZH1gO1xyXG4gICAgdGl0bGVDb250YWluZXIuYXBwZW5kKGNsaWVudElkKTtcclxuXHJcbiAgICB0aXRsZS50ZXh0Q29udGVudCA9ICfQmNC30LzQtdC90LjRgtGMINC00LDQvdC90YvQtSc7XHJcbiAgICBjb25maXJtQnRuLnRleHRDb250ZW50ID0gJ9Ch0L7RhdGA0LDQvdC40YLRjCc7XHJcbiAgICBjYW5jZWxCdG4udGV4dENvbnRlbnQgPSAn0KPQtNCw0LvQuNGC0Ywg0LrQu9C40LXQvdGC0LAnO1xyXG4gICAgbmFtZUlucHV0LnZhbHVlID0gZGF0YS5uYW1lO1xyXG4gICAgc2Vjb25kTmFtZUlucHV0LnZhbHVlID0gZGF0YS5zZWNvbmROYW1lO1xyXG4gICAgbGFzdE5hbWVJbnB1dC52YWx1ZSA9IGRhdGEubGFzdE5hbWUgIT09ICdub3Qgc3BlY2lmaWVkJyA/IGRhdGEubGFzdE5hbWUgOiAnJztcclxuXHJcbiAgICBpZiAoZGF0YS5jb250YWN0cykge1xyXG4gICAgICBPYmplY3QuZW50cmllcyhkYXRhLmNvbnRhY3RzKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcclxuICAgICAgICBjb250YWN0Q29udGFpbmVyLnByZXBlbmQoY29udGFjdExpc3QpO1xyXG4gICAgICAgIG5ldyBDb250YWN0KGNvbnRhY3RMaXN0LCB7bmFtZUlucHV0LCBzZWNvbmROYW1lSW5wdXQsIGNvbmZpcm1CdG59LCB7c3RhcnRUeXBlOiBrZXksIGlucHV0VmFsdWU6IHZhbHVlfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBpZiAoQ29udGFjdC5jb3VudCA+PSAxMCkge1xyXG4gICAgICAgIGNvbnRhY3RCdG4uY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LWJ0bi0taGlkZGVuJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjYW5jZWxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAgZXZlbnQgPT4ge1xyXG4gICAgICBtb2RhbC5yZW1vdmUoKTtcclxuICAgICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XHJcbiAgICAgIG9wZW5EZWxldGVDbGllbnQodXNlcklkLCBkYXRhLmlkKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbmZpcm1CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBldmVudCA9PiB7XHJcbiAgICAgIGNvbnN0IGxvYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgZXZlbnQuY3VycmVudFRhcmdldC5hcHBlbmQobG9hZGVyKTtcclxuXHJcbiAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICBuYW1lSW5wdXQuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICBzZWNvbmROYW1lSW5wdXQuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICBsYXN0TmFtZUlucHV0LmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgQ29udGFjdC5pbnB1dHMuZm9yRWFjaChpbnB1dCA9PiBpbnB1dC5kaXNhYmxlZCA9IHRydWUpO1xyXG4gICAgICBjbG9zZUJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgIGNhbmNlbEJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcblxyXG4gICAgICB1cGRhdGVDbGllbnREYXRhKHVzZXJJZCwgZGF0YS5pZCwge1xyXG4gICAgICAgIG5hbWVWYWx1ZTogbmFtZUlucHV0LnZhbHVlLFxyXG4gICAgICAgIHNlY29uZE5hbWVWYWx1ZTogc2Vjb25kTmFtZUlucHV0LnZhbHVlLFxyXG4gICAgICAgIGxhc3ROYW1lVmFsdWU6IGxhc3ROYW1lSW5wdXQudmFsdWUsXHJcbiAgICAgICAgY29udGFjdHNBcnJheTogQ29udGFjdC5pbnB1dHMsXHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICBtb2RhbC5yZW1vdmUoKTtcclxuICAgICAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKCgpID0+IHtcclxuICAgICAgICBtZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ21lc3NhZ2UnKTtcclxuICAgICAgICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XHJcbiAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQp9GC0L4t0YLQviDQv9C+0YjQu9C+INC90LUg0YLQsNC6Li4uJztcclxuICAgICAgICBsb2FkZXIucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICBuYW1lSW5wdXQuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICBzZWNvbmROYW1lSW5wdXQuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICBsYXN0TmFtZUlucHV0LmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgY2xvc2VCdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICBjYW5jZWxCdG4uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICBDb250YWN0LmlucHV0cy5mb3JFYWNoKGlucHV0ID0+IGlucHV0LmRpc2FibGVkID0gZmFsc2UpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZGFya0JhY2tncm91bmQpO1xyXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKG1vZGFsKTtcclxuXHJcbiAgcGxhY2Vob2xkZXIoc2Vjb25kTmFtZUlucHV0LCAn0KTQsNC80LjQu9C40Y8qJyk7XHJcbiAgcGxhY2Vob2xkZXIobmFtZUlucHV0LCAn0JjQvNGPKicpO1xyXG4gIHBsYWNlaG9sZGVyKGxhc3ROYW1lSW5wdXQsICfQntGC0YfQtdGB0YLQstC+Jyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBvcGVuRGVsZXRlQ2xpZW50KHVzZXJJZCwgY2xpZW50SWQpIHtcclxuICBjb25zdCBkYXJrQmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xyXG4gIGNvbnN0IGRlc2NyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gIGNvbnN0IGNsb3NlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgY29uc3QgZGVsZXRlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgY29uc3QgY2FuY2VsQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcblxyXG4gIGRhcmtCYWNrZ3JvdW5kLmNsYXNzTGlzdC5hZGQoJ2RhcmstYmFja2dyb3VuZCcpO1xyXG4gIG1vZGFsLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbCcpO1xyXG4gIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fdGl0bGUnKTtcclxuICBkZXNjci5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2Rlc2NyJyk7XHJcbiAgY2xvc2VCdG4uY2xhc3NMaXN0LmFkZCgnY2xvc2UtbW9kYWwtYnRuJyk7XHJcbiAgZGVsZXRlQnRuLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fYnRuJyk7XHJcbiAgY2FuY2VsQnRuLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fZGVzY3ItYnRuJyk7XHJcblxyXG4gIHRpdGxlLnRleHRDb250ZW50ID0gJ9Cj0LTQsNC70LjRgtGMINC60LvQuNC10L3RgtCwJztcclxuICBkZXNjci50ZXh0Q29udGVudCA9ICfQktGLINC00LXQudGB0YLQstC40YLQtdC70YzQvdC+INGF0L7RgtC40YLQtSDRg9C00LDQu9C40YLRjCDQtNCw0L3QvdC+0LPQviDQutC70LjQtdC90YLQsD8nO1xyXG4gIGRlbGV0ZUJ0bi50ZXh0Q29udGVudCA9ICfQo9C00LDQu9C40YLRjCc7XHJcbiAgY2FuY2VsQnRuLnRleHRDb250ZW50ID0gJ9Ce0YLQvNC10L3QsCc7XHJcblxyXG4gIG1vZGFsLmFwcGVuZChjbG9zZUJ0bik7XHJcbiAgbW9kYWwuYXBwZW5kKHRpdGxlKTtcclxuICBtb2RhbC5hcHBlbmQoZGVzY3IpO1xyXG4gIG1vZGFsLmFwcGVuZChkZWxldGVCdG4pO1xyXG4gIG1vZGFsLmFwcGVuZChjYW5jZWxCdG4pO1xyXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGRhcmtCYWNrZ3JvdW5kKTtcclxuICBkb2N1bWVudC5ib2R5LmFwcGVuZChtb2RhbCk7XHJcblxyXG4gIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgbW9kYWwucmVtb3ZlKCk7XHJcbiAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcclxuICB9KTtcclxuXHJcbiAgY2FuY2VsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgbW9kYWwucmVtb3ZlKCk7XHJcbiAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcclxuICB9KTtcclxuXHJcbiAgZGVsZXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgY29uc3QgbG9hZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgZGVsZXRlQnRuLmFwcGVuZChsb2FkZXIpO1xyXG5cclxuICAgIGNsb3NlQnRuLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgIGNhbmNlbEJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICBkZWxldGVCdG4uZGlzYWJsZWQgPSB0cnVlO1xyXG5cclxuICAgICAgZGVsZXRlQ2xpZW50KHVzZXJJZCwgY2xpZW50SWQpXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICBtb2RhbC5yZW1vdmUoKTtcclxuICAgICAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICBsb2FkZXIucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIGNsb3NlQnRuLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgY2FuY2VsQnRuLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgZGVsZXRlQnRuLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG4gIH0pO1xyXG59XHJcbiJdLCJmaWxlIjoiY3JtL21vZGFscy5qcyJ9
