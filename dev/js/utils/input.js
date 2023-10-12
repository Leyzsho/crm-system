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
  placeholder.textContent = value;
  placeholder.style.transform = `scale(1) translateY(${input.offsetHeight / 3.5}px)`;
  container.append(placeholder);

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
      btn.style.backgroundImage = 'url(../images/hide-password.svg)';
    } else {
      input.type = 'password';
      btn.style.backgroundImage = 'url(../images/show-password.svg)';
    }
  });
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ1dGlscy9pbnB1dC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gd2l0aG91dFNwYWNlKGlucHV0KSB7XG4gIGlucHV0LnZhbHVlID0gaW5wdXQudmFsdWUucmVwbGFjZSgvXFxzL2csICcnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9ubHlMZXR0ZXJzKGlucHV0KSB7XG4gIGlucHV0LnZhbHVlID0gaW5wdXQudmFsdWUucmVwbGFjZSgvW15hLXpBLVrQsC3Rj9CQLdCvXS9nLCAnJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwbGFjZWhvbGRlcihpbnB1dCwgdmFsdWUpIHtcbiAgY29uc3QgY29udGFpbmVyID0gaW5wdXQucGFyZW50RWxlbWVudDtcbiAgaWYgKGNvbnRhaW5lciA9PT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKCfQndC10YIg0LrQvtC90YLQtdC50L3QtdGA0LAuJyk7XG5cbiAgY29uc3QgcGxhY2Vob2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIHBsYWNlaG9sZGVyLmNsYXNzTGlzdC5hZGQoJ2lucHV0LXBsYWNlaG9sZGVyJyk7XG4gIHBsYWNlaG9sZGVyLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIHBsYWNlaG9sZGVyLnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgxKSB0cmFuc2xhdGVZKCR7aW5wdXQub2Zmc2V0SGVpZ2h0IC8gMy41fXB4KWA7XG4gIGNvbnRhaW5lci5hcHBlbmQocGxhY2Vob2xkZXIpO1xuXG4gIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgZXZlbnQgPT4ge1xuICAgIHBsYWNlaG9sZGVyLnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgwLjcpIHRyYW5zbGF0ZVkoLTEwcHgpYDtcbiAgfSk7XG5cbiAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGV2ZW50ID0+IHtcbiAgICBpZiAoaW5wdXQudmFsdWUgPT09ICcnKSB7XG4gICAgICBwbGFjZWhvbGRlci5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGUoMSkgdHJhbnNsYXRlWSgke2lucHV0Lm9mZnNldEhlaWdodCAvIDMuNX1weClgO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93SGlkZVBhc3N3b3JkKGlucHV0KSB7XG4gIGNvbnN0IGNvbnRhaW5lciA9IGlucHV0LnBhcmVudEVsZW1lbnQ7XG4gIGlmIChjb250YWluZXIgPT09IG51bGwpIHRocm93IG5ldyBFcnJvcign0J7RgtGB0YPRgtGB0YLQstGD0LXRgiDQutC+0L3RgtC10LnQvdC10YAnKTtcblxuICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgYnRuLmNsYXNzTGlzdC5hZGQoJ3Nob3ctaGlkZS1wYXNzd29yZC1idG4nKTtcbiAgYnRuLnN0eWxlLnRvcCA9IGAke2lucHV0Lm9mZnNldEhlaWdodCAvIDJ9cHhgO1xuXG4gIGNvbnRhaW5lci5hcHBlbmQoYnRuKTtcblxuICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAoaW5wdXQudHlwZSA9PT0gJ3Bhc3N3b3JkJykge1xuICAgICAgaW5wdXQudHlwZSA9ICd0ZXh0JztcbiAgICAgIGJ0bi5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKC4uL2ltYWdlcy9oaWRlLXBhc3N3b3JkLnN2ZyknO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbnB1dC50eXBlID0gJ3Bhc3N3b3JkJztcbiAgICAgIGJ0bi5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKC4uL2ltYWdlcy9zaG93LXBhc3N3b3JkLnN2ZyknO1xuICAgIH1cbiAgfSk7XG59XG4iXSwiZmlsZSI6InV0aWxzL2lucHV0LmpzIn0=
