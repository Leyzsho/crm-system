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
