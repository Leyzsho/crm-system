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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcm0vbW9kYWxzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG9ubHlMZXR0ZXJzLCBwbGFjZWhvbGRlciwgd2l0aG91dFNwYWNlIH0gZnJvbSAnLi4vdXRpbHMvaW5wdXQuanMnO1xuaW1wb3J0IHsgZGVsZXRlQ2xpZW50LCB3cml0ZUNsaWVudERhdGEsIHVwZGF0ZUNsaWVudERhdGEgfSBmcm9tICcuL2ZpcmViYXNlLWFwaS5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuQ2xpZW50TW9kYWwod2F5LCB1c2VySWQsIGRhdGEpIHtcbiAgY2xhc3MgQ29udGFjdCB7XG4gICAgc3RhdGljIGNvdW50ID0gMDtcbiAgICBzdGF0aWMgaW5wdXRzID0gW107XG5cbiAgICBjb25zdHJ1Y3RvciAobGlzdCwge25hbWVJbnB1dCwgc2Vjb25kTmFtZUlucHV0LCBjb25maXJtQnRufSwge3N0YXJ0VHlwZSwgaW5wdXRWYWx1ZX0pIHtcbiAgICAgIHRoaXMubGlzdCA9IGxpc3Q7XG4gICAgICB0aGlzLm5hbWVJbnB1dCA9IG5hbWVJbnB1dDtcbiAgICAgIHRoaXMuc2Vjb25kTmFtZUlucHV0ID0gc2Vjb25kTmFtZUlucHV0O1xuICAgICAgdGhpcy5jb25maXJtQnRuID0gY29uZmlybUJ0bjtcbiAgICAgIHRoaXMuc3RhcnRUeXBlID0gc3RhcnRUeXBlO1xuICAgICAgdGhpcy5pbnB1dFZhbHVlID0gaW5wdXRWYWx1ZTtcblxuICAgICAgQ29udGFjdC5jb3VudCsrO1xuICAgICAgdGhpcy5jcmVhdGVDb250YWN0KCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGlucHV0c0hhdmVDb250ZW50KCkge1xuICAgICAgY29uc3QgYWxsVmFsdWVzTm90RW1wdHkgPSBDb250YWN0LmlucHV0cy5ldmVyeShpbnB1dCA9PiBpbnB1dC52YWx1ZSAhPT0gJycpO1xuXG4gICAgICBpZiAoIWFsbFZhbHVlc05vdEVtcHR5KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcign0KMg0LrQsNC60LjRhS3RgtC+INC60L7QvdGC0LDQutGC0L7QsiDQvdC10YIg0LfQvdCw0YfQtdC90LjRjy4nKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVDb250YWN0KCkge1xuICAgICAgdGhpcy5jb250YWN0SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICB0aGlzLmNvbnRhY3RTZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgICAgIHRoaXMuY29udGFjdElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgIHRoaXMuY29udGFjdERlbGV0ZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXG4gICAgICB0aGlzLnBob25lT3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICB0aGlzLmVtYWlsT3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICB0aGlzLnZrT3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICB0aGlzLmZhY2Vib29rT3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICB0aGlzLm90aGVyT3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG5cbiAgICAgIHRoaXMuY29udGFjdEl0ZW0uY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LWl0ZW0nKTtcbiAgICAgIHRoaXMuY29udGFjdFNlbGVjdC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2NvbnRhY3Qtc2VsZWN0Jyk7XG4gICAgICB0aGlzLmNvbnRhY3RJbnB1dC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2NvbnRhY3QtaW5wdXQnKTtcbiAgICAgIHRoaXMuY29udGFjdERlbGV0ZUJ0bi5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2NvbnRhY3QtZGVsZXRlLWJ0bicpO1xuXG4gICAgICB0aGlzLnBob25lT3B0aW9uLnZhbHVlID0gJ3Bob25lJztcbiAgICAgIHRoaXMucGhvbmVPcHRpb24udGV4dENvbnRlbnQgPSAn0YLQtdC70LXRhNC+0L0nO1xuICAgICAgdGhpcy5lbWFpbE9wdGlvbi52YWx1ZSA9ICdlbWFpbCc7XG4gICAgICB0aGlzLmVtYWlsT3B0aW9uLnRleHRDb250ZW50ID0gJ2VtYWlsJztcbiAgICAgIHRoaXMudmtPcHRpb24udmFsdWUgPSAndmsnO1xuICAgICAgdGhpcy52a09wdGlvbi50ZXh0Q29udGVudCA9ICd2ayc7XG4gICAgICB0aGlzLmZhY2Vib29rT3B0aW9uLnZhbHVlID0gJ2ZhY2Vib29rJztcbiAgICAgIHRoaXMuZmFjZWJvb2tPcHRpb24udGV4dENvbnRlbnQgPSAnZmFjZWJvb2snO1xuICAgICAgdGhpcy5vdGhlck9wdGlvbi52YWx1ZSA9ICdvdGhlcic7XG4gICAgICB0aGlzLm90aGVyT3B0aW9uLnRleHRDb250ZW50ID0gJ9C00YDRg9Cz0L7QtSc7XG4gICAgICB0aGlzLmNvbnRhY3RTZWxlY3QuYXBwZW5kKHRoaXMucGhvbmVPcHRpb24pO1xuICAgICAgdGhpcy5jb250YWN0U2VsZWN0LmFwcGVuZCh0aGlzLmVtYWlsT3B0aW9uKTtcbiAgICAgIHRoaXMuY29udGFjdFNlbGVjdC5hcHBlbmQodGhpcy52a09wdGlvbik7XG4gICAgICB0aGlzLmNvbnRhY3RTZWxlY3QuYXBwZW5kKHRoaXMuZmFjZWJvb2tPcHRpb24pO1xuICAgICAgdGhpcy5jb250YWN0U2VsZWN0LmFwcGVuZCh0aGlzLm90aGVyT3B0aW9uKTtcbiAgICAgIHRoaXMuY29udGFjdEl0ZW0uYXBwZW5kKHRoaXMuY29udGFjdFNlbGVjdCk7XG4gICAgICB0aGlzLmNvbnRhY3RJdGVtLmFwcGVuZCh0aGlzLmNvbnRhY3RJbnB1dCk7XG4gICAgICB0aGlzLmNvbnRhY3RJdGVtLmFwcGVuZCh0aGlzLmNvbnRhY3REZWxldGVCdG4pO1xuICAgICAgdGhpcy5saXN0LmFwcGVuZCh0aGlzLmNvbnRhY3RJdGVtKTtcblxuICAgICAgaWYgKHRoaXMuc3RhcnRUeXBlLmluY2x1ZGVzKCdwaG9uZScpKSB7XG4gICAgICAgIHRoaXMuY29udGFjdFNlbGVjdC52YWx1ZSA9IHRoaXMucGhvbmVPcHRpb24udmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhcnRUeXBlLmluY2x1ZGVzKCdlbWFpbCcpKSB7XG4gICAgICAgIHRoaXMuY29udGFjdFNlbGVjdC52YWx1ZSA9IHRoaXMuZW1haWxPcHRpb24udmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhcnRUeXBlLmluY2x1ZGVzKCdmYWNlYm9vaycpKSB7XG4gICAgICAgIHRoaXMuY29udGFjdFNlbGVjdC52YWx1ZSA9IHRoaXMuZmFjZWJvb2tPcHRpb24udmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhcnRUeXBlLmluY2x1ZGVzKCd2aycpKSB7XG4gICAgICAgIHRoaXMuY29udGFjdFNlbGVjdC52YWx1ZSA9IHRoaXMudmtPcHRpb24udmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbnRhY3RTZWxlY3QudmFsdWUgPSB0aGlzLm90aGVyT3B0aW9uLnZhbHVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbnRhY3RJbnB1dC5kYXRhc2V0LnR5cGUgPSB0aGlzLmNvbnRhY3RTZWxlY3QudmFsdWU7XG4gICAgICB0aGlzLmNvbnRhY3RJbnB1dC52YWx1ZSA9IHRoaXMuaW5wdXRWYWx1ZTtcblxuICAgICAgdGhpcy5jaGFuZ2VQbGFjZWhvbGRlcigpO1xuXG4gICAgICBDb250YWN0LmlucHV0cy5wdXNoKHRoaXMuY29udGFjdElucHV0KTtcblxuICAgICAgdGhpcy5jb250YWN0RGVsZXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgICB0aGlzLmRlbGV0ZUNvbnRhY3QoKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmNvbnRhY3RTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZXZlbnQgPT4ge1xuICAgICAgICB0aGlzLmNvbnRhY3RJbnB1dC5kYXRhc2V0LnR5cGUgPSBldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlO1xuICAgICAgICB0aGlzLmNoYW5nZVBsYWNlaG9sZGVyKCk7XG4gICAgICB9KTtcblxuICAgICAgbmV3IENob2ljZXModGhpcy5jb250YWN0U2VsZWN0LCB7XG4gICAgICAgIHNlYXJjaEVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICBpdGVtU2VsZWN0VGV4dDogJycsXG4gICAgICAgIHBvc2l0aW9uOiAnYm90dG9tJyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGRlbGV0ZUNvbnRhY3QoKSB7XG4gICAgICBjb25zdCBpbmRleCA9IENvbnRhY3QuaW5wdXRzLmluZGV4T2YodGhpcy5jb250YWN0SW5wdXQpO1xuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgIENvbnRhY3QuaW5wdXRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG5cbiAgICAgIGNoZWNrSW5wdXRzQ29udGVudCh0aGlzLm5hbWVJbnB1dCwgdGhpcy5zZWNvbmROYW1lSW5wdXQsIHRoaXMuY29uZmlybUJ0bik7XG5cbiAgICAgIENvbnRhY3QuY291bnQtLTtcbiAgICAgIGlmIChDb250YWN0LmNvdW50ID09PSAwKSB7XG4gICAgICAgIHRoaXMubGlzdC5yZW1vdmUoKTtcbiAgICAgIH0gZWxzZSBpZiAoQ29udGFjdC5jb3VudCA+PSA5KSB7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjcmVhdGUtY29udGFjdCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2NsaWVudC1tb2RhbF9fY29udGFjdC1idG4tLWhpZGRlbicpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbnRhY3RJdGVtLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIGNoYW5nZVBsYWNlaG9sZGVyKCkge1xuICAgICAgaWYgKHRoaXMuY29udGFjdElucHV0LmRhdGFzZXQudHlwZSA9PT0gJ3Bob25lJykge1xuICAgICAgICB0aGlzLmNvbnRhY3RJbnB1dC5wbGFjZWhvbGRlciA9ICcrNzkyMjExMTA1MDAnO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbnRhY3RJbnB1dC5kYXRhc2V0LnR5cGUgPT09ICdlbWFpbCcpIHtcbiAgICAgICAgdGhpcy5jb250YWN0SW5wdXQucGxhY2Vob2xkZXIgPSAnZXhhbXBsZUBtYWlsLmNvbSc7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY29udGFjdElucHV0LmRhdGFzZXQudHlwZSA9PT0gJ3ZrJykge1xuICAgICAgICB0aGlzLmNvbnRhY3RJbnB1dC5wbGFjZWhvbGRlciA9ICdAdmsuY29tL3ZrJztcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jb250YWN0SW5wdXQuZGF0YXNldC50eXBlID09PSAnZmFjZWJvb2snKSB7XG4gICAgICAgIHRoaXMuY29udGFjdElucHV0LnBsYWNlaG9sZGVyID0gJ0BmYWNlYm9vayc7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY29udGFjdElucHV0LmRhdGFzZXQudHlwZSA9PT0gJ290aGVyJykge1xuICAgICAgICB0aGlzLmNvbnRhY3RJbnB1dC5wbGFjZWhvbGRlciA9ICcnO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrSW5wdXRzQ29udGVudChuYW1lSW5wdXQsIHNlY29uZE5hbWVJbnB1dCwgY29uZmlybUJ0bikge1xuICAgIHRyeSB7XG4gICAgICBDb250YWN0LmlucHV0c0hhdmVDb250ZW50KCk7XG4gICAgICBpZiAobmFtZUlucHV0LnZhbHVlICE9PSAnJyAmJiBzZWNvbmROYW1lSW5wdXQudmFsdWUgIT09ICcnKSB7XG4gICAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBkYXJrQmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCBjbG9zZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCB0aXRsZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gIGNvbnN0IGNsaWVudElkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICBjb25zdCBuYW1lTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICBjb25zdCBzZWNvbmROYW1lTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICBjb25zdCBsYXN0TmFtZUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgY29uc3QgbmFtZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgY29uc3Qgc2Vjb25kTmFtZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgY29uc3QgbGFzdE5hbWVJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gIGNvbnN0IGNvbnRhY3RDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgY29udGFjdExpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICBjb25zdCBjb250YWN0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIGNvbnN0IGNvbmZpcm1CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgY2FuY2VsQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cbiAgZGFya0JhY2tncm91bmQuY2xhc3NMaXN0LmFkZCgnZGFyay1iYWNrZ3JvdW5kJyk7XG4gIGNsb3NlQnRuLmNsYXNzTGlzdC5hZGQoJ2Nsb3NlLW1vZGFsLWJ0bicpO1xuICBtb2RhbC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWwnKTtcbiAgdGl0bGVDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX190aXRsZS1jb250YWluZXInKTtcbiAgdGl0bGUuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX190aXRsZScpO1xuICBjbGllbnRJZC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2lkJyk7XG4gIG5hbWVMYWJlbC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2xhYmVsJyk7XG4gIHNlY29uZE5hbWVMYWJlbC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2xhYmVsJyk7XG4gIGxhc3ROYW1lTGFiZWwuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19sYWJlbCcpO1xuICBuYW1lSW5wdXQuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19pbnB1dCcpO1xuICBzZWNvbmROYW1lSW5wdXQuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19pbnB1dCcpO1xuICBsYXN0TmFtZUlucHV0LmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9faW5wdXQnKTtcbiAgY29udGFjdENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2NvbnRhY3QtY29udGFpbmVyJyk7XG4gIGNvbnRhY3RMaXN0LmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fY29udGFjdC1saXN0Jyk7XG4gIGNvbnRhY3RCdG4uY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LWJ0bicpO1xuICBjb25maXJtQnRuLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fYnRuJyk7XG4gIGNhbmNlbEJ0bi5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2Rlc2NyLWJ0bicpO1xuXG4gIGNvbnRhY3RCdG4uaWQgPSAnY3JlYXRlLWNvbnRhY3QnO1xuXG4gIG5hbWVJbnB1dC50eXBlID0gJ3RleHQnO1xuICBzZWNvbmROYW1lSW5wdXQudHlwZSA9ICd0ZXh0JztcbiAgbGFzdE5hbWVJbnB1dC50eXBlID0gJ3RleHQnO1xuICBjb250YWN0QnRuLnRleHRDb250ZW50ID0gJ9CU0L7QsdCw0LLQuNGC0Ywg0LrQvtC90YLQsNC60YInO1xuICBjb250YWN0QnRuLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuXG4gIHRpdGxlQ29udGFpbmVyLmFwcGVuZCh0aXRsZSk7XG4gIG5hbWVMYWJlbC5hcHBlbmQobmFtZUlucHV0KTtcbiAgc2Vjb25kTmFtZUxhYmVsLmFwcGVuZChzZWNvbmROYW1lSW5wdXQpO1xuICBsYXN0TmFtZUxhYmVsLmFwcGVuZChsYXN0TmFtZUlucHV0KTs7XG4gIGNvbnRhY3RDb250YWluZXIuYXBwZW5kKGNvbnRhY3RCdG4pO1xuICBtb2RhbC5hcHBlbmQoY2xvc2VCdG4pO1xuICBtb2RhbC5hcHBlbmQodGl0bGVDb250YWluZXIpO1xuICBtb2RhbC5hcHBlbmQoc2Vjb25kTmFtZUxhYmVsKTtcbiAgbW9kYWwuYXBwZW5kKG5hbWVMYWJlbCk7XG4gIG1vZGFsLmFwcGVuZChsYXN0TmFtZUxhYmVsKTtcbiAgbW9kYWwuYXBwZW5kKGNvbnRhY3RDb250YWluZXIpO1xuICBtb2RhbC5hcHBlbmQobWVzc2FnZSk7XG4gIG1vZGFsLmFwcGVuZChjb25maXJtQnRuKTtcbiAgbW9kYWwuYXBwZW5kKGNhbmNlbEJ0bik7XG5cbiAgbW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XG4gICAgd2l0aG91dFNwYWNlKGV2ZW50LnRhcmdldCk7XG4gICAgaWYgKCFldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjbGllbnQtbW9kYWxfX2NvbnRhY3QtaW5wdXQnKSkge1xuICAgICAgb25seUxldHRlcnMoZXZlbnQudGFyZ2V0KTtcbiAgICB9XG4gICAgY2hlY2tJbnB1dHNDb250ZW50KG5hbWVJbnB1dCwgc2Vjb25kTmFtZUlucHV0LCBjb25maXJtQnRuKTtcbiAgfSk7XG5cbiAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgbW9kYWwucmVtb3ZlKCk7XG4gICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XG4gIH0pO1xuXG4gIGNvbnRhY3RCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgY29udGFjdENvbnRhaW5lci5wcmVwZW5kKGNvbnRhY3RMaXN0KTtcbiAgICBuZXcgQ29udGFjdChjb250YWN0TGlzdCwge25hbWVJbnB1dCwgc2Vjb25kTmFtZUlucHV0LCBjb25maXJtQnRufSwge3N0YXJ0VHlwZTogJ3Bob25lJywgaW5wdXRWYWx1ZTogJyd9KTtcbiAgICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICBpZiAoQ29udGFjdC5jb3VudCA+PSAxMCkge1xuICAgICAgY29udGFjdEJ0bi5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2NvbnRhY3QtYnRuLS1oaWRkZW4nKTtcbiAgICB9XG4gIH0pO1xuXG4gIGlmICh3YXkgPT09ICdjcmVhdGUnKSB7XG4gICAgdGl0bGUudGV4dENvbnRlbnQgPSAn0J3QvtCy0YvQuSDQutC70LjQtdC90YInO1xuICAgIGNvbmZpcm1CdG4udGV4dENvbnRlbnQgPSAn0KHQvtGF0YDQsNC90LjRgtGMJztcbiAgICBjYW5jZWxCdG4udGV4dENvbnRlbnQgPSAn0J7RgtC80LXQvdCwJztcblxuICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgY2FuY2VsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgbW9kYWwucmVtb3ZlKCk7XG4gICAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcbiAgICB9KTtcblxuICAgIGNvbmZpcm1CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBldmVudCA9PiB7XG4gICAgICBjb25zdCBsb2FkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBldmVudC5jdXJyZW50VGFyZ2V0LmFwcGVuZChsb2FkZXIpO1xuXG4gICAgICBldmVudC5jdXJyZW50VGFyZ2V0LmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIG5hbWVJbnB1dC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBzZWNvbmROYW1lSW5wdXQuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgbGFzdE5hbWVJbnB1dC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBDb250YWN0LmlucHV0cy5mb3JFYWNoKGlucHV0ID0+IGlucHV0LmRpc2FibGVkID0gdHJ1ZSk7XG4gICAgICBjbG9zZUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBjYW5jZWxCdG4uZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgICB3cml0ZUNsaWVudERhdGEodXNlcklkLCB7XG4gICAgICAgIG5hbWVWYWx1ZTogbmFtZUlucHV0LnZhbHVlLFxuICAgICAgICBzZWNvbmROYW1lVmFsdWU6IHNlY29uZE5hbWVJbnB1dC52YWx1ZSxcbiAgICAgICAgbGFzdE5hbWVWYWx1ZTogbGFzdE5hbWVJbnB1dC52YWx1ZSxcbiAgICAgICAgY29udGFjdHNBcnJheTogQ29udGFjdC5pbnB1dHMsXG4gICAgICB9KVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICAgICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgbWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdtZXNzYWdlJyk7XG4gICAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcbiAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQp9GC0L4t0YLQviDQv9C+0YjQu9C+INC90LUg0YLQsNC6Li4uJztcbiAgICAgICAgbG9hZGVyLnJlbW92ZSgpO1xuXG4gICAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgbmFtZUlucHV0LmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHNlY29uZE5hbWVJbnB1dC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBsYXN0TmFtZUlucHV0LmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIGNsb3NlQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIGNhbmNlbEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBDb250YWN0LmlucHV0cy5mb3JFYWNoKGlucHV0ID0+IGlucHV0LmRpc2FibGVkID0gZmFsc2UpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAod2F5ID09PSAnY2hhbmdlJykge1xuICAgIGlmIChkYXRhID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9CU0LDQvdC90L7Qs9C+INC60LvQuNC10L3RgtCwINC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIuJyk7XG4gICAgfVxuXG4gICAgY2xpZW50SWQudGV4dENvbnRlbnQgPSBgSUQ6ICR7ZGF0YS5pZH1gO1xuICAgIHRpdGxlQ29udGFpbmVyLmFwcGVuZChjbGllbnRJZCk7XG5cbiAgICB0aXRsZS50ZXh0Q29udGVudCA9ICfQmNC30LzQtdC90LjRgtGMINC00LDQvdC90YvQtSc7XG4gICAgY29uZmlybUJ0bi50ZXh0Q29udGVudCA9ICfQodC+0YXRgNCw0L3QuNGC0YwnO1xuICAgIGNhbmNlbEJ0bi50ZXh0Q29udGVudCA9ICfQo9C00LDQu9C40YLRjCDQutC70LjQtdC90YLQsCc7XG4gICAgbmFtZUlucHV0LnZhbHVlID0gZGF0YS5uYW1lO1xuICAgIHNlY29uZE5hbWVJbnB1dC52YWx1ZSA9IGRhdGEuc2Vjb25kTmFtZTtcbiAgICBsYXN0TmFtZUlucHV0LnZhbHVlID0gZGF0YS5sYXN0TmFtZSAhPT0gJ25vdCBzcGVjaWZpZWQnID8gZGF0YS5sYXN0TmFtZSA6ICcnO1xuXG4gICAgaWYgKGRhdGEuY29udGFjdHMpIHtcbiAgICAgIE9iamVjdC5lbnRyaWVzKGRhdGEuY29udGFjdHMpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICBjb250YWN0Q29udGFpbmVyLnByZXBlbmQoY29udGFjdExpc3QpO1xuICAgICAgICBuZXcgQ29udGFjdChjb250YWN0TGlzdCwge25hbWVJbnB1dCwgc2Vjb25kTmFtZUlucHV0LCBjb25maXJtQnRufSwge3N0YXJ0VHlwZToga2V5LCBpbnB1dFZhbHVlOiB2YWx1ZX0pO1xuICAgICAgfSk7XG4gICAgICBpZiAoQ29udGFjdC5jb3VudCA+PSAxMCkge1xuICAgICAgICBjb250YWN0QnRuLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fY29udGFjdC1idG4tLWhpZGRlbicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNhbmNlbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICBldmVudCA9PiB7XG4gICAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICAgIGRhcmtCYWNrZ3JvdW5kLnJlbW92ZSgpO1xuICAgICAgb3BlbkRlbGV0ZUNsaWVudCh1c2VySWQsIGRhdGEuaWQpO1xuICAgIH0pO1xuXG4gICAgY29uZmlybUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGV2ZW50ID0+IHtcbiAgICAgIGNvbnN0IGxvYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQuYXBwZW5kKGxvYWRlcik7XG5cbiAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgbmFtZUlucHV0LmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHNlY29uZE5hbWVJbnB1dC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBsYXN0TmFtZUlucHV0LmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIENvbnRhY3QuaW5wdXRzLmZvckVhY2goaW5wdXQgPT4gaW5wdXQuZGlzYWJsZWQgPSB0cnVlKTtcbiAgICAgIGNsb3NlQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIGNhbmNlbEJ0bi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICAgIHVwZGF0ZUNsaWVudERhdGEodXNlcklkLCBkYXRhLmlkLCB7XG4gICAgICAgIG5hbWVWYWx1ZTogbmFtZUlucHV0LnZhbHVlLFxuICAgICAgICBzZWNvbmROYW1lVmFsdWU6IHNlY29uZE5hbWVJbnB1dC52YWx1ZSxcbiAgICAgICAgbGFzdE5hbWVWYWx1ZTogbGFzdE5hbWVJbnB1dC52YWx1ZSxcbiAgICAgICAgY29udGFjdHNBcnJheTogQ29udGFjdC5pbnB1dHMsXG4gICAgICB9KVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICAgICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgbWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdtZXNzYWdlJyk7XG4gICAgICAgIG1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcbiAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9ICfQp9GC0L4t0YLQviDQv9C+0YjQu9C+INC90LUg0YLQsNC6Li4uJztcbiAgICAgICAgbG9hZGVyLnJlbW92ZSgpO1xuXG4gICAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgbmFtZUlucHV0LmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHNlY29uZE5hbWVJbnB1dC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBsYXN0TmFtZUlucHV0LmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIGNsb3NlQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIGNhbmNlbEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBDb250YWN0LmlucHV0cy5mb3JFYWNoKGlucHV0ID0+IGlucHV0LmRpc2FibGVkID0gZmFsc2UpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBkb2N1bWVudC5ib2R5LmFwcGVuZChkYXJrQmFja2dyb3VuZCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKG1vZGFsKTtcblxuICBwbGFjZWhvbGRlcihzZWNvbmROYW1lSW5wdXQsICfQpNCw0LzQuNC70LjRjyonKTtcbiAgcGxhY2Vob2xkZXIobmFtZUlucHV0LCAn0JjQvNGPKicpO1xuICBwbGFjZWhvbGRlcihsYXN0TmFtZUlucHV0LCAn0J7RgtGH0LXRgdGC0LLQvicpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3BlbkRlbGV0ZUNsaWVudCh1c2VySWQsIGNsaWVudElkKSB7XG4gIGNvbnN0IGRhcmtCYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgY29uc3QgZGVzY3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIGNvbnN0IGNsb3NlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IGRlbGV0ZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBjb25zdCBjYW5jZWxCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblxuICBkYXJrQmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCdkYXJrLWJhY2tncm91bmQnKTtcbiAgbW9kYWwuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsJyk7XG4gIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fdGl0bGUnKTtcbiAgZGVzY3IuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19kZXNjcicpO1xuICBjbG9zZUJ0bi5jbGFzc0xpc3QuYWRkKCdjbG9zZS1tb2RhbC1idG4nKTtcbiAgZGVsZXRlQnRuLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fYnRuJyk7XG4gIGNhbmNlbEJ0bi5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2Rlc2NyLWJ0bicpO1xuXG4gIHRpdGxlLnRleHRDb250ZW50ID0gJ9Cj0LTQsNC70LjRgtGMINC60LvQuNC10L3RgtCwJztcbiAgZGVzY3IudGV4dENvbnRlbnQgPSAn0JLRiyDQtNC10LnRgdGC0LLQuNGC0LXQu9GM0L3QviDRhdC+0YLQuNGC0LUg0YPQtNCw0LvQuNGC0Ywg0LTQsNC90L3QvtCz0L4g0LrQu9C40LXQvdGC0LA/JztcbiAgZGVsZXRlQnRuLnRleHRDb250ZW50ID0gJ9Cj0LTQsNC70LjRgtGMJztcbiAgY2FuY2VsQnRuLnRleHRDb250ZW50ID0gJ9Ce0YLQvNC10L3QsCc7XG5cbiAgbW9kYWwuYXBwZW5kKGNsb3NlQnRuKTtcbiAgbW9kYWwuYXBwZW5kKHRpdGxlKTtcbiAgbW9kYWwuYXBwZW5kKGRlc2NyKTtcbiAgbW9kYWwuYXBwZW5kKGRlbGV0ZUJ0bik7XG4gIG1vZGFsLmFwcGVuZChjYW5jZWxCdG4pO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChkYXJrQmFja2dyb3VuZCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKG1vZGFsKTtcblxuICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcbiAgfSk7XG5cbiAgY2FuY2VsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgIG1vZGFsLnJlbW92ZSgpO1xuICAgIGRhcmtCYWNrZ3JvdW5kLnJlbW92ZSgpO1xuICB9KTtcblxuICBkZWxldGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgY29uc3QgbG9hZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGRlbGV0ZUJ0bi5hcHBlbmQobG9hZGVyKTtcblxuICAgIGNsb3NlQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICBjYW5jZWxCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgIGRlbGV0ZUJ0bi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICAgIGRlbGV0ZUNsaWVudCh1c2VySWQsIGNsaWVudElkKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICAgICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIGxvYWRlci5yZW1vdmUoKTtcblxuICAgICAgICBjbG9zZUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBjYW5jZWxCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgZGVsZXRlQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICB9KTtcbiAgfSk7XG59XG4iXSwiZmlsZSI6ImNybS9tb2RhbHMuanMifQ==
