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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ1dGlscy9pbnB1dC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gd2l0aG91dFNwYWNlKGlucHV0KSB7XHJcbiAgaW5wdXQudmFsdWUgPSBpbnB1dC52YWx1ZS5yZXBsYWNlKC9cXHMvZywgJycpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gb25seUxldHRlcnMoaW5wdXQpIHtcclxuICBpbnB1dC52YWx1ZSA9IGlucHV0LnZhbHVlLnJlcGxhY2UoL1teYS16QS1a0LAt0Y/QkC3Qr10vZywgJycpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGxhY2Vob2xkZXIoaW5wdXQsIHZhbHVlKSB7XHJcbiAgY29uc3QgY29udGFpbmVyID0gaW5wdXQucGFyZW50RWxlbWVudDtcclxuICBpZiAoY29udGFpbmVyID09PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoJ9Cd0LXRgiDQutC+0L3RgtC10LnQvdC10YDQsC4nKTtcclxuXHJcbiAgY29uc3QgcGxhY2Vob2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgcGxhY2Vob2xkZXIuY2xhc3NMaXN0LmFkZCgnaW5wdXQtcGxhY2Vob2xkZXInKTtcclxuICBjb250YWluZXIuYXBwZW5kKHBsYWNlaG9sZGVyKTtcclxuICBwbGFjZWhvbGRlci50ZXh0Q29udGVudCA9IHZhbHVlO1xyXG5cclxuICBpZiAoaW5wdXQudmFsdWUgPT09ICcnKSB7XHJcbiAgICBwbGFjZWhvbGRlci5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGUoMSkgdHJhbnNsYXRlWSgke2lucHV0Lm9mZnNldEhlaWdodCAvIDMuNX1weClgO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBwbGFjZWhvbGRlci5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGUoMC43KSB0cmFuc2xhdGVZKC0xMHB4KWA7XHJcbiAgfVxyXG5cclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIHBsYWNlaG9sZGVyLnN0eWxlLnRyYW5zaXRpb24gPSAndHJhbnNmb3JtIC4zcyBlYXNlLWluLW91dCc7XHJcbiAgfSwgMzAwKTtcclxuXHJcblxyXG4gIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgZXZlbnQgPT4ge1xyXG4gICAgcGxhY2Vob2xkZXIuc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlKDAuNykgdHJhbnNsYXRlWSgtMTBweClgO1xyXG4gIH0pO1xyXG5cclxuICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZXZlbnQgPT4ge1xyXG4gICAgaWYgKGlucHV0LnZhbHVlID09PSAnJykge1xyXG4gICAgICBwbGFjZWhvbGRlci5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGUoMSkgdHJhbnNsYXRlWSgke2lucHV0Lm9mZnNldEhlaWdodCAvIDMuNX1weClgO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2hvd0hpZGVQYXNzd29yZChpbnB1dCkge1xyXG4gIGNvbnN0IGNvbnRhaW5lciA9IGlucHV0LnBhcmVudEVsZW1lbnQ7XHJcbiAgaWYgKGNvbnRhaW5lciA9PT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKCfQntGC0YHRg9GC0YHRgtCy0YPQtdGCINC60L7QvdGC0LXQudC90LXRgCcpO1xyXG5cclxuICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcInN2Z1wiKTtcclxuICBjb25zdCB1c2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcInVzZVwiKTtcclxuXHJcbiAgYnRuLmNsYXNzTGlzdC5hZGQoJ3Nob3ctaGlkZS1wYXNzd29yZC1idG4nKTtcclxuICBidG4uc3R5bGUudG9wID0gYCR7aW5wdXQub2Zmc2V0SGVpZ2h0IC8gMn1weGA7XHJcbiAgdXNlLnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgJ3hsaW5rOmhyZWYnLCAnI3Nob3ctcGFzc3dvcmQnKTtcclxuXHJcbiAgYnRuLmFwcGVuZCh1c2UpO1xyXG4gIGNvbnRhaW5lci5hcHBlbmQoYnRuKTtcclxuXHJcbiAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZXZlbnQgPT4ge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGlmIChpbnB1dC50eXBlID09PSAncGFzc3dvcmQnKSB7XHJcbiAgICAgIGlucHV0LnR5cGUgPSAndGV4dCc7XHJcbiAgICAgIHVzZS5zZXRBdHRyaWJ1dGVOUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycsICd4bGluazpocmVmJywgJyNoaWRlLXBhc3N3b3JkJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpbnB1dC50eXBlID0gJ3Bhc3N3b3JkJztcclxuICAgICAgdXNlLnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgJ3hsaW5rOmhyZWYnLCAnI3Nob3ctcGFzc3dvcmQnKTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG4iXSwiZmlsZSI6InV0aWxzL2lucHV0LmpzIn0=
