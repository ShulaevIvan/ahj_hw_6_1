export default class CardManager {
  constructor(mainTag) {
    this.allCards = [];
    this.container = document.querySelector(mainTag);
    this.mouseX = undefined;
    this.mouseY = undefined;
    this.draggbleEl = undefined;
    this.dropEl = undefined;

    this.container.addEventListener('dragenter', (e) => {
      this.dropEl = e.target;
      let column;
      let targetDrop;
      const positionElem = this.dropEl.getBoundingClientRect();
      if (!this.dropEl.classList.contains('selected')) {
        const currentCursor = positionElem.y + (positionElem.height);

        if (e.clientY > currentCursor && e.target.classList.contains('list-item')) {
          targetDrop = this.dropEl.closest('.list-item');
          column = targetDrop.closest('.list');
          column.insertBefore(this.draggbleEl, targetDrop);
        } else if (currentCursor > e.clientY && e.target.classList.contains('list-item')) {
          targetDrop = this.dropEl.closest('.list-item');
          column = targetDrop.closest('.list');
          column.insertBefore(this.draggbleEl, targetDrop);
        }
      }
      if (this.dropEl !== undefined && !this.dropEl.classList.contains('list-item')) {
        column = this.dropEl.closest('.list');
        if (column) column.appendChild(this.draggbleEl);
      }
    });

    this.onMouseUp = (e) => {
      if (e.target.classList.contains('list-item') && this.draggbleEl) {
        this.draggbleEl.classList.remove('selected');
      }
    };

    this.dragFunc = (e) => {
      this.draggbleEl = e.target;
      this.draggbleEl.classList.add('selected');
    };

    this.dragFuncOver = (e) => {
      if (this.draggbleEl) {
        const newCardColumn = this.draggbleEl.closest('.list').getAttribute('data-column');
        this.allCards.forEach((item) => {
          if (item.id === this.draggbleEl.getAttribute('cardid')) item.column = newCardColumn;
        });
        this.draggbleEl.classList.remove('selected');
        this.draggbleEl.removeAttribute('style');
        this.draggbleEl = undefined;
        this.toLocalStorage();
      }
    };

    this.removeCard = (e) => {
      if (e.target.classList.contains('card-close-block')) {
        e.preventDefault();
        e.stopPropagation();
        this.allCards = this.allCards.filter((item) => item.id !== e.target.getAttribute('closeId'));
        this.rebuildDom();
      }
    };

    this.hoverCard = (e) => {
      if (e.target.classList.contains('list-item')) {
        const id = e.target.getAttribute('cardId');
        const card = this.allCards.find((cardItem) => cardItem.id === id);
        card.close.removeEventListener(card.tag, this.hoverCardOff);
        card.close.classList.remove('hidden');
      }
    };
    this.hoverCardOff = (e) => {
      if (e.target.classList.contains('list-item')) {
        const id = e.target.getAttribute('cardId');
        const card = this.allCards.find((cardItem) => cardItem.id === id);
        card.close.removeEventListener(card.tag, this.hoverCard);
        card.close.classList.add('hidden');
      }
    };
  }

  createCard(contentValue, clickedTarget) {
    if (clickedTarget.getAttribute('data-active') === 'false') return;
    const id = performance.now().toFixed();
    const li = document.createElement('li');
    const p = document.createElement('p');
    const btnClose = document.createElement('div');
    const form = this.createForm(id);

    p.textContent = contentValue;
    li.classList.add('list-item');
    li.setAttribute('draggable', true);
    li.setAttribute('cardId', id);
    btnClose.setAttribute('closeId', id);
    btnClose.classList.add('card-close-block');
    btnClose.addEventListener('click', this.removeCard);
    btnClose.classList.add('hidden');
    li.appendChild(p);
    li.appendChild(btnClose);
    li.addEventListener('mouseover', this.hoverCard);
    li.addEventListener('mouseup', this.onMouseUp);
    li.addEventListener('mouseleave', this.hoverCardOff);
    li.addEventListener('mousedown', this.dragFunc);
    li.addEventListener('dragend', this.dragFuncOver);
    const cardObj = {
      id: id,
      text: contentValue,
      tag: li,
      close: btnClose,
      column: clickedTarget.getAttribute('data-column'),
      form: form,
    };
    this.allCards.push(cardObj);
    const formPlace = clickedTarget.closest('.list-container');
    this.showForm(formPlace, cardObj.form);
    clickedTarget.setAttribute('data-active', false);
    return cardObj;
  }

  rebuildDom() {
    document.querySelectorAll('.list-item').forEach((item) => {
      if (!item.classList.contains('unmovable')) {
        item.removeEventListener('click', this.removeCard);
        item.removeEventListener('mouseover', this.hoverCard);
        item.removeEventListener('mouseleave', this.hoverCardOff);
        item.removeEventListener('mousedown', this.dragFunc);
        item.removeEventListener('dragend', this.dragFuncOver);
        item.removeEventListener('mouseup', this.onMouseUp);
        item.remove();
      }
    });

    this.allCards.forEach((cardItem) => {
      const column = document.querySelector(`.${cardItem.column}-list`);
      cardItem.tag.textContent = cardItem.text;
      cardItem.tag.appendChild(cardItem.close);
      cardItem.tag.addEventListener('mouseover', this.hoverCard);
      cardItem.tag.addEventListener('mouseleave', this.hoverCardOff);
      cardItem.tag.addEventListener('mousedown', this.dragFunc);
      cardItem.tag.addEventListener('dragend', this.dragFuncOver);
      cardItem.tag.addEventListener('mouseup', this.onMouseUp);
      column.appendChild(cardItem.tag);
    });
    this.toLocalStorage();
  }

  toLocalStorage() {
    const toLocalStorageArr = [];
    this.allCards.forEach((item) => {
      toLocalStorageArr.push({
        id: item.id,
        tagClass: item.tag.getAttribute('class'),
        column: item.column,
        text: item.text,
        closeTag: item.close.getAttribute('closeid'),
      });
    });
    localStorage.setItem('cards', JSON.stringify(toLocalStorageArr));
  }

  restoreCardsStorage(storageData) {
    storageData.forEach((item) => {
      const id = item.id;
      const li = document.createElement('li');
      const p = document.createElement('p');
      const btnClose = document.createElement('div');
      const targetColumn = document.querySelector(`.${item.column}-list`);
      li.classList.add(item.tagClass);
      li.setAttribute('draggable', true);
      li.setAttribute('cardId', id);
      btnClose.setAttribute('closeId', id);
      btnClose.classList.add('card-close-block');
      btnClose.addEventListener('click', this.removeCard);
      btnClose.classList.add('hidden');
      p.textContent = item.text;
      li.appendChild(btnClose);
      li.appendChild(p);
      li.addEventListener('mouseover', this.hoverCard);
      li.addEventListener('mouseleave', this.hoverCardOff);
      li.addEventListener('mousedown', this.dragFunc);
      li.addEventListener('dragend', this.dragFuncOver);
      li.addEventListener('mouseup', this.onMouseUp);
      const cardObj = {
        id: id,
        text: item.text,
        tag: li,
        close: btnClose,
        column: item.column,
      };
      this.allCards.push(cardObj);
      targetColumn.appendChild(cardObj.tag);
    });
  }

  createForm(id) {
    this.id = id;
    const form = document.createElement('form');
    form.setAttribute('formId', this.id);
    form.classList.add('add-card');
    form.innerHTML = `<textarea name="card-title" class="card-title-field" rows = "5" placeholder="Enter a text for this card..."></textarea>
                    <div class="input-container">
                      <div class="input-block">
                          <input type="submit" value="Add Card" class="input-add-card" data-cardId=${this.id}>
                             <div class="close-btn">
                        </div>
                    </div>
                    <div class="menu-block">
                      </div>
                  </div>`;
    return form;
  }

  showForm(formPlace, form) {
    const addBtn = form.querySelector('.input-add-card');
    const textarea = form.querySelector('textarea');
    formPlace.appendChild(form);
    addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!textarea.value) {
        return this.showForm(formPlace, form);
      }
      if (textarea.value) {
        const id = form.getAttribute('formId');
        this.allCards.forEach((item) => {
          if (item.id === id) {
            item.text = textarea.value;
            form.remove();
            this.rebuildDom();
          }
        });
      }
    });
  }
}
