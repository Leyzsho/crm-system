import { onlyLetters, placeholder, withoutSpace } from '../utils/input.js';
import { writeClientData } from './firebase-api.js';

export function openClientModal(way, user, data) {
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
      this.twitterOption = document.createElement('option');
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
      this.twitterOption.value = 'twitter';
      this.twitterOption.textContent = 'twitter';
      this.otherOption.value = 'other';
      this.otherOption.textContent = 'другое';

      this.contactSelect.append(this.phoneOption);
      this.contactSelect.append(this.emailOption);
      this.contactSelect.append(this.vkOption);
      this.contactSelect.append(this.twitterOption);
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
      } else if (this.contactInput.dataset.type === 'twitter') {
        this.contactInput.placeholder = '@twitter';
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

  confirmBtn.addEventListener('click', event => {
    writeClientData(user.uid, {
      nameValue: nameInput.value,
      secondNameValue: secondNameInput.value,
      lastNameValue: lastNameInput.value,
      contactsArray: Contact.inputs,
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcm0vbW9kYWxzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG9ubHlMZXR0ZXJzLCBwbGFjZWhvbGRlciwgd2l0aG91dFNwYWNlIH0gZnJvbSAnLi4vdXRpbHMvaW5wdXQuanMnO1xuaW1wb3J0IHsgd3JpdGVDbGllbnREYXRhIH0gZnJvbSAnLi9maXJlYmFzZS1hcGkuanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gb3BlbkNsaWVudE1vZGFsKHdheSwgdXNlciwgZGF0YSkge1xuICBjbGFzcyBDb250YWN0IHtcbiAgICBzdGF0aWMgY291bnQgPSB3YXkgPT09ICdjcmVhdGUnID8gMCA6IGRhdGE7XG4gICAgc3RhdGljIGlucHV0cyA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IgKGxpc3QsIHtuYW1lSW5wdXQsIHNlY29uZE5hbWVJbnB1dCwgY29uZmlybUJ0bn0pIHtcbiAgICAgIHRoaXMubGlzdCA9IGxpc3Q7XG4gICAgICB0aGlzLm5hbWVJbnB1dCA9IG5hbWVJbnB1dDtcbiAgICAgIHRoaXMuc2Vjb25kTmFtZUlucHV0ID0gc2Vjb25kTmFtZUlucHV0O1xuICAgICAgdGhpcy5jb25maXJtQnRuID0gY29uZmlybUJ0bjtcbiAgICAgIENvbnRhY3QuY291bnQrKztcbiAgICAgIHRoaXMuY3JlYXRlQ29udGFjdCgpO1xuXG4gICAgICBpZiAoQ29udGFjdC5jb3VudCA+PSAxMCkge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3JlYXRlLWNvbnRhY3QnKS5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2NvbnRhY3QtYnRuLS1oaWRkZW4nKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgaW5wdXRzSGF2ZUNvbnRlbnQoKSB7XG4gICAgICBjb25zdCBhbGxWYWx1ZXNOb3RFbXB0eSA9IENvbnRhY3QuaW5wdXRzLmV2ZXJ5KGlucHV0ID0+IGlucHV0LnZhbHVlICE9PSAnJyk7XG5cbiAgICAgIGlmICghYWxsVmFsdWVzTm90RW1wdHkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCfQoyDQutCw0LrQuNGFLdGC0L4g0LrQvtC90YLQsNC60YLQvtCyINC90LXRgiDQt9C90LDRh9C10L3QuNGPLicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUNvbnRhY3QoKSB7XG4gICAgICB0aGlzLmNvbnRhY3RJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIHRoaXMuY29udGFjdFNlbGVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICAgICAgdGhpcy5jb250YWN0SW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgdGhpcy5jb250YWN0RGVsZXRlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cbiAgICAgIHRoaXMucGhvbmVPcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgIHRoaXMuZW1haWxPcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgIHRoaXMudmtPcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgIHRoaXMudHdpdHRlck9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgdGhpcy5vdGhlck9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuXG4gICAgICB0aGlzLmNvbnRhY3RJdGVtLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fY29udGFjdC1pdGVtJyk7XG4gICAgICB0aGlzLmNvbnRhY3RTZWxlY3QuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LXNlbGVjdCcpO1xuICAgICAgdGhpcy5jb250YWN0SW5wdXQuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LWlucHV0Jyk7XG4gICAgICB0aGlzLmNvbnRhY3REZWxldGVCdG4uY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LWRlbGV0ZS1idG4nKTtcblxuICAgICAgdGhpcy5waG9uZU9wdGlvbi52YWx1ZSA9ICdwaG9uZSc7XG4gICAgICB0aGlzLnBob25lT3B0aW9uLnRleHRDb250ZW50ID0gJ9GC0LXQu9C10YTQvtC9JztcbiAgICAgIHRoaXMuZW1haWxPcHRpb24udmFsdWUgPSAnZW1haWwnO1xuICAgICAgdGhpcy5lbWFpbE9wdGlvbi50ZXh0Q29udGVudCA9ICdlbWFpbCc7XG4gICAgICB0aGlzLnZrT3B0aW9uLnZhbHVlID0gJ3ZrJztcbiAgICAgIHRoaXMudmtPcHRpb24udGV4dENvbnRlbnQgPSAndmsnO1xuICAgICAgdGhpcy50d2l0dGVyT3B0aW9uLnZhbHVlID0gJ3R3aXR0ZXInO1xuICAgICAgdGhpcy50d2l0dGVyT3B0aW9uLnRleHRDb250ZW50ID0gJ3R3aXR0ZXInO1xuICAgICAgdGhpcy5vdGhlck9wdGlvbi52YWx1ZSA9ICdvdGhlcic7XG4gICAgICB0aGlzLm90aGVyT3B0aW9uLnRleHRDb250ZW50ID0gJ9C00YDRg9Cz0L7QtSc7XG5cbiAgICAgIHRoaXMuY29udGFjdFNlbGVjdC5hcHBlbmQodGhpcy5waG9uZU9wdGlvbik7XG4gICAgICB0aGlzLmNvbnRhY3RTZWxlY3QuYXBwZW5kKHRoaXMuZW1haWxPcHRpb24pO1xuICAgICAgdGhpcy5jb250YWN0U2VsZWN0LmFwcGVuZCh0aGlzLnZrT3B0aW9uKTtcbiAgICAgIHRoaXMuY29udGFjdFNlbGVjdC5hcHBlbmQodGhpcy50d2l0dGVyT3B0aW9uKTtcbiAgICAgIHRoaXMuY29udGFjdFNlbGVjdC5hcHBlbmQodGhpcy5vdGhlck9wdGlvbik7XG4gICAgICB0aGlzLmNvbnRhY3RJdGVtLmFwcGVuZCh0aGlzLmNvbnRhY3RTZWxlY3QpO1xuICAgICAgdGhpcy5jb250YWN0SXRlbS5hcHBlbmQodGhpcy5jb250YWN0SW5wdXQpO1xuICAgICAgdGhpcy5jb250YWN0SXRlbS5hcHBlbmQodGhpcy5jb250YWN0RGVsZXRlQnRuKTtcbiAgICAgIHRoaXMubGlzdC5hcHBlbmQodGhpcy5jb250YWN0SXRlbSk7XG5cbiAgICAgIHRoaXMuY29udGFjdElucHV0LmRhdGFzZXQudHlwZSA9IHRoaXMuY29udGFjdFNlbGVjdC52YWx1ZTtcbiAgICAgIHRoaXMuY29udGFjdElucHV0LnBsYWNlaG9sZGVyID0gJys3OTIyMTExMDUwMCc7XG5cbiAgICAgIENvbnRhY3QuaW5wdXRzLnB1c2godGhpcy5jb250YWN0SW5wdXQpO1xuXG4gICAgICB0aGlzLmNvbnRhY3REZWxldGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICAgIHRoaXMuZGVsZXRlQ29udGFjdCgpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuY29udGFjdFNlbGVjdC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBldmVudCA9PiB7XG4gICAgICAgIHRoaXMuY29udGFjdElucHV0LmRhdGFzZXQudHlwZSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWU7XG4gICAgICAgIHRoaXMuY2hhbmdlUGxhY2Vob2xkZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgICBuZXcgQ2hvaWNlcyh0aGlzLmNvbnRhY3RTZWxlY3QsIHtcbiAgICAgICAgc2VhcmNoRW5hYmxlZDogZmFsc2UsXG4gICAgICAgIGl0ZW1TZWxlY3RUZXh0OiAnJyxcbiAgICAgICAgcG9zaXRpb246ICdib3R0b20nLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGVsZXRlQ29udGFjdCgpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gQ29udGFjdC5pbnB1dHMuaW5kZXhPZih0aGlzLmNvbnRhY3RJbnB1dCk7XG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgQ29udGFjdC5pbnB1dHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cblxuICAgICAgY2hlY2tJbnB1dHNDb250ZW50KHRoaXMubmFtZUlucHV0LCB0aGlzLnNlY29uZE5hbWVJbnB1dCwgdGhpcy5jb25maXJtQnRuKTtcblxuICAgICAgQ29udGFjdC5jb3VudC0tO1xuICAgICAgaWYgKENvbnRhY3QuY291bnQgPT09IDApIHtcbiAgICAgICAgdGhpcy5saXN0LnJlbW92ZSgpO1xuICAgICAgfSBlbHNlIGlmIChDb250YWN0LmNvdW50ID49IDkpIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NyZWF0ZS1jb250YWN0JykuY2xhc3NMaXN0LnJlbW92ZSgnY2xpZW50LW1vZGFsX19jb250YWN0LWJ0bi0taGlkZGVuJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY29udGFjdEl0ZW0ucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgY2hhbmdlUGxhY2Vob2xkZXIoKSB7XG4gICAgICBpZiAodGhpcy5jb250YWN0SW5wdXQuZGF0YXNldC50eXBlID09PSAncGhvbmUnKSB7XG4gICAgICAgIHRoaXMuY29udGFjdElucHV0LnBsYWNlaG9sZGVyID0gJys3OTIyMTExMDUwMCc7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY29udGFjdElucHV0LmRhdGFzZXQudHlwZSA9PT0gJ2VtYWlsJykge1xuICAgICAgICB0aGlzLmNvbnRhY3RJbnB1dC5wbGFjZWhvbGRlciA9ICdleGFtcGxlQG1haWwuY29tJztcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jb250YWN0SW5wdXQuZGF0YXNldC50eXBlID09PSAndmsnKSB7XG4gICAgICAgIHRoaXMuY29udGFjdElucHV0LnBsYWNlaG9sZGVyID0gJ0B2ay5jb20vdmsnO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbnRhY3RJbnB1dC5kYXRhc2V0LnR5cGUgPT09ICd0d2l0dGVyJykge1xuICAgICAgICB0aGlzLmNvbnRhY3RJbnB1dC5wbGFjZWhvbGRlciA9ICdAdHdpdHRlcic7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY29udGFjdElucHV0LmRhdGFzZXQudHlwZSA9PT0gJ290aGVyJykge1xuICAgICAgICB0aGlzLmNvbnRhY3RJbnB1dC5wbGFjZWhvbGRlciA9ICcnO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrSW5wdXRzQ29udGVudChuYW1lSW5wdXQsIHNlY29uZE5hbWVJbnB1dCwgY29uZmlybUJ0bikge1xuICAgIHRyeSB7XG4gICAgICBDb250YWN0LmlucHV0c0hhdmVDb250ZW50KCk7XG4gICAgICBpZiAobmFtZUlucHV0LnZhbHVlICE9PSAnJyAmJiBzZWNvbmROYW1lSW5wdXQudmFsdWUgIT09ICcnKSB7XG4gICAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbmZpcm1CdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBkYXJrQmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCBjbG9zZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCB0aXRsZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gIGNvbnN0IG5hbWVMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gIGNvbnN0IHNlY29uZE5hbWVMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gIGNvbnN0IGxhc3ROYW1lTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICBjb25zdCBuYW1lSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICBjb25zdCBzZWNvbmROYW1lSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICBjb25zdCBsYXN0TmFtZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgY29uc3QgY29udGFjdENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCBjb250YWN0TGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gIGNvbnN0IGNvbnRhY3RCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgY29uc3QgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgY29uc3QgY29uZmlybUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBjb25zdCBjYW5jZWxCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblxuICBkYXJrQmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCdkYXJrLWJhY2tncm91bmQnKTtcbiAgY2xvc2VCdG4uY2xhc3NMaXN0LmFkZCgnY2xvc2UtbW9kYWwtYnRuJyk7XG4gIG1vZGFsLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbCcpO1xuICB0aXRsZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX3RpdGxlLWNvbnRhaW5lcicpO1xuICB0aXRsZS5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX3RpdGxlJyk7XG4gIG5hbWVMYWJlbC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2xhYmVsJyk7XG4gIHNlY29uZE5hbWVMYWJlbC5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2xhYmVsJyk7XG4gIGxhc3ROYW1lTGFiZWwuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19sYWJlbCcpO1xuICBuYW1lSW5wdXQuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19pbnB1dCcpO1xuICBzZWNvbmROYW1lSW5wdXQuY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19pbnB1dCcpO1xuICBsYXN0TmFtZUlucHV0LmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9faW5wdXQnKTtcbiAgY29udGFjdENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2NvbnRhY3QtY29udGFpbmVyJyk7XG4gIGNvbnRhY3RMaXN0LmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fY29udGFjdC1saXN0Jyk7XG4gIGNvbnRhY3RCdG4uY2xhc3NMaXN0LmFkZCgnY2xpZW50LW1vZGFsX19jb250YWN0LWJ0bicpO1xuICBjb25maXJtQnRuLmNsYXNzTGlzdC5hZGQoJ2NsaWVudC1tb2RhbF9fYnRuJyk7XG4gIGNhbmNlbEJ0bi5jbGFzc0xpc3QuYWRkKCdjbGllbnQtbW9kYWxfX2Rlc2NyLWJ0bicpO1xuXG4gIGNvbnRhY3RCdG4uaWQgPSAnY3JlYXRlLWNvbnRhY3QnO1xuXG4gIG5hbWVJbnB1dC50eXBlID0gJ3RleHQnO1xuICBzZWNvbmROYW1lSW5wdXQudHlwZSA9ICd0ZXh0JztcbiAgbGFzdE5hbWVJbnB1dC50eXBlID0gJ3RleHQnO1xuICBjb250YWN0QnRuLnRleHRDb250ZW50ID0gJ9CU0L7QsdCw0LLQuNGC0Ywg0LrQvtC90YLQsNC60YInO1xuICBjb250YWN0QnRuLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICBjb25maXJtQnRuLmRpc2FibGVkID0gdHJ1ZTtcblxuICB0aXRsZUNvbnRhaW5lci5hcHBlbmQodGl0bGUpO1xuICBuYW1lTGFiZWwuYXBwZW5kKG5hbWVJbnB1dCk7XG4gIHNlY29uZE5hbWVMYWJlbC5hcHBlbmQoc2Vjb25kTmFtZUlucHV0KTtcbiAgbGFzdE5hbWVMYWJlbC5hcHBlbmQobGFzdE5hbWVJbnB1dCk7O1xuICBjb250YWN0Q29udGFpbmVyLmFwcGVuZChjb250YWN0QnRuKTtcbiAgbW9kYWwuYXBwZW5kKGNsb3NlQnRuKTtcbiAgbW9kYWwuYXBwZW5kKHRpdGxlQ29udGFpbmVyKTtcbiAgbW9kYWwuYXBwZW5kKHNlY29uZE5hbWVMYWJlbCk7XG4gIG1vZGFsLmFwcGVuZChuYW1lTGFiZWwpO1xuICBtb2RhbC5hcHBlbmQobGFzdE5hbWVMYWJlbCk7XG4gIG1vZGFsLmFwcGVuZChjb250YWN0Q29udGFpbmVyKTtcbiAgbW9kYWwuYXBwZW5kKG1lc3NhZ2UpO1xuICBtb2RhbC5hcHBlbmQoY29uZmlybUJ0bik7XG4gIG1vZGFsLmFwcGVuZChjYW5jZWxCdG4pO1xuXG4gIG1vZGFsLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZXZlbnQgPT4ge1xuICAgIHdpdGhvdXRTcGFjZShldmVudC50YXJnZXQpO1xuICAgIGlmICghZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY2xpZW50LW1vZGFsX19jb250YWN0LWlucHV0JykpIHtcbiAgICAgIG9ubHlMZXR0ZXJzKGV2ZW50LnRhcmdldCk7XG4gICAgfVxuICAgIGNoZWNrSW5wdXRzQ29udGVudChuYW1lSW5wdXQsIHNlY29uZE5hbWVJbnB1dCwgY29uZmlybUJ0bik7XG4gIH0pO1xuXG4gIGNhbmNlbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50ID0+IHtcbiAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICBkYXJrQmFja2dyb3VuZC5yZW1vdmUoKTtcbiAgfSk7XG5cbiAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgbW9kYWwucmVtb3ZlKCk7XG4gICAgZGFya0JhY2tncm91bmQucmVtb3ZlKCk7XG4gIH0pO1xuXG4gIGNvbnRhY3RCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgY29udGFjdENvbnRhaW5lci5wcmVwZW5kKGNvbnRhY3RMaXN0KTtcbiAgICBuZXcgQ29udGFjdChjb250YWN0TGlzdCwge25hbWVJbnB1dCwgc2Vjb25kTmFtZUlucHV0LCBjb25maXJtQnRufSk7XG4gICAgY29uZmlybUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gIH0pO1xuXG4gIGNvbmZpcm1CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgd3JpdGVDbGllbnREYXRhKHVzZXIudWlkLCB7XG4gICAgICBuYW1lVmFsdWU6IG5hbWVJbnB1dC52YWx1ZSxcbiAgICAgIHNlY29uZE5hbWVWYWx1ZTogc2Vjb25kTmFtZUlucHV0LnZhbHVlLFxuICAgICAgbGFzdE5hbWVWYWx1ZTogbGFzdE5hbWVJbnB1dC52YWx1ZSxcbiAgICAgIGNvbnRhY3RzQXJyYXk6IENvbnRhY3QuaW5wdXRzLFxuICAgIH0pO1xuICB9KTtcblxuICBpZiAod2F5ID09PSAnY3JlYXRlJykge1xuICAgIHRpdGxlLnRleHRDb250ZW50ID0gJ9Cd0L7QstGL0Lkg0LrQu9C40LXQvdGCJztcbiAgICBjb25maXJtQnRuLnRleHRDb250ZW50ID0gJ9Ch0L7RhdGA0LDQvdC40YLRjCc7XG4gICAgY2FuY2VsQnRuLnRleHRDb250ZW50ID0gJ9Ce0YLQvNC10L3QsCc7XG5cbiAgfSBlbHNlIGlmICh3YXkgPT09ICdjaGFuZ2UnKSB7XG4gICAgaWYgKGRhdGEgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcign0JTQsNC90L3QvtCz0L4g0LrQu9C40LXQvdGC0LAg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgi4nKTtcbiAgICB9XG4gIH1cblxuICBkb2N1bWVudC5ib2R5LmFwcGVuZChkYXJrQmFja2dyb3VuZCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kKG1vZGFsKTtcblxuICBwbGFjZWhvbGRlcihzZWNvbmROYW1lSW5wdXQsICfQpNCw0LzQuNC70LjRjyonKTtcbiAgcGxhY2Vob2xkZXIobmFtZUlucHV0LCAn0JjQvNGPKicpO1xuICBwbGFjZWhvbGRlcihsYXN0TmFtZUlucHV0LCAn0J7RgtGH0LXRgdGC0LLQvicpO1xufVxuIl0sImZpbGUiOiJjcm0vbW9kYWxzLmpzIn0=
