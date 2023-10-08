export function validationEmail(value) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (typeof value !== 'string') {
    throw new TypeError('Эл. почта не является строкой.');
  }

  value = value.trim();

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

  value = value.trim();

  if (value === '') {
    throw new Error('Пожалуйста, введите пароль.');
  }

  if (!passwordRegex.test(value)) {
    throw new Error('Пароль должен состоять из букв и цифр и содержать не меньше 6 символов.');
  }

}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhdXRoL3ZhbGlkYXRpb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRpb25FbWFpbCh2YWx1ZSkge1xuICBjb25zdCBlbWFpbFJlZ2V4ID0gL15bYS16QS1aMC05Ll8tXStAW2EtekEtWjAtOS4tXStcXC5bYS16QS1aXXsyLH0kLztcblxuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ9Ct0LsuINC/0L7Rh9GC0LAg0L3QtSDRj9Cy0LvRj9C10YLRgdGPINGB0YLRgNC+0LrQvtC5LicpO1xuICB9XG5cbiAgdmFsdWUgPSB2YWx1ZS50cmltKCk7XG5cbiAgaWYgKHZhbHVlID09PSAnJykge1xuICAgIHRocm93IG5ldyBFcnJvcign0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0LLQtdC00LjRgtC1INGN0LsuINC/0L7Rh9GC0YMuJyk7XG4gIH1cblxuICBpZiAoIWVtYWlsUmVnZXgudGVzdCh2YWx1ZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ9Ct0LsuINC/0L7Rh9GC0LAg0L3QtdC00LXQudGB0YLQstC40YLQtdC70YzQvdCwLCDQuNGB0L/QvtC70YzQt9GD0LnRgtC1INC00YDRg9Cz0YPRji4nKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0aW9uUGFzc3dvcmQodmFsdWUpIHtcbiAgY29uc3QgcGFzc3dvcmRSZWdleCA9IC9eKD89LipbQS1aYS16XSkoPz0uKlxcZClbQS1aYS16XFxkXXs2LH0kLztcblxuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ9Cf0LDRgNC+0LvRjCDQvdC1INGP0LLQu9GP0LXRgtGB0Y8g0YHRgtGA0L7QutC+0LkuJyk7XG4gIH1cblxuICB2YWx1ZSA9IHZhbHVlLnRyaW0oKTtcblxuICBpZiAodmFsdWUgPT09ICcnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCfQn9C+0LbQsNC70YPQudGB0YLQsCwg0LLQstC10LTQuNGC0LUg0L/QsNGA0L7Qu9GMLicpO1xuICB9XG5cbiAgaWYgKCFwYXNzd29yZFJlZ2V4LnRlc3QodmFsdWUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCfQn9Cw0YDQvtC70Ywg0LTQvtC70LbQtdC9INGB0L7RgdGC0L7Rj9GC0Ywg0LjQtyDQsdGD0LrQsiDQuCDRhtC40YTRgCDQuCDRgdC+0LTQtdGA0LbQsNGC0Ywg0L3QtSDQvNC10L3RjNGI0LUgNiDRgdC40LzQstC+0LvQvtCyLicpO1xuICB9XG5cbn1cbiJdLCJmaWxlIjoiYXV0aC92YWxpZGF0aW9uLmpzIn0=
