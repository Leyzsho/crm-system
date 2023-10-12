import { onlyLetters, placeholder, withoutSpace } from '../utils/input.js';

export function openClientModal(way, data) {
  class Contact {
    static count = data ? 5 : 0;
    static requiredInputs = [];

    constructor (list) {
      this.list = list;
      this.requiredInputs = requiredInputs;
      Contact.count++;
      this.createContact();

      if (Contact.count >= 10) {
        document.getElementById('create-contact').classList.add('client-modal__contact-btn--hidden');
      }
    }

    static checkRequiredInputs() {
      const allValuesNotEmpty = Contact.requiredInputs.every(input => input.value !== '');

      if (!allValuesNotEmpty) {
        throw new Error();
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
      this.twitterOption = document.createElement('option');

      this.contactItem.classList.add('client-modal__contact-item');
      this.contactSelect.classList.add('client-modal__contact-select');
      this.contactInput.classList.add('client-modal__contact-input');
      this.contactDeleteBtn.classList.add('client-modal__contact-delete-btn');

      this.phoneOption.value = 'телефон';
      this.emailOption.value = 'email';
      this.vkOption.value = 'vk';
      this.twitterOption.value = 'twitter';
      this.phoneOption.textContent = 'телефон';
      this.emailOption.textContent = 'email';
      this.vkOption.textContent = 'vk';
      this.twitterOption.textContent = 'twitter';

      this.contactInput.placeholder = '+79221110500';

      this.contactSelect.append(this.phoneOption);
      this.contactSelect.append(this.emailOption);
      this.contactSelect.append(this.vkOption);
      this.contactSelect.append(this.twitterOption);
      this.contactItem.append(this.contactSelect);
      this.contactItem.append(this.contactInput);
      this.contactItem.append(this.contactDeleteBtn);
      this.list.append(this.contactItem);

      Contact.requiredInputs.push(this.contactInput);

      this.contactDeleteBtn.addEventListener('click', event => {
        this.deleteContact();
      });

      this.contactSelect.addEventListener('change', event => {
        this.changePlaceholder();
      });

      new Choices(this.contactSelect, {
        searchEnabled: false,
        itemSelectText: '',
        position: 'bottom',
      });
    }

    deleteContact() {
      Contact.count--;
      if (Contact.count === 0) {
        this.list.remove();
      } else if (Contact.count >= 9) {
        document.getElementById('create-contact').classList.remove('client-modal__contact-btn--hidden');
      }
      this.contactItem.remove();
      Contact.requiredInputs.splice(1, this.contactInput);
    }

    changePlaceholder() {
      if (this.contactSelect.value === 'телефон') {
        this.contactInput.placeholder = '+79221110500';
      } else if (this.contactSelect.value === 'email') {
        this.contactInput.placeholder = 'example@mail.com';
      } else if (this.contactSelect.value === 'vk') {
        this.contactInput.placeholder = '@vk.com/example';
      } else if (this.contactSelect.value === 'twitter') {
        this.contactInput.placeholder = '@example';
      }
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

  const requiredInputs = [nameInput, secondNameInput];

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
  modal.append(nameLabel);
  modal.append(secondNameLabel);
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

    try {
      Contact.checkRequiredInputs();
      if (nameInput.value !== '' && secondNameInput.value !== '') {
        confirmBtn.disabled = false;
      } else {
        confirmBtn.disabled = true;
      }
    } catch (error) {
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
    const contact = new Contact(contactList);
    confirmBtn.disabled = true;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcm0vbW9kYWxzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG9ubHlMZXR0ZXJzLCBwbGFjZWhvbGRlciwgd2l0aG91dFNwYWNlIH0gZnJvbSAnLi4vdXRpbHMvaW5wdXQuanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gb3BlbkNsaWVudE1vZGFsKHdheSwgZGF0YSkge1xuICBjbGFzcyBDb250YWN0IHtcbiAgICBzdGF0aWMgY291bnQgPSBkYXRhID8gNSA6IDA7XG4gICAgc3RhdGljIHJlcXVpcmVkSW5wdXRzID0gW107XG5cbiAgICBjb25zdHJ1Y3RvciAobGlzdCkge1xuICAgICAgdGhpcy5saXN0ID0gbGlzdDtcbiAgICAgIHRoaXMucmVxdWlyZWRJbnB1dHMgPSByZXF1aXJlZElucHV0cztcbiAgICAgIENvbnRhY3QuY291bnQrKztcbiAgICAgIHRoaXMuY3JlYXRlQ29udGFjdCgpO1xuXG4gICAgICBpZiAoQ29udGFjdC5jb3VudCA+PSAxMCkge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3JlYXRlLWNvbnRhY3QnKS5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2NvbnRhY3QtYnRuLS1oaWRkZW4nKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgY2hlY2tSZXF1aXJlZElucHV0cygpIHtcbiAgICAgIGNvbnN0IGFsbFZhbHVlc05vdEVtcHR5ID0gQ29udGFjdC5yZXF1aXJlZElucHV0cy5ldmVyeShpbnB1dCA9PiBpbnB1dC52YWx1ZSAhPT0gJycpO1xuXG4gICAgICBpZiAoIWFsbFZhbHVlc05vdEVtcHR5KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUNvbnRhY3QoKSB7XG4gICAgICB0aGlzLmNvbnRhY3RJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIHRoaXMuY29udGFjdFNlbGVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICAgICAgdGhpcy5jb250YWN0SW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgdGhpcy5jb250YWN0RGVsZXRlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cbiAgICAgIHRoaXMucGhvbmVPcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgIHRoaXMuZW1haWxPcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgIHRoaXMudmtPcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgIHRoaXMudHdpdHRlck9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuXG4gICAgICB0aGlzLmNvbnRhY3RJdGVtLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fY29udGFjdC1pdGVtJyk7XG4gICAgICB0aGlzLmNvbnRhY3RTZWxlY3QuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LXNlbGVjdCcpO1xuICAgICAgdGhpcy5jb250YWN0SW5wdXQuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LWlucHV0Jyk7XG4gICAgICB0aGlzLmNvbnRhY3REZWxldGVCdG4uY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LWRlbGV0ZS1idG4nKTtcblxuICAgICAgdGhpcy5waG9uZU9wdGlvbi52YWx1ZSA9ICfRgtC10LvQtdGE0L7QvSc7XG4gICAgICB0aGlzLmVtYWlsT3B0aW9uLnZhbHVlID0gJ2VtYWlsJztcbiAgICAgIHRoaXMudmtPcHRpb24udmFsdWUgPSAndmsnO1xuICAgICAgdGhpcy50d2l0dGVyT3B0aW9uLnZhbHVlID0gJ3R3aXR0ZXInO1xuICAgICAgdGhpcy5waG9uZU9wdGlvbi50ZXh0Q29udGVudCA9ICfRgtC10LvQtdGE0L7QvSc7XG4gICAgICB0aGlzLmVtYWlsT3B0aW9uLnRleHRDb250ZW50ID0gJ2VtYWlsJztcbiAgICAgIHRoaXMudmtPcHRpb24udGV4dENvbnRlbnQgPSAndmsnO1xuICAgICAgdGhpcy50d2l0dGVyT3B0aW9uLnRleHRDb250ZW50ID0gJ3R3aXR0ZXInO1xuXG4gICAgICB0aGlzLmNvbnRhY3RJbnB1dC5wbGFjZWhvbGRlciA9ICcrNzkyMjExMTA1MDAnO1xuXG4gICAgICB0aGlzLmNvbnRhY3RTZWxlY3QuYXBwZW5kKHRoaXMucGhvbmVPcHRpb24pO1xuICAgICAgdGhpcy5jb250YWN0U2VsZWN0LmFwcGVuZCh0aGlzLmVtYWlsT3B0aW9uKTtcbiAgICAgIHRoaXMuY29udGFjdFNlbGVjdC5hcHBlbmQodGhpcy52a09wdGlvbik7XG4gICAgICB0aGlzLmNvbnRhY3RTZWxlY3QuYXBwZW5kKHRoaXMudHdpdHRlck9wdGlvbik7XG4gICAgICB0aGlzLmNvbnRhY3RJdGVtLmFwcGVuZCh0aGlzLmNvbnRhY3RTZWxlY3QpO1xuICAgICAgdGhpcy5jb250YWN0SXRlbS5hcHBlbmQodGhpcy5jb250YWN0SW5wdXQpO1xuICAgICAgdGhpcy5jb250YWN0SXRlbS5hcHBlbmQodGhpcy5jb250YWN0RGVsZXRlQnRuKTtcbiAgICAgIHRoaXMubGlzdC5hcHBlbmQodGhpcy5jb250YWN0SXRlbSk7XG5cbiAgICAgIENvbnRhY3QucmVxdWlyZWRJbnB1dHMucHVzaCh0aGlzLmNvbnRhY3RJbnB1dCk7XG5cbiAgICAgIHRoaXMuY29udGFjdERlbGV0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICAgICAgdGhpcy5kZWxldGVDb250YWN0KCk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5jb250YWN0U2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGV2ZW50ID0+IHtcbiAgICAgICAgdGhpcy5jaGFuZ2VQbGFjZWhvbGRlcigpO1xuICAgICAgfSk7XG5cbiAgICAgIG5ldyBDaG9pY2VzKHRoaXMuY29udGFjdFNlbGVjdCwge1xuICAgICAgICBzZWFyY2hFbmFibGVkOiBmYWxzZSxcbiAgICAgICAgaXRlbVNlbGVjdFRleHQ6ICcnLFxuICAgICAgICBwb3NpdGlvbjogJ2JvdHRvbScsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBkZWxldGVDb250YWN0KCkge1xuICAgICAgQ29udGFjdC5jb3VudC0tO1xuICAgICAgaWYgKENvbnRhY3QuY291bnQgPT09IDApIHtcbiAgICAgICAgdGhpcy5saXN0LnJlbW92ZSgpO1xuICAgICAgfSBlbHNlIGlmIChDb250YWN0LmNvdW50ID49IDkpIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NyZWF0ZS1jb250YWN0JykuY2xhc3NMaXN0LnJlbW92ZSgnY2xpZW50LW1vZGFsX19jb250YWN0LWJ0bi0taGlkZGVuJyk7XG4gICAgICB9XG4gICAgICB0aGlzLmNvbnRhY3RJdGVtLnJlbW92ZSgpO1xuICAgICAgQ29udGFjdC5yZXF1aXJlZElucHV0cy5zcGxpY2UoMSwgdGhpcy5jb250YWN0SW5wdXQpO1xuICAgIH1cblxuICAgIGNoYW5nZVBsYWNlaG9sZGVyKCkge1xuICAgICAgaWYgKHRoaXMuY29udGFjdFNlbGVjdC52YWx1ZSA9PT0gJ9GC0LXQu9C10YTQvtC9Jykge1xuICAgICAgICB0aGlzLmNvbnRhY3RJbnB1dC5wbGFjZWhvbGRlciA9ICcrNzkyMjExMTA1MDAnO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbnRhY3RTZWxlY3QudmFsdWUgPT09ICdlbWFpbCcpIHtcbiAgICAgICAgdGhpcy5jb250YWN0SW5wdXQucGxhY2Vob2xkZXIgPSAnZXhhbXBsZUBtYWlsLmNvbSc7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY29udGFjdFNlbGVjdC52YWx1ZSA9PT0gJ3ZrJykge1xuICAgICAgICB0aGlzLmNvbnRhY3RJbnB1dC5wbGFjZWhvbGRlciA9ICdAdmsuY29tL2V4YW1wbGUnO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbnRhY3RTZWxlY3QudmFsdWUgPT09ICd0d2l0dGVyJykge1xuICAgICAgICB0aGlzLmNvbnRhY3RJbnB1dC5wbGFjZWhvbGRlciA9ICdAZXhhbXBsZSc7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZGFya0JhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgY2xvc2VCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgdGl0bGVDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICBjb25zdCBuYW1lTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICBjb25zdCBzZWNvbmROYW1lTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICBjb25zdCBsYXN0TmFtZUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgY29uc3QgbmFtZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgY29uc3Qgc2Vjb25kTmFtZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgY29uc3QgbGFzdE5hbWVJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gIGNvbnN0IGNvbnRhY3RDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29uc3QgY29udGFjdExpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICBjb25zdCBjb250YWN0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIGNvbnN0IGNvbmZpcm1CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgY2FuY2VsQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cbiAgY29uc3QgcmVxdWlyZWRJbnB1dHMgPSBbbmFtZUlucHV0LCBzZWNvbmROYW1lSW5wdXRdO1xuXG4gIGRhcmtCYWNrZ3JvdW5kLmNsYXNzTGlzdC5hZGQoJ2RhcmstYmFja2dyb3VuZCcpO1xuICBjbG9zZUJ0bi5jbGFzc0xpc3QuYWRkKCdjbG9zZS1tb2RhbC1idG4nKTtcbiAgbW9kYWwuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsJyk7XG4gIHRpdGxlQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fdGl0bGUtY29udGFpbmVyJyk7XG4gIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fdGl0bGUnKTtcbiAgbmFtZUxhYmVsLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fbGFiZWwnKTtcbiAgc2Vjb25kTmFtZUxhYmVsLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fbGFiZWwnKTtcbiAgbGFzdE5hbWVMYWJlbC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2xhYmVsJyk7XG4gIG5hbWVJbnB1dC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2lucHV0Jyk7XG4gIHNlY29uZE5hbWVJbnB1dC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2lucHV0Jyk7XG4gIGxhc3ROYW1lSW5wdXQuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19pbnB1dCcpO1xuICBjb250YWN0Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fY29udGFjdC1jb250YWluZXInKTtcbiAgY29udGFjdExpc3QuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LWxpc3QnKTtcbiAgY29udGFjdEJ0bi5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2NvbnRhY3QtYnRuJyk7XG4gIGNvbmZpcm1CdG4uY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19idG4nKTtcbiAgY2FuY2VsQnRuLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fZGVzY3ItYnRuJyk7XG5cbiAgY29udGFjdEJ0bi5pZCA9ICdjcmVhdGUtY29udGFjdCc7XG5cbiAgbmFtZUlucHV0LnR5cGUgPSAndGV4dCc7XG4gIHNlY29uZE5hbWVJbnB1dC50eXBlID0gJ3RleHQnO1xuICBsYXN0TmFtZUlucHV0LnR5cGUgPSAndGV4dCc7XG4gIGNvbnRhY3RCdG4udGV4dENvbnRlbnQgPSAn0JTQvtCx0LDQstC40YLRjCDQutC+0L3RgtCw0LrRgic7XG4gIGNvbnRhY3RCdG4uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJyk7XG4gIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuXG4gIHRpdGxlQ29udGFpbmVyLmFwcGVuZCh0aXRsZSk7XG4gIG5hbWVMYWJlbC5hcHBlbmQobmFtZUlucHV0KTtcbiAgc2Vjb25kTmFtZUxhYmVsLmFwcGVuZChzZWNvbmROYW1lSW5wdXQpO1xuICBsYXN0TmFtZUxhYmVsLmFwcGVuZChsYXN0TmFtZUlucHV0KTs7XG4gIGNvbnRhY3RDb250YWluZXIuYXBwZW5kKGNvbnRhY3RCdG4pO1xuICBtb2RhbC5hcHBlbmQoY2xvc2VCdG4pO1xuICBtb2RhbC5hcHBlbmQodGl0bGVDb250YWluZXIpO1xuICBtb2RhbC5hcHBlbmQobmFtZUxhYmVsKTtcbiAgbW9kYWwuYXBwZW5kKHNlY29uZE5hbWVMYWJlbCk7XG4gIG1vZGFsLmFwcGVuZChsYXN0TmFtZUxhYmVsKTtcbiAgbW9kYWwuYXBwZW5kKGNvbnRhY3RDb250YWluZXIpO1xuICBtb2RhbC5hcHBlbmQobWVzc2FnZSk7XG4gIG1vZGFsLmFwcGVuZChjb25maXJtQnRuKTtcbiAgbW9kYWwuYXBwZW5kKGNhbmNlbEJ0bik7XG5cbiAgbW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBldmVudCA9PiB7XG4gICAgd2l0aG91dFNwYWNlKGV2ZW50LnRhcmdldCk7XG4gICAgaWYgKCFldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjbGllbnQtbW9kYWxfX2NvbnRhY3QtaW5wdXQnKSkge1xuICAgICAgb25seUxldHRlcnMoZXZlbnQudGFyZ2V0KTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgQ29udGFjdC5jaGVja1JlcXVpcmVkSW5wdXRzKCk7XG4gICAgICBpZiAobmFtZUlucHV0LnZhbHVlICE9PSAnJyAmJiBzZWNvbmROYW1lSW5wdXQudmFsdWUgIT09ICcnKSB7XG4gICAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIGNhbmNlbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcbiAgfSk7XG5cbiAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgbW9kYWwucmVtb3ZlKCk7XG4gICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XG4gIH0pO1xuXG4gIGNvbnRhY3RCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgY29udGFjdENvbnRhaW5lci5wcmVwZW5kKGNvbnRhY3RMaXN0KTtcbiAgICBjb25zdCBjb250YWN0ID0gbmV3IENvbnRhY3QoY29udGFjdExpc3QpO1xuICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuICB9KTtcblxuICBpZiAod2F5ID09PSAnY3JlYXRlJykge1xuICAgIHRpdGxlLnRleHRDb250ZW50ID0gJ9Cd0L7QstGL0Lkg0LrQu9C40LXQvdGCJztcbiAgICBjb25maXJtQnRuLnRleHRDb250ZW50ID0gJ9Ch0L7RhdGA0LDQvdC40YLRjCc7XG4gICAgY2FuY2VsQnRuLnRleHRDb250ZW50ID0gJ9Ce0YLQvNC10L3QsCc7XG5cbiAgfSBlbHNlIGlmICh3YXkgPT09ICdjaGFuZ2UnKSB7XG4gICAgaWYgKGRhdGEgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0JTQsNC90L3QvtCz0L4g0LrQu9C40LXQvdGC0LAg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgi4nKTtcbiAgICB9XG4gIH1cblxuICBkb2N1bWVudC5ib2R5LmFwcGVuZChkYXJrQmFja2dyb3VuZCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKG1vZGFsKTtcblxuICBwbGFjZWhvbGRlcihuYW1lSW5wdXQsICfQpNCw0LzQuNC70LjRjyonKTtcbiAgcGxhY2Vob2xkZXIoc2Vjb25kTmFtZUlucHV0LCAn0JjQvNGPKicpO1xuICBwbGFjZWhvbGRlcihsYXN0TmFtZUlucHV0LCAn0J7RgtGH0LXRgdGC0LLQvicpO1xufVxuIl0sImZpbGUiOiJjcm0vbW9kYWxzLmpzIn0=
