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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ1dGlscy9pbnB1dC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gd2l0aG91dFNwYWNlKGlucHV0KSB7XG4gIGlucHV0LnZhbHVlID0gaW5wdXQudmFsdWUucmVwbGFjZSgvXFxzL2csICcnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9ubHlMZXR0ZXJzKGlucHV0KSB7XG4gIGlucHV0LnZhbHVlID0gaW5wdXQudmFsdWUucmVwbGFjZSgvW15hLXpBLVrQsC3Rj9CQLdCvXS9nLCAnJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwbGFjZWhvbGRlcihpbnB1dCwgdmFsdWUpIHtcbiAgY29uc3QgY29udGFpbmVyID0gaW5wdXQucGFyZW50RWxlbWVudDtcbiAgaWYgKGNvbnRhaW5lciA9PT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKCfQndC10YIg0LrQvtC90YLQtdC50L3QtdGA0LAuJyk7XG5cbiAgY29uc3QgcGxhY2Vob2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIHBsYWNlaG9sZGVyLmNsYXNzTGlzdC5hZGQoJ2lucHV0LXBsYWNlaG9sZGVyJyk7XG4gIGNvbnRhaW5lci5hcHBlbmQocGxhY2Vob2xkZXIpO1xuICBwbGFjZWhvbGRlci50ZXh0Q29udGVudCA9IHZhbHVlO1xuXG4gIGlmIChpbnB1dC52YWx1ZSA9PT0gJycpIHtcbiAgICBwbGFjZWhvbGRlci5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGUoMSkgdHJhbnNsYXRlWSgke2lucHV0Lm9mZnNldEhlaWdodCAvIDMuNX1weClgO1xuICB9IGVsc2Uge1xuICAgIHBsYWNlaG9sZGVyLnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgwLjcpIHRyYW5zbGF0ZVkoLTEwcHgpYDtcbiAgfVxuXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIHBsYWNlaG9sZGVyLnN0eWxlLnRyYW5zaXRpb24gPSAndHJhbnNmb3JtIC4zcyBlYXNlLWluLW91dCc7XG4gIH0sIDMwMCk7XG5cblxuICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIGV2ZW50ID0+IHtcbiAgICBwbGFjZWhvbGRlci5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGUoMC43KSB0cmFuc2xhdGVZKC0xMHB4KWA7XG4gIH0pO1xuXG4gIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBldmVudCA9PiB7XG4gICAgaWYgKGlucHV0LnZhbHVlID09PSAnJykge1xuICAgICAgcGxhY2Vob2xkZXIuc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlKDEpIHRyYW5zbGF0ZVkoJHtpbnB1dC5vZmZzZXRIZWlnaHQgLyAzLjV9cHgpYDtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hvd0hpZGVQYXNzd29yZChpbnB1dCkge1xuICBjb25zdCBjb250YWluZXIgPSBpbnB1dC5wYXJlbnRFbGVtZW50O1xuICBpZiAoY29udGFpbmVyID09PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoJ9Ce0YLRgdGD0YLRgdGC0LLRg9C10YIg0LrQvtC90YLQtdC50L3QtdGAJyk7XG5cbiAgY29uc3QgYnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgXCJzdmdcIik7XG4gIGNvbnN0IHVzZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwidXNlXCIpO1xuXG4gIGJ0bi5jbGFzc0xpc3QuYWRkKCdzaG93LWhpZGUtcGFzc3dvcmQtYnRuJyk7XG4gIGJ0bi5zdHlsZS50b3AgPSBgJHtpbnB1dC5vZmZzZXRIZWlnaHQgLyAyfXB4YDtcbiAgdXNlLnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgJ3hsaW5rOmhyZWYnLCAnI3Nob3ctcGFzc3dvcmQnKTtcblxuICBidG4uYXBwZW5kKHVzZSk7XG4gIGNvbnRhaW5lci5hcHBlbmQoYnRuKTtcblxuICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAoaW5wdXQudHlwZSA9PT0gJ3Bhc3N3b3JkJykge1xuICAgICAgaW5wdXQudHlwZSA9ICd0ZXh0JztcbiAgICAgIHVzZS5zZXRBdHRyaWJ1dGVOUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycsICd4bGluazpocmVmJywgJyNoaWRlLXBhc3N3b3JkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlucHV0LnR5cGUgPSAncGFzc3dvcmQnO1xuICAgICAgdXNlLnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgJ3hsaW5rOmhyZWYnLCAnI3Nob3ctcGFzc3dvcmQnKTtcbiAgICB9XG4gIH0pO1xufVxuIl0sImZpbGUiOiJ1dGlscy9pbnB1dC5qcyJ9
