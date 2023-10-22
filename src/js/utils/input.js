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

  const btn = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");

  btn.classList.add('show-hide-password-btn');
  btn.style.top = `${input.offsetHeight / 2}px`;
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#show-password');

  btn.append(use);
  container.append(btn);

  btn.addEventListener('click', event => {
    event.preventDefault();
    if (input.type === 'password') {
      input.type = 'text';
      use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#hide-password');
    } else {
      input.type = 'password';
      use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#show-password');
    }
  });
}
