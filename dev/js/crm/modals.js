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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcm0vbW9kYWxzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwbGFjZWhvbGRlciBmcm9tIFwiLi4vdXRpbHMvcGxhY2Vob2xkZXIuanNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5DbGllbnRNb2RhbCh3YXksIGRhdGEpIHtcbiAgY29uc3QgZGFya0JhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgY2xvc2VCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgdGl0bGVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICBjb25zdCBuYW1lTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICBjb25zdCBzZWNvbmROYW1lTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICBjb25zdCBsYXN0TmFtZUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgY29uc3QgbmFtZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgY29uc3Qgc2Vjb25kTmFtZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgY29uc3QgbGFzdE5hbWVJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gIGNvbnN0IG5hbWVFcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgY29uc3Qgc2Vjb25kTmFtZUVycm9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBjb25zdCBsYXN0TmFtZUVycm9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBjb25zdCBjb250YWN0TGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gIGNvbnN0IGNvbnRhY3RCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICBjb25zdCBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBjb25zdCBjb25maXJtQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IGNhbmNlbEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXG4gIGRhcmtCYWNrZ3JvdW5kLmNsYXNzTGlzdC5hZGQoJ2RhcmstYmFja2dyb3VuZCcpO1xuICBjbG9zZUJ0bi5jbGFzc0xpc3QuYWRkKCdjbG9zZS1tb2RhbC1idG4nKTtcbiAgbW9kYWwuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsJyk7XG4gIHRpdGxlQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fdGl0bGUtY29udGFpbmVyJyk7XG4gIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fdGl0bGUnKTtcbiAgbmFtZUxhYmVsLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fbGFiZWwnKTtcbiAgc2Vjb25kTmFtZUxhYmVsLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fbGFiZWwnKTtcbiAgbGFzdE5hbWVMYWJlbC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2xhYmVsJyk7XG4gIG5hbWVJbnB1dC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2lucHV0Jyk7XG4gIHNlY29uZE5hbWVJbnB1dC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2lucHV0Jyk7XG4gIGxhc3ROYW1lSW5wdXQuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19pbnB1dCcpO1xuICBuYW1lRXJyb3IuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcbiAgc2Vjb25kTmFtZUVycm9yLmNsYXNzTGlzdC5hZGQoJ2Vycm9yJyk7XG4gIGxhc3ROYW1lRXJyb3IuY2xhc3NMaXN0LmFkZCgnZXJyb3InKTtcbiAgY29udGFjdExpc3QuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LWxpc3QnKTtcbiAgY29udGFjdEJ0bi5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2NvbnRhY3QtYnRuJyk7XG4gIGNvbmZpcm1CdG4uY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19idG4nKTtcbiAgY2FuY2VsQnRuLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fZGVzY3ItYnRuJyk7XG5cbiAgbmFtZUlucHV0LnR5cGUgPSAndGV4dCc7XG4gIHNlY29uZE5hbWVJbnB1dC50eXBlID0gJ3RleHQnO1xuICBsYXN0TmFtZUlucHV0LnR5cGUgPSAndGV4dCc7XG4gIGNvbnRhY3RCdG4udGV4dENvbnRlbnQgPSAn0JTQvtCx0LDQstC40YLRjCDQutC+0L3RgtCw0LrRgic7XG4gIGNvbnRhY3RCdG4uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJyk7XG5cbiAgdGl0bGVDb250YWluZXIuYXBwZW5kKHRpdGxlKTtcbiAgbmFtZUxhYmVsLmFwcGVuZChuYW1lSW5wdXQpO1xuICBuYW1lTGFiZWwuYXBwZW5kKG5hbWVFcnJvcik7XG4gIHNlY29uZE5hbWVMYWJlbC5hcHBlbmQoc2Vjb25kTmFtZUlucHV0KTtcbiAgc2Vjb25kTmFtZUxhYmVsLmFwcGVuZChzZWNvbmROYW1lRXJyb3IpO1xuICBsYXN0TmFtZUxhYmVsLmFwcGVuZChsYXN0TmFtZUlucHV0KTtcbiAgbGFzdE5hbWVMYWJlbC5hcHBlbmQobGFzdE5hbWVFcnJvcik7XG4gIGNvbnRhY3RMaXN0LmFwcGVuZChjb250YWN0QnRuKTtcbiAgbW9kYWwuYXBwZW5kKGNsb3NlQnRuKTtcbiAgbW9kYWwuYXBwZW5kKHRpdGxlQ29udGFpbmVyKTtcbiAgbW9kYWwuYXBwZW5kKG5hbWVMYWJlbCk7XG4gIG1vZGFsLmFwcGVuZChzZWNvbmROYW1lTGFiZWwpO1xuICBtb2RhbC5hcHBlbmQobGFzdE5hbWVMYWJlbCk7XG4gIG1vZGFsLmFwcGVuZChjb250YWN0TGlzdCk7XG4gIG1vZGFsLmFwcGVuZChtZXNzYWdlKTtcbiAgbW9kYWwuYXBwZW5kKGNvbmZpcm1CdG4pO1xuICBtb2RhbC5hcHBlbmQoY2FuY2VsQnRuKTtcblxuICBpZiAod2F5ID09PSAnY3JlYXRlJykge1xuICAgIHRpdGxlLnRleHRDb250ZW50ID0gJ9Cd0L7QstGL0Lkg0LrQu9C40LXQvdGCJztcbiAgICBjb25maXJtQnRuLnRleHRDb250ZW50ID0gJ9Ch0L7RhdGA0LDQvdC40YLRjCc7XG4gICAgY2FuY2VsQnRuLnRleHRDb250ZW50ID0gJ9Ce0YLQvNC10L3QsCc7XG5cbiAgfSBlbHNlIGlmICh3YXkgPT09ICdjaGFuZ2UnKSB7XG4gICAgaWYgKGRhdGEgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0JTQsNC90L3QvtCz0L4g0LrQu9C40LXQvdGC0LAg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgi4nKTtcbiAgICB9XG4gIH1cblxuICBkb2N1bWVudC5ib2R5LmFwcGVuZChkYXJrQmFja2dyb3VuZCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKG1vZGFsKTtcblxuICBwbGFjZWhvbGRlcihuYW1lSW5wdXQsICfQpNCw0LzQuNC70LjRjyonKTtcbiAgcGxhY2Vob2xkZXIoc2Vjb25kTmFtZUlucHV0LCAn0JjQvNGPKicpO1xuICBwbGFjZWhvbGRlcihsYXN0TmFtZUlucHV0LCAn0J7RgtGH0LXRgdGC0LLQvicpO1xufVxuIl0sImZpbGUiOiJjcm0vbW9kYWxzLmpzIn0=
