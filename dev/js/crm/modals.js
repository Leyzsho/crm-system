export function openClientModal(data, way) {
  const darkBackground = document.createElement('div');
  const modal = document.createElement('div');
  const closeBtn = document.createElement('button');
  const title = document.createElement('h2');

  if (way === 'create') {
    if (data !== null) {
      throw new Error('Клиент уже существует.');
    }
  } else if (way === 'change') {
    if (data === null) {
      throw new Error('Данного клиента не существует.');
    }
  }
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjcm0vbW9kYWxzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBvcGVuQ2xpZW50TW9kYWwoZGF0YSwgd2F5KSB7XG4gIGNvbnN0IGRhcmtCYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IGNsb3NlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcblxuICBpZiAod2F5ID09PSAnY3JlYXRlJykge1xuICAgIGlmIChkYXRhICE9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ca0LvQuNC10L3RgiDRg9C20LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIuJyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKHdheSA9PT0gJ2NoYW5nZScpIHtcbiAgICBpZiAoZGF0YSA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCfQlNCw0L3QvdC+0LPQviDQutC70LjQtdC90YLQsCDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCLicpO1xuICAgIH1cbiAgfVxufVxuIl0sImZpbGUiOiJjcm0vbW9kYWxzLmpzIn0=
