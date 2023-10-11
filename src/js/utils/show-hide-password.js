export default function showHidePassword(input) {
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
      btn.style.backgroundImage = 'url(../images/hide-password.svg)';
    } else {
      input.type = 'password';
      btn.style.backgroundImage = 'url(../images/show-password.svg)';
    }
  });
}
