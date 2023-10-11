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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ1dGlscy9zaG93LWhpZGUtcGFzc3dvcmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2hvd0hpZGVQYXNzd29yZChpbnB1dCkge1xuICBjb25zdCBjb250YWluZXIgPSBpbnB1dC5wYXJlbnRFbGVtZW50O1xuICBpZiAoY29udGFpbmVyID09PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YLRgdGD0YLRgdGC0LLRg9C10YIg0LrQvtC90YLQtdC50L3QtdGAJyk7XG5cbiAgY29uc3QgYnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGJ0bi5jbGFzc0xpc3QuYWRkKCdzaG93LWhpZGUtcGFzc3dvcmQtYnRuJyk7XG4gIGJ0bi5zdHlsZS50b3AgPSBgJHtpbnB1dC5vZmZzZXRIZWlnaHQgLyAyfXB4YDtcblxuICBjb250YWluZXIuYXBwZW5kKGJ0bik7XG5cbiAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKGlucHV0LnR5cGUgPT09ICdwYXNzd29yZCcpIHtcbiAgICAgIGlucHV0LnR5cGUgPSAndGV4dCc7XG4gICAgICBidG4uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ3VybCguLi9pbWFnZXMvaGlkZS1wYXNzd29yZC5zdmcpJztcbiAgICB9IGVsc2Uge1xuICAgICAgaW5wdXQudHlwZSA9ICdwYXNzd29yZCc7XG4gICAgICBidG4uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ3VybCguLi9pbWFnZXMvc2hvdy1wYXNzd29yZC5zdmcpJztcbiAgICB9XG4gIH0pO1xufVxuIl0sImZpbGUiOiJ1dGlscy9zaG93LWhpZGUtcGFzc3dvcmQuanMifQ==
