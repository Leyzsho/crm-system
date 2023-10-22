export function validationEmail(value) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (typeof value !== 'string') {
    throw new TypeError('Эл. почта не является строкой.');
  }

  value = value.replace(/\s/g, '');

  if (value === '') {
    throw new Error('Пожалуйста, введите эл. почту.');
  }

  if (!emailRegex.test(value)) {
    throw new Error('Эл. почта недействительна, используйте другую.')
  }
}

export function validationPassword(value) {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  if (typeof value !== 'string') {
    throw new TypeError('Пароль не является строкой.');
  }

  value = value.replace(/\s/g, '');

  if (value === '') {
    throw new Error('Пожалуйста, введите пароль.');
  }

  if (!passwordRegex.test(value)) {
    throw new Error('Пароль должен состоять из букв и цифр и содержать не меньше 6 символов.');
  }
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ1c2VyL3ZhbGlkYXRpb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRpb25FbWFpbCh2YWx1ZSkge1xyXG4gIGNvbnN0IGVtYWlsUmVnZXggPSAvXlthLXpBLVowLTkuXy1dK0BbYS16QS1aMC05Li1dK1xcLlthLXpBLVpdezIsfSQvO1xyXG5cclxuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcign0K3Quy4g0L/QvtGH0YLQsCDQvdC1INGP0LLQu9GP0LXRgtGB0Y8g0YHRgtGA0L7QutC+0LkuJyk7XHJcbiAgfVxyXG5cclxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xccy9nLCAnJyk7XHJcblxyXG4gIGlmICh2YWx1ZSA9PT0gJycpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcign0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0LLQtdC00LjRgtC1INGN0LsuINC/0L7Rh9GC0YMuJyk7XHJcbiAgfVxyXG5cclxuICBpZiAoIWVtYWlsUmVnZXgudGVzdCh2YWx1ZSkpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcign0K3Quy4g0L/QvtGH0YLQsCDQvdC10LTQtdC50YHRgtCy0LjRgtC10LvRjNC90LAsINC40YHQv9C+0LvRjNC30YPQudGC0LUg0LTRgNGD0LPRg9GOLicpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGlvblBhc3N3b3JkKHZhbHVlKSB7XHJcbiAgY29uc3QgcGFzc3dvcmRSZWdleCA9IC9eKD89LipbQS1aYS16XSkoPz0uKlxcZClbQS1aYS16XFxkXXs2LH0kLztcclxuXHJcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcclxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ9Cf0LDRgNC+0LvRjCDQvdC1INGP0LLQu9GP0LXRgtGB0Y8g0YHRgtGA0L7QutC+0LkuJyk7XHJcbiAgfVxyXG5cclxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xccy9nLCAnJyk7XHJcblxyXG4gIGlmICh2YWx1ZSA9PT0gJycpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcign0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0LLQtdC00LjRgtC1INC/0LDRgNC+0LvRjC4nKTtcclxuICB9XHJcblxyXG4gIGlmICghcGFzc3dvcmRSZWdleC50ZXN0KHZhbHVlKSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCfQn9Cw0YDQvtC70Ywg0LTQvtC70LbQtdC9INGB0L7RgdGC0L7Rj9GC0Ywg0LjQtyDQsdGD0LrQsiDQuCDRhtC40YTRgCDQuCDRgdC+0LTQtdGA0LbQsNGC0Ywg0L3QtSDQvNC10L3RjNGI0LUgNiDRgdC40LzQstC+0LvQvtCyLicpO1xyXG4gIH1cclxufVxyXG4iXSwiZmlsZSI6InVzZXIvdmFsaWRhdGlvbi5qcyJ9
