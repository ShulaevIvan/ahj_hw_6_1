import CardManager from '../components/dnd/dnd';

window.addEventListener('DOMContentLoaded', () => {
  const cardManager = new CardManager('.container');
  const allBtn = document.querySelectorAll('.add-card-container');
  if (localStorage.getItem('cards') !== null) {
    try {
      const storage = JSON.parse(localStorage.getItem('cards'));
      storage.forEach((item) => {
        if (!item.id || !item.column || !item.text || !item.closeTag || item.tagClass !== 'list-item') {
          localStorage.clear();
        }
      });
      cardManager.restoreCardsStorage(storage);
      cardManager.toLocalStorage();
    } catch (err) {
      localStorage.clear();
    }
  } else {
    localStorage.clear();
  }

  allBtn.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const btnAdd = e.target;
      const btnCheck = btnAdd.getAttribute('data-active');
      if (btnCheck === 'false') {
        const countForms = Array.from(document.querySelectorAll('.add-card'));
        if (countForms.length === 0) {
          btnAdd.setAttribute('data-active', true);
          cardManager.createCard('demo', e.target);
        }
      } else if (btnCheck === 'true') {
        btnAdd.setAttribute('data-active', false);
      }
    });
  });
});
