export function withoutSpace(input) {
  input.value = input.value.replace(/\s/g, '');
}

export function onlyLetters(input) {
  input.value = input.value.replace(/[^a-zA-Zа-яА-Я]/g, '');
}

export function placeholder(input, value) {
  const container = input.parentElement;
  if (container === null) throw new Error('Нет контейнера.');

  const placeholder = document.createElement('span');
  placeholder.classList.add('input-placeholder');
  container.append(placeholder);
  placeholder.textContent = value;

  if (input.value === '') {
    placeholder.style.transform = `scale(1) translateY(${input.offsetHeight / 3.5}px)`;
  } else {
    placeholder.style.transform = `scale(0.7) translateY(-10px)`;
  }

  setTimeout(() => {
    placeholder.style.transition = 'transform .3s ease-in-out';
  }, 300);


  input.addEventListener('focus', event => {
    placeholder.style.transform = `scale(0.7) translateY(-10px)`;
  });

  input.addEventListener('blur', event => {
    if (input.value === '') {
      placeholder.style.transform = `scale(1) translateY(${input.offsetHeight / 3.5}px)`;
    }
  });
}

export function showHidePassword(input) {
  const container = input.parentElement;
  if (container === null) throw new Error('Отсутствует контейнер');

  const btn = document.createElement('button');
  btn.classList.add('show-hide-password-btn');
  btn.style.top = `${input.offsetHeight / 2}px`;

  container.append(btn);

  btn.addEventListener('click', event => {
    event.preventDefault();
    if (input.type === 'password') {
      input.type = 'text';
      btn.style.backgroundImage = 'url(../../images/hide-password.svg)';
    } else {
      input.type = 'password';
      btn.style.backgroundImage = 'url(../../images/show-password.svg)';
    }
  });
}
