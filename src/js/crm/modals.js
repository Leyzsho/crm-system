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
