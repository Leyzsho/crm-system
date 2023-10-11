import placeholder from "../utils/placeholder.js";

export function openClientModal(way, data) {
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
  const nameError = document.createElement('p');
  const secondNameError = document.createElement('p');
  const lastNameError = document.createElement('p');
  const contactList = document.createElement('ul');
  const contactBtn = document.createElement('li');
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
  nameError.classList.add('error');
  secondNameError.classList.add('error');
  lastNameError.classList.add('error');
  contactList.classList.add('client-modal__contact-list');
  contactBtn.classList.add('client-modal__contact-btn');
  confirmBtn.classList.add('client-modal__btn');
  cancelBtn.classList.add('client-modal__descr-btn');

  nameInput.type = 'text';
  secondNameInput.type = 'text';
  lastNameInput.type = 'text';
  contactBtn.textContent = 'Добавить контакт';
  contactBtn.setAttribute('tabindex', '0');

  titleContainer.append(title);
  nameLabel.append(nameInput);
  nameLabel.append(nameError);
  secondNameLabel.append(secondNameInput);
  secondNameLabel.append(secondNameError);
  lastNameLabel.append(lastNameInput);
  lastNameLabel.append(lastNameError);
  contactList.append(contactBtn);
  modal.append(closeBtn);
  modal.append(titleContainer);
  modal.append(nameLabel);
  modal.append(secondNameLabel);
  modal.append(lastNameLabel);
  modal.append(contactList);
  modal.append(message);
  modal.append(confirmBtn);
  modal.append(cancelBtn);

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

  placeholder(nameInput, 'Фамилия*');
  placeholder(secondNameInput, 'Имя*');
  placeholder(lastNameInput, 'Отчество');
}
