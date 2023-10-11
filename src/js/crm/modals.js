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
