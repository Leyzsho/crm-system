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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ1c2VyL3ZhbGlkYXRpb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRpb25FbWFpbCh2YWx1ZSkge1xuICBjb25zdCBlbWFpbFJlZ2V4ID0gL15bYS16QS1aMC05Ll8tXStAW2EtekEtWjAtOS4tXStcXC5bYS16QS1aXXsyLH0kLztcblxuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ9Ct0LsuINC/0L7Rh9GC0LAg0L3QtSDRj9Cy0LvRj9C10YLRgdGPINGB0YLRgNC+0LrQvtC5LicpO1xuICB9XG5cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXHMvZywgJycpO1xuXG4gIGlmICh2YWx1ZSA9PT0gJycpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ9Cf0L7QttCw0LvRg9C50YHRgtCwLCDQstCy0LXQtNC40YLQtSDRjdC7LiDQv9C+0YfRgtGDLicpO1xuICB9XG5cbiAgaWYgKCFlbWFpbFJlZ2V4LnRlc3QodmFsdWUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCfQrdC7LiDQv9C+0YfRgtCwINC90LXQtNC10LnRgdGC0LLQuNGC0LXQu9GM0L3QsCwg0LjRgdC/0L7Qu9GM0LfRg9C50YLQtSDQtNGA0YPQs9GD0Y4uJylcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGlvblBhc3N3b3JkKHZhbHVlKSB7XG4gIGNvbnN0IHBhc3N3b3JkUmVnZXggPSAvXig/PS4qW0EtWmEtel0pKD89LipcXGQpW0EtWmEtelxcZF17Nix9JC87XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCfQn9Cw0YDQvtC70Ywg0L3QtSDRj9Cy0LvRj9C10YLRgdGPINGB0YLRgNC+0LrQvtC5LicpO1xuICB9XG5cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXHMvZywgJycpO1xuXG4gIGlmICh2YWx1ZSA9PT0gJycpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ9Cf0L7QttCw0LvRg9C50YHRgtCwLCDQstCy0LXQtNC40YLQtSDQv9Cw0YDQvtC70YwuJyk7XG4gIH1cblxuICBpZiAoIXBhc3N3b3JkUmVnZXgudGVzdCh2YWx1ZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ9Cf0LDRgNC+0LvRjCDQtNC+0LvQttC10L0g0YHQvtGB0YLQvtGP0YLRjCDQuNC3INCx0YPQutCyINC4INGG0LjRhNGAINC4INGB0L7QtNC10YDQttCw0YLRjCDQvdC1INC80LXQvdGM0YjQtSA2INGB0LjQvNCy0L7Qu9C+0LIuJyk7XG4gIH1cbn1cbiJdLCJmaWxlIjoidXNlci92YWxpZGF0aW9uLmpzIn0=
