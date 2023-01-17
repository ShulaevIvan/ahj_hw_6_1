import Card from './card';

export default class CardManager {
  constructor() {
    this.container = undefined;
    this.draggedElment = undefined;

    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.eventCardMove = this.eventCardMove.bind(this);
    this.dgraggedMask = undefined;
    this.allCards = [];
  }

  bindToDOM(container) {
    this.container = container;
    this.eventListenerAdd('todo');
    this.eventListenerAdd('progress');
    this.eventListenerAdd('done');
    document.documentElement.addEventListener('mouseup', this.onMouseUp);
  }

  eventListenerAdd(column) { 
    const element = this.container.querySelector(`.an_card_add_${column}`);

    element.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.addCard(column);
    });
  }

  addCard(column) {
    const add = this.container.querySelector(`.an_card_add_${column}`);
    add.classList.add('hidden');

    const addbtn = this.container.querySelector(`.card_add_${column}`);// скрыть +add и показать кнопку
    addbtn.classList.remove('hidden');

    const newcard = new Card(column);
    newcard.createCard(column);
   this.allCards.push(newcard);

    this.eventListenerAddButton(column, newcard);
  }

  eventListenerAddButton(column, card) {
    const element = this.container.querySelector(`.card_add_${column}`);
    element.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.addCardBtn(column, card);
    });
  }

  addCardBtn(column, newcard) {
    const add = this.container.querySelector(`.an_card_add_${column}`);
    add.classList.remove('hidden');

    const addbtn = this.container.querySelector(`.card_add_${column}`);
    addbtn.classList.add('hidden');

    newcard.saveCard();

    const { card } = newcard;

    card.addEventListener('mouseover', (e) => {
      e.preventDefault();
      this.showClose(card, newcard);
    });

    card.addEventListener('mouseout', (e) => {
      e.preventDefault();
      this.hiddenClose(card);
    });

    card.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.draggedElment = document.querySelector(`.data-id_${newcard.id}`);
      this.eventCardMove(e);
    });
  }

  showClose(card, newcard) {
    const close = card.querySelector('.card_delete');
    close.classList.remove('hidden');

    close.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.closeClick(card, close, newcard);
    });
  }

  closeClick(card) {
    card.remove();
    console.log(this.allCards)
  }

  hiddenClose(card) {
    const close = card.querySelector('.card_delete');
    close.classList.add('hidden');

    close.removeEventListener('mousedown', (e) => {
      e.preventDefault();
      this.closeClick(card, close);
    });
  }

  eventCardMove(e) {
    if (e.target.classList.contains('card_input')) {
      const elemPosition = this.draggedElment.getBoundingClientRect()
      this.cursorX = e.clientX - elemPosition.left;
      this.cursorY = e.clientY - elemPosition.top;

      this.draggedElment.classList.add('dragged');
      document.body.style.cursor = 'grabbing';

      document.documentElement.addEventListener('mouseover', this.onMouseOver);
    }
    
  }

  onMouseOver(e) {
    this.draggedElment.style.left = `${e.pageX - this.cursorX / 2}px`;
    this.draggedElment.style.top = `${e.pageY - this.cursorY / 2}px`;

    this.dgraggedMask = this.draggedElment.cloneNode(true);
    this.dgraggedMask.querySelector('.card_input').className = 'card_clone_input';
    this.dgraggedMask.className = 'card_clone';

    const { target } = e;

    const targetColumn = target.closest('.column-item');
    if (target.closest('.card_content')) {
      if (document.querySelector('.card_clone')) {
        document.querySelector('.card_clone').remove();
      }
      target.closest('.cards').insertBefore(this.dgraggedMask, target.closest('.card_content'));
    } else if (targetColumn) {
      if (document.querySelector('.card_clone')) {
        document.querySelector('.card_clone').remove();
      }
      targetColumn.querySelector('.cards').appendChild(this.dgraggedMask);
    } else if (!target.closest('.card_content')
    && !target.closest('.column-item')
    && document.querySelector('.card_clone')) {
      document.querySelector('.card_clone').remove();
    }

    if (this.dgraggedMask) {
      this.dgraggedMask.addEventListener('mouseup', this.onMouseUp);
    }
  }
  onMouseUp(e) {
    const { target } = e;
    if (document.querySelector('.dragged') !== null) {
      const targetColumn = target.closest('.column-item');
      const targetClone = target.closest('.card_clone');
      if (targetColumn) {
        targetColumn.querySelector('.cards').insertBefore(this.draggedElment, this.dgraggedMask);

        document.querySelector('.card_clone').remove();

        this.draggedElment.classList.remove('dragged');
        this.draggedElment = undefined;

        document.body.style.cursor = 'auto';
        this.dgraggedMask.removeEventListener('mouseup', this.onMouseUp);

        document.documentElement.removeEventListener('mouseover', this.onMouseOver);
        return;
      }
      if (targetClone) {
        const place = document.elementFromPoint(e.clientX, e.clientY);

        if (place.closest('.card_content')) {
          place.closest('.cards').insertBefore(this.draggedElment, place.closest('.card_content'));
        } else {
          place.closest('.cards').appendChild(this.draggedElment);
        }

        document.querySelector('.card_clone').remove();
        this.draggedElment.classList.remove('dragged');
        this.allCards.forEach((item) => {
          if (item.id == this.draggedElment.getAttribute('data-id')) {
            item.column = this.draggedElment.closest('.column-item').getAttribute('data-name');
          }
        });
        this.draggedElment = undefined;

        document.body.style.cursor = 'auto';
        this.dgraggedMask.removeEventListener('mouseup', this.onMouseUp);

        document.documentElement.removeEventListener('mouseover', this.onMouseOver);
        return;
      }

      this.draggedElment.classList.remove('dragged');
      this.draggedElment = undefined;

      document.body.style.cursor = 'auto';
      this.dgraggedMask.removeEventListener('mouseup', this.onMouseUp);
      document.documentElement.removeEventListener('mouseover', this.onMouseOver);
    }
  }
}
