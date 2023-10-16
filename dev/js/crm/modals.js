import { onlyLetters, placeholder, withoutSpace } from '../utils/input.js';
import { deleteClient, writeClientData } from './firebase-api.js';

export function openClientModal(way, userId, data) {
  class Contact {
    static count = way === 'create' ? 0 : data;
    static inputs = [];

    constructor (list, {nameInput, secondNameInput, confirmBtn}) {
      this.list = list;
      this.nameInput = nameInput;
      this.secondNameInput = secondNameInput;
      this.confirmBtn = confirmBtn;
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

      this.contactInput.dataset.type = this.contactSelect.value;
      this.contactInput.placeholder = '+79221110500';

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
  confirmBtn.disabled = true;

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

  cancelBtn.addEventListener('click', event => {
    modal.remove();
    darkBackground.remove();
  });

  closeBtn.addEventListener('click', event => {
    modal.remove();
    darkBackground.remove();
  });

  contactBtn.addEventListener('click', event => {
    contactContainer.prepend(contactList);
    new Contact(contactList, {nameInput, secondNameInput, confirmBtn});
    confirmBtn.disabled = true;
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

  if (way === 'create') {
    title.textContent = 'Новый клиент';
    confirmBtn.textContent = 'Сохранить';
    cancelBtn.textContent = 'Отмена';

  } else if (way === 'change') {
    if (data === null) {
      throw new Error('Данного клиента не существует.');
    }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcm0vbW9kYWxzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG9ubHlMZXR0ZXJzLCBwbGFjZWhvbGRlciwgd2l0aG91dFNwYWNlIH0gZnJvbSAnLi4vdXRpbHMvaW5wdXQuanMnO1xuaW1wb3J0IHsgZGVsZXRlQ2xpZW50LCB3cml0ZUNsaWVudERhdGEgfSBmcm9tICcuL2ZpcmViYXNlLWFwaS5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuQ2xpZW50TW9kYWwod2F5LCB1c2VySWQsIGRhdGEpIHtcbiAgY2xhc3MgQ29udGFjdCB7XG4gICAgc3RhdGljIGNvdW50ID0gd2F5ID09PSAnY3JlYXRlJyA/IDAgOiBkYXRhO1xuICAgIHN0YXRpYyBpbnB1dHMgPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yIChsaXN0LCB7bmFtZUlucHV0LCBzZWNvbmROYW1lSW5wdXQsIGNvbmZpcm1CdG59KSB7XG4gICAgICB0aGlzLmxpc3QgPSBsaXN0O1xuICAgICAgdGhpcy5uYW1lSW5wdXQgPSBuYW1lSW5wdXQ7XG4gICAgICB0aGlzLnNlY29uZE5hbWVJbnB1dCA9IHNlY29uZE5hbWVJbnB1dDtcbiAgICAgIHRoaXMuY29uZmlybUJ0biA9IGNvbmZpcm1CdG47XG4gICAgICBDb250YWN0LmNvdW50Kys7XG4gICAgICB0aGlzLmNyZWF0ZUNvbnRhY3QoKTtcblxuICAgICAgaWYgKENvbnRhY3QuY291bnQgPj0gMTApIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NyZWF0ZS1jb250YWN0JykuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LWJ0bi0taGlkZGVuJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGlucHV0c0hhdmVDb250ZW50KCkge1xuICAgICAgY29uc3QgYWxsVmFsdWVzTm90RW1wdHkgPSBDb250YWN0LmlucHV0cy5ldmVyeShpbnB1dCA9PiBpbnB1dC52YWx1ZSAhPT0gJycpO1xuXG4gICAgICBpZiAoIWFsbFZhbHVlc05vdEVtcHR5KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcign0KMg0LrQsNC60LjRhS3RgtC+INC60L7QvdGC0LDQutGC0L7QsiDQvdC10YIg0LfQvdCw0YfQtdC90LjRjy4nKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVDb250YWN0KCkge1xuICAgICAgdGhpcy5jb250YWN0SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICB0aGlzLmNvbnRhY3RTZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgICAgIHRoaXMuY29udGFjdElucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgIHRoaXMuY29udGFjdERlbGV0ZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXG4gICAgICB0aGlzLnBob25lT3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICB0aGlzLmVtYWlsT3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICB0aGlzLnZrT3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICB0aGlzLmZhY2Vib29rT3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICB0aGlzLm90aGVyT3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG5cbiAgICAgIHRoaXMuY29udGFjdEl0ZW0uY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LWl0ZW0nKTtcbiAgICAgIHRoaXMuY29udGFjdFNlbGVjdC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2NvbnRhY3Qtc2VsZWN0Jyk7XG4gICAgICB0aGlzLmNvbnRhY3RJbnB1dC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2NvbnRhY3QtaW5wdXQnKTtcbiAgICAgIHRoaXMuY29udGFjdERlbGV0ZUJ0bi5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2NvbnRhY3QtZGVsZXRlLWJ0bicpO1xuXG4gICAgICB0aGlzLnBob25lT3B0aW9uLnZhbHVlID0gJ3Bob25lJztcbiAgICAgIHRoaXMucGhvbmVPcHRpb24udGV4dENvbnRlbnQgPSAn0YLQtdC70LXRhNC+0L0nO1xuICAgICAgdGhpcy5lbWFpbE9wdGlvbi52YWx1ZSA9ICdlbWFpbCc7XG4gICAgICB0aGlzLmVtYWlsT3B0aW9uLnRleHRDb250ZW50ID0gJ2VtYWlsJztcbiAgICAgIHRoaXMudmtPcHRpb24udmFsdWUgPSAndmsnO1xuICAgICAgdGhpcy52a09wdGlvbi50ZXh0Q29udGVudCA9ICd2ayc7XG4gICAgICB0aGlzLmZhY2Vib29rT3B0aW9uLnZhbHVlID0gJ2ZhY2Vib29rJztcbiAgICAgIHRoaXMuZmFjZWJvb2tPcHRpb24udGV4dENvbnRlbnQgPSAnZmFjZWJvb2snO1xuICAgICAgdGhpcy5vdGhlck9wdGlvbi52YWx1ZSA9ICdvdGhlcic7XG4gICAgICB0aGlzLm90aGVyT3B0aW9uLnRleHRDb250ZW50ID0gJ9C00YDRg9Cz0L7QtSc7XG5cbiAgICAgIHRoaXMuY29udGFjdFNlbGVjdC5hcHBlbmQodGhpcy5waG9uZU9wdGlvbik7XG4gICAgICB0aGlzLmNvbnRhY3RTZWxlY3QuYXBwZW5kKHRoaXMuZW1haWxPcHRpb24pO1xuICAgICAgdGhpcy5jb250YWN0U2VsZWN0LmFwcGVuZCh0aGlzLnZrT3B0aW9uKTtcbiAgICAgIHRoaXMuY29udGFjdFNlbGVjdC5hcHBlbmQodGhpcy5mYWNlYm9va09wdGlvbik7XG4gICAgICB0aGlzLmNvbnRhY3RTZWxlY3QuYXBwZW5kKHRoaXMub3RoZXJPcHRpb24pO1xuICAgICAgdGhpcy5jb250YWN0SXRlbS5hcHBlbmQodGhpcy5jb250YWN0U2VsZWN0KTtcbiAgICAgIHRoaXMuY29udGFjdEl0ZW0uYXBwZW5kKHRoaXMuY29udGFjdElucHV0KTtcbiAgICAgIHRoaXMuY29udGFjdEl0ZW0uYXBwZW5kKHRoaXMuY29udGFjdERlbGV0ZUJ0bik7XG4gICAgICB0aGlzLmxpc3QuYXBwZW5kKHRoaXMuY29udGFjdEl0ZW0pO1xuXG4gICAgICB0aGlzLmNvbnRhY3RJbnB1dC5kYXRhc2V0LnR5cGUgPSB0aGlzLmNvbnRhY3RTZWxlY3QudmFsdWU7XG4gICAgICB0aGlzLmNvbnRhY3RJbnB1dC5wbGFjZWhvbGRlciA9ICcrNzkyMjExMTA1MDAnO1xuXG4gICAgICBDb250YWN0LmlucHV0cy5wdXNoKHRoaXMuY29udGFjdElucHV0KTtcblxuICAgICAgdGhpcy5jb250YWN0RGVsZXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgICAgICB0aGlzLmRlbGV0ZUNvbnRhY3QoKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmNvbnRhY3RTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZXZlbnQgPT4ge1xuICAgICAgICB0aGlzLmNvbnRhY3RJbnB1dC5kYXRhc2V0LnR5cGUgPSBldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlO1xuICAgICAgICB0aGlzLmNoYW5nZVBsYWNlaG9sZGVyKCk7XG4gICAgICB9KTtcblxuICAgICAgbmV3IENob2ljZXModGhpcy5jb250YWN0U2VsZWN0LCB7XG4gICAgICAgIHNlYXJjaEVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICBpdGVtU2VsZWN0VGV4dDogJycsXG4gICAgICAgIHBvc2l0aW9uOiAnYm90dG9tJyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGRlbGV0ZUNvbnRhY3QoKSB7XG4gICAgICBjb25zdCBpbmRleCA9IENvbnRhY3QuaW5wdXRzLmluZGV4T2YodGhpcy5jb250YWN0SW5wdXQpO1xuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgIENvbnRhY3QuaW5wdXRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG5cbiAgICAgIGNoZWNrSW5wdXRzQ29udGVudCh0aGlzLm5hbWVJbnB1dCwgdGhpcy5zZWNvbmROYW1lSW5wdXQsIHRoaXMuY29uZmlybUJ0bik7XG5cbiAgICAgIENvbnRhY3QuY291bnQtLTtcbiAgICAgIGlmIChDb250YWN0LmNvdW50ID09PSAwKSB7XG4gICAgICAgIHRoaXMubGlzdC5yZW1vdmUoKTtcbiAgICAgIH0gZWxzZSBpZiAoQ29udGFjdC5jb3VudCA+PSA5KSB7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjcmVhdGUtY29udGFjdCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2NsaWVudC1tb2RhbF9fY29udGFjdC1idG4tLWhpZGRlbicpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbnRhY3RJdGVtLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIGNoYW5nZVBsYWNlaG9sZGVyKCkge1xuICAgICAgaWYgKHRoaXMuY29udGFjdElucHV0LmRhdGFzZXQudHlwZSA9PT0gJ3Bob25lJykge1xuICAgICAgICB0aGlzLmNvbnRhY3RJbnB1dC5wbGFjZWhvbGRlciA9ICcrNzkyMjExMTA1MDAnO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbnRhY3RJbnB1dC5kYXRhc2V0LnR5cGUgPT09ICdlbWFpbCcpIHtcbiAgICAgICAgdGhpcy5jb250YWN0SW5wdXQucGxhY2Vob2xkZXIgPSAnZXhhbXBsZUBtYWlsLmNvbSc7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY29udGFjdElucHV0LmRhdGFzZXQudHlwZSA9PT0gJ3ZrJykge1xuICAgICAgICB0aGlzLmNvbnRhY3RJbnB1dC5wbGFjZWhvbGRlciA9ICdAdmsuY29tL3ZrJztcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jb250YWN0SW5wdXQuZGF0YXNldC50eXBlID09PSAnZmFjZWJvb2snKSB7XG4gICAgICAgIHRoaXMuY29udGFjdElucHV0LnBsYWNlaG9sZGVyID0gJ0BmYWNlYm9vayc7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY29udGFjdElucHV0LmRhdGFzZXQudHlwZSA9PT0gJ290aGVyJykge1xuICAgICAgICB0aGlzLmNvbnRhY3RJbnB1dC5wbGFjZWhvbGRlciA9ICcnO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrSW5wdXRzQ29udGVudChuYW1lSW5wdXQsIHNlY29uZE5hbWVJbnB1dCwgY29uZmlybUJ0bikge1xuICAgIHRyeSB7XG4gICAgICBDb250YWN0LmlucHV0c0hhdmVDb250ZW50KCk7XG4gICAgICBpZiAobmFtZUlucHV0LnZhbHVlICE9PSAnJyAmJiBzZWNvbmROYW1lSW5wdXQudmFsdWUgIT09ICcnKSB7XG4gICAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBkYXJrQmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCBjbG9zZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCB0aXRsZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gIGNvbnN0IG5hbWVMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gIGNvbnN0IHNlY29uZE5hbWVMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gIGNvbnN0IGxhc3ROYW1lTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICBjb25zdCBuYW1lSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICBjb25zdCBzZWNvbmROYW1lSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICBjb25zdCBsYXN0TmFtZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgY29uc3QgY29udGFjdENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCBjb250YWN0TGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gIGNvbnN0IGNvbnRhY3RCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgY29uc3QgY29uZmlybUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBjb25zdCBjYW5jZWxCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblxuICBkYXJrQmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCdkYXJrLWJhY2tncm91bmQnKTtcbiAgY2xvc2VCdG4uY2xhc3NMaXN0LmFkZCgnY2xvc2UtbW9kYWwtYnRuJyk7XG4gIG1vZGFsLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbCcpO1xuICB0aXRsZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX3RpdGxlLWNvbnRhaW5lcicpO1xuICB0aXRsZS5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX3RpdGxlJyk7XG4gIG5hbWVMYWJlbC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2xhYmVsJyk7XG4gIHNlY29uZE5hbWVMYWJlbC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2xhYmVsJyk7XG4gIGxhc3ROYW1lTGFiZWwuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19sYWJlbCcpO1xuICBuYW1lSW5wdXQuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19pbnB1dCcpO1xuICBzZWNvbmROYW1lSW5wdXQuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19pbnB1dCcpO1xuICBsYXN0TmFtZUlucHV0LmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9faW5wdXQnKTtcbiAgY29udGFjdENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2NvbnRhY3QtY29udGFpbmVyJyk7XG4gIGNvbnRhY3RMaXN0LmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fY29udGFjdC1saXN0Jyk7XG4gIGNvbnRhY3RCdG4uY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LWJ0bicpO1xuICBjb25maXJtQnRuLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fYnRuJyk7XG4gIGNhbmNlbEJ0bi5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2Rlc2NyLWJ0bicpO1xuXG4gIGNvbnRhY3RCdG4uaWQgPSAnY3JlYXRlLWNvbnRhY3QnO1xuXG4gIG5hbWVJbnB1dC50eXBlID0gJ3RleHQnO1xuICBzZWNvbmROYW1lSW5wdXQudHlwZSA9ICd0ZXh0JztcbiAgbGFzdE5hbWVJbnB1dC50eXBlID0gJ3RleHQnO1xuICBjb250YWN0QnRuLnRleHRDb250ZW50ID0gJ9CU0L7QsdCw0LLQuNGC0Ywg0LrQvtC90YLQsNC60YInO1xuICBjb250YWN0QnRuLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcblxuICB0aXRsZUNvbnRhaW5lci5hcHBlbmQodGl0bGUpO1xuICBuYW1lTGFiZWwuYXBwZW5kKG5hbWVJbnB1dCk7XG4gIHNlY29uZE5hbWVMYWJlbC5hcHBlbmQoc2Vjb25kTmFtZUlucHV0KTtcbiAgbGFzdE5hbWVMYWJlbC5hcHBlbmQobGFzdE5hbWVJbnB1dCk7O1xuICBjb250YWN0Q29udGFpbmVyLmFwcGVuZChjb250YWN0QnRuKTtcbiAgbW9kYWwuYXBwZW5kKGNsb3NlQnRuKTtcbiAgbW9kYWwuYXBwZW5kKHRpdGxlQ29udGFpbmVyKTtcbiAgbW9kYWwuYXBwZW5kKHNlY29uZE5hbWVMYWJlbCk7XG4gIG1vZGFsLmFwcGVuZChuYW1lTGFiZWwpO1xuICBtb2RhbC5hcHBlbmQobGFzdE5hbWVMYWJlbCk7XG4gIG1vZGFsLmFwcGVuZChjb250YWN0Q29udGFpbmVyKTtcbiAgbW9kYWwuYXBwZW5kKG1lc3NhZ2UpO1xuICBtb2RhbC5hcHBlbmQoY29uZmlybUJ0bik7XG4gIG1vZGFsLmFwcGVuZChjYW5jZWxCdG4pO1xuXG4gIG1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xuICAgIHdpdGhvdXRTcGFjZShldmVudC50YXJnZXQpO1xuICAgIGlmICghZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY2xpZW50LW1vZGFsX19jb250YWN0LWlucHV0JykpIHtcbiAgICAgIG9ubHlMZXR0ZXJzKGV2ZW50LnRhcmdldCk7XG4gICAgfVxuICAgIGNoZWNrSW5wdXRzQ29udGVudChuYW1lSW5wdXQsIHNlY29uZE5hbWVJbnB1dCwgY29uZmlybUJ0bik7XG4gIH0pO1xuXG4gIGNhbmNlbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcbiAgfSk7XG5cbiAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgbW9kYWwucmVtb3ZlKCk7XG4gICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XG4gIH0pO1xuXG4gIGNvbnRhY3RCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgY29udGFjdENvbnRhaW5lci5wcmVwZW5kKGNvbnRhY3RMaXN0KTtcbiAgICBuZXcgQ29udGFjdChjb250YWN0TGlzdCwge25hbWVJbnB1dCwgc2Vjb25kTmFtZUlucHV0LCBjb25maXJtQnRufSk7XG4gICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gIH0pO1xuXG4gIGNvbmZpcm1CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBldmVudCA9PiB7XG4gICAgY29uc3QgbG9hZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQuYXBwZW5kKGxvYWRlcik7XG5cbiAgICBldmVudC5jdXJyZW50VGFyZ2V0LmRpc2FibGVkID0gdHJ1ZTtcbiAgICBuYW1lSW5wdXQuZGlzYWJsZWQgPSB0cnVlO1xuICAgIHNlY29uZE5hbWVJbnB1dC5kaXNhYmxlZCA9IHRydWU7XG4gICAgbGFzdE5hbWVJbnB1dC5kaXNhYmxlZCA9IHRydWU7XG4gICAgQ29udGFjdC5pbnB1dHMuZm9yRWFjaChpbnB1dCA9PiBpbnB1dC5kaXNhYmxlZCA9IHRydWUpO1xuICAgIGNsb3NlQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICBjYW5jZWxCdG4uZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgd3JpdGVDbGllbnREYXRhKHVzZXJJZCwge1xuICAgICAgbmFtZVZhbHVlOiBuYW1lSW5wdXQudmFsdWUsXG4gICAgICBzZWNvbmROYW1lVmFsdWU6IHNlY29uZE5hbWVJbnB1dC52YWx1ZSxcbiAgICAgIGxhc3ROYW1lVmFsdWU6IGxhc3ROYW1lSW5wdXQudmFsdWUsXG4gICAgICBjb250YWN0c0FycmF5OiBDb250YWN0LmlucHV0cyxcbiAgICB9KVxuICAgIC50aGVuKCgpID0+IHtcbiAgICAgIG1vZGFsLnJlbW92ZSgpO1xuICAgICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XG4gICAgfSlcbiAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgbWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdtZXNzYWdlJyk7XG4gICAgICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG4gICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gJ9Cn0YLQvi3RgtC+INC/0L7RiNC70L4g0L3QtSDRgtCw0LouLi4nO1xuICAgICAgbG9hZGVyLnJlbW92ZSgpO1xuXG4gICAgICBldmVudC5jdXJyZW50VGFyZ2V0LmRpc2FibGVkID0gZmFsc2U7XG4gICAgICBuYW1lSW5wdXQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIHNlY29uZE5hbWVJbnB1dC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgbGFzdE5hbWVJbnB1dC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgY2xvc2VCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIGNhbmNlbEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgQ29udGFjdC5pbnB1dHMuZm9yRWFjaChpbnB1dCA9PiBpbnB1dC5kaXNhYmxlZCA9IGZhbHNlKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaWYgKHdheSA9PT0gJ2NyZWF0ZScpIHtcbiAgICB0aXRsZS50ZXh0Q29udGVudCA9ICfQndC+0LLRi9C5INC60LvQuNC10L3Rgic7XG4gICAgY29uZmlybUJ0bi50ZXh0Q29udGVudCA9ICfQodC+0YXRgNCw0L3QuNGC0YwnO1xuICAgIGNhbmNlbEJ0bi50ZXh0Q29udGVudCA9ICfQntGC0LzQtdC90LAnO1xuXG4gIH0gZWxzZSBpZiAod2F5ID09PSAnY2hhbmdlJykge1xuICAgIGlmIChkYXRhID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9CU0LDQvdC90L7Qs9C+INC60LvQuNC10L3RgtCwINC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIuJyk7XG4gICAgfVxuICB9XG5cbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZGFya0JhY2tncm91bmQpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChtb2RhbCk7XG5cbiAgcGxhY2Vob2xkZXIoc2Vjb25kTmFtZUlucHV0LCAn0KTQsNC80LjQu9C40Y8qJyk7XG4gIHBsYWNlaG9sZGVyKG5hbWVJbnB1dCwgJ9CY0LzRjyonKTtcbiAgcGxhY2Vob2xkZXIobGFzdE5hbWVJbnB1dCwgJ9Ce0YLRh9C10YHRgtCy0L4nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5EZWxldGVDbGllbnQodXNlcklkLCBjbGllbnRJZCkge1xuICBjb25zdCBkYXJrQmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gIGNvbnN0IGRlc2NyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBjb25zdCBjbG9zZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBjb25zdCBkZWxldGVCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgY2FuY2VsQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cbiAgZGFya0JhY2tncm91bmQuY2xhc3NMaXN0LmFkZCgnZGFyay1iYWNrZ3JvdW5kJyk7XG4gIG1vZGFsLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbCcpO1xuICB0aXRsZS5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX3RpdGxlJyk7XG4gIGRlc2NyLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fZGVzY3InKTtcbiAgY2xvc2VCdG4uY2xhc3NMaXN0LmFkZCgnY2xvc2UtbW9kYWwtYnRuJyk7XG4gIGRlbGV0ZUJ0bi5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2J0bicpO1xuICBjYW5jZWxCdG4uY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19kZXNjci1idG4nKTtcblxuICB0aXRsZS50ZXh0Q29udGVudCA9ICfQo9C00LDQu9C40YLRjCDQutC70LjQtdC90YLQsCc7XG4gIGRlc2NyLnRleHRDb250ZW50ID0gJ9CS0Ysg0LTQtdC50YHRgtCy0LjRgtC10LvRjNC90L4g0YXQvtGC0LjRgtC1INGD0LTQsNC70LjRgtGMINC00LDQvdC90L7Qs9C+INC60LvQuNC10L3RgtCwPyc7XG4gIGRlbGV0ZUJ0bi50ZXh0Q29udGVudCA9ICfQo9C00LDQu9C40YLRjCc7XG4gIGNhbmNlbEJ0bi50ZXh0Q29udGVudCA9ICfQntGC0LzQtdC90LAnO1xuXG4gIG1vZGFsLmFwcGVuZChjbG9zZUJ0bik7XG4gIG1vZGFsLmFwcGVuZCh0aXRsZSk7XG4gIG1vZGFsLmFwcGVuZChkZXNjcik7XG4gIG1vZGFsLmFwcGVuZChkZWxldGVCdG4pO1xuICBtb2RhbC5hcHBlbmQoY2FuY2VsQnRuKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQoZGFya0JhY2tncm91bmQpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZChtb2RhbCk7XG5cbiAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgbW9kYWwucmVtb3ZlKCk7XG4gICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XG4gIH0pO1xuXG4gIGNhbmNlbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcbiAgfSk7XG5cbiAgZGVsZXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgIGNvbnN0IGxvYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBkZWxldGVCdG4uYXBwZW5kKGxvYWRlcik7XG5cbiAgICBjbG9zZUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgY2FuY2VsQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICBkZWxldGVCdG4uZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgICBkZWxldGVDbGllbnQodXNlcklkLCBjbGllbnRJZClcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgbW9kYWwucmVtb3ZlKCk7XG4gICAgICAgIGRhcmtCYWNrZ3JvdW5kLnJlbW92ZSgpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICBsb2FkZXIucmVtb3ZlKCk7XG5cbiAgICAgICAgY2xvc2VCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgY2FuY2VsQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIGRlbGV0ZUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgfSk7XG4gIH0pO1xufVxuIl0sImZpbGUiOiJjcm0vbW9kYWxzLmpzIn0=
