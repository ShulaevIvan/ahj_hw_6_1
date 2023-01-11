export default class DragApp {
  constructor(popupTag) {
    this.popup = document.querySelector(popupTag);
    this.closeBtn = this.popup.querySelector('.close-btn');
    this.addBtn = this.popup.querySelector('.card-btn');
    this.taskContentTag = this.popup.querySelector('.task-content');
    this.hide = this.hidePopup.bind(this);
    this.show = this.showPopup.bind(this);
    this.allCards = [];
    this.targetColumn = undefined;
    this.draggedElement = undefined;
    this.draggedElementId = undefined;

    this.createCardEvent = (e) => {
      e.preventDefault();
      this.createCard(this.taskContentTag.value, this.targetColumn);
      this.hidePopup();
    };

    this.removeCardEvent = (e) => {
      e.preventDefault();
      this.removeCard(e.target);
    };

    this.closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.hidePopup();
    });

    this.draggedEvent = (e) => {
      if (e.target.classList.contains('card')) {
        document.body.style.cursor = 'grabbing';
        this.draggedElement = e.target;
        this.draggedElement.style.position = 'fixed';
        this.draggedElement.style.top = `${e.y / this.draggedElement.style.height}px`;
        this.draggedElement.style.left = `${e.x / this.draggedElement.style.width}px`;
        this.draggedElementId = this.draggedElement.getAttribute('cardId');
        this.draggedElement.classList.add('dragged');
        document.documentElement.addEventListener('mousemove', this.onMouseOver);
      }
    };

    this.onMouseOver = (e) => {
      if (this.draggedElement !== undefined) {
        this.draggedElement.style.top = `${e.y}px`;
        this.draggedElement.style.left = `${e.x}px`;
      }
    };

    this.onMouseUp = (e) => {
      if (this.draggedElement !== undefined && !e.target.classList.contains('rm-card')) {
        this.allCards.forEach((card) => {
          if (card.id === this.draggedElement.getAttribute('cardId')) {
            card.column = e.target.closest('.column');
          }
        });

        if (e.target.classList.contains('card')) {
          const currentCard = this.allCards.find((card) => card.id === e.target.getAttribute('cardId'));
          const column = e.target.parentNode;
          column.insertBefore(this.draggedElement, currentCard.tag);
          this.allCards.forEach((item) => {
            if (item.id === this.draggedElement.getAttribute('cardId')) {
              item.tag = currentCard.tag;
              item.cardColumn = column.classList.value.replace('column', '');
            }
          });
          localStorage.clear();
          localStorage.setItem('cards', JSON.stringify(this.allCards));
        } else if (e.target.classList.contains('column') && !e.target.classList.contains('card')) {
          this.allCards.forEach((item) => {
            if (this.draggedElement.getAttribute('cardId') === item.id) {
              item.cardColumn = e.target.classList.value.replace('column', '');
            }
          });
          e.target.appendChild(this.draggedElement);
        }

        this.draggedElement.style.removeProperty('top');
        this.draggedElement.style.removeProperty('left');
        this.draggedElement.style.removeProperty('position');
        this.draggedElement.classList.remove('dragged');
        this.draggedElement = undefined;
        document.documentElement.removeEventListener('mousemove', this.onMouseOver);
        document.body.style.cursor = 'default';
      }
      localStorage.clear();
      localStorage.setItem('cards', JSON.stringify(this.allCards));
    };
  }

  showPopup(targetColumn) {
    this.targetColumn = targetColumn;
    this.taskContentTag.value = '';
    this.addBtn.addEventListener('click', this.createCardEvent);
    this.popup.classList.remove('popup_hidden');
  }

  hidePopup() {
    this.taskContentTag.value = '';
    this.addBtn.removeEventListener('click', this.createCardEvent);
    this.popup.classList.add('popup_hidden');
  }

  createCard(content) {
    const cardId = performance.now().toFixed();
    const cardWrap = document.createElement('div');
    const cardContent = document.createElement('span');
    const closeBtn = document.createElement('span');
    const cardColumn = this.targetColumn;

    cardWrap.classList.add('card');
    cardContent.classList.add('card-content');
    closeBtn.classList.add('rm-card');
    cardContent.textContent = content;
    cardWrap.appendChild(cardContent);
    cardWrap.appendChild(closeBtn);

    cardWrap.addEventListener('mousedown', this.draggedEvent);
    document.documentElement.addEventListener('mouseup', this.onMouseUp);

    const retObj = {
      id: cardId,
      tag: cardWrap,
      column: cardColumn,
      cardColumn: cardColumn.classList.value.replace('column', ''),
      inputValue: content,
    };
    this.allCards.push(retObj);

    cardWrap.setAttribute('cardId', cardId);
    closeBtn.addEventListener('click', this.removeCardEvent);
    cardColumn.appendChild(cardWrap);
    localStorage.setItem('cards', JSON.stringify(this.allCards));
  }

  restoreCards(storageObj) {
    const cardId = storageObj.id;
    const columnSelector = `.${storageObj.cardColumn}`.replace(' ', '');
    const cardColumn = document.querySelector(columnSelector);
    const cardWrap = document.createElement('div');
    const cardContent = document.createElement('span');
    const closeBtn = document.createElement('span');
    cardWrap.classList.add('card');
    cardContent.classList.add('card-content');
    closeBtn.classList.add('rm-card');
    cardWrap.setAttribute('cardId', cardId);
    cardContent.textContent = storageObj.inputValue;
    cardWrap.appendChild(cardContent);
    cardWrap.appendChild(closeBtn);
    cardWrap.addEventListener('mousedown', this.draggedEvent);
    closeBtn.addEventListener('click', this.removeCardEvent);
    document.documentElement.addEventListener('mouseup', this.onMouseUp);
    const retObj = {
      id: cardId,
      tag: cardWrap,
      column: cardColumn,
      cardColumn: columnSelector.replace('.', ''),
      inputValue: storageObj.inputValue,
    };
    this.allCards.push(retObj);
    document.querySelector(columnSelector).appendChild(cardWrap);
  }

  removeCard(target) {
    const column = target.parentNode.parentNode;
    const targetCardId = target.parentNode.getAttribute('cardId');
    this.allCards = this.allCards.filter((item) => item.id !== targetCardId);
    localStorage.setItem('cards', JSON.stringify(this.allCards));
    document.querySelectorAll('.card').forEach((card) => card.remove());
    this.allCards.forEach((item) => {
      item.column.appendChild(item.tag);
    });
  }
}
