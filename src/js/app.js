import CardManager from '../components/dnd/dnd';

window.addEventListener('DOMContentLoaded', () => {
  const cardManager = new CardManager('.container');
  const allBtn = document.querySelectorAll('.add-card-container');
  const storage = JSON.parse(localStorage.getItem('cards'));
  if (storage) {
    cardManager.restoreCardsStorage(storage);
  } else {
    localStorage.clear();
  }

  allBtn.forEach((item) => {
    item.addEventListener('click', (e) => {
      const card = cardManager.createCard('demo', e.target);
      e.preventDefault();
    });
  });
});
