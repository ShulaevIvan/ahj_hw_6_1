export default class CardManager {
    constructor(mainTag) {
        this.allCards = [];
        this.container = document.querySelector(mainTag);
        this.mouseX = undefined;
        this.mouseY = undefined;
        this.draggbleEl = undefined;
        this.dropEl = undefined;

        this.mousePositon = (e) => {
            this.mouseX = e.pageX
            this.mouseY = e.pageY
            if (this.draggbleEl && this.draggbleEl.classList.contains('dragged-on')) {

            }
        }
        this.container.addEventListener('dragenter', (e)  => {
            this.dropEl = e.target;
            let column = undefined;
            let targetDrop = undefined;
            const positionElem = this.dropEl.getBoundingClientRect();
            if (!this.dropEl.classList.contains('selected')) {
                const currentElementCenter = positionElem.y + (positionElem.height);

                if (e.clientY > currentElementCenter && e.target.classList.contains('list-item')) {
                    targetDrop = this.dropEl.closest('.list-item');
                    column = targetDrop.closest('.list');
                    column.insertBefore(this.draggbleEl, targetDrop)
                }
                else if (currentElementCenter > e.clientY && e.target.classList.contains('list-item')){
                    targetDrop = this.dropEl.closest('.list-item');
                    column = targetDrop.closest('.list');
                    column.insertBefore(this.draggbleEl, targetDrop)
                }
            }
            if (this.dropEl !== undefined && !this.dropEl.classList.contains('list-item')) {
                column = this.dropEl.closest('.list');
                if (column) column.appendChild(this.draggbleEl)
            }
        })

        this.dragFunc = (e) => {
            this.draggbleEl = e.target
            this.draggbleEl.classList.add('selected');
            
        };
        
        this.dragFuncOver = (e) => {
            if (this.draggbleEl)  {
                this.draggbleEl.classList.remove('selected');
                this.draggbleEl.removeAttribute('style');
                this.draggbleEl = undefined;
            }
        }

        this.container.addEventListener('mousemove', this.mousePositon);

        this.removeCard = (e) => {
            if (e.target.classList.contains('card-close-block')) {
                e.preventDefault()
                e.stopPropagation();
                this.allCards = this.allCards.filter((item) => item.id != e.target.getAttribute('closeId'));
                this.rebuildDom();
            }
        };

        this.hoverCard = (e) => {
            if (e.target.classList.contains('list-item')) {
                const id = e.target.getAttribute('cardId');
                const card = this.allCards.find((card) => card.id == id);
                card.close.removeEventListener(card.tag, this.hoverCardOff);
                card.close.classList.remove('hidden');
            }
        }
        this.hoverCardOff = (e) => {
            if (e.target.classList.contains('list-item')) {
                const id = e.target.getAttribute('cardId');
                const card = this.allCards.find((card) => card.id == id);
                card.close.removeEventListener(card.tag, this.hoverCard);
                card.close.classList.add('hidden');
            } 
        }

    }

    createCard(contentValue, clickedTarget) {
        const id = performance.now().toFixed();
        const li = document.createElement('li');
        const p = document.createElement('p');
        const btnClose = document.createElement('div');
        const form = this.createForm(id);

        p.textContent = contentValue;
        li.classList.add('list-item');
        li.setAttribute('draggable', false);
        li.setAttribute('cardId', id);
        btnClose.setAttribute('closeId', id);
        btnClose.classList.add('card-close-block');
        btnClose.addEventListener('click', this.removeCard);
        btnClose.classList.add('hidden')
        li.appendChild(btnClose);
        li.appendChild(p);
        li.addEventListener('mouseover', this.hoverCard);
        li.addEventListener('mouseleave', this.hoverCardOff);
        li.addEventListener('mousedown', this.dragFunc);
        li.addEventListener('drag', this.mousePositon);
        li.addEventListener('dragend', this.dragFuncOver);
        const cardObj = {
            id: id,
            text: contentValue,
            tag: li,
            close: btnClose,
            column: clickedTarget.getAttribute('data-column'),
            form: form
        }
        this.allCards.push(cardObj);
        const formPlace = clickedTarget.closest('.list-container');
        this.showForm(formPlace, cardObj.form)
        return cardObj
    }

    rebuildDom() {
        document.querySelectorAll('.list-item').forEach((item) => {
            if (!item.classList.contains('unmovable')) {
                item.removeEventListener('click', this.removeCard)
                item.removeEventListener('mouseover', this.hoverCard);
                item.removeEventListener('mouseleave', this.hoverCardOff);
                item.removeEventListener('mousedown', this.dragFunc);
                item.removeEventListener('drag', this.mousePositon);
                item.removeEventListener('dragend', this.dragFuncOver);
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
            cardItem.tag.addEventListener('drag', this.mousePositon);
            cardItem.tag.addEventListener('dragend', this.dragFuncOver);
            column.appendChild(cardItem.tag);
        })
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

    restoreCardsStorage(storageData)  {
        storageData.forEach((item) => {
            let id = item.id;
            let li = document.createElement('li');
            let p = document.createElement('p');
            let btnClose = document.createElement('div');
            let targetColumn = document.querySelector(`.${item.column}-list`);
            li.classList.add(item.tagClass);
            li.setAttribute('draggable', true);
            li.setAttribute('cardId', id);
            btnClose.setAttribute('closeId', id);
            btnClose.classList.add('card-close-block');
            btnClose.addEventListener('click', this.removeCard);
            btnClose.classList.add('hidden')
            p.textContent = item.text;
            li.appendChild(btnClose);
            li.appendChild(p);
            li.addEventListener('mouseover', this.hoverCard);
            li.addEventListener('mouseleave', this.hoverCardOff);
            li.addEventListener('mousedown', this.dragFunc);
            li.addEventListener('drag', this.mousePositon);
            li.addEventListener('dragend', this.dragFuncOver);
            const cardObj = {
                id: id,
                text: item.text,
                tag: li,
                close: btnClose,
                column: item.column,
            }
            this.allCards.push(cardObj);
            targetColumn.appendChild(cardObj.tag);

        });
    }



    createForm(id) {
        const form = document.createElement('form');
        form.setAttribute('formId', id);
        form.classList.add('add-card');
        form.innerHTML = ` <textarea name="card-title" class="card-title-field" rows = "5" placeholder="Enter a title for this card..."></textarea>
                  <div class="input-container">
                      <div class="input-block">
                          <input type="submit" value="Add Card" class="input-add-card" data-cardId=${id}>
                          <div class="close-btn">
                              <i class="fas fa-lg fa-times"></i>
                          </div>
                      </div>
                      <div class="menu-block">
                          <i class="fas fa-lg fa-ellipsis-h"></i>
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
        else if (textarea.value) {
            const id = form.getAttribute('formId');
            this.allCards.forEach((item) => {
                if (item.id == id) {
                    item.text = textarea.value;
                    form.remove();
                    this.rebuildDom();
                }
            });
        }
      });
    }

}