import { onlyLetters, placeholder, withoutSpace } from '../utils/input.js';

export function openClientModal(way, data) {
  function createContact(list) {
    const contactItem = document.createElement('li');
    const contactSelect = document.createElement('select');
    const contactInput = document.createElement('input');
    const contactDeleteBtn = document.createElement('button');

    contactItem.classList.add('client-modal__contact-item');
    contactSelect.classList.add('client-modal__contact-select');
    contactInput.classList.add('client-modal__contact-input');
    contactDeleteBtn.classList.add('client-modal__delete-btn');

    contactItem.append(contactSelect);
    contactItem.append(contactInput);
    contactItem.append(contactDeleteBtn);
    list.append(contactItem);
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
  modal.append(nameLabel);
  modal.append(secondNameLabel);
  modal.append(lastNameLabel);
  modal.append(contactContainer);
  modal.append(message);
  modal.append(confirmBtn);
  modal.append(cancelBtn);

  modal.addEventListener('input', event => {
    withoutSpace(event.target);
    onlyLetters(event.target);
    if (nameInput.value !== '' && secondNameInput.value !== '') {
      confirmBtn.disabled = false;
    } else {
      confirmBtn.disabled = true;
    }
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
    createContact(contactList);
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

  placeholder(nameInput, 'Фамилия*');
  placeholder(secondNameInput, 'Имя*');
  placeholder(lastNameInput, 'Отчество');
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcm0vbW9kYWxzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG9ubHlMZXR0ZXJzLCBwbGFjZWhvbGRlciwgd2l0aG91dFNwYWNlIH0gZnJvbSAnLi4vdXRpbHMvaW5wdXQuanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gb3BlbkNsaWVudE1vZGFsKHdheSwgZGF0YSkge1xuICBmdW5jdGlvbiBjcmVhdGVDb250YWN0KGxpc3QpIHtcbiAgICBjb25zdCBjb250YWN0SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgY29uc3QgY29udGFjdFNlbGVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICAgIGNvbnN0IGNvbnRhY3RJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgY29uc3QgY29udGFjdERlbGV0ZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXG4gICAgY29udGFjdEl0ZW0uY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LWl0ZW0nKTtcbiAgICBjb250YWN0U2VsZWN0LmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fY29udGFjdC1zZWxlY3QnKTtcbiAgICBjb250YWN0SW5wdXQuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LWlucHV0Jyk7XG4gICAgY29udGFjdERlbGV0ZUJ0bi5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2RlbGV0ZS1idG4nKTtcblxuICAgIGNvbnRhY3RJdGVtLmFwcGVuZChjb250YWN0U2VsZWN0KTtcbiAgICBjb250YWN0SXRlbS5hcHBlbmQoY29udGFjdElucHV0KTtcbiAgICBjb250YWN0SXRlbS5hcHBlbmQoY29udGFjdERlbGV0ZUJ0bik7XG4gICAgbGlzdC5hcHBlbmQoY29udGFjdEl0ZW0pO1xuICB9XG5cbiAgY29uc3QgZGFya0JhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgY2xvc2VCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgdGl0bGVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICBjb25zdCBuYW1lTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICBjb25zdCBzZWNvbmROYW1lTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICBjb25zdCBsYXN0TmFtZUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgY29uc3QgbmFtZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgY29uc3Qgc2Vjb25kTmFtZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgY29uc3QgbGFzdE5hbWVJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gIGNvbnN0IGNvbnRhY3RDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgY29udGFjdExpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICBjb25zdCBjb250YWN0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIGNvbnN0IGNvbmZpcm1CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgY2FuY2VsQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cbiAgZGFya0JhY2tncm91bmQuY2xhc3NMaXN0LmFkZCgnZGFyay1iYWNrZ3JvdW5kJyk7XG4gIGNsb3NlQnRuLmNsYXNzTGlzdC5hZGQoJ2Nsb3NlLW1vZGFsLWJ0bicpO1xuICBtb2RhbC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWwnKTtcbiAgdGl0bGVDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX190aXRsZS1jb250YWluZXInKTtcbiAgdGl0bGUuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX190aXRsZScpO1xuICBuYW1lTGFiZWwuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19sYWJlbCcpO1xuICBzZWNvbmROYW1lTGFiZWwuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19sYWJlbCcpO1xuICBsYXN0TmFtZUxhYmVsLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fbGFiZWwnKTtcbiAgbmFtZUlucHV0LmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9faW5wdXQnKTtcbiAgc2Vjb25kTmFtZUlucHV0LmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9faW5wdXQnKTtcbiAgbGFzdE5hbWVJbnB1dC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2lucHV0Jyk7XG4gIGNvbnRhY3RDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LWNvbnRhaW5lcicpO1xuICBjb250YWN0TGlzdC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2NvbnRhY3QtbGlzdCcpO1xuICBjb250YWN0QnRuLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fY29udGFjdC1idG4nKTtcbiAgY29uZmlybUJ0bi5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2J0bicpO1xuICBjYW5jZWxCdG4uY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19kZXNjci1idG4nKTtcblxuICBuYW1lSW5wdXQudHlwZSA9ICd0ZXh0JztcbiAgc2Vjb25kTmFtZUlucHV0LnR5cGUgPSAndGV4dCc7XG4gIGxhc3ROYW1lSW5wdXQudHlwZSA9ICd0ZXh0JztcbiAgY29udGFjdEJ0bi50ZXh0Q29udGVudCA9ICfQlNC+0LHQsNCy0LjRgtGMINC60L7QvdGC0LDQutGCJztcbiAgY29udGFjdEJ0bi5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJzAnKTtcbiAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgdGl0bGVDb250YWluZXIuYXBwZW5kKHRpdGxlKTtcbiAgbmFtZUxhYmVsLmFwcGVuZChuYW1lSW5wdXQpO1xuICBzZWNvbmROYW1lTGFiZWwuYXBwZW5kKHNlY29uZE5hbWVJbnB1dCk7XG4gIGxhc3ROYW1lTGFiZWwuYXBwZW5kKGxhc3ROYW1lSW5wdXQpOztcbiAgY29udGFjdENvbnRhaW5lci5hcHBlbmQoY29udGFjdEJ0bik7XG4gIG1vZGFsLmFwcGVuZChjbG9zZUJ0bik7XG4gIG1vZGFsLmFwcGVuZCh0aXRsZUNvbnRhaW5lcik7XG4gIG1vZGFsLmFwcGVuZChuYW1lTGFiZWwpO1xuICBtb2RhbC5hcHBlbmQoc2Vjb25kTmFtZUxhYmVsKTtcbiAgbW9kYWwuYXBwZW5kKGxhc3ROYW1lTGFiZWwpO1xuICBtb2RhbC5hcHBlbmQoY29udGFjdENvbnRhaW5lcik7XG4gIG1vZGFsLmFwcGVuZChtZXNzYWdlKTtcbiAgbW9kYWwuYXBwZW5kKGNvbmZpcm1CdG4pO1xuICBtb2RhbC5hcHBlbmQoY2FuY2VsQnRuKTtcblxuICBtb2RhbC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGV2ZW50ID0+IHtcbiAgICB3aXRob3V0U3BhY2UoZXZlbnQudGFyZ2V0KTtcbiAgICBvbmx5TGV0dGVycyhldmVudC50YXJnZXQpO1xuICAgIGlmIChuYW1lSW5wdXQudmFsdWUgIT09ICcnICYmIHNlY29uZE5hbWVJbnB1dC52YWx1ZSAhPT0gJycpIHtcbiAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICBjYW5jZWxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgbW9kYWwucmVtb3ZlKCk7XG4gICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XG4gIH0pO1xuXG4gIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgIG1vZGFsLnJlbW92ZSgpO1xuICAgIGRhcmtCYWNrZ3JvdW5kLnJlbW92ZSgpO1xuICB9KTtcblxuICBjb250YWN0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgIGNvbnRhY3RDb250YWluZXIucHJlcGVuZChjb250YWN0TGlzdCk7XG4gICAgY3JlYXRlQ29udGFjdChjb250YWN0TGlzdCk7XG4gIH0pO1xuXG4gIGlmICh3YXkgPT09ICdjcmVhdGUnKSB7XG4gICAgdGl0bGUudGV4dENvbnRlbnQgPSAn0J3QvtCy0YvQuSDQutC70LjQtdC90YInO1xuICAgIGNvbmZpcm1CdG4udGV4dENvbnRlbnQgPSAn0KHQvtGF0YDQsNC90LjRgtGMJztcbiAgICBjYW5jZWxCdG4udGV4dENvbnRlbnQgPSAn0J7RgtC80LXQvdCwJztcblxuICB9IGVsc2UgaWYgKHdheSA9PT0gJ2NoYW5nZScpIHtcbiAgICBpZiAoZGF0YSA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQlNCw0L3QvdC+0LPQviDQutC70LjQtdC90YLQsCDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCLicpO1xuICAgIH1cbiAgfVxuXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKGRhcmtCYWNrZ3JvdW5kKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQobW9kYWwpO1xuXG4gIHBsYWNlaG9sZGVyKG5hbWVJbnB1dCwgJ9Ck0LDQvNC40LvQuNGPKicpO1xuICBwbGFjZWhvbGRlcihzZWNvbmROYW1lSW5wdXQsICfQmNC80Y8qJyk7XG4gIHBsYWNlaG9sZGVyKGxhc3ROYW1lSW5wdXQsICfQntGC0YfQtdGB0YLQstC+Jyk7XG59XG4iXSwiZmlsZSI6ImNybS9tb2RhbHMuanMifQ==
