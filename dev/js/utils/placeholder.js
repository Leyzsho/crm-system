export default function placeholder(input, value) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ1dGlscy9wbGFjZWhvbGRlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwbGFjZWhvbGRlcihpbnB1dCwgdmFsdWUpIHtcbiAgY29uc3QgY29udGFpbmVyID0gaW5wdXQucGFyZW50RWxlbWVudDtcbiAgaWYgKGNvbnRhaW5lciA9PT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKCfQndC10YIg0LrQvtC90YLQtdC50L3QtdGA0LAuJyk7XG5cbiAgY29uc3QgcGxhY2Vob2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIHBsYWNlaG9sZGVyLmNsYXNzTGlzdC5hZGQoJ2lucHV0LXBsYWNlaG9sZGVyJyk7XG4gIHBsYWNlaG9sZGVyLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIHBsYWNlaG9sZGVyLnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgxKSB0cmFuc2xhdGVZKCR7aW5wdXQub2Zmc2V0SGVpZ2h0IC8gMy41fXB4KWA7XG4gIGNvbnRhaW5lci5hcHBlbmQocGxhY2Vob2xkZXIpO1xuXG4gIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgZXZlbnQgPT4ge1xuICAgIHBsYWNlaG9sZGVyLnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgwLjcpIHRyYW5zbGF0ZVkoLTEwcHgpYDtcbiAgfSk7XG5cbiAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGV2ZW50ID0+IHtcbiAgICBpZiAoaW5wdXQudmFsdWUgPT09ICcnKSB7XG4gICAgICBwbGFjZWhvbGRlci5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGUoMSkgdHJhbnNsYXRlWSgke2lucHV0Lm9mZnNldEhlaWdodCAvIDMuNX1weClgO1xuICAgIH1cbiAgfSk7XG59XG4iXSwiZmlsZSI6InV0aWxzL3BsYWNlaG9sZGVyLmpzIn0=
