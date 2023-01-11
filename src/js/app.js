import DragApp from '../components/dnd/dnd';

window.addEventListener('DOMContentLoaded', () => {
  const addCardBtn = document.querySelectorAll('.add-card');
  const dragApp = new DragApp('#popup');

  addCardBtn.forEach((item) => {
    item.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-card')) {
        dragApp.showPopup(e.target.parentNode.parentNode);
      }
    });
  });
});
